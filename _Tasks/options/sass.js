module.exports = {
    dev: {
        options: {
            outputStyle: 'expanded',
            sourceMap: false,
            sourceComments: true,
            includePaths: [
                'node_modules/support-for/sass',
                'node_modules/normalize-scss/sass',
                'node_modules/breakpoint-sass/stylesheets',
                'node_modules',
                'node_modules/lab-ui/_Build/sass',
                '_Build/vue'
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
                'node_modules/support-for/sass',
                'node_modules/normalize-scss/sass',
                'node_modules/breakpoint-sass/stylesheets',
                'node_modules',
                'node_modules/lab-ui/_Build/sass',
                '_Build/vue'
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