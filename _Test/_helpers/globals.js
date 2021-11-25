module.exports = {
    opts: {encoding: 'utf8', stdio: process.argv.includes('--publish') ? 'pipe' : 'inherit'}
};