import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    profile: null,
  },
  getters: {
    profile(state) {
      return state.profile;
    }
  },
  mutations: {
    UPDATE_PROFILE(state, payload) {
      state.profile = payload;
    },
  },
  actions: {
    async updateProfile({ commit }, payload) {
      const { name, ...rest } = payload;

      const profile = Object.assign(
        { name },
        rest.oldPassword ? rest : {}
      );

      const response = await api.put('users', profile);
      return commit('UPDATE_PROFILE', response.data);
    }
  }
}