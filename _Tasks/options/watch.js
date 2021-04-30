module.exports = {
    options: {
        spawn: false
    },
    vue: {
        files: ['<%= src %>/vue/**/*.{vue,js}'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev', 'compile-vue', 'newer:postcss:dev', 'clean:build']
    },
    scripts: {
        files: ['<%= src %>/js/**/*.js', '!<%= src %>/js/generated/**/*'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev']
    },
    styles: {
        files: ['<%= src %>/vue/**/*.scss', '.cache/css/*.css'],
        tasks: ['compile-vue', 'newer:postcss:dev', 'concat:sass', 'clean:build']
    },
    html: {
        files: [
                '<%= src %>/*.json',
                '<%= src %>/example/content.json',
                '<%= src %>/config/**/*.json',
                '<%= src %>/*.html',
                '<%= src %>/html/**/*.html',
                '<%= src %>/handlebars/**/*',
                '!<%= src %>/handlebars/generated/**/*'
            ],
        tasks: ['reload', 'jsonlint', 'tv4', 'compile-handlebars', 'htmlmin', 'webpack:dev', 'concat:dev', 'compile-vue', 'newer:postcss:dev', 'clean:build']
    },
    assets: {
        files: ['<%= src %>/media/**/*'],
        tasks: ['copy:assets']
    }
}