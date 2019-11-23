export default {
  state: {
    databases: [
      { id: 'pubchem', name: 'Pubchem database', isSelected: true },
      { id: 'chembl', name: 'Chembl database', isSelected: false }
    ],
    loading: null,
    error: null
  },
  mutations: {
    setLoading: (state, payload) => {
      state.loading = payload
    },
    setError: (state, payload) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  actions: {
    clearError: ({ commit }) => {
      commit('clearError')
    },
    setLoading: ({ commit }, payload) => {
      commit('setLoading', payload)
    },
    setError: ({ commit }, payload) => {
      commit('setError', payload)
    }
  },
  getters: {
    loading: state => state.loading,
    error: state => state.error,
    databases: state => state.databases,
    dbSelected: state => state.databases.filter(db => db.isSelected)
  }
}
