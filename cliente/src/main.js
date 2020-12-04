import Vue from 'vue';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

const options = {
  position: POSITION.TOP_CENTER,
};

Vue.use(Toast, options);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
