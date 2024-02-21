import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

let router = new VueRouter({
	linkExactActiveClass: 'active',
	routes: require("./routes.js")(),
	mode: 'history'
});

router.beforeEach((to, from, next) => {
	// Enforce routes have trailing forward slash
	if(to.path.substr(-1) != '/'){
		return next({path: `${to.path}/`, query: to.query, hash: to.hash});
	}

	return next();
});

export default router;