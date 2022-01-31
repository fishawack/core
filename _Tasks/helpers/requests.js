function image(src, options){
    const request = require('request-promise');
    const path = require('path');
    const fs = require('fs-extra');
    const grunt = require('grunt');
    const { url_join } = require('./misc.js');

    let file = path.join(options.saveTo, 'media', src.replace(new RegExp(options.find), ''));

    // Check if valid string - if not then prepend the CMS path
    try {
        new URL(src);
    } catch (e) {
        src = url_join(options.path, src);
    }

    fs.mkdirpSync(path.dirname(file));

    return request({uri: src, encoding: 'binary'})
        .then(body => {
            grunt.log.ok(`Downloaded: ${path.basename(file)}`);

            fs.writeFileSync(file, body, 'binary');
        })
        .catch(err => {
            grunt.log.warn(err);
        });
}

async function download(options){
    try{
        const path = require('path');
        const fs = require('fs-extra');
        const pLimit = require('p-limit');
        const limit = pLimit(5);
        const glob = require('glob');

        var arr = [];

        glob.sync(path.join(options.saveTo, options.bundle, `*.${options.ext}`)).forEach(endpoint => {
            var data = fs.readFileSync(endpoint, {encoding: 'utf8'});

            // Find all values between quotes
            data.match(/(["'])(?:(?=(\\?))\2.)*?\1/g).forEach(d => {
                let value = JSON.parse(d);
                
                if(new RegExp(options.find).test(value)){
                    arr.push(value);
                }
            });
        });

        // Make array of assets unqiue
        arr = [...new Set(arr)];
        
        await Promise.all(arr.map(d => limit(() => image(d, options))));
    } catch(e){
        console.log(e);
    }
}

async function rewrite(options){
    const grunt = require('grunt');
    const fs = require('fs-extra');
    const path = require('path');
    const glob = require('glob');
    
    grunt.log.ok(`Rewriting json to use local paths`);

    glob.sync(path.join(options.saveTo, options.bundle, `*.${options.ext}`)).forEach(endpoint => {
        let data = fs.readFileSync(endpoint, {encoding: 'utf8'});

        // Find all values between quotes
        data = data.replaceAll(/(["'])(?:(?=(\\?))\2.)*?\1/g, d => {
            let value = JSON.parse(d);
            
            if(new RegExp(options.find).test(value)){
                return `"${path.join('media/content', value.replace(new RegExp(options.find), ''))}"`;
            }

            return d;
        });

        fs.writeFileSync(endpoint, data, {encoding: 'utf8'});
    });
}

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(str, newStr){
        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);
	};
}

function load(options, index = 1, arr){
    var request = require('request-promise');
    
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

module.exports = {
    image,
    download,
    rewrite,
    load
}