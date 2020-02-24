function processors(){
	var arr = [
		require('autoprefixer')({browsers: 'last 6 versions'}),
		require('postcss-assets')({
			basePath: config.root,
			relativeTo: 'css/',
			loadPaths: ['media/**/']
		})
	];

	// Only run postcss uncss on qc/master branch, too slow for feature/dev branches
	if(
		this.deployBranch === "qc" ||
		this.deployBranch === "master"
	){
		arr.push(require('postcss-uncss')({
			html: contentJson.attributes.uncss.map(function(d, i){
				return grunt.template.process(d, grunt.config.get());
			}),
			userAgent: 'jsdom',
			ignore: [
				/.active/i,
				/.deactive/i,
				/.disabled/i,
				/.capture/i,
				/.icon/i,
				/.labD3/i,
				/\bspan\b/i,
				/\bsup\b/i,
				/\bsub\b/i,
				/\bsmall\b/i,
				/\bstrong\b/i,
				/\bb\b/i,
				/\bem\b/i,
				/\bi\b/i,
				/\ba\b/i
			],
			inject: function(window){
				if(!contentJson.attributes.modernizr.length){
					window.document.documentElement.classList.add('modern');
				} else {
					window.document.documentElement.classList.add('no-js', 'js', 'loading', 'staging', 'production', 'qc');

					contentJson.attributes.modernizr.forEach(function(d){
						window.document.documentElement.classList.add('no-' + d, d);
					});
				}
			}
		}));
	}

	return arr;
}

module.exports = {
	options: {
		map: false,
		processors: () => {
			return processors();
		}
	},
	dev: {
		files: [{
			expand: true,
			cwd: '.tmp/css/',
			src: ['*.css'],
			dest: '<%= root %>/css/'
		}]
	},
	dist: {
		options: {
			map: false,
			processors: () => {
				return processors().concat([
					require('cssnano')({
						preset: 'default',
					})
				]);
			}
		},
		files: [{
			expand: true,
			cwd: '.tmp/css/',
			src: ['*.css'],
			dest: '<%= root %>/css/'
		}]
	}

};