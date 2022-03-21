module.exports = {
	cache: ["_Output/css/*.cache.*.css", "_Output/js/*.cache.*.js", '.cache'],
	build: [".tmp"],
    dist: ["<%= root %>", "<%= src %>/**/generated/**/*"],
    zip: ['_Zips'],
    pdf: ["_Pdfs"],
    app: ['_App/**/*'],
    electron: ['_Packages/Electron/**/*'],
    phonegap: ['_Packages/Phonegap/**/*'],
    veeva: ['_Packages/Veeva/**/*'],
    vablet: ['_Packages/Vablet/**/*'],
    cegedim: ['_Packages/Cegedim/**/*'],
    handover: ['_Packages/Handover/**/*'],
    deploy: ['_Packages/Deploy/**/*'],
    watertight: ['_Packages/Watertight/**/*'],
    watertightEmptyDirs: {
        src: ['_Packages/Watertight/**/*'],
        filter: (fp) => grunt.file.isDir(fp) && require('fs').readdirSync(fp).length === 0
    },
    content: ['<%= src %>/content']
}