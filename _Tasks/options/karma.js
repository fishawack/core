module.exports = {
	unit: {
        configFile: '<%= configPath %>karma.conf.js',
        background: true,
        singleRun: false
    },
    continuous: {
        configFile: '<%= configPath %>karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome']
    }
}