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
	
	// Only run purge on branches with deploy targets or on production builds, too slow for feature/dev branches on watch
	// If deployEnv has a location then consider a full deploy so run purgecss
	if(process.env.NODE_ENV === 'production' || deployEnv.location){
		arr.push(require('@fullhuman/postcss-purgecss')({
			content: [
				`${webRoot}/**/*.html`,
				`${webRoot}/**/*.twig`,
				`${config.src}/views/**/*.blade.php`,
				`${config.src}/vue/**/*.vue`
			],
			safelist: {
				greedy: [
					/active/i,
					/deactive/i,
					/disabled/i,
					/capture/i,
					/labD3/i
				]
			},
			defaultExtractor: (content) => {
				let modernizr = [];

				if(!contentJson.attributes.modernizr || contentJson.attributes.modernizr.length){
					modernizr.push('modern');
				} else {
					modernizr.push('no-js', 'js', 'loading', 'development');
	
					for(var key in contentJson.attributes.targets){
						if(contentJson.attributes.targets.hasOwnProperty(key)){
							modernizr.push(key);
						}
					}
	
					contentJson.attributes.modernizr.forEach(function(d){
						modernizr.push('no-' + d, d);
					});
				}

				// Capture as liberally as possible, including things like `h-(screen-1.5)`
				const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
				const broadMatchesWithoutTrailingSlash = broadMatches.map((match) => _.trimEnd(match, '\\'))

				// Capture classes within other delimiters like .block(class="w-1/2") in Pug
				const innerMatches = content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || []

				return modernizr.concat(broadMatches).concat(broadMatchesWithoutTrailingSlash).concat(innerMatches);
			}
		}));
	}
	
	if(process.env.NODE_ENV === "production"){
		arr.push(require('cssnano')({
			preset: [
				"default",
				{"discardComments": {"removeAll": true}}
			]
		}));
	}
	
	return arr;
};