module.exports = function(grunt) {
    grunt.registerTask('artifacts', () => {
        if(!config.targets.egnyte){
            grunt.log.warn('No egnyte credentials found');
            return;
        }

        const { host, username, password } = config.targets.egnyte;
        const fs = require('fs');
        const lftp = require('./helpers/lftp.js');
        const name = config.pkg.name;

        ['_Zips/', '_Pdfs/'].forEach(d => {
            if(fs.existsSync(d)){
                lftp.push(
                    d,
                    `Shared/FW/Knutsford/Digital/Auto-Package/${name}`,
                    username,
                    password,
                    host
                );
            } else {
                grunt.log.warn(`No artifacts found in ${d}`);
            }
        });
    });
};