var config;
var path;

function setup(){
	const webpack = require('webpack');
	const VueLoaderPlugin = require('vue-loader/lib/plugin');
	path = require('path');

	const grunt = require('grunt');

	// Javascript files in _Build/js that start with '--' will be treated as entry points and an output file will be generated with the same name minus the '--' prefix i.e _Build/js/libs/--test.js -> _Output/js/test.js
	var entryPoints = {};
	grunt.file.expand({
		expand: true,
		cwd: './_Build/js/'
	}, '**/--*.js').forEach(function(element, index){
		entryPoints[element.split('--')[1].split('.js')[0]] = './_Build/js/' + element;
	});

	config = {
		watch: false,
		cache: true,
		entry: Object.assign(
			{ script: './_Build/js/script.js' },
			entryPoints
		),
		output: {
			filename: '[name].js',
			chunkFilename: '[name].dynamic.js',
			publicPath: 'js/'
		},
		resolve: {
			modules: [
				'node_modules',
				path.resolve(__dirname, "../../node_modules") // Used for core dev
			]
		},
		resolveLoader: {
			modules: [
				"node_modules",
				path.resolve(__dirname, "../../node_modules") // Used for core dev
			]
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: [
						{
							loader: 'vue-loader',
							options: {
								compilerOptions: {
									preserveWhitespace: false
								}
							}
						}
					]
				},
				{
					parser: { amd: false }
				},
				{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[require.resolve('@babel/preset-env'), {
										"useBuiltIns": "usage"
									}]
								],
								sourceType: "unambiguous",
								plugins: [
									require.resolve('@babel/plugin-transform-object-assign'),
									require.resolve('@babel/plugin-syntax-dynamic-import')
								]
							}
						}
					]
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				}
			]
		},
		plugins: [
	    	new VueLoaderPlugin(),
	    	new webpack.EnvironmentPlugin(Object.keys(process.env))
	    ],
	    optimization: {
			splitChunks: ((!contentJson.attributes.splitChunks) ? {} : {
				cacheGroups: {
					commons: {
						name: 'commons',
						chunks: 'initial',
						minChunks: 2
					}
				}
			})
		}
	};
}

module.exports = {
	dev: () => {
		if(!config){
			setup();
		}

		return Object.assign(config, {
			mode: "development",
			output: {
				path: path.resolve(process.cwd(),'<%= root %>/js/')
			}
		});
	},
	dist: () => {
		if(!config){
			setup();
		}

		return Object.assign(config, {
			mode: "production",
			output: {
				path: path.resolve(process.cwd(), '.tmp/js/')
			}
		});
	}
}