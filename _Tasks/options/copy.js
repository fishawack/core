module.exports = {
    content: {
        files: [{
            expand: true,
            cwd: '_Build/content/media',
            src: ['**/*'],
            dest: '<%= root %>/media/content'
        }]
    },
    assets: {
        files: [{
            expand: true,
            cwd: '_Build/media/',
            src: ['**/*'],
            dest: '<%= root %>/media/'
        }]
    },
    svg: {
        files: [{
            expand: true,
            cwd: '.tmp/icons-min/',
            src: ['**/*'],
            dest: '_Build/handlebars/partials/generated/embed/',
            rename: function(dest, src){ // RENAMED SO DONT CLASH WITH HANDELBARS PARTIALS / HELPERS
                return dest + 'svg--' + src;
            },
            flatten: true
        }]
    },
    svgasis: {
        files: [{
            expand: true,
            cwd: '_Build/svg',
            src: ['**/__*'],
            dest: '_Build/handlebars/partials/generated/embed/',
            rename: function(dest, src){ // RENAMED SO DONT CLASH WITH HANDELBARS PARTIALS / HELPERS
                return dest + 'svg--asis--' + src;
            },
            flatten: true
        }]
    },
    app: {
        files: [{
            expand: true,
            cwd: '<%= root %>',
            src: ['**/*'],
            dest: '_App'
        }]
    },
    electron: {
        files: [
            {
                src: '_Node/electron.js',
                dest: '_Packages/Electron/App/index.js'
            },
            {
                cwd: '<%= root %>/',
                src: '**',
                dest: '_Packages/Electron/App/',
                expand: true
            }
        ]
    }
}