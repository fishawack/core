module.exports = function(grunt) {
    grunt.registerTask('compare', function(){
        var done = this.async();

        var resemble = require('resemblejs');
        var fs = require('fs-extra');

        var sizes = deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]];
        var browsers = deployEnv.pdf && deployEnv.pdf.browsers || ['chrome'];

        var write = false;

        var compare = {
            browser(browser){
                return new Promise((resolve, reject) => {
                    grunt.log.ok(browser);

                    var arr = sizes.map((d) => {
                            return compare.size(browser, `${d[0]}x${d[1]}`);
                        });

                    Promise.all(arr)
                        .then((values) => {
                            resolve(values);
                        });
                });
            },
            size(browser, size){
                return new Promise((resolve, reject) => {
                    grunt.log.ok(size);

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

        var arr = browsers.map((d) => {
                return compare.browser(d);
            });

        Promise.all(arr)
            .then((values) => {
                var badge = require('gh-badges');
                var svg_to_png = require('svg-to-png');

                function buildBadge(text, value, file){
                    return new Promise((resolve, reject) => {
                        var color = 'green';

                        if(value > 30){
                            color = 'red';
                        } else if(value > 15){
                            color = 'yellow';
                        }

                        badge({ text: [text, value.toFixed(2) + '%'], colorscheme: color, template: "flat" }, function(svg, err) {
                            grunt.file.write('_Build/media/generated/__' + file + '.svg', svg);
                            resolve(process.cwd() + '/_Build/media/generated/__' + file + '.svg');
                        });
                    });
                }

                var arr = values.map((d, i) => {
                        var max = d.reduce((a, b) => (a > b) ? a : b);
                        var browser = browsers[i];

                        return buildBadge(` ${browser} `, max, browser);
                    });

                Promise.all(arr)
                    .then((values) => {
                        svg_to_png.convert(values, '_Build/media/generated/').then(function(){
                                done();
                            });
                    });
            });
    });
};