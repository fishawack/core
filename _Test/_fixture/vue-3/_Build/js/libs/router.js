import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(),
	linkExactActiveClass: 'active',
	routes: require("./routes.js")()
});

router.beforeEach((to, from, next) => {
	// Enforce routes have trailing forward slash
	if(to.path.substr(-1) != '/'){
		return next({path: `${to.path}/`, query: to.query, hash: to.hash});
	}

	return next();
});

export default router;