module.exports = {
    deploy: {
        "options": {
            'archive': '_Zips/Deploy.zip'
        },
        'cwd': '<%= root %>', 
        'src': ['**/*'],
        'expand': true
    },
    watertight: {
        "options": {
            'archive': '_Zips/Deploy.zip'
        },
        'cwd': '_Login', 
        'src': ['**/*', '**/.htaccess'],
        'expand': true
    },
    app: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_App.zip'
        },
        'cwd': '_Output/', 
        'src': ['**'],
        'expand': true
    },
    mac: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Mac.zip'
        },
        'cwd': '_Packages/Electron/<%= contentJson.attributes.title %>-darwin-x64/', 
        'src': ['**'],
        'expand': true
    },
    win: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Win.zip'
        },
        'cwd': '_Packages/Electron/<%= contentJson.attributes.title %>-win32-x64/', 
        'src': ['**'],
        'expand': true
    }
}