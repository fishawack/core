const fs = require('fs');
const os = require('os');
const host = "ftp-fishawack.egnyte.com";
const creds = JSON.parse(fs.readFileSync(`${os.homedir()}/targets/.ftppass`))[host];

module.exports = {
    opts: {encoding: 'utf8', stdio: process.argv.includes('--publish') ? 'pipe' : 'inherit'},
    host,
    creds
};