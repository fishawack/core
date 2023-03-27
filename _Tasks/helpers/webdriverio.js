async function run(wdioOptions = {}){
    await new Promise(resolve => {
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
            let obj = require('../../wdio.conf.js').config;
            const capture = captureEnv();

            obj.capabilities = capture.browsers.reduce((arr, browser) => {
                capture.sizes.forEach((size, index) => {
                    let obj = { 
                        browserName: browser,
                        size,
                        index,
                        wait: capture.wait,
                        url: capture.url,
                        sizes: capture.sizes,
                        pages: capture.pages,
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

            fs.mkdirpSync('.tmp')
            fs.writeFileSync('.tmp/wdio.conf.js', `exports.config = ${JSON.stringify(obj, null, 4)};`);

            const wdio = new Launcher(
                ".tmp/wdio.conf.js",
                wdioOptions
            );

            let exitCode = await wdio.run();

            bs.exit();

            if(exitCode){
                grunt.fail.warn('Tests suites failing', exitCode);
            };

            resolve(); 
        });
    });
}

module.exports.run = run;