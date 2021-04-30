module.exports = {
    options: {
        separator: ';',
    },
    dev: {
        files: [
        {
            '<%= root %>/js/crucial.js': ['<%= src %>/js/**/__*.js']
        },
        {
            expand: true,
            cwd: '<%= src %>/js/',
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
            '.tmp/js/crucial.js': ['<%= src %>/js/**/__*.js']
        },
        {
            expand: true,
            cwd: '<%= src %>/js/',
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
                '<%= root %>/css/general.css': ['.cache/postcss/vendor.css', '.cache/postcss/general.css']
            },
            {
                expand: true,
                cwd: '.cache/postcss',
                src: ['*.css', '!general.css', '!vendor.css'],
                dest: '<%= root %>/css/',
            }
        ]
    }
}