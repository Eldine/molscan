// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import SuiVue from 'semantic-ui-vue'
import VueMasonry from 'vue-masonry-css'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
// import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import store from './store'
var infiniteScroll = require('vue-infinite-scroll')
Vue.use(infiniteScroll)
Vue.use(PerfectScrollbar)
Vue.use(VueMasonry)
Vue.use(VueResource)
Vue.use(SuiVue)
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
