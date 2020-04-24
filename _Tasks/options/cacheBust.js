module.exports = {
    options: {
        assets: [
            'css/*', 
            'js/*'
        ],
        baseDir: '<%= root %>',
        deleteOriginals: true,
        separator: '.cache.'
    },
    default: {
        src: [
            '<%= root %>/**/*.html', 
            '<%= root %>/html/**/*.html'
        ]
    }
}