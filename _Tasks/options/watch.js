module.exports = {
    options: {
        spawn: false
    },
    vue: {
        files: ['<%= src %>/vue/**/*.{vue,js}'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev', 'clean:build']
    },
    scripts: {
        files: ['<%= src %>/js/**/*.js', '!<%= src %>/js/generated/**/*'],
        tasks: ['jshint', 'webpack:dev', 'concat:dev']
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
        tasks: ['reload', 'jsonlint', 'tv4', 'compile-handlebars', 'htmlmin', 'webpack:dev', 'concat:dev', 'clean:build']
    },
    assets: {
        files: ['<%= src %>/media/**/*'],
        tasks: ['copy:assets']
    }
}