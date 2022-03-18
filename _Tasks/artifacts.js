module.exports = function(grunt) {
    grunt.registerTask('artifacts', () => {
        const fs = require('fs');
        const lftp = require('./helpers/lftp.js');
        const host = "ftp-fishawack.egnyte.com";
        const creds = config.targets.ftp[host];
        const name = config.pkg.name;

        ['_Zips/', '_Pdfs/'].forEach(d => {
            if(fs.existsSync(d)){
                lftp.push(
                    d,
                    `Shared/FW/Knutsford/Digital/Auto-Package/${name}`,
                    creds.username,
                    creds.password,
                    host
                );
            } else {
                grunt.log.warn(`No artifacts found in ${d}`);
            }
        });
    });
};