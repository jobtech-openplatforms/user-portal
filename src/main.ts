import Vue from 'vue';
import router from './router';
import './registerServiceWorker';
import store from "@/store/Store";
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import AuthPlugin from './plugins/AuthPlugin';


Vue.config.productionTip = false;

Vue.use(AuthPlugin)
Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
