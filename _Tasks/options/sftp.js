module.exports = {
	options: {
		path: '<%= deployLocation %>',
		host: '<%= deployCred.host %>',
		username: '<%= deployCred.username %>',
		password: '<%= deployCred.password %>',
		privateKey: '<%= targets.key %>',
		passphrase: '<%= deployCred.passphrase %>',
		showProgress: true,
		srcBasePath: "_Zips/",
		createDirectories: true
	},
	deploy: {
		files: {
			"./": "_Zips/Deploy.zip"
		}
	}
}