module.exports = grunt => {
    grunt.registerMultiTask('compress', function() {
        const execSync = require('child_process').execSync;
        const fs = require('fs-extra');
        const path = require('path');

        let opts = this.options();

        fs.mkdirpSync(`.tmp/zip`);

        this.files.forEach(d => {
            let src = d.src[0];
            let dest = path.join('.tmp/zip', d.dest);
            
            if(fs.existsSync(src)){
                let stats = fs.lstatSync(src);

                if(stats.isDirectory()){
                    fs.mkdirpSync(dest)
                } else if(opts.symlinks && stats.isSymbolicLink()){
                    fs.symlinkSync(fs.readlinkSync(src), dest);
                } else{
                    fs.copyFileSync(src, dest)
                }
            }
        });

        fs.mkdirpSync(`_Zips`);

        execSync(`(cd .tmp/zip/ && zip -y -r - .) > ${opts.archive}`, {encoding: 'utf8', stdio: 'inherit'});

        fs.removeSync(`.tmp/zip`);
    });
};