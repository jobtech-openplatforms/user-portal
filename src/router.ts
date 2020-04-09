import Vue from 'vue';
import Router from 'vue-router';
import AuthCallback from './views/AuthCallback.vue';
import Start from './views/Start.vue';
import ConnectAppStart from './views/ConnectAppStart.vue';
import ConnectApp from './views/ConnectApp.vue';
import MyConnections from './views/MyConnections.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Start,
    },
    {
      path: '/my-connections',
      component: MyConnections,
    },
    {
      path: '/initiate-connection',
      component: ConnectAppStart,
      props: true
    },
    {
      path: '/add-connection',
      component: ConnectApp,
      props: true
    },
    {
      path: '/completed-connection',
      component: ConnectApp,
      props: true
    },
    {
      path: '/auth',
      component: AuthCallback,
    },
  ],
});
