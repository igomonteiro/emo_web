import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#00FFFF',
        secondary: '#1D1B1B',
        accent: '#BDFCFC',
      },
      dark: {
        primary: '#1D1B1B',
        secondary: '#00FFFF',
        accent: '#1D1B1B',
      },
    },
  },
});