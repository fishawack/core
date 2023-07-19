module.exports = (grunt) => {
    grunt.registerTask('prerender', async function(){
        var done = this.async();

        const fs = require('fs-extra');
        const path = require('path');

        const Prerenderer = require('@prerenderer/prerenderer');
        const Renderer = require('@prerenderer/renderer-puppeteer');

        const dest = grunt.config.process('<%= root %>');
        var routes;

        try{
            routes = await require(path.join(process.cwd(), '/_Node/prerender.js'))();
        } catch {
            routes = ['/'];
        }

        const prerenderer = new Prerenderer({
            // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
            staticDir: path.join(process.cwd(), grunt.config.process('<%= webRoot %>')),

            indexPath: path.join(process.cwd(), dest, 'index.html'),

            // The plugin that actually renders the page.
            renderer: new Renderer({
                // Optional - defaults to 0, no limit.
                // Routes are rendered asynchronously.
                // Use this to limit the number of routes rendered in parallel.
                maxConcurrentRoutes: 10,

                // Optional - Wait to render until the specified element is detected using `document.querySelector`
                renderAfterElementExists: '.loaded',

                inject: {
                    engine: 'puppeteer'
                },

                injectProperty: 'prerender',

                args: [
                    '--single-process',
                    '--headless', 
                    '--no-sandbox', 
                    '--disable-gpu', 
                    '--disable-dev-shm-usage',
                    '--shm-size=3gb',
                ],

                timeout: 60000,
            })
        });

        const total = routes.length;
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(5);
        let retries = 0;

        try {
            while(routes.length){
                const batch = routes.splice(0, 25);
                grunt.log.warn(`New Batch of ${batch.length}: ${routes.length} remaining`);

                await prerenderer.initialize();

                try { 
                    await Promise.all(batch.map((d, i) => limit(async () => {
                        const renderedRoute = (await prerenderer.renderRoutes([d]))[0];

                        const outputDir = path.join(process.cwd(), dest, renderedRoute.route);
                        const outputFile = `${outputDir}/index.html`;
                        const html = renderedRoute.html.trim().replace('loaded', 'loading');
                        
                        fs.mkdirpSync(outputDir);

                        fs.writeFileSync(outputFile, html);

                        grunt.log.ok(`Rendered (${(total - (routes.length + batch.length)) + i}/${total}) ${renderedRoute.route}`);
                    })));
                } catch (err){
                    console.log(err);
                    retries++;

                    if(retries > 5){
                        await prerenderer.destroy();
                        grunt.log.warn(`No more retries`);
                        grunt.fatal(err);
                    }

                    grunt.log.warn(`Retrying batch: retry ${retries}`);
                    routes.unshift(...batch);
                }
                
                console.log("destroy");
                await prerenderer.destroy();
            }
        } catch (err){
            grunt.fatal(err);
        }

        done();
    });
};