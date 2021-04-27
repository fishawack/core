module.exports = {
	default: {
        src: [
            '<%= src %>/**/*.json',
            '!<%= src %>/content/**/*',
            '!<%= src %>/**/generated/**/*',
            '!<%= src %>/schemas/**/*'
        ]
    }
}