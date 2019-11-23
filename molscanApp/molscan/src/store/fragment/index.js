export default {
  state: {
    requests: []
  },
  mutations: {
    clearRequests: (state) => { state.requests = [] },
    setRequests: (state, payload) => { state.requests = payload },
    setRequest: (state) => {
      console.log('value:' + state.requests[0].wasRequested)
      // state.requests[index] = value
    },
    addRequest: (state, payload) => { state.requests.push(payload) }
  },
  actions: {
    clearRequests: ({ commit }) => {
      commit('clearRequests')
    },
    setRequests: ({ commit }, payload) => {
      commit('setRequests', payload)
    },
    setRequest: ({ commit }) => {
      commit('setRequest')
      console.log('fdffdfhdkfhk ')
    },
    addRequest: ({ commit }, payload) => {
      commit('addRequest', payload)
    }
  },
  getters: {
    requests: state => state.requests,
    selectedRequests: state => state.requests.filter(request => request.isSelected)
  }
}
