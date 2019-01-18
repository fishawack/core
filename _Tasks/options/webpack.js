const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path');

module.exports = {
	options: {
		watch: false,
		cache: true
	},
	default: {
		mode: process.env.NODE_ENV,
		entry: './_Build/js/script.js',
		output: {
			filename: 'script.js',
			path: path.resolve(process.cwd(), './_Output/js')
		},
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
				'node_modules'
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
						presets: ['babel-preset-env'],
						plugins: [
							'babel-plugin-transform-object-assign'
						]
					}
				}
				]
			}
			]
		},
		plugins: [
	    	// make sure to include the plugin!
	    	new VueLoaderPlugin()
	    ]
	}
}