module.exports = {
    options: {
        spawn: false
    },
	scripts: {
        files: ['_Build/js/**/*.js', '!_Build/js/generated/**/*'],
        tasks: ['jshint', 'browserify:dev', 'concat:dev', 'karma:unit:run']
    },
    styles: {
        files: ['_Build/sass/**/*.scss', '_Build/sass/**/*.json'],
        tasks: ['sass:dev', 'postcss:all']
    },
    content: {
        options: {
            spawn: false
        },
        files: ['_Build/content.json', '_Build/example/content.json']
    },
    html: {
        files: ['_Build/*.html', '_Build/*.json', '_Build/example/content.json', '_Build/handlebars/**/*', '!_Build/handlebars/partials/generated/**/*'],
        tasks: ['jsonlint', 'tv4', 'compile-handlebars:dev', 'htmlmin', 'clean:build', 'sass:dev', 'postcss:all']
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets']
    },
    svg: {
        files: ['_Build/svg/**/*', '_Build/icons/**/*'],
        tasks: ['fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:svgasis', 'copy:svg', 'clean:build']
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