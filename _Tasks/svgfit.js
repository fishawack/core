module.exports = grunt => {
    grunt.registerMultiTask('svgfit', async function() {
        const done = this.async();
        const svgfit = await import('svgfit');

        let options = this.options();

        await svgfit.fit(this.files.map(d => d.src[0]), this.files.map(d => d.dest));
        
        done();
    });
};