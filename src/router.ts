import Vue from 'vue';
import Router from 'vue-router';
import AuthCallback from './views/AuthCallback.vue';
import Start from './views/Start.vue';
import ConnectAppInitiate from './views/ConnectAppInitiate.vue';
import ConnectAppAdd from './views/ConnectAppAdd.vue';
import ConnectAppCompleted from './views/ConnectAppCompleted.vue';
import MyConnections from './views/MyConnections.vue';
import VerifyEmailRoute from './views/VerifyEmailRoute.vue';

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
      component: ConnectAppInitiate,
      props: true
    },
    {
      path: '/add-connection',
      component: ConnectAppAdd,
      props: true
    },
    {
      path: '/verify-email',
      component: VerifyEmailRoute,
      props: true
    },
    {
      path: '/completed-connection',
      component: ConnectAppCompleted,
      props: true
    },
    {
      path: '/auth',
      component: AuthCallback,
    },
  ],
});
