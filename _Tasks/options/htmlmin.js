module.exports = {
	all: {
        options: {
            removeComments: true,
            collapseWhitespace: true,
            keepClosingSlash: true,
            minifyJS: true,
            collapseInlineTagWhitespace: false
        },
        files: [{
            expand: true,
            cwd: '.tmp/compiled',
            src: '*.html',
            dest: '<%= root %>'
        }]
    }
}