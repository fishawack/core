module.exports = (grunt) => {
    grunt.registerTask('content:request', async function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var done = this.async();
        var request = require('request-promise');
        var fs = require('fs-extra');
        var path = require('path');
        var pLimit = require('p-limit');
        var limit = pLimit(5);
        const { download, rewrite } = require('./helpers/requests.js');

        await Promise.all(contentJson.attributes.content.reduce((arr, d, i) => {
            if(d.url){
                arr = arr.concat(d.endpoints.map((endpoint) => limit(() => load({
                        path: d.url,
                        api: d.api || '/wp-json/wp/v2/',
                        endpoint,
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

            return arr;
        }, []));

        // Pull assets referenced in json files
        await Promise.all(contentJson.attributes.content.map((d, i) => {
            if(d.url && d.find !== null){
                return limit(() => download({
                        path: d.url,
                        api: d.api || '/wp-json/wp/v2/',
                        ext: d.ext || 'json',
                        saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`),
                        bundle: d.bundle ? 'media/' : '',
                        find: d.find || `^https.*/wp-content/uploads`
                    }));
            }
        }));

        // Rewrite json files
        await Promise.all(contentJson.attributes.content.map((d, i) => {
            if(d.url && d.find !== null){
                return limit(() => rewrite({
                        path: d.url,
                        api: d.api || '/wp-json/wp/v2/',
                        ext: d.ext || 'json',
                        saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`),
                        bundle: d.bundle ? 'media/' : '',
                        find: d.find || `^https.*/wp-content/uploads`
                    }));
            }
        }));

        done();

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
    });
};