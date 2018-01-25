module.exports = {
	options: {
		transform: [
			require('envify')
		],
		alias: {
		},
		browserifyOptions: {
			paths: [
				'./_Build/js/',
				'./_Build/js/libs/',
				'./node_modules/lab-d3/_Build/js/',
				'./node_modules/lab-d3/_Build/js/charts/',
				'./node_modules/lab-d3/_Build/js/data/'
			]
		}
	},
	dev: {
		files: {
			'<%= root %>/js/script.js': ['_Build/js/script.js']
		}
	},
	dist: {
		options: {
			exclude: ['dev']
		},
		files: {
			'.tmp/js/script.js': ['_Build/js/script.js']
		}
	}
}