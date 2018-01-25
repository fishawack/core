module.exports = {
    deploy: {
        options: {
            casperjsOptions: [
                '--url=' + '<%= deployUrl %>'
            ]
        },
        src: ['_Test/casperjs/*.js']
    },
    local: {
        options: {
            casperjsOptions: [
                '--url=http://localhost:9001/'
            ]
        },
        src: ['_Test/casperjs/*.js']
    }
}