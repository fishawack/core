'use strict';

import { createApp, h } from "vue";

import filters from "./libs/filters";
import globals from "./libs/globals";
import router from "./libs/router";
import store from "./libs/store";

(() => {
	// Init vue instance
	const vue = createApp({
		render: () => h(require('../vue/app.vue').default),
	});

	vue.use(store);
    vue.use(router);
    vue.use(filters);
    vue.use(globals);

    vue.mount("#app");

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();