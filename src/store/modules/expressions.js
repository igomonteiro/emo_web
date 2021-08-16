import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    dayExpressions: null,
    allTodayExpressions: null,
  },
  getters: {
    allTodayExpressions: state => {
      const mapClassification = {
        happy: 0,
        neutral: 1,
        sad: 2,
        angry: 3,
        surprised: 4,
      }
      return state.allTodayExpressions.map(res => ({
        x: res.time,
        y: mapClassification[res.classification],
      }));
    },
    dayExpressions: state => {
      const expressions = state.dayExpressions;
      let sum = 0;
      let mappedExpressions = [];

      let translated = {
        'neutral': 'neutro',
        'happy': 'feliz',
        'sad': 'triste',
        'angry': 'irritado',
        'surprised': 'surpreso'
      }

      for (const exp in expressions) {
        sum += expressions[exp];
      }

      for (const exp in expressions) {
        mappedExpressions.push({
          classification: translated[exp],
          part: parseFloat(((expressions[exp]/sum) * 100).toFixed(2)) || 0,
        })
      }

      return mappedExpressions;
    }
  },
  mutations: {
    SET_DAY_EXPRESSIONS(state, expressions) {
      state.dayExpressions = expressions;
    },
    SET_ALL_TODAY_EXPRESSIONS(state, expressions) {
      state.allTodayExpressions = expressions;
    }
  },
  actions: {
    async getByDateExpressions({ commit }, date) {
      try {
        const response = await api.get('emotions/date', {
          params: {
            date,
          }
        });
        commit('SET_DAY_EXPRESSIONS', response.data);
      } catch (err) {
        console.log(err);
      }
    },
    async getAllTodayExpressions({ commit }) {
      try {
        const response = await api.get('emotions/today/all');
        commit('SET_ALL_TODAY_EXPRESSIONS', response.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}