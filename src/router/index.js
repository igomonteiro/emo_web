import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import Dashboard from '@/views/Dashboard.vue';
import Camera from '@/views/Camera.vue';
import Settings from '@/views/Settings.vue';
import Profile from '@/views/Profile.vue';
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/camera',
    name: 'Camera',
    component: Camera,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.name !== 'SignIn' && !store.getters['auth/authenticated']) {
      return next({
        name: 'SignIn',
      });
    } else {
      next();
    }
  } else if ((to.name === 'SignIn' || to.name === 'SignUp') && store.getters['auth/authenticated']) {
    return next({
      name: 'Dashboard'
    })
  } else {
    next();
  }
});

export default router;
