module.exports = {
    options: {
        separator: ';',
    },
    dev: {
        files: [
        {
            '<%= root %>/js/crucial.js': ['<%= src %>/js/**/__*.js']
        }]
    },
    dist: {
        files: [
        {
            '.tmp/js/crucial.js': ['<%= src %>/js/**/__*.js']
        }]
    }
}