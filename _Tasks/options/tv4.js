module.exports = {
	options: {
        root: () => {
			var fs = require('fs-extra');

			try{
				fs.copySync(`${configPath}_Schema/`, `.cache/schema/`);
				fs.copySync(`_Schema/`, `.cache/schema/`);
			} catch(e){}
			
			return grunt.file.readJSON('.cache/schema/schema.json');
		},
		schemas: () => {
			var obj = {};
			grunt.file.expand({cwd: `.cache/schema/`}, '**/*.json').forEach(d => {
				obj[d] = grunt.file.readJSON(`.cache/schema/${d}`);
			});
			return obj;
		},
		banUnknownProperties: true
    },
    default: {
    	"src": ["<%= this.contentPath %>"]
    }
}