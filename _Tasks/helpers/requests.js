function image(src, options){
    const path = require('path');
    const fs = require('fs-extra');
    const grunt = require('grunt');
    const { url_join } = require('./misc.js');

    let file = path.join(options.saveTo, 'media', src.replace(new RegExp(options.find), ''));

    // Check if valid string - if not then prepend the CMS path
    // Fix for Contenful pathing not being a real URL
    if(options.path.indexOf("contentful") > -1) {
        src = `https:${src}`;
    }
    try {
        new URL(src);
    } catch (e) {
        src = url_join(options.path, src);
    }

    fs.mkdirpSync(path.dirname(file));

    return fetch(src)
        .then(async res => {
            grunt.log.ok(`Downloaded: ${path.basename(file)}`);

            fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
        })
        .catch(err => {
            grunt.log.warn(err);
        });
}

async function download(options){
    try{
        const path = require('path');
        const fs = require('fs-extra');
        const pLimit = (await import('p-limit')).default;
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
        
        if(options.type =='contentful') {
            data = JSON.stringify(JSON.parse(data)[0]);
        }

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

async function load(options){
    var fs = require('fs-extra');

    let data = [];
    let index = 0;

    do{
        index++;
        let uri = '';

        if(options.type === 'contentful') {
            uri = url_join(options.path, `${options.api}${options.endpoint}&skip=${(index - 1) * 100}`);
        } else {
            uri = url_join(options.path, options.api, `${options.endpoint}?per_page=1&page=${index}`);
        }

        let res = await fetch(uri);
        let json = await res.json();

        data = data.concat(json);

        if(options.type === 'contentful') {
            current = Math.ceil(json.total / 100);
        } else {
            current = +res.headers.get('x-wp-totalpages');
        }
    } while(current && current !== index)

    grunt.log.ok(`Downloaded: ${options.endpoint}`);

    var file = path.join(options.saveTo, options.bundle, `${options.endpoint}.${options.ext}`);

    fs.mkdirpSync(path.dirname(file));

    fs.writeFileSync(
        file,
        JSON.stringify(data)
    );
}

module.exports = {
    image,
    download,
    rewrite,
    load
}