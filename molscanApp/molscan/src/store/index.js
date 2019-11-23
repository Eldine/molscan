import Vue from 'vue'
import Vuex from 'vuex'
import shared from './shared'
import molecule from './molecule'
import request from './fragment'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    molecule: molecule,
    shared: shared,
    request: request
  }
})
