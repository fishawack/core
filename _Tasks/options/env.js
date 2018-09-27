module.exports = {
	options: {
		add : contentJson.attributes.env
	},
	dev : {
		NODE_ENV : 'development',
		NODE_IP : '<%= getIP() %>'
    },
    stage : {
		NODE_ENV : 'staging',
		concat : contentJson.attributes.staging && contentJson.attributes.staging.env || {}
    },
    dist : {
		NODE_ENV : 'production',
		concat : contentJson.attributes.production && contentJson.attributes.production.env || {}
    }
}