module.exports = {
	options: {
		transform: (contentJson.attributes.browserify || []).concat([
				['envify', {global: true}],
				['babelify', {
					global: true,
					presets: ["env"],
					plugins: ["transform-object-assign"]
				}]
			]),
		alias: {
		},
		browserifyOptions: {
			paths: [
				'./_Build/js/',
				'./_Build/js/libs/',
				'./_Build/js/charts/',
				'./_Build/js/data/',
				'./node_modules/lab-d3/_Build/js/',
				'./node_modules/lab-d3/_Build/js/libs',
				'./node_modules/lab-d3/_Build/js/charts/',
				'./node_modules/lab-d3/_Build/js/data/'
			]
		}
	},
	dev: {
		files: [
			{
				'<%= root %>/js/script.js': ['_Build/js/script.js']
			},
			{
	            expand: true,
	            cwd: '_Build/js/',
	            src: ['**/--*.js'],
	            dest: '<%= root %>/js/',
	            flatten: true,
	            rename: function(path, file){
	            	return path + file.replace('--', '');
	            }
	        }
		]
	},
	dist: {
		options: {
			exclude: ['dev']
		},
		files: [
			{
				'.tmp/js/script.js': ['_Build/js/script.js']
			},
			{
	            expand: true,
	            cwd: '_Build/js/',
	            src: ['**/--*.js'],
	            dest: '.tmp/js/',
	            flatten: true,
	            rename: function(path, file){
	            	return path + file.replace('--', '');
	            }
	        }
		]
	}
}