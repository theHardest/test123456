import Vue from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-TW"; 
import request from "@/utils/request";
import store from "./store";

import router from "./router";
// import '@/router/permission' // permission control

Vue.use(ElementUI, { locale });
Vue.prototype.$https = request;
Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});