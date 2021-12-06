module.exports = grunt => {
    grunt.registerMultiTask('compress', function() {
        if(!this.files.length){
            grunt.log.warn(`No files found`);
            return;
        }

        const execSync = require('child_process').execSync;
        const fs = require('fs-extra');
        const path = require('path');

        let opts = this.options();

        fs.mkdirpSync(`.tmp/zip`);

        let count = {
            files: 0,
            directories: 0,
            symlinks: 0
        };

        this.files.forEach(d => {
            let src = d.src[0];
            let dest = path.join('.tmp/zip', d.dest);
            
            if(fs.existsSync(src)){
                let stats = fs.lstatSync(src);

                if(stats.isDirectory()){
                    fs.mkdirpSync(dest); count.directories++;
                } else if(opts.symlinks && stats.isSymbolicLink()){
                    fs.symlinkSync(fs.readlinkSync(src), dest); count.symlinks++;
                } else{
                    fs.copyFileSync(src, dest); count.files++;
                }
            }
        });

        fs.mkdirpSync(`_Zips`);

        execSync(`(cd .tmp/zip/ && zip -y -q -r - .) > ${opts.archive}`, {encoding: 'utf8', stdio: 'inherit'});

        fs.removeSync(`.tmp/zip`);
        
        grunt.log.ok(`${count.files} files, ${count.directories} directories, ${count.symlinks} symlinks compressed`);
    });
};