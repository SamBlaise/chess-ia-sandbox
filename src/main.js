// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import TreeView from 'vue-json-tree-view'
import Store from '@/stores/StoreEditor'

Vue.config.productionTip = false
Vue.use(TreeView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: Store
})
