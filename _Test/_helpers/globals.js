module.exports = {
    opts: {encoding: 'utf8', stdio: process.argv[process.argv.length - 1] === '--publish' ? 'pipe' : 'inherit'}
};