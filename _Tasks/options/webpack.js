const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const grunt = require('grunt');

// var config;
var path = require('path');

// Javascript files in _Build/js that start with '--' will be treated as entry points and an output file will be generated with the same name minus the '--' prefix i.e _Build/js/libs/--test.js -> _Output/js/test.js
var entry = {};
grunt.file.expand({
	expand: true,
	cwd: `./${config.src}/js/`
}, ['**/script.js', '**/--*.js']).forEach(function(element, index){
	entry[(element.split('--')[1] || element.split('/')[element.split('/').length - 1]).split('.js')[0]] = `./${config.src}/js/${element}`;
});

module.exports = {
	options: {
		watch: false,
		cache: true,
		entry,
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
					exclude: new RegExp(`/node_modules\/(?!(${(contentJson.attributes.transpile || []).join('|')})\/).*/`),
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[require.resolve('@babel/preset-env'), {
										"useBuiltIns": "usage",
										"corejs": { "version": 3, "proposals": true }
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
			new webpack.DefinePlugin(Object.keys(process.env).reduce((a, b) => {
				a[`process.env.${b}`] = webpack.DefinePlugin.runtimeValue(() => JSON.stringify(process.env[b]), [`./${config.src}/config/**/*.json`]);
				return a;
			}, {}))
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
	},
	dev: {
		mode: "development",
		output: {
			path: path.resolve(process.cwd(),'<%= root %>/js/')
		}
	},
	dist: {
		mode: "production",
		output: {
			path: path.resolve(process.cwd(), '.tmp/js/')
		}
	}
}