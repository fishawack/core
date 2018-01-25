module.exports = {
	build: [".tmp"],
    dist: ["<%= root %>/**/*", "_Build/**/generated/**/*"],
    content: ["_Build/content/**/*"],
    deploy: ["_Zips", "_Login"],
    pdfs: ["_Pdfs"],
    app: ['_App/**/*'],
    electron: ['_Electron/**/*']
}