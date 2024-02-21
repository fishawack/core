import { createStore } from "vuex";
import VuexPersistedState from 'vuex-persistedstate';

const store = createStore({
    plugins: [
        VuexPersistedState({
    		key: document.title
    	})
    ],
    
    state: {
    },

    mutations: {
    }
});

export default store;