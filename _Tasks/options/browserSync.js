module.exports = {
	default: {
        bsFiles: {
            src : [
                '<%= root %>/css/*.css',
                '<%= root %>/*.html',
                '<%= root %>/js/*.js',
                '<%= root %>/media/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF,json}',
                '<%= root %>/svg/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}'
            ]
        },
        options: {
            watchTask: true,
            notify: false,
            open: false,
            reloadOnRestart: true,
            ghostMode: true,
            single: true,
            server: {
                baseDir: "<%= root %>"
            },
        }
    }
}