module.exports = (file, dir) => {
	let webRoot = dir.split('/css')[0];

	let arr = [
		require('autoprefixer')({browsers: 'last 6 versions'}),
		require('postcss-assets')({
			basePath: webRoot,
			relativeTo: 'css/',
			loadPaths: ['**/*']
		})
	];
	
	// Only run postcss uncss on branches with deploy targets or on production builds, too slow for feature/dev branches on watch
	// Checking keys length as if no deployEnv === {} which would still pass
	if(process.env.NODE_ENV === 'production' || Object.keys(deployEnv).length){
		arr.push(require('uncss').postcssPlugin({
			html: [
				`${webRoot}/**/*.html`,
				".cache/vue/**/*.vue"
			],
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
	
	if(process.env.NODE_ENV === "production"){
		arr.push(require('cssnano')({
			preset: 'default',
		}));
	}
	
	return arr;
};