// Karma configuration
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: process.cwd(),


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'fixture', 'webpack'],


    // list of files / patterns to load in the browser
    files: [
        '_Test/karma/**/*.js',
        '_Test/karma/fixtures/**/*',
        '_Test/unit/**/*.js',
        '_Test/unit/fixtures/**/*'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '_Test/karma/fixtures/**/*.html'   : ['html2js'],
        '_Test/karma/fixtures/**/*.json'   : ['json_fixtures'],
        '_Test/karma/**/*.js': ['webpack', 'coverage'],
        '_Test/unit/fixtures/**/*.html'   : ['html2js'],
        '_Test/unit/fixtures/**/*.json'   : ['json_fixtures'],
        '_Test/unit/**/*.js': ['webpack', 'coverage'],
    },

    webpack: require('./_Tasks/options/webpack.js').options,

    webpackMiddleware: {
        noInfo: true,
        quiet: true,
        logLevel: "error",
        stats: {
            // options i.e. 
            chunks: false
        }
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
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
        ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
