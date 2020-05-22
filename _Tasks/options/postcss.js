function processors(){
	var arr = [
		require('autoprefixer')({browsers: 'last 6 versions'}),
		require('postcss-assets')({
			basePath: config.root,
			relativeTo: 'css/',
			loadPaths: ['media/**/']
		})
	];

	// Only run postcss uncss if not on development branch, too slow for feature/dev branches
	if(this.deployTarget !== "development"){
		arr.push(require('uncss').postcssPlugin({
			html: contentJson.attributes.uncss,
			userAgent: 'jsdom',
			timeout: 100,
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
					window.document.documentElement.classList.add('no-js', 'js', 'loading', 'staging', 'production', 'qc', 'development');

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