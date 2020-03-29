import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'

Vue.use(Vuex);

axios.defaults.baseURL = '/api';

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
