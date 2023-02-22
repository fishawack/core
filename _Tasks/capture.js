module.exports = grunt => {
    grunt.registerTask('capture', ['clean:build', 'capture:screenshots']);

    grunt.registerTask('capture:screenshots', async function(){
        const done = this.async();
        await require('./helpers/webdriverio.js').run({ 
            spec: [require.resolve('../_Node/capture.js')]
        });
        done();
    });

    
};