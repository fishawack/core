module.exports = {
	options: {
		add : Object.assign(
			{ NODE_TARGET : deployBranch },
			contentJson.attributes.env,
			contentJson.attributes.deploy && contentJson.attributes.deploy[deployBranch] && contentJson.attributes.deploy[deployBranch].env || {}
		)
	},
	dev : {
		NODE_ENV : 'development'
    },
    dist : {
		NODE_ENV : 'production'
    }
}