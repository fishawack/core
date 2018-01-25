module.exports = {
	unit: {
        configFile: 'node_modules/config-grunt/karma.conf.js',
        background: true,
        singleRun: false
    },
    continuous: {
        configFile: 'node_modules/config-grunt/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome']
    }
}