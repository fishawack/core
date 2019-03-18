module.exports = {
    options: {
        name: '<%= contentJson.attributes.title %>',
        dir: '_Packages/Electron/App',
        out: '_Packages/Electron/'
    },
    macos: {
        options: {
            electronVersion: '4.1.0',
            platform: 'darwin',
            arch: 'x64'
        }
    },
    win32: {
        options: {
            electronVersion: '4.1.0',
            platform: 'win32',
            arch: 'x64'
        }
    }
}