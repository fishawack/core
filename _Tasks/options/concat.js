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
            src: ['**/++*.js'],
            dest: '<%= root %>/js/',
            flatten: true,
            rename: function(path, file){
                return path + file.replace('++', '');
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
            src: ['**/++*.js'],
            dest: '.tmp/js/',
            flatten: true,
            rename: function(path, file){
                return path + file.replace('++', '');
            }
        }]
    },
    sass: {
        options: {
            separator: '\n',
        },
        files: [
            {
                '<%= root %>/css/general.css': ['.tmp/css/vendor.css', '.tmp/css/general.css']
            },
            {
                expand: true,
                cwd: '.tmp/css',
                src: ['*.css', '!general.css', '!vendor.css'],
                dest: '<%= root %>/css/',
            }
        ]
    }
}