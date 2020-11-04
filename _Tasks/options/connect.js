module.exports = {
	default: {
        options: {
            port: 9001,
            base: '<%= root %>',
            useAvailablePort: true,
            middleware(connect, options, middlewares){
                middlewares.unshift(require('connect-history-api-fallback')());
                return middlewares;
            }
        }
    }
}