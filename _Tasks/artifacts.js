module.exports = function(grunt) {
    grunt.registerTask('artifacts', () => {
        const lftp = require('./helpers/lftp.js');
        const host = "ftp-fishawack.egnyte.com";
        const creds = config.targets.ftp[host];
        const name = config.pkg.name;

        lftp.push(
            '_Zips/',
            `Shared/FW/Knutsford/Digital/Auto-Package/${name}`,
            creds.username,
            creds.password,
            host
        );

        lftp.push(
            '_Pdfs/',
            `Shared/FW/Knutsford/Digital/Auto-Package/${name}`,
            creds.username,
            creds.password,
            host
        );
    });
};