module.exports = {
    options: {
        name: '<%= contentJson.attributes.title %>',
        dir: '_App',
        out: '_Electron'
    },
    macos: {
        options: {
            electronVersion: '1.7.9',
            platform: 'darwin',
            arch: 'x64'
        }
    },
    win32: {
        options: {
            electronVersion: '1.7.9',
            platform: 'win32',
            arch: 'x64'
        }
    }
}