module.exports = grunt => {
    grunt.registerTask('integration', async function(){
        const done = this.async();
        await require('./helpers/webdriverio.js').run({ 
            baseUrl: captureEnv().url 
        });
        done();
    });
};