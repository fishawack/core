function processors(){
	var arr = [
		require('autoprefixer')({browsers: 'last 6 versions'}),
		require('postcss-assets')({
			basePath: config.root,
			relativeTo: 'css/',
			loadPaths: ['media/**/']
		})
	];

	// Only run postcss uncss on branches with deploy targets or on production builds, too slow for feature/dev branches on watch
	// Checking keys length as if no deployEnv === {} which would still pass
	if(process.env.NODE_ENV === 'production' || Object.keys(deployEnv).length){
		arr.push(require('uncss').postcssPlugin({
			html: contentJson.attributes.uncss || [],
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
					window.document.documentElement.classList.add('no-js', 'js', 'loading', 'development');

					for(var key in contentJson.attributes.targets){
						if(contentJson.attributes.targets.hasOwnProperty(key)){
							window.document.documentElement.classList.add(key);
						}
					}

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