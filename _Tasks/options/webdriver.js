module.exports = {
    pdf: {
        configFile: 'node_modules/@fishawack/config-grunt/wdio.conf.js',
        specs: [
            '<%= configPath %>_Node/crawl.js'
        ]
    }
}