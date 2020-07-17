module.exports = {
	options: {
        root: () => {
			var fs = require('fs-extra');

			try{
				fs.copySync(`${configPath}_Schema/`, `node_modules/.schema/`);
				fs.copySync(`_Schema/`, `node_modules/.schema/`);
			} catch(e){}
			
			return grunt.file.readJSON('node_modules/.schema/schema.json');
		},
		schemas: () => {
			var obj = {};
			grunt.file.expand({cwd: `node_modules/.schema/`}, '**/*.json').forEach(d => {
				obj[d] = grunt.file.readJSON(`node_modules/.schema/${d}`);
			});
			return obj;
		},
		banUnknownProperties: true
    },
    all: {
    	"src": ["<%= this.contentPath %>"]
    }
}