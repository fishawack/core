function command(command, username, password, host){
    const execSync = require('child_process').execSync;
    const opts = {encoding: 'utf8', stdio: 'inherit'};

    execSync(`lftp -e '${command}; exit;' -u '${username}','${password}' sftp://${host}`, opts);
};

const mirror = command => `set sftp:auto-confirm yes; mirror ${command} --exclude-glob *.DS_Store -p --parallel=10`

module.exports = {
    pull(local, server, username, password, host){
        command(mirror(`"${server}" "${local}"`), username, password, host);
    },
    push(local, server, username, password, host){
        command(mirror(`-R "${local}" "${server}"`), username, password, host);
    },
    remove(server, username, password, host){
        command(`rm "${server}"`, username, password, host);
    }
};