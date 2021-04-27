module.exports = {
    content: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= src %>/content/',
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
            cwd: '<%= src %>/media/',
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
            dest: '<%= src %>/handlebars/generated/embed/',
            rename: function(dest, src){ // RENAMED SO DONT CLASH WITH HANDELBARS PARTIALS / HELPERS
                return dest + 'svg--' + src;
            },
            flatten: true
        }]
    },
    svgasis: {
        files: [{
            expand: true,
            cwd: '<%= src %>',
            src: ['svg/**/*.svg', 'icons/**/*.svg'],
            dest: '<%= src %>/handlebars/generated/embed/',
            rename: function(dest, src){ // RENAMED SO DONT CLASH WITH HANDELBARS PARTIALS / HELPERS
                return dest + 'svg--asis--' + src;
            },
            flatten: true
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
                    '<%= src %>/**/*',
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