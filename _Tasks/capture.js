module.exports = grunt => {
    grunt.registerTask('capture', ['clean:build', 'capture:screenshots']);

    grunt.registerTask('capture:screenshots', function(){capture(this.async())});

    function capture(done){
        const bs = require("browser-sync").create();
        const fs = require("fs-extra"); 

        bs.init(Object.assign(grunt.config.get('browserSync').default.options, {
            port: 9001,
            ghostMode: false,
            https: false,
            logLevel: 'silent'
        }), async () => {
            const { Launcher } = await import('@wdio/cli');
            
            // Laumching wdio/cli directly doesn't allow you to set multiple capabilities so instead write all to tmp wdio conf and read that in
            let obj = require('../wdio.conf.js').config;

            obj.capabilities = captureEnv().browsers.reduce((arr, browser) => {
                captureEnv().sizes.forEach((size, index) => {
                    let obj = { 
                        browserName: browser,
                        size,
                        index,
                        wait: captureEnv().wait,
                        url: captureEnv().url,
                        sizes: captureEnv().sizes,
                        pages: captureEnv().pages,
                        output: config.root
                    };

                    if(browser === "chrome"){
                        obj['goog:chromeOptions'] = {
                            args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
                        }
                    }
    
                    arr.push(obj);
                });
    
                return arr;
            }, []);

            // Disable usual test spec location
            obj.specs = [];

            fs.mkdirpSync('/app/.tmp')
            fs.writeFileSync('/app/.tmp/wdio.conf.js', `exports.config = ${JSON.stringify(obj, null, 4)};`);

            const wdio = new Launcher(
                "/app/.tmp/wdio.conf.js",
                { spec: ['/app/_Node/capture.js'] }
            );

            let exitCode = await wdio.run();

            bs.exit();

            if(exitCode){
                grunt.fail.warn('Tests suites failing', exitCode);
            };

            done(); 
        });
    }
};