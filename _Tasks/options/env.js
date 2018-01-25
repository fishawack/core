module.exports = {
	dev : {
		NODE_ENV : 'development',
		NODE_IP : '<%= getIP() %>'
    },
    dist : {
		NODE_ENV : 'production'
    },
    stage : {
		NODE_ENV : 'staging'
    }
}