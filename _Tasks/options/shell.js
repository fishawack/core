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
    }
}