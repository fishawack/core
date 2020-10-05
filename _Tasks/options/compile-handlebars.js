module.exports = {
	default: {
        'files': [
            {
                expand: true,
                cwd: '_Build/',
                src: ['*.html', '!**/*_*.html'],
                dest: '.tmp/compiled/',
                flatten: true
            },
            {
                expand: true,
                cwd: '_Build/html',
                src: ['**/*.html', '!**/*_*.html'],
                dest: '.tmp/compiled/'
            }
        ],
        'templateData': "<%= this.contentPath %>",
        'helpers': '_Build/handlebars/helpers/**/*.js',
        'partials': [
            '_Build/handlebars/partials/**/*.{hbs,svg,html}',
            '_Build/handlebars/components/**/*.{hbs,svg,html}'
        ],
        'globals': [
            {
                dev: '<%= dev %>',
                target: '<%= deployBranch %>',
                version: '<%= pkg.version %>',
                env: process.env,
                pkg: '<%= pkg %>',
                build: Math.floor(Math.random()*90000) + 1000000
            }
        ],
        handlebars: "<%= (pkg.devDependencies && pkg.devDependencies.handlebars) && 'node_modules/handlebars' %>"
    }
}