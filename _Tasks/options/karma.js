module.exports = {
	unit: {
        configFile: 'karma.conf.js',
        background: true,
        singleRun: false
    },
    continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome']
    }
}