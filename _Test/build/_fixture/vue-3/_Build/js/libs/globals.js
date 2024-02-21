import GSvg from "../../vue/globals/GSvg.vue";
import GIcon from "../../vue/globals/GIcon.vue";

export default {
    install(Vue) {
        Vue.component('GIcon', GIcon);
        Vue.component('GSvg', GSvg);
    },
};
