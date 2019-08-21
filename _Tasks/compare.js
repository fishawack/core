module.exports = function(grunt) {
    grunt.registerTask('compare', function(){
        var done = this.async();

        var resemble = require('resemblejs');
        var fs = require('fs-extra');

        var sizes = deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]];
        var browsers = deployEnv.pdf && deployEnv.pdf.browsers || ['chrome'];

        var write = true;

        var compare = {
            size(size){
                return new Promise((resolve, reject) => {
                    grunt.log.ok(size);

                    var arr = browsers.map((d) => {
                            return compare.browser(d, size);
                        });

                    Promise.all(arr)
                        .then((values) => {
                            resolve(values);
                        });
                });
            },
            browser(browser, size){
                return new Promise((resolve, reject) => {
                    grunt.log.ok(browser);

                    if(write){
                        fs.mkdirpSync(`.tmp/difference/`);
                        fs.mkdirpSync(`.tmp/difference/${browser}/${size}/`);
                    }

                    var arr = [];

                    grunt.file.expand({cwd: `.tmp/screenshots/${browser}/${size}/`}, '*').forEach((element, index) => {
                            arr.push(compare.images(browser, size, index));
                        });

                    Promise.all(arr)
                        .then((values) => {
                            resolve(values.reduce((a, b) => {
                                    return (a > b.rawMisMatchPercentage) ? a : b.rawMisMatchPercentage;
                                }, 0));
                        });
                });
            },
            images(browser, size, index){
                return new Promise((resolve, reject) => {
                    grunt.log.ok(index);

                    var image1 = fs.readFileSync(`.tmp/screenshots/${browsers[0]}/${size}/${index}.png`);
                    var image2 = fs.readFileSync(`.tmp/screenshots/${browser}/${size}/${index}.png`);

                    var options = {
                        output: {
                            largeImageThreshold: 0,
                            errorType: "movement"
                        },
                        ignore: "antialiasing"
                    };

                    if(!write){
                        options.returnEarlyThreshold = 100; // Disables writing images
                    }

                    resemble.compare(image1, image2, options, (err, data) => {
                            if(write){
                                fs.writeFileSync(`.tmp/difference/${browser}/${size}/${index}.png`, data.getBuffer());
                            }

                            resolve(data);
                        });
                });
            }
        }

        var arr = sizes.map((d) => {
                return compare.size(`${d[0]}x${d[1]}`);
            });

        Promise.all(arr)
            .then((values) => {
                console.log(values);

                done();
            });
    });
};