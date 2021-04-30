module.exports = (grunt) => {
    const postcss = require('postcss');
    const { readFileSync } = require('fs');
    const { outputFileSync } = require('fs-extra');
    const spawn = require('child_process').spawn;
    const path = require('path');

    grunt.registerMultiTask('sass', function() {
        var options = this.options();
        var done = this.async();
        var processing = 0;
        var sassFinished = false;

        var targets = this.files.filter(d => grunt.file.exists(d.src[0]))
            .map(d => `${d.src[0]}:.cache/css/${d.dest}`);

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
            ls.stdout.pipe(process.stdout);

            function readFileSyncSafe(path){
                try{
                    return readFileSync(path);
                } catch (e) {
                    return '';
                }
            }

            function checkFinished(){
                if(sassFinished && !processing){
                    done();
                }
            }

            function processPostcss(file, dir){
                let src = '.cache/css';
                let dest = '.cache/postcss';

                processing += 1;

                postcss(options.postcss(file, dir))
                    .process(readFileSync(`${src}/${dir}/${file}.css`), {from: undefined})
                    .then(res => {
                        if(file === "vendor" || file === "general"){
                            outputFileSync(`${dest}/${dir}/${file}.css`, res.css);

                            var vendor = file === "vendor" ? res.css : readFileSyncSafe(`${dest}/${dir}/vendor.css`);
                            var general = file === "general" ? res.css : readFileSyncSafe(`${dest}/${dir}/general.css`);
                            outputFileSync(`${dir}/general.css`, `${vendor}\n${general}`);
                        } else {
                            outputFileSync(`${dir}/${file}.css`, res.css);
                        }
                    })
                    .catch(err => {
                        grunt.log.subhead(`Postcss: ${dir}/${file}.css`);
                        grunt.fail.warn(err.message);
                    })
                    .finally(() => {
                        processing -= 1;

                        checkFinished();
                    });
            }

            function rendered(data){
                const lines = data.toString().split(/\r?\n/);

                lines.forEach(line => {
                    if(line.includes("Deleted")){
                        return;
                    }
    
                    let split = line.split(`.cache/css/`)[1];
                    let raw = split && split.split('.css')[0];
    
                    if(raw){
                        processPostcss(path.basename(raw), path.dirname(raw));
                    }
                })
            }

            ls.stdout.on('data', rendered);

            if(watch){
                ls.stdout.on('data', isReady);

                function isReady(data){
                    if(data.toString().includes("Sass is watching for changes. Press Ctrl-C to stop.")){
                        ls.stdout.off('data', isReady);

                        sassFinished = true;

                        checkFinished();
                    }
                }
            } else {
                ls.on('exit', () => {
                    sassFinished = true;

                    if(sassFinished && !processing){
                        done();
                    }
                });
            }
        } else {
            grunt.log.warn('No sass files found');
            done();
        }
    });
};