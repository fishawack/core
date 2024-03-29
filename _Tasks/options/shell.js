module.exports = {
    options: {
        execOptions: {
            maxBuffer: 20000 * 1024
        },
        stderr: true,
        stdout: true
    },
    pushPrevious: {
        command: `lftp -e 'set sftp:auto-confirm yes; mirror -R .tmp/screenshots/ Shared/FW/Knutsford/Digital/Auto-Regression/<%= pkg.name %>/<%= repo.name %> -p -e --parallel=10; exit;' -u '<%= targets.egnyte.username %>',<%= targets.egnyte.password %> sftp://<%= targets.egnyte.host %>`
    },
    pullPrevious: {
        command: `lftp -e 'set sftp:auto-confirm yes; mirror Shared/FW/Knutsford/Digital/Auto-Regression/<%= pkg.name %>/<%= repo.name %> .tmp/previous -p -e --parallel=10 -c; exit;' -u '<%= targets.egnyte.username %>',<%= targets.egnyte.password %> sftp://<%= targets.egnyte.host %>`,
        options: {
            failOnError: false
        }
    },
    test: {
        command: "echo hello"
    }
}