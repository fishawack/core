module.exports = {
    options: {
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyJS: true,
        collapseInlineTagWhitespace: false
    },
	default: {
        files: [{
            expand: true,
            cwd: '.tmp/compiled',
            src: '**/*.html',
            dest: '<%= root %>'
        }]
    }
}