module.exports = {
	dev: {
        bsFiles: {
            src : [
                '<%= root %>/css/*.css',
                '<%= root %>/*.html',
                '<%= root %>/js/*.js',
                '<%= root %>/media/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}',
                '<%= root %>/svg/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}'
            ]
        },
        options: {
            watchTask: true,
            notify: false,
            open: false,
            reloadOnRestart: true,
            ghostMode: true,
            server: {
                baseDir: "<%= root %>"
            },
        }
    }
}