module.exports = {
	options: {
		curly: true,
		eqeqeq: true,
		forin: true,
		freeze: true,
		funcscope: true,
		undef: true,
		latedef: "nofunc",
		globalstrict: true,
		nonbsp: true,
		strict: true,
		eqnull: true,
		browser: true,
		globals: {
		    console: true,
		    alert: true,
		    require: true,
		    module: true,
		    process: true,
		    define: true,
			Modernizr: true,
			$: true
		},
		esversion: 10
	},
    files: [
    	'<%= src %>/js/**/*.js',
    	'<%= src %>/vue/**/*.js',
    	'!<%= src %>/js/**/generated/**/*.js',
    	'!<%= src %>/js/**/libs/**/*.js'
	]
}