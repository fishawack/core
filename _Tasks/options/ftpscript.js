module.exports = {
    options: {
        host: '10.1.8.4',
        timeout: 5,
        port: 21,
        passive: true
    },
    deploy: {
        options: {
            host: '<%= deployEnv.ftp %>'
        },
        files: [{
            expand: true,
            cwd: '<%= root %>',
            src: ['**/*', '!**/.DS_Store'],
            dest: '<%= deployLocation %>'
        }]
    },
    pdf: {
        files: [{
            expand: true,
            cwd: '_Pdfs/',
            src: ["*.pdf"],
            dest: './Auto-Package/<%= pkg.name %>' + '/'
        }]
    },
    package: {
        files: [{
            expand: true,
            cwd: '_Zips/',
            src: ['**/*', '!**/.DS_Store'],
            dest: './Auto-Package/<%= pkg.name %>' + '/'
        }]
    },
    badges: {
        files: [{
            expand: true,
            cwd: '_Build/media/generated/',
            src: ['**/*', '!**/.DS_Store'],
            dest: './Auto-Badges/<%= pkg.name %>/<%= repo.name %>/'
        }]
    },
    veeva: {
        options: {
            host: 'crm-13-ftp-us.veevacrm.com'
        },
        files: [{
            expand: true,
            cwd: '_Packages/Veeva/',
            src: ['**/*', '!**/.DS_Store'],
            dest: './'
        }]
    }
}