module.exports = {
	options: {
		add : contentJson.attributes.env
	},
	dev : {
		NODE_ENV : 'development',
		NODE_IP : '<%= getIP() %>'
    },
    dist : {
		NODE_ENV : 'production',
		NODE_TARGET : deployTarget,
		concat : contentJson.attributes[deployTarget] && contentJson.attributes[deployTarget].env || {}
    }
}