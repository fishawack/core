module.exports = {
    pdf: {
        configFile: '<%= configPath %>wdio.conf.js',
        specs: [
            '<%= configPath %>_Node/capture.js'
        ],
        capabilities: captureEnv().browsers.map((d) => {
        	return {browserName: d};
        })
    }
}