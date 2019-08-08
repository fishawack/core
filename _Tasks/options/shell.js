var token = '';

if(config.targets.misc && config.targets.misc.phonegap){
    token = config.targets.misc.phonegap.token;
}

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
        command: "curl -X PUT -F file=@_Zips/Deploy.zip -F 'data={\"keys\":{\"ios\":{\"id\":<%= (contentJson.attributes.phonegap && contentJson.attributes.phonegap.signingKey || '') %>,\"password\": \"<%= contentJson.attributes.phonegap && contentJson.attributes.phonegap.signingPassword || '13Orange02' %>\"}}}' https://build.phonegap.com/api/v1/apps/<%= (contentJson.attributes.phonegap && contentJson.attributes.phonegap.appID || '') %>?auth_token=" + token
    },
    pullApp: {
        command: "curl --create-dirs -o _Packages/iOS/app.ipa "
    },
    pdf: {
        command: function(){
            var sizes = [[1080, 608]];
            if(deployEnv.pdf && deployEnv.pdf.sizes){
                sizes = deployEnv.pdf.sizes;
            }

            return sizes.map((d, i) => {
                var width = sizes[i][0];
                var height = sizes[i][1];

                return `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/${contentJson.attributes.title}_${width}x${height}_${grunt.template.today('yyyy-mm-dd')}.pdf' '.tmp/pdfs/${i}.pdf'`;
            }).join(' && ');
        }
    }
}