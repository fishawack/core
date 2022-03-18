function command(command, username, password, host){
    const execSync = require('child_process').execSync;
    const opts = {encoding: 'utf8', stdio: 'inherit'};

    execSync(`lftp -e '${command}; exit;' -u '${username}','${password}' sftp://${host}`, opts);
};

module.exports = {
    pull(local, server, username, password, host){
        command(`set sftp:auto-confirm yes; mirror ${server} ${local} -p --parallel=10`, username, password, host);
    },
    push(local, server, username, password, host){
        command(`set sftp:auto-confirm yes; mirror -R ${local} ${server} -p --parallel=10`, username, password, host);
    },
    remove(server, username, password, host){
        command(`rm ${server}`, username, password, host);
    }
};