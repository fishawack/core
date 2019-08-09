module.exports = {
    pdf: {
        configFile: '<%= configPath %>wdio.conf.js',
        specs: [
            '<%= configPath %>_Node/capture.js'
        ],
        capabilities: (deployEnv.pdf && deployEnv.pdf.browsers || ['chrome']).map((d) => {
        	return {browserName: d};
        })
    }
}