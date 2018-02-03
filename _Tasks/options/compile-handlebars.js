module.exports = {
	default: {
        'files': [{
            expand: true,
            cwd: '_Build/',
            src: ['*.html', '!_*.html'],
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
                dev: '<%= (deployTarget === "production") ? false : true %>',
                target: '<%= deployTarget %>',
                version: '<%= pkg.version %>'
            }
        ]
    }
}