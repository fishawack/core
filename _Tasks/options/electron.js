module.exports = {
    options: {
        name: '<%= contentJson.attributes.title %>',
        dir: '_Packages/Electron/App',
        out: '_Packages/Electron/'
    },
    macos: {
        options: {
            electronVersion: '2.0.8',
            platform: 'darwin',
            arch: 'x64'
        }
    },
    win32: {
        options: {
            electronVersion: '2.0.8',
            platform: 'win32',
            arch: 'x64'
        }
    }
}