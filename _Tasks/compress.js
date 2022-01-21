module.exports = grunt => {
    grunt.registerMultiTask('compress', function() {
        if(!this.files.length){
            grunt.log.warn(`No files found`);
            return;
        }

        const execSync = require('child_process').execSync;
        const fs = require('fs-extra');
        const path = require('path');
        const symlinks = require('./helpers/symlinks.js');

        let opts = this.options();

        let dest = '.tmp/zip';

        fs.removeSync(dest);
        fs.mkdirSync(dest, {recursive: true});

        let count = {
            files: 0,
            directories: 0,
            symlinks: 0,
            resolved: 0
        };

        this.files.forEach(d => {
            let src = d.src[0];

            let stats = fs.lstatSync(src);

            if(stats.isSymbolicLink()) count.symlinks++;
            if(stats.isDirectory()) count.directories++;
            else count.files++;

            if(!stats.isDirectory()){
                fs.copySync(src, path.join(dest, d.dest)); count.paths++;
            }
        });

        count.resolved = symlinks.resolve(this.data.cwd, dest, opts.symlinks);

        fs.mkdirpSync(`_Zips`);

        execSync(`(cd .tmp/zip/ && zip -y -q -r - .) > ${opts.archive}`, {encoding: 'utf8', stdio: 'inherit'});

        fs.removeSync(`.tmp/zip`);
        
        grunt.log.ok(`${count.files} files, ${count.directories} directories, ${count.symlinks} symlinks compressed. ${count.resolved} symlinks resolved`);
    });
};