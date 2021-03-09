import Vue from "vue";
import Vuex from "vuex";

import ScreenHandler from "./modules/ScreenHandler";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        ScreenHandler,
    },
});

export default store;
