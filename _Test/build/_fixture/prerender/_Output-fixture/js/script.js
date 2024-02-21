let vue = new Vue({
    el: '#app',
    router: new VueRouter({
        mode: 'history',
        base: 'subdirectory',
        routes: [
            { path: '/', component: { template: '<h3 v-text="`Home`"/>' } },
            { path: '/about', component: { template: '<h3 v-text="`About`"/>' } },
        ]
    })
});

document.documentElement.classList.remove('loading');
document.documentElement.classList.add('loaded');