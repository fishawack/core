function image(src, options){
    const request = require('request-promise');
    const path = require('path');
    const fs = require('fs-extra');
    const grunt = require('grunt');
    const { url_join } = require('./misc.js');

    var split = src.split(url_join(options.path, `/wp-content/uploads/`));
    var file = path.join(options.saveTo, 'media/', split[1]);

    fs.mkdirpSync(path.dirname(file));

    return request({uri: src, encoding: 'binary'})
        .then(body => {
            grunt.log.ok(`Downloaded: ${split[1]}`);

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

        var data = fs.readJSONSync(path.join(options.saveTo, options.bundle, `${options.media}.${options.ext}`));
        var arr = [];

        data.forEach(d => {
            if(d.media_details && d.media_details.sizes){
                for(var key in d.media_details.sizes){
                    if(d.media_details.sizes.hasOwnProperty(key)){
                        arr.push(d.media_details.sizes[key].source_url);
                    }
                }
            } else {
                arr.push(d.source_url);
            }
        });

        await Promise.all(arr.map(d => limit(() => image(d, options))));
    } catch(e){
        console.log(e);
    }
}

module.exports = {
    image,   
    download
}