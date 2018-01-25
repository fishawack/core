module.exports = {
    options: {
        separator: ';',
    },
    dev: {
        files: [
        {
            '<%= root %>/js/crucial.js': ['_Build/js/**/__*.js']
        },
        {
            expand: true,
            cwd: '_Build/js/',
            src: ['**/--*.js'],
            dest: '<%= root %>/js/',
            flatten: true,
            rename: function(dest, src){
                return dest + src.slice(2);
            }
        }]
    },
    dist: {
        files: [
        {
            '.tmp/js/crucial.js': ['_Build/js/**/__*.js']
        },
        {
            expand: true,
            cwd: '_Build/js/',
            src: ['**/--*.js'],
            dest: '.tmp/js/',
            flatten: true,
            rename: function(dest, src){
                return dest + src.slice(2);
            }
        }]
    }
}