module.exports = (grunt) => {
    grunt.registerTask('content:request', async function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var done = this.async();
        
        var path = require('path');
        var pLimit = require('p-limit');
        var limit = pLimit(5);
        const { download, rewrite, load } = require('./helpers/requests.js');

        await Promise.all(contentJson.attributes.content.reduce((arr, d, i) => {
            if(d.url){
                arr = arr.concat(d.endpoints.map((endpoint) => limit(() => load({
                        path: d.url,
                        api: d.api || '/wp-json/wp/v2/',
                        endpoint,
                        type: d.type || 'wp',
                        ext: d.ext || 'json',
                        saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`),
                        bundle: d.bundle ? 'media/' : '',
                    }))));
            }

            return arr;
        }, []));

        // Pull assets referenced in json files
        await Promise.all(contentJson.attributes.content.map((d, i) => {
            if(d.url && d.find !== null){
                return limit(() => download({
                        path: d.url,
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
                        ext: d.ext || 'json',
                        type: d.type || 'wp',
                        saveTo: d.saveTo || path.join(config.src, `/content/content-${i}/`),
                        bundle: d.bundle ? 'media/' : '',
                        find: d.find || `^https.*/wp-content/uploads`
                    }));
            }
        }));

        done();
    });
};