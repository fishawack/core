module.exports = {
	default: {
        bsFiles: {
            src : [
                '<%= root %>/css/*.css',
                '<%= root %>/*.html',
                '<%= root %>/js/*.js'
            ]
        },
        options: {
            watchTask: true,
            notify: false,
            open: false,
            reloadOnRestart: false,
            ghostMode: true,
            single: true,
            server: {
                baseDir: "<%= root %>"
            },
            port: process.env.PORT || 3000,
            ui: {
                port: +process.env.PORT_OPT || 3001
            }
        }
    }
}