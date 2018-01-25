module.exports = {
	options: {
        execOptions: {
            maxBuffer: 20000 * 1024
        },
        stderr: true,
        stdout: true
    },
    pushApp: {
    	command: "curl -X PUT -F file=@_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today(\"dd-mm-yy\") %>.zip -F 'data={\"keys\":{\"ios\":{\"id\":592790,\"password\":\"13Orange02\"}}}' https://build.phonegap.com/api/v1/apps/2335152?auth_token=9tsERPEn2PamsbzFFjAB"
    },
    pdf: {
        command: "gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today('dd-mm-yy') %>.pdf' '_Pdfs/raw.pdf'"
    }
}