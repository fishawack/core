'use strict';

import Vue from 'vue';

export default {
    install() {
        Vue.Bus = new Vue();
        Vue.prototype.Bus = new Vue();
    },
};