import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';

require('@/store/modules/subscriber');

Vue.config.productionTip = false;

Vue.use(Vuelidate);

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
  }).$mount('#app')
});