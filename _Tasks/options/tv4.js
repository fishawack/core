module.exports = {
	options: {
        root: function(){return require('grunt').file.readJSON('_Build/schemas/schema.json')},
        banUnknownProperties: true
    },
    all: {
    	"src": ["<%= this.contentPath %>"]
    }
}