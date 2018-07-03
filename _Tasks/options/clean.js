module.exports = {
	build: [".tmp"],
    dist: ["<%= root %>/**/*", "_Build/**/generated/**/*", "node_modules/.browserify-cache.json"],
    content: ["_Build/content/**/*"],
    zip: ['_Zips/**/*'],
    deploy: ["_Login"],
    pdf: ["_Pdfs"],
    app: ['_App/**/*'],
    electron: ['_Packages/Electron/**/*'],
    phonegap: ['_Packages/Phonegap/**/*']
}