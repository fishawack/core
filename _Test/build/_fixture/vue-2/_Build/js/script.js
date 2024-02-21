'use strict';

import Vue from 'vue';

import directives from './libs/directives';
import './libs/filters';
import plugins from './libs/plugins';
import router from './libs/router';
import store from './libs/store';

(() => {
	// Global components
	Vue.component('GIcon', require('../vue/globals/GIcon.vue').default);
	Vue.component('GSvg', require('../vue/globals/GSvg.vue').default);
	Vue.component('GLorem', require('vue-lorem-ipsum').default);

    // Plugins
    Vue.use(plugins);

    // Directives
    directives.forEach(directive => Vue.directive(directive.name, directive.config));

	// Init vue instance
	new Vue({
		el: '#app',
		store,
		router,
		render: createElement => createElement(require('../vue/app.vue').default),
	});

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();