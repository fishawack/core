module.exports = {
	dev: {
        'files': [{
            expand: true,
            cwd: '_Build/',
            src: ['*.html'],
            dest: '.tmp/compiled/'
        }],
        'templateData': "<%= this.contentPath %>",
        'helpers': '_Build/handlebars/helpers/**/*.js',
        'partials': [
            '_Build/handlebars/partials/**/*.{hbs,svg,html}',
            '_Build/handlebars/components/**/*.{hbs,svg,html}'
        ],
        'globals': [
            {
                dev: true,
                version: '<%= pkg.version %>'
            }
        ]
    },
    dist: {
        'files': [{
            expand: true,
            cwd: '_Build/',
            src: ['*.html'],
            dest: '.tmp/compiled/'
        }],
        'templateData': "<%= this.contentPath %>",
        'helpers': '_Build/handlebars/helpers/**/*.js',
        'partials': [
            '_Build/handlebars/partials/**/*.{hbs,svg,html}',
            '_Build/handlebars/components/**/*.{hbs,svg,html}'
        ],
        'globals': []
    }
}