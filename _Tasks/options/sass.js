module.exports = {
	options: {
		outputStyle: 'expanded',
		sourceMap: false,
		sourceComments: true,
		includePaths: [
			'node_modules/support-for/sass',
			'node_modules/normalize-scss/sass',
			'node_modules/breakpoint-sass/stylesheets',
			'node_modules',
			'node_modules/@fishawack/lab-ui/_Build/sass',
			'<%= src %>/vue'
		]
	},
    default: {
        files: [{
            expand: true,
            cwd: '<%= src %>/sass/',
            src: ['**/*.scss', '!**/_*.scss'],
            dest: '.cache/css/',
            ext: '.css',
            flatten: true
        }]
    }
}