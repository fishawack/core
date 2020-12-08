module.exports = {
    default: {
        files: [{
			expand: true,
			cwd: '_Build/sass/',
			src: ['**/*.scss'],
			dest: '.tmp/css/'
		}]
    }
}