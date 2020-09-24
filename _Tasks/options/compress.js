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
        'cwd': '_Packages/Watertight/', 
        'src': ['**/*', '**/.htaccess'],
        'expand': true,
        'dot': true
    },
    app: {
        "options": {
            'archive': '_Zips/<%= filename %>_App.zip'
        },
        'cwd': '_Output/', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    mac: {
        "options": {
            'archive': '_Zips/<%= filename %>_Mac.zip'
        },
        'cwd': '_Packages/Electron/<%= repo.name %>-darwin-x64/', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    win: {
        "options": {
            'archive': '_Zips/<%= filename %>_Win.zip'
        },
        'cwd': '_Packages/Electron/<%= repo.name %>-win32-x64/', 
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
            'archive': '_Zips/<%= filename %>_iOS.zip'
        },
        'cwd': '_Packages/iOS/', 
        'src': ['app.ipa'],
        'expand': true,
        'dot': true
    },
    veeva: {
        "options": {
            'archive': '_Zips/<%= filename %>_Veeva.zip'
        },
        'cwd': '_Packages/Veeva', 
        'src': ['**', '!**/ctlfile/**/*', '!**/ctlfile'],
        'expand': true,
        'dot': true
    },
    vablet: {
        "options": {
            'archive': '_Zips/<%= filename %>_Vablet.zip'
        },
        'cwd': '_Packages/Vablet', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    cegedim: {
        "options": {
            'archive': '_Zips/<%= filename %>_Cegedim.zip'
        },
        'cwd': '_Packages/Cegedim', 
        'src': ['**'],
        'expand': true,
        'dot': true
    },
    handover: {
        "options": {
            'archive': '_Zips/<%= filename %>_Handover.zip'
        },
        'cwd': '_Packages/Handover', 
        'src': ['**'],
        'expand': true,
        'dot': true
    }
}