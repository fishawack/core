module.exports = function(grunt) {
    var delay = 50;
    var index = 0;
    var captureIndex = 0;

    grunt.file.mkdir('.tmp/screenshots/');

    var areas = ["menu_0"];

    this.capturePage = function(){
        describe('pdf', function () {
            it('Screenshot', function(done) {
                browser.url('http://localhost:9001/index.html');

                var tempAreas = browser.execute(function(){
                        var tempArray = [];

                        document.querySelector('html').classList.add('capture');
                        window.capture = true;

                        window.Utility.eachNode('.area', function(node){
                            tempArray.push(node.dataset.area);
                        });

                        // SLICE REMOVES MENU
                        return tempArray.slice(1);
                    });

                areas = areas.concat(tempAreas.value);

                browser.waitForExist('.loaded', 2000);

                captureArea();
            });
        });
    }

    this.captureArea = function(){
        var currentArea = areas[index];

        describe(currentArea, function () {
            it('Screenshot', function(done) {
                browser.execute(function(area){
                        document.querySelector('.js-area[data-area="' + area + '"]').click();
                    }, currentArea);

                browser.pause(delay);

                browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

                captureDrags();

                captureCaptures();

                captureToggles();

                captureTabs();

                var tempContent = browser.execute(function(){
                        var tempCount = 0;

                        window.Utility.eachNode('.area.active > article', function(node){
                            if(node.children.length){
                                tempCount++;
                            }
                        });

                        return tempCount - 1;
                    });

                if(tempContent.value >= 1){
                    captureContent(0, tempContent.value);
                }

                captureModals();

                index += 1;
                if(index < areas.length){
                    captureArea();
                } else {
                    createPdfsAndZips();
                }
            });
        });
    }

    this.captureContent = function(current, count){
        browser.execute(function(){
                window.Nav.content('next');
            });

        browser.pause(delay);

        browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

        captureDrags();

        captureCaptures();

        captureToggles();

        captureTabs();

        current += 1;
        if(current < count){
            captureContent(current, count);
        }
    }

    this.captureTabs = function(){
        var tempTab = browser.execute(function(){
                var tempArray = [];

                window.Utility.eachNode('.area.active > article.active .js-tab', function(node){
                    var target = node.dataset.target;
                    var found = false;

                    tempArray.forEach(function(d){
                        if(d.target === target){
                            found = true;
                        }
                    });

                    if(!found){
                        var index;

                        var tabs = document.querySelectorAll('.area.active > article.active [data-target="' + target +'"]');

                        for(var i = tabs.length; i--;){
                            if(tabs[i].dataset.dir){
                                continue;
                            }

                            var taberoo = tabs[i].children;

                            for(var j = taberoo.length; j--;){
                                var inner = taberoo[j].querySelector('button');

                                if(index == null || index < +inner.dataset.index){
                                    index = +inner.dataset.index;
                                }
                            }
                        }

                        tempArray.push({
                            target: target,
                            count: index
                        });
                    }
                });

                return tempArray;
            });

        for(var i = 0; i < tempTab.value.length; i++){
            captureTab(0, tempTab.value[i]);
        }
    }

    this.captureTab = function(current, tab){
        browser.execute(function(tab){
                window.Nav.tabdir(tab.target, 'next');
            }, tab);

        browser.pause(delay);

        browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

        current += 1;
        if(current < tab.count){
            captureTab(current, tab);
        }
    }

    this.captureToggles = function(){
        var tempToggle = browser.execute(function(){
                var tempArray = [];

                window.Utility.eachNode('.area.active > article.active .js-toggle', function(node){
                    if(tempArray.indexOf(node.dataset.target) === -1){
                        tempArray.push(node.dataset.target);
                    }
                });

                return tempArray;
            });

        for(var i = 0; i < tempToggle.value.length; i++){
            captureToggle(0, tempToggle.value[i]);
        }
    }

    this.captureToggle = function(current, toggle){
        browser.execute(function(toggle){
                window.Nav.toggle(toggle);
            }, toggle);

        browser.pause(delay);

        browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");
    }

    this.captureDrags = function(){
        var tempDrag = browser.execute(function(){
                var tempArray = [];

                window.Utility.eachNode('.area.active > article.active .js-drag', function(node){
                    var target = node.dataset.target;
                    var found = false;

                    tempArray.forEach(function(d){
                        if(d.target === target){
                            found = true;
                        }
                    });

                    if(!found){
                        var boxes = window.context.querySelectorAll('.' + node.dataset.box);
                        var index;

                        if(boxes[0].dataset.index != null){
                            for(var j = boxes.length; j--;){
                                if(index == null || index < +boxes[j].dataset.index){
                                    index = +boxes[j].dataset.index
                                }
                            }
                        }

                        if(node.dataset.index != null){
                            var drags = document.querySelectorAll('.area.active > article.active .js-drag[data-target="' + target +'"]');

                            for(var j = drags.length; j--;){
                                if(index == null || index < +drags[j].dataset.index){
                                    index = +drags[j].dataset.index
                                }
                            }
                        }

                        tempArray.push({
                            target: node.dataset.target,
                            count: index
                        });
                    }
                });

                return tempArray;
            });

        for(var i = 0; i < tempDrag.value.length; i++){
            if(tempDrag.value[i].count != null){
                for(var j = 0; j < tempDrag.value[i].count + 1; j++){
                    captureDrag(0, tempDrag.value[i].target, j);
                }
            } else {
                captureDrag(0, tempDrag.value[i].target);
            }
        }
    }

    this.captureDrag = function(current, drag, index){
        browser.execute(function(drag, index){
                window.Nav.drag(null, null, null, drag, null, true, null, index);
            }, drag, index);

        browser.pause(delay);

        browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");
    }

    this.captureModals = function(){
        var isVisible = browser.isVisible('.js-modals');

        if(isVisible){
            var tempModals = browser.execute(function(){
                    var modals = document.querySelector('.js-modals');

                    if(modals){
                        return modals.children.length;
                    }

                    return 0;
                });

            for(var i = 0; i < tempModals.value; i++){
                browser.execute(function(index){
                    window.Nav.modal(index);
                }, i);

                browser.pause(delay);

                browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

                browser.execute(function(){
                    window.Nav.modal(-1);
                });
            }
        }
    }

    this.captureCaptures = function(){
        var tempCapture = browser.execute(function(){
                var tempArray = [];

                window.Utility.eachNode('.area.active > article.active .js-capture', function(node){
                    tempArray.push({
                        target: node.dataset.target,
                        slug: node.dataset.slug
                    });
                });

                return tempArray;
            });

        for(var i = 0; i < tempCapture.value.length; i++){
            var capture = tempCapture.value[i];

            while(!browser.execute(function(target, slug){
                return window[slug][target]();
            }, capture.target, capture.slug).value){
                browser.pause(delay);
                browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");
            }

            browser.pause(delay);
            browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");
        }
    }
}