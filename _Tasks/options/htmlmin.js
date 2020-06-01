module.exports = {
    options: {
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyJS: true,
        collapseInlineTagWhitespace: false
    },
	all: {
        files: [{
            expand: true,
            cwd: '.tmp/compiled',
            src: '**/*.html',
            dest: '<%= root %>'
        }]
    }
}