module.exports = function(grunt) {
    grunt.registerTask('compare', ['compare:previous', 'compare:browsers']);

    grunt.registerTask('compare:previous', async function(){
        const done = this.async();
        await compare(captureEnv().browsers, captureEnv().sizes);
        done();
    });
    
    grunt.registerTask('compare:browsers', async function(){
        const done = this.async();
        await compare(captureEnv().browsers, captureEnv().sizes, true);
        done();
    });
};

async function compare(browsers, sizes, crossBrowser){
    var fs = require('fs-extra');
    const { log } = require('../_Tasks/helpers/include.js');

    fs.mkdirpSync(`./coverage`);

    // Only generate images for previous compares
    var write = !crossBrowser;

    for(let i = 0; i < browsers.length; i++){
        let value = await browser(browsers[i], write, sizes, browsers[0])
        var diff = 100;

        // Reduce all sizes into a single diff %
        if(value.length){
            diff = value.reduce((a, b) => (a > b) ? a : b);
        }

        log.ok(`${crossBrowser ? `${browsers[0]}-` : ''}${browsers[i]}`, `${diff}% different`);

        fs.writeFileSync(`./coverage/${crossBrowser ? `comparison-${browsers[0]}-${browsers[i]}` : 'regression'}.json`, JSON.stringify({diff}, null, 4));
    }
}

async function browser(browser, write, sizes, baseBrowser){
    const { log } = require('../_Tasks/helpers/include.js');
    var values = [];

    for(let i = 0; i < sizes.length; i++){
        let width = sizes[i][0];
        let height = sizes[i][1];

        var data = await size(browser, `${width}x${height}`, write, baseBrowser);

        if(data != null){
            values.push(data);

            if(write){
                var createPdfsAndZips = require('../_Node/createPdfsAndZips');

                await createPdfsAndZips(
                        `${browser}/${width}x${height}`,
                        '.tmp/difference',
                        `${config.filename}_${width}x${height}_${browser}_compare.pdf`
                    );
            }
        }
    }

    log.ok(browser);
    
    return values;
};

async function size(browser, size, write, baseBrowser){
    const fs = require('fs-extra');
    const glob = require('glob');
    const { alphanumSort, log } = require('../_Tasks/helpers/include.js');
    
    if(write){
        fs.mkdirpSync(`.tmp/difference/`);
        fs.mkdirpSync(`.tmp/difference/${browser}/${size}/`);
    }

    var values = [];

    let files = await alphanumSort(glob.sync('*', {cwd: `.tmp/screenshots/${browser}/${size}/`}));
    
    for(let i = 0; i < files.length; i++){
        let file = files[i];

        try{
            var image1;
            var image2 = fs.readFileSync(`.tmp/screenshots/${browser}/${size}/${file}`);
            
            if(write){
                image1 = fs.readFileSync(`.tmp/previous/${browser}/${size}/${file}`);
            } else {
                image1 = fs.readFileSync(`.tmp/screenshots/${baseBrowser}/${size}/${file}`);
            }
        } catch(e){
            log.warn(`${file} didn't exist in previous run`);
            continue;
        }

        var data = await images(image1, image2);

        if(data){
            values.push(data.result);

            if(write){
                fs.writeFileSync(`.tmp/difference/${browser}/${size}/${file}`, data.diff);
            }
        
            log.ok(file);
        }
    }

    if(!values.length){
        log.error("No images to compare");
        
        return null;
    }

    log.ok(size);

    // Reduce to the largest change out of all pages
    return values.reduce((a, b) => {
        return (a > b) ? a : b;
    }, 0);
};

async function images(image1, image2){
    const sharp = require('sharp');
    const pixelmatch = require('pixelmatch');
    const PNG = require('pngjs').PNG;

    const sharp1 = sharp(image1);
    const meta1 = await sharp1.metadata();

    const sharp2 = sharp(image2);
    const meta2 = await sharp2.metadata();

    const width = Math.max(meta1.width, meta2.width);
    const height = Math.max(meta1.height, meta2.height);

    const opts = {
        width: width,
        height: height,
        fit: 'contain',
        position: 'left top'
    };

    const boxedBuffer1 = await sharp1
        .resize(opts)
        .raw()
        .toBuffer();

    const boxedBuffer2 = await sharp2
        .resize(opts)
        .raw()
        .toBuffer();

    const total = width * height;
    const diff = new PNG({width, height});

    let result = pixelmatch(boxedBuffer1, boxedBuffer2, diff.data, width, height, {threshold: 0.05});

    return {result: +((result / total) * 100).toFixed(2), diff: PNG.sync.write(diff)};
};

module.exports.compare = compare;
module.exports.images = images;