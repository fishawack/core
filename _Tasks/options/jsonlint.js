module.exports = {
	default: {
        src: [
            '_Build/**/*.json',
            '!_Build/content/**/*',
            '!_Build/**/generated/**/*',
            '!_Build/schemas/**/*'
        ]
    }
}