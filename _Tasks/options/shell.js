module.exports = {
	options: {
        execOptions: {
            maxBuffer: 20000 * 1024
        },
        stderr: true,
        stdout: true
    },
    pushApp: {
        options: {
            stdout: false
        },
        command: "curl -X PUT -F file=@_Zips/Deploy.zip -F 'data={\"keys\":{\"ios\":{\"id\":<%= (contentJson.attributes.phonegap && contentJson.attributes.phonegap.signingKey || '') %>,\"password\":\"13Orange02\"}}}' https://build.phonegap.com/api/v1/apps/<%= (contentJson.attributes.phonegap && contentJson.attributes.phonegap.appID || '') %>?auth_token=9tsERPEn2PamsbzFFjAB"
    },
    pullApp: {
        command: "curl --create-dirs -o _Packages/iOS/app.ipa <%= pullApp %>"
    },
    pdf: {
        command: "gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today('dd-mm-yy') %>.pdf' '_Pdfs/raw.pdf'"
    }
}