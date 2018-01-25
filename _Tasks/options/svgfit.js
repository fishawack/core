module.exports = {
	dist: {
        files: [{
            expand: true,
            cwd: '_Build',
            src: ['svg/**/*.svg', 'icons/**/*.svg'],
            dest: '.tmp/icons-fit/',
            flatten: true,
        }]
    }
}