module.exports = {
    options: {
        name: '<%= repo.name %>',
        dir: '_Packages/Electron/App',
        out: '_Packages/Electron/'
    },
    macos: {
        options: {
            electronVersion: '23.1.0',
            platform: 'darwin',
            arch: 'x64'
        }
    },
    win32: {
        options: {
            electronVersion: '23.1.0',
            platform: 'win32',
            arch: 'x64'
        }
    }
}