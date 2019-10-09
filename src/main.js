import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify";
import "@/filters";
import "@/css/app.css";

// import AOS from "aos";
// import "aos/dist/aos.css";

(function() {
  if (typeof NodeList.prototype.forEach === "function") return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

(function() {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
  }
})();

import browserDetect from "vue-browser-detect-plugin";
Vue.use(browserDetect);

Vue.config.productionTip = false;
// eslint-disable-next-line no-undef
NProgress.configure({ showSpinner: false });

new Vue({
  router,
  store,
  // created() {
  //   AOS.init();
  // },
  vuetify,
  render: h => h(App)
}).$mount("#app");
