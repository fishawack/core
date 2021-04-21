module.exports = {
    options: {
        configFile: '<%= configPath %>wdio.conf.js',
        capabilities: captureEnv().browsers.map((d) => {
        	return {browserName: d};
        }),
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