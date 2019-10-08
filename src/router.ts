import Vue from 'vue';
import Router from 'vue-router';
import AuthCallback from './views/AuthCallback.vue';
import Start from './views/Start.vue';
import MyConnections from './views/MyConnections.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start,
    },
    {
      path: '/my-connections',
      name: 'my-connections',
      component: MyConnections,
    },
    {
      path: '/auth',
      name: 'Auth callback',
      component: AuthCallback,
    },
  ],
});
