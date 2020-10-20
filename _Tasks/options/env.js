module.exports = {
	options: {
		add : Object.assign(
			{ NODE_TARGET : deployBranch },
			contentJson.attributes.env
		)
	},
	dev : {
		NODE_ENV : 'development'
    },
    dist : {
		NODE_ENV : 'production'
    }
}