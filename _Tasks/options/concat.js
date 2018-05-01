module.exports = {
    options: {
        separator: ';',
    },
    dev: {
        files: [
        {
            '<%= root %>/js/crucial.js': ['_Build/js/**/__*.js']
        }]
    },
    dist: {
        files: [
        {
            '.tmp/js/crucial.js': ['_Build/js/**/__*.js']
        }]
    }
}