module.exports = {
    options: {
        spawn: false
    },
    vue: {
        files: ['<%= src %>/vue/**/*.{vue,js}'],
        tasks: ['webpack:dev', 'concat:dev', 'clean:build']
    },
    scripts: {
        files: ['<%= src %>/js/**/*.js', '!<%= src %>/js/generated/**/*'],
        tasks: ['webpack:dev', 'concat:dev']
    },
    html: {
        files: [
                './fw.json',
                './content.json',
                './level-*.json',
                '<%= src %>/*.json',
                '<%= src %>/example/content.json',
                '<%= src %>/config/**/*.json',
                '<%= src %>/*.html',
                '<%= src %>/html/**/*.html',
                '<%= src %>/handlebars/**/*',
                '!<%= src %>/handlebars/generated/**/*'
            ],
        tasks: ['reload', 'json-schema', 'compile-handlebars', 'htmlmin', 'webpack:dev', 'concat:dev', 'clean:build']
    },
    assets: {
        files: ['<%= src %>/media/**/*'],
        tasks: ['copy:assets']
    }
}