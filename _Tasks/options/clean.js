const { packages, capitalize } = require("../helpers/misc.js");

const clean = {};

packages.forEach(({ name }) => {
    clean[name] = [`_Packages/${capitalize(name)}/**/*`];
});

module.exports = {
    ...clean,
	cache: ["_Output/css/*.cache.*.css", "_Output/js/*.cache.*.js", '.cache'],
	build: [".tmp"],
    dist: ["<%= root %>", "<%= src %>/**/generated/**/*"],
    zip: ['_Zips'],
    pdf: ["_Pdfs"],
    app: ['_App/**/*'],
    deploy: ['_Packages/Deploy/**/*'],
    watertight: ['_Packages/Watertight/**/*'],
    watertightEmptyDirs: {
        src: ['_Packages/Watertight/**/*'],
        filter: (fp) => grunt.file.isDir(fp) && require('fs').readdirSync(fp).length === 0
    },
    content: ['<%= src %>/content'],
    coverage: ['coverage']
}