import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  getters: {
    authenticated(state) {
      return state.token && state.user;
    },
    user(state) {
      return state.user;
    }
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      let response = await api.post('session', credentials);
      return dispatch('attempt', response.data.token);
    },
    async attempt({ commit, state }, token) {

      if (token) {
        commit('SET_TOKEN', token);
      }

      if (!state.token) {
        return;
      }
      
      try {
        let response = await api.get('session');
        commit('SET_USER', response.data.user);
        commit('user/UPDATE_PROFILE', response.data.user, { root: true });
      } catch(err) {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
        commit('user/UPDATE_PROFILE', null, { root: true });
      }
    },
    signUp(_, payload) {
      return api.post('users', payload);
    },
    async signOut({ commit }) {
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
      commit('user/UPDATE_PROFILE', null, { root: true });
    }
  }
}