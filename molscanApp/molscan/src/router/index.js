import Vue from 'vue'
import Router from 'vue-router'
import MolScan from '@/components/MolScan'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'MolScan',
    component: MolScan
  }]
})
