module.exports = {
	default: {
        'files': [
            {
                expand: true,
                cwd: '<%= src %>/',
                src: ['*.html', '!**/*_*.html'],
                dest: '.tmp/compiled/',
                flatten: true
            },
            {
                expand: true,
                cwd: '<%= src %>/html',
                src: ['**/*.html', '!**/*_*.html'],
                dest: '.tmp/compiled/'
            }
        ],
        'templateData': "<%= this.contentPath %>",
        'helpers': [
            '<%= src %>/handlebars/**/*.js'
        ],
        'partials': [
            '<%= src %>/handlebars/**/*.{hbs,svg,html}'
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