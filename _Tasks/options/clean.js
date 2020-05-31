module.exports = {
	cache: ["_Output/css/*.cache.*.css", "_Output/js/*.cache.*.js"],
	build: [".tmp"],
    dist: ["<%= root %>/**/*", "_Build/**/generated/**/*"],
    zip: ['_Zips/**/*'],
    deploy: ["_Login"],
    pdf: ["_Pdfs"],
    app: ['_App/**/*'],
    electron: ['_Packages/Electron/**/*'],
    phonegap: ['_Packages/Phonegap/**/*'],
    veeva: ['_Packages/Veeva/**/*'],
    vablet: ['_Packages/Vablet/**/*'],
    cegedim: ['_Packages/Cegedim/**/*']
}