'use strict';

module.exports = (node) => [
    {
        path: '/',
        component: node ? '' : require('../../vue/routes/PIndex.vue').default,
        name: 'index'
    },
    {
        path: '/404',
        component: node ? '' : require('../../vue/routes/P404.vue').default
    },
    {
        path: '/*',
        redirect: '/404',
        prerender: false
    }
];