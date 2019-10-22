import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const state = {
  filterOrderNo_MRP: '',
  filterPerson_MRP: '',
  filterCode_MRP: '',
  ifHasTF_MRP: false,
  orderMRPId: ''
}

const actions = {
  updateOrderMRPId ({commit, state}, OrderMRPId) {
    commit('setOrderMRPId', OrderMRPId)
  }
}

const mutations = {
  setOrderMRPId (state, OrderMRPId) {
    state.orderMRPId = OrderMRPId
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
})
