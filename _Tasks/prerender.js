module.exports = (grunt) => {
    grunt.registerTask('prerender', function(){
        var done = this.async();

        const fs = require('fs');
        const path = require('path');
        const mkdirp = require('mkdirp');

        const Prerenderer = require('@prerenderer/prerenderer');
        const Renderer = require('@prerenderer/renderer-puppeteer');

        const dest = grunt.config.process('<%= root %>');
        var routes;

        try{
            routes = require(path.join(process.cwd(), '/_Build/js/libs/routes.js'))(true).paths;
        } catch {
            routes = ['/'];
        }

        const prerenderer = new Prerenderer({
            // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
            staticDir: path.join(process.cwd(), dest),

            // The plugin that actually renders the page.
            renderer: new Renderer({
                // Optional - defaults to 0, no limit.
                // Routes are rendered asynchronously.
                // Use this to limit the number of routes rendered in parallel.
                maxConcurrentRoutes: 10,

                // Optional - Wait to render until the specified element is detected using `document.querySelector`
                renderAfterElementExists: '.loaded'
            })
        });

        // Initialize is separate from the constructor for flexibility of integration with build systems.
        prerenderer.initialize()
            .then(() => prerenderer.renderRoutes(routes))
            .then(renderedRoutes => {
                // renderedRoutes is an array of objects in the format:
                // {
                //   route: String (The route rendered)
                //   html: String (The resulting HTML)
                // }
                renderedRoutes.forEach(renderedRoute => {
                    const outputDir = path.join(process.cwd(), dest, renderedRoute.route);
                    const outputFile = `${outputDir}/index.html`;

                    mkdirp.sync(outputDir);
                    fs.writeFileSync(outputFile, renderedRoute.html.trim());

                    grunt.log.ok(renderedRoute.route);
                });

                // Shut down the file server and renderer.
                prerenderer.destroy();
            })
            .catch(err => {
                // Shut down the server and renderer.
                prerenderer.destroy();
                // Handle errors.
            })
            .finally(() => {
                done();
            });
    });
};