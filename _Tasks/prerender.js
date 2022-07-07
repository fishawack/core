module.exports = (grunt) => {
    grunt.registerTask('prerender', async function(){
        var done = this.async();

        const fs = require('fs');
        const path = require('path');
        const mkdirp = require('mkdirp');
        const jsdom = require("jsdom");

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
            staticDir: path.join(process.cwd(), path.dirname(dest).split(path.sep)[0]),

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
                    '--single-process'
                ]
            })
        });

        // Initialize is separate from the constructor for flexibility of integration with build systems.
        prerenderer.initialize()
            .then(async () => {
                let arr = [];
                for(var i = 0; i < routes.length; i++){
                    grunt.log.warn(`Rendering ${routes[i]}`);
                    arr = arr.concat(await prerenderer.renderRoutes([routes[i]]));

                }
                return arr;
            })
            .then(renderedRoutes => {
                // renderedRoutes is an array of objects in the format:
                // {
                //   route: String (The route rendered)
                //   html: String (The resulting HTML)
                // }
                renderedRoutes.forEach(renderedRoute => {
                    const outputDir = path.join(process.cwd(), dest, renderedRoute.route);
                    const outputFile = `${outputDir}/index.html`;
                    let html = renderedRoute.html.trim().replace('loaded', 'loading');
                    
                    mkdirp.sync(outputDir);

                    fs.writeFileSync(outputFile, html);

                    grunt.log.ok(`Rendered ${renderedRoute.route}`);
                });

                // Shut down the file server and renderer.
                prerenderer.destroy();
            })
            .catch(err => {
                grunt.fatal(err);
                // Shut down the server and renderer.
                prerenderer.destroy();
                // Handle errors.
            })
            .finally(() => done());
    });
};