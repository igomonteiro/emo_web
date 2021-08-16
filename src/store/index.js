import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import user from './modules/user';
import face from './modules/face';
import expressions from './modules/expressions';
import camera from './modules/camera';

Vue.use(Vuex);

export default new Vuex.Store({ 
  modules: {
    auth,
    user,
    face,
    expressions,
    camera,
  }
});