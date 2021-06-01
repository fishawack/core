module.exports = {
	cache: ["_Output/css/*.cache.*.css", "_Output/js/*.cache.*.js", '.cache'],
    cache_vue: ['.cache/vue'],
	build: [".tmp"],
    dist: ["<%= root %>", "<%= src %>/**/generated/**/*"],
    zip: ['_Zips/**/*'],
    pdf: ["_Pdfs"],
    app: ['_App/**/*'],
    electron: ['_Packages/Electron/**/*'],
    phonegap: ['_Packages/Phonegap/**/*'],
    veeva: ['_Packages/Veeva/**/*'],
    vablet: ['_Packages/Vablet/**/*'],
    cegedim: ['_Packages/Cegedim/**/*'],
    handover: ['_Packages/Handover/**/*'],
    watertight: ['__Packages/Watertight/**/*'],
    watertightEmptyDirs: {
        src: ['__Packages/Watertight/**/*'],
        filter: (fp) => grunt.file.isDir(fp) && require('fs').readdirSync(fp).length === 0
    }
}