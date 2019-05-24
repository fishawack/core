module.exports = {
    default: {
        options: {
            implementation: require('node-sass'),
            outputStyle: 'expanded',
            sourceMap: false,
            sourceComments: true,
            includePaths: [
                'node_modules/support-for/sass',
                'node_modules/normalize-scss/sass',
                'node_modules/breakpoint-sass/stylesheets',
                'node_modules',
                'node_modules/@fishawack/lab-ui/_Build/sass',
                '_Build/vue'
            ]
        },
        files: [{
            expand: true,
            cwd: '_Build/sass/',
            src: ['**/*.scss', '!**/_*.scss'],
            dest: '.tmp/css/',
            ext: '.css',
            flatten: true
        }]
    }
}