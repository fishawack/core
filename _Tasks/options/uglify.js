module.exports = {
    dist: {
        files: [
        {
            expand: true,
            cwd: '.tmp/js',
            src: ['**/*.js'],
            dest: '<%= root %>/js/',
            flatten: true
        }]
    }
}