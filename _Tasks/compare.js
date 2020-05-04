module.exports = function(grunt) {
    grunt.registerTask('compare', ['compare:previous', 'compare:browsers']);

    grunt.registerTask('compare:previous', function(){
        compare(this.async());
    });
    
    grunt.registerTask('compare:browsers', function(){
        compare(this.async(), true);
    });

    function compare(done, crossBrowser){
        require('../_Node/createPdfsAndZips.js')(grunt);

        var resemble = require('resemblejs');
        var fs = require('fs-extra');

        var sizes = captureEnv().sizes;
        var browsers = captureEnv().browsers;

        // Only generate images for previous compares
        var write = !crossBrowser;

        var compare = {
            browser(browser){
                return new Promise((resolve, reject) => {
                    grunt.log.writeln(browser);

                    async function asyncCall () {
                        var values = [];

                        await sizes.reduce(async (promise, d) => {
                            await promise;

                            var data = await compare.size(browser, `${d[0]}x${d[1]}`).catch(() => {});

                            if(data != null){
                                values.push(data);

                                if(!crossBrowser){
                                    await createPdfsAndZips(
                                            `${browser}/${d[0]}x${d[1]}`,
                                            '.tmp/difference',
                                            `${config.filename}_${d[0]}x${d[1]}_${browser}_compare.pdf`
                                        );
                                }
                            }
                        }, Promise.resolve());

                        grunt.log.ok(browser);
                        resolve(values);
                    }

                    asyncCall();
                });
            },
            size(browser, size){
                return new Promise((resolve, reject) => {
                    if(write){
                        fs.mkdirpSync(`.tmp/difference/`);
                        fs.mkdirpSync(`.tmp/difference/${browser}/${size}/`);
                    }

                    async function asyncCall () {
                        var values = [];

                        await grunt.file.expand({cwd: `.tmp/screenshots/${browser}/${size}/`}, '*').reduce(async (promise, d, i) => {
                            await promise;
                            
                            var data = await compare.images(browser, size, i).catch(err => console.log(err));

                            if(data){
                                values.push(data);
                            }
                        }, Promise.resolve());

                        if(!values.length){
                            grunt.log.error("No images to compare");
                            
                            return reject();
                        }

                        grunt.log.ok(size);

                        resolve(values.reduce((a, b) => {
                                return (a > b.rawMisMatchPercentage) ? a : b.rawMisMatchPercentage;
                            }, 0));
                    }

                    asyncCall();
                });
            },
            images(browser, size, index){
                return new Promise((resolve, reject) => {
                    try{
                        var image1;
                        var image2 = fs.readFileSync(`.tmp/screenshots/${browser}/${size}/${index}.png`);
                        
                        if(crossBrowser){
                            image1 = fs.readFileSync(`.tmp/screenshots/${browsers[0]}/${size}/${index}.png`);
                        } else {
                            image1 = fs.readFileSync(`.tmp/previous/${browser}/${size}/${index}.png`);
                        }
                    } catch(e){
                        return reject(e);
                    }
                
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

                            grunt.log.ok(index);
                            resolve(data);
                        });
                });
            }
        }

        async function asyncCall () {
            var values = [];

            await browsers.reduce(async (promise, d) => {
                await promise;
                values.push(await compare.browser(d));
            }, Promise.resolve());

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
                    var max = 100;

                    if(d.length){
                        max = d.reduce((a, b) => (a > b) ? a : b);
                    }

                    var browser = browsers[i];

                    if(crossBrowser){
                        browser = `${browsers[i]} - ${browsers[0]}`;
                    }

                    return buildBadge(` ${browser} `, max, browser);
                });

            Promise.all(arr)
                .then((values) => {
                    svg_to_png.convert(values, '_Build/media/generated/')
                        .then(function(){
                            done();
                        })
                        .catch((err) => {
                            grunt.log.error(err);
                        });
                })
                .catch((err) => {
                    grunt.log.error(err);
                });
        }

        asyncCall();
    }
};