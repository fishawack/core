module.exports = grunt => {
    grunt.registerMultiTask('json-schema', function() {
        const Ajv = require("ajv");
        const fs = require('fs-extra');
        const { log } = require('../_Tasks/helpers/include.js');

        let options = this.options();

        const ajv = new Ajv({strict: false});

        try{
            fs.copySync(`${configPath}_Schema/`, `.cache/schema/`);
            fs.copySync(`_Schema/`, `.cache/schema/`);
        } catch(e){}

        const schema = grunt.file.readJSON('.cache/schema/schema.json');

        grunt.file.expand({cwd: `.cache/schema/`}, '**/*.json').forEach(d => {
            ajv.addSchema(grunt.file.readJSON(`.cache/schema/${d}`), d);
        });

        const validate = ajv.compile(schema);

        this.data.src.forEach(d => {
            const data = fs.readJSONSync(d);
            const valid = validate(data)
            
            if (!valid) {
                validate.errors.forEach(d => log.error(d));
                grunt.fatal(`JSON schema errors in: ${d}`);
            }
        })
    });
};