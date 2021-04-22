module.exports = {
    options: {
        spawn: false
    },
    vue: {
        files: ['_Build/vue/**/*.{vue,js}'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev', 'compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    scripts: {
        files: ['_Build/js/**/*.js', '!_Build/js/generated/**/*'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev']
    },
    styles: {
        files: ['_Build/vue/**/*.scss', '_Build/sass/**/*.scss'],
        tasks: ['compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    html: {
        files: [
                '_Build/*.json',
                '_Build/example/content.json',
                '_Build/config/**/*.json',
                '_Build/*.html',
                '_Build/html/**/*.html',
                '_Build/handlebars/**/*',
                '!_Build/handlebars/generated/**/*'
            ],
        tasks: ['reload', 'jsonlint', 'tv4', 'compile-handlebars', 'htmlmin', 'webpack:dev', 'concat:dev', 'compile-vue', 'sass', 'postcss:dev', 'clean:build']
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets']
    }
}