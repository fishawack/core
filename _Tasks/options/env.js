module.exports = {
	options: {
		add : Object.assign(
			{ NODE_TARGET : deployTarget },
			contentJson.attributes.env,
			contentJson.attributes[deployTarget] && contentJson.attributes[deployTarget].env || {}
		)
	},
	dev : {
		NODE_ENV : 'development'
    },
    dist : {
		NODE_ENV : 'production'
    }
}