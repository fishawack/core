module.exports = {
    options: {
        archive: '_Zips/Deploy.zip'
    },
    deploy: {
        files: [
            {
                expand: true,
                cwd: '<%= root %>',
                src: ['**/*'],
                dest: './'
            }
        ]
    },
    watertight: {
        files: [
            {
                expand: true,
                cwd: '_Login/',
                src: ['**/*', '**/.htaccess'],
                dest: './'
            }
        ]
    },
    app: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_App.zip'
        },
        'cwd': '_App/', 
        'src': ['**'],
        'expand': true
    },
    mac: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Mac.zip'
        },
        'cwd': '_Electron/<%= contentJson.attributes.title %>-darwin-x64/', 
        'src': ['**'],
        'expand': true
    },
    win: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Win.zip'
        },
        'cwd': '_Electron/<%= contentJson.attributes.title %>-win32-x64/', 
        'src': ['**'],
        'expand': true
    }
}