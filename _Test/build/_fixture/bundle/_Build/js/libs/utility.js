export function eachNode(nodes, cb){
    nodes = document.querySelectorAll(nodes);
    
    for(var i = 0, len = nodes.length; i < len; i++){
        cb(nodes[i], i);
    }
};

export function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};

export function load(path, mimetype, pages, index, arr) {
    return new Promise((resolve) => {
        index = index || 1;

        var xobj = new XMLHttpRequest();
        if(mimetype){
            xobj.overrideMimeType(mimetype);
        }

        xobj.open('GET', (pages) ? `${path}?per_page=100&page=${index}` : path, true);
        xobj.onreadystatechange = function () {
            if(xobj.readyState === 4 && (+xobj.status === 200 || +xobj.status === 0)){
                var data = JSON.parse(xobj.responseText);

                if(!pages){
                    resolve(data);
                } else {
                    var current = +xobj.getResponseHeader('x-wp-totalpages');

                    if(!arr){
                        arr = data || [];
                    } else {
                        arr = arr.concat(data);
                    }

                    if(current && current !== index){
                        load(path, mimetype, pages, ++index, arr)
                            .then((res) => resolve(res));
                    } else {
                        resolve(arr);
                    }
                }
            }
        };
        xobj.send(null);
    });
};

export function classList(el) {
    var list = el.classList;

    return {
        toggle: function(c) { list.toggle(c); return this; },
        add:    function(c) { list.add   (c); return this; },
        remove: function(c) { list.remove(c); return this; }
    };
}

var blueprints = {};
export function blueprint(selector, array, cb, root, node){
    var nodes;

    if(!node){
        nodes = (root || document).querySelectorAll(selector);
    } else {
        nodes = [node];
    }

    var blueprint;

    if(blueprints[selector]){
        blueprint = blueprints[selector];
    } else {
        blueprint = nodes[0].children[0];
        blueprint.classList.remove('ut-hide');
        blueprints[selector] = blueprint;
    }

    var docFrag = document.createDocumentFragment();

    array.forEach(function(d, i, arr){
        var item = blueprint.cloneNode(true);

        cb(item, d, i, arr);

        docFrag.appendChild(item);
    });

    for(var i = nodes.length; i--;){
        nodes[i].innerHTML = '';

        nodes[i].appendChild(docFrag);
    }
};

export function styleguide(){
    let colors = [].slice.call(document.styleSheets[0].cssRules).filter(d => d.selectorText && d.selectorText.includes('.color-')).map(d => d.selectorText);
	
	let length = 0;
	/* jshint ignore:start */
	while(colors.find(d => d === `.color-${length}`)){
		length++;
	}
	/* jshint ignore:end */
    eachNode('.js-styleguide-dynamic', node => {
        let name = node.dataset.styleguideDynamic;
        blueprint(name, Array(length).fill(0), (item, d, i) => {
            let text = item.querySelector('.js-styleguide-index');
            if(text){
                text.innerText = i;
            }
            classList(item.querySelector(`.${name}`) || item).remove(name).add(`${name}${i}`);
        }, null, node);
    });
}