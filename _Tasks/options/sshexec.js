module.exports = {
	options: {
		host: '<%= deployCred.host %>',
		username: '<%= deployCred.username %>',
		password: '<%= deployCred.password %>',
		privateKey: '<%= targets.key %>',
		passphrase: '<%= deployCred.passphrase %>'
	},
	remove: {
		command: [
			'rm <%= deployLocation %> -rf'
		]
	},
	unpack: {
		command: [
			'cd <%= deployLocation %>',
			'unzip -o Deploy.zip',
			'rm Deploy.zip'
		].join(' && ')
	},
	required: {
		command: [
			'cd <%= deployLocation %>',
			'mkdir -p logs'
		].join(' && ')
	},
	root: {
		command: [
			'rm <%= deployLocation %>/app -rf',
			'rm <%= deployLocation %>/vendor -rf',
			'rm <%= deployLocation %>/public_html/bootstrap -rf',
			'rm <%= deployLocation %>/public_html/build -rf',
			'rm <%= deployLocation %>/public_html/css -rf',
			'rm <%= deployLocation %>/public_html/js -rf',
			'rm <%= deployLocation %>/public_html/svg -rf',
			'rm <%= deployLocation %>/public_html/media -rf',
			'rm <%= deployLocation %>/public_html/.htaccess -rf',
			'rm <%= deployLocation %>/public_html/favicon.ico -rf',
			'rm <%= deployLocation %>/public_html/index.php -rf'
		]
	},
	subDir: {
		command: [
			'rm <%= deployLocation %>/app -rf',
			'rm <%= deployLocation %>/vendor -rf',
			'rm <%= deployLocation %>/bootstrap -rf',
			'rm <%= deployLocation %>/build -rf',
			'rm <%= deployLocation %>/css -rf',
			'rm <%= deployLocation %>/js -rf',
			'rm <%= deployLocation %>/svg -rf',
			'rm <%= deployLocation %>/media -rf',
			'rm <%= deployLocation %>/.htaccess -rf',
			'rm <%= deployLocation %>/favicon.ico -rf',
			'rm <%= deployLocation %>/index.php -rf'
		]
	}
}