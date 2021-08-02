import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#262223',
        secondary: '#DDC6B6',
        accent: '#FFE8D8',
      },
    },
  },
});