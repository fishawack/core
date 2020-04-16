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
    pushPrevious: {
        command: `lftp -d -e 'set sftp:auto-confirm yes; mirror -R .tmp/screenshots/ Shared/FW/Knutsford/Digital/Auto-Regression/<%= pkg.name %>/<%= contentJson.attributes.title %> -p -e --parallel=10; exit;' -u '<%= targets.ftp["ftp-fishawack.egnyte.com"].username %>',<%= targets.ftp["ftp-fishawack.egnyte.com"].password %> sftp://ftp-fishawack.egnyte.com`
    },
    pullPrevious: {
        command: `lftp -d -e 'set sftp:auto-confirm yes; mirror Shared/FW/Knutsford/Digital/Auto-Regression/<%= pkg.name %>/<%= contentJson.attributes.title %> .tmp/previous -p -e --parallel=10 -c; exit;' -u '<%= targets.ftp["ftp-fishawack.egnyte.com"].username %>',<%= targets.ftp["ftp-fishawack.egnyte.com"].password %> sftp://ftp-fishawack.egnyte.com`,
        options: {
            failOnError: false
        }
    }
}