module.exports = {
    deploy: {
        options: {
            host: '<%= deployEnv.ftp %>',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '<%= root %>',
            src: ['**/*', '!**/.DS_Store'],
            dest: '<%= deployLocation %>'
        }]
    },
    pdf: {
        options: {
            host: '10.1.8.4',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '_Pdfs/',
            src: ["<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today('yyyy-mm-dd') %>.pdf"],
            dest: './Auto-Package/<%= pkg.name %>' + '/'
        }]
    },
    package: {
        options: {
            host: '10.1.8.4',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '_Zips/',
            src: ['**/*', '!**/.DS_Store'],
            dest: './Auto-Package/<%= pkg.name %>' + '/'
        }]
    }
}