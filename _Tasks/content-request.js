module.exports = (grunt) => {
    grunt.registerTask('content:request', function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var request = require('request-promise');
        var fs = require('fs-extra');
        var path = require('path');
        var pLimit = require('p-limit');
        var limit = pLimit(5);
        const { download } = require('./helpers/requests.js');

        var requests = [];
        var rewrites = [];

        contentJson.attributes.content.forEach(function(d, i){
            if(d.url){
                requests = requests.concat(d.endpoints.map((dd) => limit(() => load({
                        path: d.url,
                        api: d.api || '/wp-json/wp/v2/',
                        endpoint: dd,
                        ext: d.ext || 'json',
                        saveTo: (d.saveTo || path.join(config.src, `/content/content-${i}/`, (d.bundle ? 'media/' : '')))
                    }, 1)
                    .then(({options, data}) => {
                        grunt.log.ok(`Downloaded: ${options.endpoint}`);

                        var file = path.join(options.saveTo, `${options.endpoint}.${options.ext}`);

                        fs.mkdirpSync(path.dirname(file));

                        fs.writeFileSync(
                            file,
                            JSON.stringify(data)
                        );
                    }))));
            }
        });

        if(requests.length){
            var done = this.async();

            Promise.all(requests)
                .then(() => {
                    let arr = [];

                    contentJson.attributes.content.forEach(function(d, i){
                        if(d.url && d.media !== null){
                            arr.push(limit(() => download({
                                    path: d.url,
                                    api: d.api || '/wp-json/wp/v2/',
                                    media: d.media || 'media',
                                    ext: d.ext || 'json',
                                    saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`),
                                    bundle: d.bundle ? 'media/' : '',
                                    index: i
                                })));
                        }
                    });

                    if(arr.length){
                        Promise.all(arr)
                            .then(() => {
                                contentJson.attributes.content.forEach(function(d, i){
                                    if(d.url){
                                        rewrites.push(limit(() => update({
                                                path: d.url,
                                                saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`, (d.bundle ? 'media/' : '')),
                                                index: i
                                            })));
                                    }
                                });
            
                                Promise.all(rewrites)
                                    .catch(err => grunt.log.warn(err.message))
                                    .finally(() => done());
                            })
                            .catch(err => grunt.log.warn(err.message));
                    } else {
                        done();
                    }
                })
                .catch(err => grunt.log.warn(err.message));
        }

        function load(options, index, arr){
            return new Promise((resolve, reject) => {
                request({
                        uri: url_join(options.path, options.api, `${options.endpoint}?per_page=100&page=${index}`),
                        resolveWithFullResponse: true
                    })
                    .then(res => {
                        var data = JSON.parse(res.body);
                        var current = +res.headers['x-wp-totalpages'];

                        if(!arr){
                            arr = data || [];
                        } else {
                            arr = arr.concat(data);
                        }

                        if(current && current !== index){
                            load(options, ++index, arr)
                                .then((res) => resolve(res));
                        } else {
                            resolve({options, data: arr});
                        }
                    })
                    .catch(err => { 
                        if(err.statusCode === 404){
                            resolve();
                        } else {
                            reject(err);
                        }
                        grunt.log.warn(err.statusCode, err.options.uri); 
                    });
            });
        }

        function update(options){
            return new Promise((resolve, reject) => {
                grunt.log.ok(`Rewriting json to use local paths`);

                var files = fs.readdirSync(options.saveTo).filter(d => d.indexOf('.json') > -1);

                files.forEach(file => {
                    var data = fs.readFileSync(path.join(options.saveTo, file), {encoding: 'utf8'});
                    
                    data = data.replace(new RegExp(`${options.path}/wp-content/uploads/`, 'g'), `media/content/`);

                    fs.writeFileSync(path.join(options.saveTo, file), data);
                });

                resolve();
            });
        }
    });
};