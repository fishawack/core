'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require("glob");
const { opts } = require('./_helpers/globals.js');

describe('svg', () => {
    describe('fontello-svg', () => {
        before(() => {
            execSync('grunt clean:build fontello_svg --branch=master --mocha=bundle', opts);
        });
        
        it('Should download icons from fontello.com as svgs', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/icons/generated/*.svg'))).to.be.an('array').that.is.not.empty;
        });

        it('Should download icons with custom file format', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/icons/generated/spin6.svg'))).to.be.an('array').that.is.not.empty;
        });
    });

    describe('svgfit', () => {
        let svg;
        
        before(() => {
            execSync('grunt clean:build fontello_svg svgfit --branch=master --mocha=bundle', opts);
        });
        
        it('Should fit svgs to bounds', () => {
            try{
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-fit/artboard.svg'), opts);
            } catch(e){
                expect(e.message).to.not.contain('ENOENT');
            }
        });

        it('Should fit viewBox tight to bounds', () => {
            expect(svg).contain('viewBox="50 50 100 100"');
        });
    });
    
    describe('svgmin', () => {
        before(() => {
            execSync('grunt clean:build fontello_svg svgfit svgmin --branch=master --mocha=bundle', opts);
        });
        
        it('Should minify & optimize svgs', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/*.svg'))).to.be.an('array').that.is.not.empty;
        });

        describe('full', () => {
            let svg;

            before(() => {
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/svg.svg'), {encoding: 'utf8'});
            });

            it('Should not remove viewBox', () => {
                expect(svg).contain('viewBox=');
            });

            it('Should remove width & height', () => {
                expect(svg).to.not.contain(' width=');
                expect(svg).to.not.contain(' height=');
            });

            it('Should prefix ids', () => {
                expect(svg).to.contain('id="id-');
            });

            it('Should remove <style> blocks', () => {
                expect(svg).to.not.contain('<style>');
            });

            it('Should remove useless fill & stroke', () => {
                expect(svg).to.not.contain(' stroke="red"');
                expect(svg).to.not.contain(' stroke-width="0"');
            });

            it('Should remove fill & stroke', () => {
                expect(svg).to.not.contain(' fill="#00f"');
                expect(svg).to.not.contain(' stroke="#00f"');
            });

            describe('artboard', () => {
                it('Should generate svgs with --artboard suffix', () => {
                    try{
                        svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/artboard--artboard.svg'), opts);
                    } catch(e){
                        expect(e.message).to.not.contain('ENOENT');
                    }
                });

                it('Should not remove viewBox', () => {
                    expect(svg).contain('viewBox=');
                });

                it('Should leave viewBox unmodified', () => {
                    expect(svg).contain('viewBox="0 0 200 200"');
                });
    
                it('Should remove width & height', () => {
                    expect(svg).to.not.contain(' width=');
                    expect(svg).to.not.contain(' height=');
                });
    
                it('Should prefix ids', () => {
                    expect(svg).to.contain('id="id-');
                });
    
                it('Should remove <style> blocks', () => {
                    expect(svg).to.not.contain('<style>');
                });
    
                it('Should remove useless fill & stroke', () => {
                    expect(svg).to.not.contain(' stroke="red"');
                    expect(svg).to.not.contain(' stroke-width="0"');
                });
    
                it('Should remove fill & stroke', () => {
                    expect(svg).to.not.contain(' fill="#00f"');
                    expect(svg).to.not.contain(' stroke="#00f"');
                });
            });
        })

        describe('minimal', () => {
            let svg;

            before(() => {
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/--svg.svg'), {encoding: 'utf8'});
            });

            it('Should not remove viewBox', () => {
                expect(svg).contain('viewBox=');
            });

            it('Should remove width & height', () => {
                expect(svg).to.not.contain(' width=');
                expect(svg).to.not.contain(' height=');
            });

            it('Should prefix ids', () => {
                expect(svg).to.contain('id="id-');
            });

            it('Should not remove <style> blocks', () => {
                expect(svg).to.contain('<style>');
            });

            it('Should not remove useless fill & stroke', () => {
                expect(svg).to.contain(' stroke="red"');
                expect(svg).to.contain(' stroke-width="0"');
            });

            it('Should not remove fill & stroke', () => {
                expect(svg).to.contain(' fill="#00f"');
                expect(svg).to.contain(' stroke="#00f"');
            });

            describe('artboard', () => {
                it('Should generate svgs with --artboard suffix', () => {
                    try{
                        svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/--artboard--artboard.svg'), opts);
                    } catch(e){
                        expect(e.message).to.not.contain('ENOENT');
                    }
                });
    
                it('Should not remove viewBox', () => {
                    expect(svg).contain('viewBox=');
                });

                it('Should leave viewBox unmodified', () => {
                    expect(svg).contain('viewBox="0 0 200 200"');
                });
    
                it('Should remove width & height', () => {
                    expect(svg).to.not.contain(' width=');
                    expect(svg).to.not.contain(' height=');
                });
    
                it('Should prefix ids', () => {
                    expect(svg).to.contain('id="id-');
                });
    
                it('Should not remove <style> blocks', () => {
                    expect(svg).to.contain('<style>');
                });
    
                it('Should not remove useless fill & stroke', () => {
                    expect(svg).to.contain(' stroke="red"');
                    expect(svg).to.contain(' stroke-width="0"');
                });
    
                it('Should not remove fill & stroke', () => {
                    expect(svg).to.contain(' fill="#00f"');
                    expect(svg).to.contain(' stroke="#00f"');
                });
            });
        })
    });

    describe('svgsprite', () => {
        before(() => {
            execSync('grunt clean:build fontello_svg svgfit svgmin svg_sprite --branch=master --mocha=bundle', opts);
        });
        
        it('Should generate svgSprite.svg', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/handlebars/generated/svgSprite.svg'))).to.be.an('array').that.is.not.empty;
        });

        describe('included files', () => {
            let svg;

            before(() => {
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Build/handlebars/generated/svgSprite.svg'), {encoding: 'utf8'});
            });

            it('Should not include files that have a __ prefix', () => {
                expect(svg).not.contain('id="__fishawack"');
            });

            it('Should include files that have a -- prefix', () => {
                expect(svg).contain('id="--svg"');
            });

            it('Should include files that have a -- prefix', () => {
                expect(svg).contain('id="svg"');
            });

            it('Should have root id svgSprite', () => {
                expect(svg).contain('id="svgSprite"');
            });

            it('Should prefix inner ids with svgo-', () => {
                expect(svg).contain('id="svgo-');
            });
        });
    });
});
