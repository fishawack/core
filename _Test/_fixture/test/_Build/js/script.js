"use strict";

"use strict";

import "./libs/build-id.js";

import * as Utility from "./libs/utility";

(function(){
	if(navigator.userAgent === 'jsdom'){ return; }

    // Used for capturing pdf as part of preprocess deploy
	if (Utility.parse_query_string(window.location.search.substring(1)).capture === 'true') {
		document.querySelector('html').classList.add('capture');
		window.capture = true;
	}

	Utility.styleguide();

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();