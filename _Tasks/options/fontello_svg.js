module.exports = {
	default: {
        options: {
            css: false,
            skip: false,
            fileFormat: '{1}.svg'
        },
        config: '<%= src %>/icons/config.json',
        dest: '<%= src %>/icons/generated/'
    }
}