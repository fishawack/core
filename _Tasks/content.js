module.exports = (grunt) => {
    grunt.registerTask('content', function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var fs = require('fs-extra');

        function protocol(d, i){
            var saveTo = (d.saveTo) ? d.saveTo : `${config.src}/content/content-${i}`;

            if(d.ftp || d.ftps){
                var protocol = (d.ftps) ? 'ftps' : 'ftp';
                var ip = (d.ftps) ? d.ftps : d.ftp;

                fs.removeSync(saveTo);

                return `wget -q --show-progress -r --user='<%= targets.ftp["${ip}"].username %>' --password='<%= targets.ftp["${ip}"].password %>' -P ${saveTo} -nH --cut=${d.location.split('/').length - 1} '${protocol}://${ip}/${d.location}'`;
            } else if(d.ssh) {
                fs.removeSync(saveTo);

                return `scp -r <%= targets["${d.ssh}"].username %>@<%= targets["${d.ssh}"].host %>:${d.location} ${saveTo}`;
            } else if(d.lftp){
                return `lftp -e 'set sftp:auto-confirm yes; mirror ${d.location} ${saveTo} -p -e --parallel=10; exit;' -u '<%= targets.ftp["${d.lftp}"].username %>','<%= targets.ftp["${d.lftp}"].password %>' sftp://${d.lftp}`;
            }
        };

        const execSync = require('child_process').execSync;

        contentJson.attributes.content.map((d, i) => {
            grunt.log.warn(`Pulling content from: ${d.location}`);
            
            execSync(grunt.template.process(protocol(d, i), {data:config}), {encoding: 'utf8', stdio: 'inherit'});

            grunt.log.ok(`Content pulled from: ${d.location}`);
        });

        grunt.task.run(['content-request']);
    });

    grunt.registerTask('content-request', function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var request = require('request-promise');
        var fs = require('fs-extra');
        var path = require('path');
        var pLimit = require('p-limit');
        var limit = pLimit(5);

        var requests = [];
        var rewrites = [];

        contentJson.attributes.content.forEach(function(d, i){
            if(d.url){
                requests = requests.concat(d.endpoints.map((dd) => limit(() => load({
                        path: d.url.replace(/\/+$/, ""),
                        endpoint: dd,
                        ext: d.ext,
                        saveTo: (d.saveTo || `${config.src}/content/content-${i}/`) + (d.bundle ? 'media/' : '')
                    }, 1)
                    .then(({options, data}) => {
                        grunt.log.ok('Downloaded ' + options.endpoint);

                        var file = options.saveTo + options.endpoint + ((options.ext) ? '.' + options.ext : '');

                        fs.mkdirpSync(path.dirname(file));

                        fs.writeFileSync(
                            file,
                            JSON.stringify(data)
                        );
                    }))));

                requests.push(limit(() => download({
                        path: d.url.replace(/\/+$/, ""),
                        saveTo: d.saveTo || `${config.src}/content/content-${i}/`,
                        index: i
                    }, 1)));
            }
        });

        if(requests.length){
            var done = this.async();

            Promise.all(requests)
                .then(() => {
                    contentJson.attributes.content.forEach(function(d, i){
                        if(d.url){
                            rewrites.push(limit(() => update({
                                    path: d.url,
                                    saveTo: d.saveTo || `${config.src}/content/content-${i}/` + (d.bundle ? 'media/' : ''),
                                    index: i
                                })));
                        }
                    });

                    return Promise.all(rewrites)
                        .catch(err => grunt.log.warn(err.message))
                        .finally(() => done());
                })
                .catch(err => grunt.log.warn(err.message));
        }

        function load(options, index, arr){
            return new Promise((resolve, reject) => {
                request({
                        uri: `${options.path}/wp-json/wp/v2/${options.endpoint}?per_page=100&page=${index}`,
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
                            reject();
                        }
                        grunt.log.warn(err.statusCode, err.options.uri); 
                    });
            });
        }

        function image(src, options){
            var split = src.split(`${options.path}/wp-content/uploads/`);
            var file = `${options.saveTo}media/${split[1]}`

            fs.mkdirpSync(path.dirname(file));

            return request({uri: src, encoding: 'binary'})
                .then(body => {
                    grunt.log.ok(`Downloaded: ${split[1]}`);

                    fs.writeFileSync(file, body, 'binary');
                })
                .catch(err => {
                    if(err.statusCode){
                        grunt.log.warn(err.statusCode, err.options.uri);
                    } else {
                        grunt.log.warn(err);
                    }
                });
        }

        function download(options, index){
            return new Promise((resolve, reject) => {
                request({
                        uri: `${options.path}/wp-json/wp/v2/media?per_page=100&page=${index}`,
                        resolveWithFullResponse: true
                    })
                    .then(res => {
                        var data = JSON.parse(res.body);
                        var current = +res.headers['x-wp-totalpages'];

                        var arr = [];
                        limit = pLimit(5);

                        data.forEach(d => {
                            if(d.media_details && d.media_details.sizes && d.media_details.sizes.length){
                                for(var key in d.media_details.sizes){
                                    if(d.media_details.sizes.hasOwnProperty(key)){
                                        arr.push(limit(() => image(d.media_details.sizes[key].source_url, options)));
                                    }
                                }
                            } else {
                                arr.push(limit(() => image(d.source_url, options)));
                            }
                        });

                        return Promise.all(arr)
                            .then(res => {
                                if(current && current !== index){
                                    return download(options, ++index)
                                        .then(() => resolve());
                                } else {
                                    resolve();
                                }
                            })
                            .catch(err => reject());
                    })
                    .catch(err => { reject(); grunt.log.warn(err.statusCode, err.options.uri); });
            });
        }

        function update(options){
            return new Promise((resolve, reject) => {
                grunt.log.ok(`Rewriting json to use local paths`);

                var files = fs.readdirSync(options.saveTo).filter(d => d.indexOf('.json') > -1);

                files.forEach(file => {
                    var data = fs.readFileSync(`${options.saveTo}${file}`, {encoding: 'utf8'});
                    
                    data = data.replace(new RegExp(`${options.path}/wp-content/uploads/`, 'g'), `media/content/`);

                    fs.writeFileSync(`${options.saveTo}${file}`, data);
                });

                resolve();
            });
        }
    });
};