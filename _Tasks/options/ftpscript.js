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
    badges: {
        files: [{
            expand: true,
            cwd: '<%= src %>/media/generated/',
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