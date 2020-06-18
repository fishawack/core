// Karma configuration
// Generated on Tue Nov 03 2015 14:32:58 GMT+0000 (GMT)

var devProject = require('./_Tasks/helpers/dev.js');
var path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../' + (devProject || '../..') + '/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'fixture'],


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
        '_Test/karma/**/*.js': ['webpack']
    },

    // SHOULD BE PULLED FROM _Tasks/options/webpack.js, NEED TO FIGURE OUT INCLUDE ISSUE OF GRUNT VARS NOT AVAILABLE ON KARMA:UNIT:START
    webpack: {
        mode: "production",
        cache: true,
        resolve: {
            modules: [
                './_Build/js/',
                './_Build/js/libs/',
                './_Build/js/charts/',
                './_Build/js/data/',
                './node_modules/@fishawack/lab-d3/_Build/js/',
                './node_modules/@fishawack/lab-d3/_Build/js/libs',
                './node_modules/@fishawack/lab-d3/_Build/js/charts/',
                './node_modules/@fishawack/lab-d3/_Build/js/data/',
                'node_modules',
                path.resolve(__dirname, "node_modules") // Used for core dev
            ]
        },
        resolveLoader: {
            modules: [
                "node_modules",
                path.resolve(__dirname, "node_modules") // Used for core dev
            ]
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: [
                        'vue-loader'
                    ]
                },
                {
                    parser: { amd: false }
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    require.resolve('@babel/preset-env')
                                ],
                                plugins: [
                                    require.resolve('@babel/plugin-transform-object-assign')
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.m?js$/,
                    include: path.resolve('./_Build/js/'),
                    use: [
                        {
                            loader: 'istanbul-instrumenter-loader',
                            query: {
                                esModules: true
                            }
                        }
                    ]
                }
            ]
        }
    },

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
    browsers: ['PhantomJS'],

    phantomjsLauncher: {
        options: {
            settings: {
                webSecurityEnabled: false
            }
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
