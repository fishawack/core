module.exports = {
    options: {
        spawn: false
    },
    vue: {
        files: ['_Build/vue/**/*.{vue,js}'],
        tasks: ['jshint', 'browserify:dev', 'concat:dev', 'compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    scripts: {
        files: ['_Build/js/**/*.js', '!_Build/js/generated/**/*'],
        tasks: ['jshint', 'browserify:dev', 'concat:dev', 'karma:unit:run']
    },
    styles: {
        files: ['_Build/vue/**/*.scss', '_Build/sass/**/*.scss', '_Build/sass/**/*.json'],
        tasks: ['compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    content: {
        files: ['_Build/content.json', '_Build/example/content.json']
    },
    html: {
        files: ['_Build/*.html', '_Build/*.json', '_Build/example/content.json', '_Build/handlebars/**/*', '!_Build/handlebars/partials/generated/**/*'],
        tasks: ['jsonlint', 'tv4', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets']
    },
    smokeTests: {
        files: ['_Test/casperjs/modules/**/*.js'],
        tasks: ['casperjs:local']
    },
    unitTests: {
        files: ['_Test/karma/**/*'],
        tasks: ['karma:unit:run']
    }
}