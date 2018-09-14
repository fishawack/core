module.exports = {
    deploy: {
        "options": {
            'archive': '_Zips/Deploy.zip'
        },
        'cwd': '<%= root %>', 
        'src': ['**/*'],
        'expand': true,
        'dot': true
    },
    watertight: {
        "options": {
            'archive': '_Zips/Deploy.zip'
        },
        'cwd': '_Login', 
        'src': ['**/*', '**/.htaccess'],
        'expand': true,
        'dot': true
    },
    app: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_App.zip'
        },
        'cwd': '_Output/', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    mac: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Mac.zip'
        },
        'cwd': '_Packages/Electron/<%= contentJson.attributes.title %>-darwin-x64/', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    win: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_Win.zip'
        },
        'cwd': '_Packages/Electron/<%= contentJson.attributes.title %>-win32-x64/', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    phonegap: {
        "options": {
            'archive': '_Zips/Deploy.zip'
        }, 
        'cwd': '_Packages/Phonegap', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    ios: {
        "options": {
            'archive': '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>_iOS.zip'
        },
        'cwd': '_Packages/iOS/', 
        'src': ['app.ipa'],
        'expand': true,
        'dot': true
    }
}