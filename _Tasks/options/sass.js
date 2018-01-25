module.exports = {
    dev: {
        options: {
            outputStyle: 'expanded',
            sourceMap: false,
            sourceComments: true,
            includePaths: [
                'bower_components/support-for/sass',
                'bower_components/compass-breakpoint/stylesheets',
                'bower_components/normalize-scss/sass',
                'node_modules',
                'node_modules/lab-ui/_Build/sass'
            ]
        },
        files: [{
            expand: true,
            cwd: '_Build/sass/',
            src: ['**/*.scss', '!**/_*.scss'],
            dest: '<%= root %>/css/',
            ext: '.css',
            flatten: true
        }]
    },
    dist: {
        options: {
            outputStyle: 'compressed',
            sourceMap: false,
            includePaths: [
                'bower_components/support-for/sass',
                'bower_components/compass-breakpoint/stylesheets',
                'bower_components/normalize-scss/sass',
                'node_modules',
                'node_modules/lab-ui/_Build/sass'
            ]
        },
        files: [
            {
                expand: true,
                cwd: '_Build/sass/',
                src: ['**/*.scss', '!**/_*.scss'],
                dest: '<%= root %>/css/',
                ext: '.css',
                flatten: true
            },
            {
                expand: true,
                cwd: '<%= root %>/svg/',
                src: ['*.css'],
                dest: '<%= root %>/svg/'
            }
        ]
    }
}