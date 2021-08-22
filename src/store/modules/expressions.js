import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    dayExpressions: null,
    weekExpressions: null,
    translated: {
      'neutral': 'neutro',
      'happy': 'feliz',
      'sad': 'triste',
      'angry': 'irritado',
      'surprised': 'surpreso'
    },
  },
  getters: {
    dayExpressions: state => {
      const expressions = state.dayExpressions;
      let sum = 0;
      let mappedExpressions = [];

      for (const exp in expressions) {
        sum += expressions[exp];
      }

      for (const exp in expressions) {
        mappedExpressions.push({
          classification: state.translated[exp],
          part: parseFloat(((expressions[exp]/sum) * 100).toFixed(2)) || 0,
        })
      }

      return mappedExpressions;
    },
    weekExpressions: state => {
      const weekExpressions = state.weekExpressions;

      if (!weekExpressions.length) {
        return [];
      }

      let translatedWeeks = {
        'Sunday': 'Domingo',
        'Monday': 'Segunda',
        'Tuesday': 'Terça',
        'Wednesday': 'Quarta',
        'Thursday': 'Quinta',
        'Friday': 'Sexta',
        'Saturday': 'Sábado',
      }

      let weekNumber = {
        'Domingo': 0,
        'Segunda': 1,
        'Terça': 2,
        'Quarta': 3,
        'Quinta': 4,
        'Sexta': 5,
        'Sábado': 6,
      }

      let weeks = [
        { day: 'Domingo', date: '', classification: '', part: ''},
        { day: 'Segunda', date: '', classification: '', part: ''},
        { day: 'Terça', date: '', classification: '', part: ''},
        { day: 'Quarta', date: '', classification: '', part: ''},
        { day: 'Quinta', date: '', classification: '', part: ''},
        { day: 'Sexta', date: '', classification: '', part: ''},
        { day: 'Sábado', date: '', classification: '', part: ''},
      ];

      let sum = 0;
      let max = 0;
      let key = null;

      weekExpressions.forEach(expression => {
        sum = 0;
        max = 0;
        key = null;
        for (const c in expression.classifications) {
          if (expression.classifications[c] > max) {
            max = expression.classifications[c];
            key = c;
          }
          sum += expression.classifications[c];
        }
        
        for (const c in expression.classifications) {
          if (c === key) {
            let numberOfWeek = weekNumber[translatedWeeks[expression.day]];
            weeks[numberOfWeek].day = translatedWeeks[expression.day];
            weeks[numberOfWeek].date = expression.formattedDate;
            weeks[numberOfWeek].classification = state.translated[c];
            weeks[numberOfWeek].part = parseFloat(((expression.classifications[c]/sum) * 100).toFixed(2)) || 0;
          }
        }
      });

      return weeks;
    },
    // weekExpressions: state => {
    //   const weekExpressions = state.weekExpressions;

    //   let translatedWeeks = {
    //     'Sunday': 'Domingo',
    //     'Monday': 'Segunda',
    //     'Tuesday': 'Terça',
    //     'Wednesday': 'Quarta',
    //     'Thursday': 'Quinta',
    //     'Friday': 'Sexta',
    //     'Saturday': 'Sábado',
    //   }

    //   let mappedExpressions = [];
    //   let sum = 0;
    //   weekExpressions.forEach(expression => {
    //     sum = 0;
    //     for (const c in expression.classifications) {
    //       sum += expression.classifications[c];
    //     }

    //     for (const c in expression.classifications) {
    //       mappedExpressions.push({
    //         day: translatedWeeks[expression.day],
    //         date: expression.formattedDate,
    //         classification: state.translated[c],
    //         part: parseFloat(((expression.classifications[c]/sum) * 100).toFixed(2)) || 0,
    //       })
    //     }
    //   });

    //   console.log(mappedExpressions);

    //   return weekExpressions;
    // }
  },
  mutations: {
    SET_DAY_EXPRESSIONS(state, expressions) {
      state.dayExpressions = expressions;
    },
    SET_WEEK_EXPRESSIONS(state, expressions) {
      state.weekExpressions = expressions;
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
    async getWeekExpressions({ commit }, date) {
      try {
        const response = await api.get('emotions/week', {
          params: {
            date,
          }
        });
        commit('SET_WEEK_EXPRESSIONS', response.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}