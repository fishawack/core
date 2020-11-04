module.exports = {
	default: {
        files: [{
            expand: true,
            cwd: '<%= root %>/media/',
            src: ['**/*.{png,jpg,jpeg,gif}', '!**/content/image-library/**/*'],
            dest: '<%= root %>/media/'
        }]
    }
}