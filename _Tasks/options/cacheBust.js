module.exports = {
    options: {
        assets: [
            'css/*', 
            'js/*'
        ],
        baseDir: '<%= root %>',
        deleteOriginals: true
    },
    default: {
        src: [
            '<%= root %>/*.html', 
            '<%= root %>/html/*.html'
        ]
    }
}