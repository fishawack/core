const fs = require('fs');
const os = require('os');
const creds = JSON.parse(fs.readFileSync(`${os.homedir()}/targets/ftp-fishawack.egnyte.com.json`));

module.exports = {
    opts: {encoding: 'utf8', stdio: process.argv.includes('--publish') ? 'pipe' : 'inherit'},
    creds
};