module.exports = {
	default: {
        files: [{
            expand: true,
            cwd: '<%= src %>',
            src: ['svg/**/*.svg', 'icons/**/*.svg'],
            dest: '.tmp/icons-fit/',
            flatten: true,
        }]
    }
}