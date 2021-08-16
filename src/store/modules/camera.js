export default {
  namespaced: true,
  state: {
    stream: null,
  },
  getters: {
  },
  mutations: {
    START_CAMERA(state, videoStream) {
      state.stream = videoStream;
    },
    STOP_CAMERA(state) {
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
        state.stream = null;
      }
    }
  },
  actions: {
    async startVideo({ commit }) {
      const standardDevice = JSON.parse(localStorage.getItem('standardDevice'));
      if (navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: standardDevice.deviceId
            }
          }).catch((error) => {
            console.log(error);
            throw new Error(error);
          });
          commit('START_CAMERA', stream);
          return stream;
      } else {
        throw new Error('Seu navegador não tem suporte à dispositivos de vídeo.');
      }
    },
    stopVideo({ commit }) {
      commit('STOP_CAMERA');
    }
  }
}