module.exports = (grunt) => {
    var spawn = require('child_process').spawn;
    var path = require('path');

    grunt.registerMultiTask('sass', function() {
        var options = this.options();
        var done = this.async();

        var targets = this.files.filter(d => grunt.file.exists(d.src[0]))
            .map(d => `${d.src[0]}:${d.dest}`);

        let watch = grunt.task._queue.findIndex(d => d.task && d.task.name === "watch") > -1;
        let flags = [];

        if(watch){
            flags.push(`--watch`);
        }

        if(targets.length){
            flags.push(
                `--update`,
                `--color`,
                `--${options.sourceMap === false ? 'no-' : ''}source-map`,
                `--style=${options.outputStyle}`,
                ...options.includePaths.map(d => `--load-path=${d}`),
                ...targets
            );

            let ls = spawn(`sass`, flags, {stdio: 'pipe'});

            ls.stderr.pipe(process.stderr);

            if(watch){
                ls.stdout.on('data', isReady);

                function isReady(data){
                    if(data.toString().includes("Sass is watching for changes. Press Ctrl-C to stop.")){
                        ls.stdout.off('data', isReady);
                        ls.stdout.pipe(process.stdout);
                        done();
                    }
                }
            } else {
                ls.stdout.pipe(process.stdout);
                ls.on('exit', () => done());
            }
        } else {
            grunt.log.warn('No sass files found');
        }
    });
};