module.exports = {
    options: {
        assets: [
            '**/css/**/*.css', 
            '**/js/**/*.js'
        ],
        baseDir: '<%= webRoot %>',
        deleteOriginals: true,
        separator: '.cache.'
    },
    default: {
        src: [
            '<%= root %>/**/*.html'
        ]
    }
}