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

module.exports = {
    image,   
    download
}