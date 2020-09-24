/*! modernizr 3.11.3 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csscalc-flexbox-setclasses-shiv !*/
!function(e,t,n,r){function o(e,t){return typeof e===t}function i(e,t){return!!~(""+e).indexOf(t)}function a(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):x?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function s(){var e=n.body;return e||(e=a(x?"svg":"body"),e.fake=!0),e}function l(e,t,r,o){var i,l,c,u,f="modernizr",d=a("div"),p=s();if(parseInt(r,10))for(;r--;)c=a("div"),c.id=o?o[r]:f+(r+1),d.appendChild(c);return i=a("style"),i.type="text/css",i.id="s"+f,(p.fake?p:d).appendChild(i),p.appendChild(d),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),d.id=f,p.fake&&(p.style.background="",p.style.overflow="hidden",u=S.style.overflow,S.style.overflow="hidden",S.appendChild(p)),l=t(d,e),p.fake?(p.parentNode.removeChild(p),S.style.overflow=u,S.offsetHeight):d.parentNode.removeChild(d),!!l}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(e,n,r){var o;if("getComputedStyle"in t){o=getComputedStyle.call(t,e,n);var i=t.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var a=i.error?"error":"log";i[a].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&e.currentStyle&&e.currentStyle[r];return o}function f(e,n){var o=e.length;if("CSS"in t&&"supports"in t.CSS){for(;o--;)if(t.CSS.supports(c(e[o]),n))return!0;return!1}if("CSSSupportsRule"in t){for(var i=[];o--;)i.push("("+c(e[o])+":"+n+")");return i=i.join(" or "),l("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"===u(e,null,"position")})}return r}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function p(e,t,n,s){function l(){u&&(delete N.style,delete N.modElem)}if(s=!o(s,"undefined")&&s,!o(n,"undefined")){var c=f(e,n);if(!o(c,"undefined"))return c}for(var u,p,m,h,v,g=["modernizr","tspan","samp"];!N.style&&g.length;)u=!0,N.modElem=a(g.shift()),N.style=N.modElem.style;for(m=e.length,p=0;p<m;p++)if(h=e[p],v=N.style[h],i(h,"-")&&(h=d(h)),N.style[h]!==r){if(s||o(n,"undefined"))return l(),"pfx"!==t||h;try{N.style[h]=n}catch(e){}if(N.style[h]!==v)return l(),"pfx"!==t||h}return l(),!1}function m(e,t){return function(){return e.apply(t,arguments)}}function h(e,t,n){var r;for(var i in e)if(e[i]in t)return!1===n?e[i]:(r=t[e[i]],o(r,"function")?m(r,n||t):r);return!1}function v(e,t,n,r,i){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+w.join(a+" ")+a).split(" ");return o(t,"string")||o(t,"undefined")?p(s,t,r,i):(s=(e+" "+j.join(a+" ")+a).split(" "),h(s,t,n))}function g(e,t,n){return v(e,r,r,t,n)}var y=[],C={_version:"3.11.3",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){y.push({name:e,fn:t,options:n})},addAsyncTest:function(e){y.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr;var E=[],S=n.documentElement,x="svg"===S.nodeName.toLowerCase();x||function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=y.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),y.elements=n+" "+e,c(t)}function i(e){var t=g[e[h]];return t||(t={},v++,e[h]=v,g[v]=t),t}function a(e,n,r){if(n||(n=t),f)return n.createElement(e);r||(r=i(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():m.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||p.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||i(e);for(var o=n.frag.cloneNode(),a=0,s=r(),l=s.length;a<l;a++)o.createElement(s[a]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function c(e){e||(e=t);var r=i(e);return!y.shivCSS||u||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),f||l(e,r),e}var u,f,d=e.html5||{},p=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,m=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h="_html5shiv",v=0,g={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",u="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return void 0===e.cloneNode||void 0===e.createDocumentFragment||void 0===e.createElement}()}catch(e){u=!0,f=!0}}();var y={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:"3.7.3",shivCSS:!1!==d.shivCSS,supportsUnknownElements:f,shivMethods:!1!==d.shivMethods,type:"default",shivDocument:c,createElement:a,createDocumentFragment:s,addElements:o};e.html5=y,c(t),"object"==typeof module&&module.exports&&(module.exports=y)}(void 0!==t?t:this,n);var b="Moz O ms Webkit",w=C._config.usePrefixes?b.split(" "):[];C._cssomPrefixes=w;var _={elem:a("modernizr")};Modernizr._q.push(function(){delete _.elem});var N={style:_.elem.style};Modernizr._q.unshift(function(){delete N.style});var j=C._config.usePrefixes?b.toLowerCase().split(" "):[];C._domPrefixes=j,C.testAllProps=v,C.testAllProps=g,Modernizr.addTest("flexbox",g("flexBasis","1px",!0));var z=C._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];C._prefixes=z,Modernizr.addTest("csscalc",function(){var e=a("a");return e.style.cssText="width:"+z.join("calc(10px);width:"),!!e.style.length}),function(){var e,t,n,r,i,a,s;for(var l in y)if(y.hasOwnProperty(l)){if(e=[],t=y[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(r=o(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)a=e[i],s=a.split("."),1===s.length?Modernizr[s[0]]=r:(Modernizr[s[0]]&&(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean)||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=r),E.push((r?"":"no-")+s.join("-"))}}(),function(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(x&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(e.length>0&&(t+=" "+n+e.join(" "+n)),x?S.className.baseVal=t:S.className=t)}(E),delete C.addTest,delete C.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,window,document);