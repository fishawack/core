module.exports = {
    pdf: {
        configFile: '<%= configPath %>wdio.conf.js',
        specs: [
            '<%= configPath %>_Node/crawl.js'
        ]
    }
}