// Karma configuration
// Generated on Tue Nov 03 2015 14:32:58 GMT+0000 (GMT)

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai', 'sinon', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
        '_Test/karma/**/*.js',
        '_Test/karma/fixtures/**/*'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '_Test/karma/fixtures/**/*.html'   : ['html2js'],
        '_Test/karma/fixtures/**/*.json'   : ['json_fixtures'],
        '_Test/karma/**/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: [istanbul({
            ignore: ['node_modules/**/*', '_Test/**/*']
        })],
        paths: [
            './_Build/js/',
            './_Build/js/libs/',
            './node_modules/',
            './node_modules/lab-d3/_Build/js/charts/',
            './node_modules/lab-d3/_Build/js/'
        ]
    },

    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'coverage'],

    coverageReporter : {
        reporters: [
            { type: 'lcov' },
            { type: 'html', subdir: 'report-html' },
            { type: 'json-summary', subdir: '.', file: 'json-summary.json' }
        ],
        dir : 'coverage/'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
