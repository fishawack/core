const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

const grunt = require('grunt');

// Javascript files in _Build/js that start with '--' will be treated as entry points and an output file will be generated with the same name minus the '--' prefix i.e _Build/js/libs/--test.js -> _Output/js/test.js
var entryPoints = {};
grunt.file.expand({
	expand: true,
	cwd: './_Build/js/'
}, '**/--*.js').forEach(function(element, index){
	entryPoints[element.split('--')[1].split('.js')[0]] = './_Build/js/' + element;
});

module.exports = {
	options: {
		watch: false,
		cache: true,
		entry: Object.assign(
			{ script: './_Build/js/script.js' },
			entryPoints
		),
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.runtime.common.js',
				'vue-router$': 'vue-router/dist/vue-router.common.js',
				'vuex$': 'vuex/dist/vuex.common.js'
			},
			modules: [
				'./_Build/js/',
				'./_Build/js/libs/',
				'./_Build/js/charts/',
				'./_Build/js/data/',
				'./node_modules/@fishawack/lab-d3/_Build/js/',
				'./node_modules/@fishawack/lab-d3/_Build/js/libs',
				'./node_modules/@fishawack/lab-d3/_Build/js/charts/',
				'./node_modules/@fishawack/lab-d3/_Build/js/data/',
				'node_modules',
				path.resolve(__dirname, "../../node_modules") // Used for config-grunt dev
			]
		},
		resolveLoader: {
			modules: [
				"node_modules",
				path.resolve(__dirname, "../../node_modules") // Used for config-grunt dev
			]
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: [
						'vue-loader'
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
									require.resolve('babel-preset-env')
								],
								plugins: [
									require.resolve('babel-plugin-transform-object-assign')
								]
							}
						}
					]
				}
			]
		},
		plugins: [
	    	// make sure to include the plugin!
	    	new VueLoaderPlugin(),
	    	new webpack.EnvironmentPlugin(
	    		Object.assign(
	    			{ NODE_TARGET : deployTarget },
	    			contentJson.attributes.env,
	    			contentJson.attributes[deployTarget] && contentJson.attributes[deployTarget].env || {}
    			)
    		)
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
			filename: '[name].js',
			path: path.resolve(process.cwd(),'<%= root %>/js/')
		}
	},
	dist:{
		mode: "production",
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd(), '.tmp/js/')
		}
	}
}