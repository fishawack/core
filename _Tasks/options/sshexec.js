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
			'rm -rf <%= deployLocation %>/'
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
	}
}