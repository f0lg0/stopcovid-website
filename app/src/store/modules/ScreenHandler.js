function isMobile() {
    const screenWidth = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );

    if (screenWidth <= 760) {
        return true;
    } else {
        return false;
    }
}

const state = {
    mobile: false,
};

const getters = {
    mobile: (state) => state.mobile,
};

const mutations = {
    isMobile(state, isMobile) {
        state.mobile = isMobile;
    },
};

const actions = {
    checkMobile({ commit }) {
        commit("isMobile", isMobile());

        window.addEventListener("resize", () => {
            commit("isMobile", isMobile());
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
