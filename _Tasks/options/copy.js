module.exports = {
    content: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '_Build/content/',
                src: ['**/media/**/*'],
                dest: '<%= root %>/media/content/',
                rename: function(dest, src) {
                    var parts = src.split('/');
                    parts.shift();// Remove content-${i}
                    parts.shift();// Remove media
                    return dest + parts.join('/');
                }
            }
        ].concat(contentJson.attributes.copy || [])
    },
    assets: {
        files: [{
            expand: true,
            dot: true,
            cwd: '_Build/media/',
            src: ['**/*'],
            dest: '<%= root %>/media/'
        }]
    },
    svg: {
        files: [{
            expand: true,
            dot: true,
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
            dot: true,
            cwd: '_Build/svg',
            src: ['**/*'],
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
            dot: true,
            cwd: '<%= root %>',
            src: ['**/*'],
            dest: '_App'
        }]
    },
    electron: {
        files: [
            {
                src: "<%= (fileExists('electron.js', '_Node/', grunt) ? '_Node/electron.js' : this.configPath + '_Node/electron.js') %>",
                dest: '_Packages/Electron/App/index.js'
            },
            {
                cwd: '<%= root %>/',
                src: '**',
                dest: '_Packages/Electron/App/',
                expand: true,
                dot: true
            }
        ]
    },
    phonegap: {
        files: [
            {
                cwd: '<%= root %>/',
                src: '**',
                dest: '_Packages/Phonegap/www/',
                expand: true,
                dot: true
            }
        ]
    },
    vablet: {
        files: [
            {
                cwd: '<%= root %>/',
                src: '**',
                dest: '_Packages/Vablet/',
                expand: true,
                dot: true
            }
        ]
    },
    handover: {
        files: [
            {
                src: [
                    '_Build/**/*',
                    '_Node/**/*',
                    '_Test/**/*',
                    '.gitignore',
                    'package.json',
                    'README.md'
                ],
                dest: '_Packages/Handover/',
                expand: true,
                dot: true
            }
        ]
    }
}