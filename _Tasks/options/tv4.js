module.exports = {
	options: {
        root: function(){
        	var grunt = require('grunt');

        	if(fileExists('content.json', '_Schema', grunt)){
        		return grunt.file.readJSON('node_modules/config-grunt/_Schema/schema-custom.json');
        	} else {
        		return grunt.file.readJSON('node_modules/config-grunt/_Schema/schema.json');
        	}
        },
        banUnknownProperties: true
    },
    all: {
    	"src": ["<%= this.contentPath %>"]
    }
}