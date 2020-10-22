import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = { 
    count: 1
}
const mutations = {
    
    incrementBy(state, n) {
        state.count+=n
    }
}

 
const actions = {
    incrementBy(context, payload) {
        context.commit('incrementBy', payload)
    },
    // incrementAsync ({ commit }) {
    //     setTimeout(() => {
    //        commit('increment')
    //     }, 1000)
    // }
}
const store = new Vuex.Store({
    state,
    mutations,
    actions
});
export default store;