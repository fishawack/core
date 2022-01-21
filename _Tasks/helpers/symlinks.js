module.exports = {
    // Look through files/folders for any symlinks
    resolve(root, search, always = false, count = 0){
        const glob = require('glob');
        const fs = require('fs-extra');

        glob.sync(`${search}/**/*`, {dot:true}).forEach(src => {
            let stats = fs.lstatSync(src);

            // If a symlink is found that links to an external path to the current root files then we need to copy it into the bundle
            // If always is set to true then always resolve symlinks to actual files/folders they point to
            if(stats.isSymbolicLink() && (always || !fs.existsSync(src))){
                count = this.checkResolve(src, src, path.dirname(path.join(root, src.split(search)[1])), always, count);
            }
        });

        return count;
    },

    checkResolve(src, dest, cwd, always, count){
        const fs = require('fs-extra');
        const path = require('path');

        let symlink = fs.readlinkSync(src);
        let resolve = path.resolve(cwd, symlink);
        let stats = fs.lstatSync(resolve);

        // If the found location is itself another symlink then need to recurse
        if(stats.isSymbolicLink()){
            count = this.checkResolve(resolve, dest, path.dirname(resolve), always, count);
        } else {
            fs.removeSync(dest);
            fs.copySync(resolve, dest); count++;

            // If the copied in path was a directory then need to recurse and check the files in that for even more possible external symlinks
            if(stats.isDirectory()){
                count = this.resolve(resolve, dest, always, count);
            }
        }

        return count;
    }
}