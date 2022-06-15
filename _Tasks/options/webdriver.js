module.exports = {
    options: {
        configFile: '<%= configPath %>wdio.conf.js',
        capabilities: captureEnv().browsers.reduce((arr, browser) => {
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
                
                if(size[0] === 375 && size[1] === 667){
                    obj.chromeOptions = {
                        mobileEmulation: {'deviceName': 'iPhone 6/7/8'},
                    };
                }

                arr.push(obj);
            });

            return arr;
        }, []),
        baseUrl: captureEnv().url
    },
    default: {
        specs: [
            '<%= configPath %>_Node/capture.js'
        ]
    },
    ui: {
        specs: [
            '_Test/ui/**/*.js'
        ]
    }
}