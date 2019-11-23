import chembl from './../../api/chembl'
import pubchem from './../../api/pubchem'
import axios from 'axios'
import store from './../../store'

const server = 'http://localhost:3000'
// var throttledQueue = require('throttled-queue')
// var throttle = throttledQueue(50000, 2000)

let molInDb = function (a1, a2) {
  let a3 = []
  for (let obj of a2) {
    if (obj.id) {
      a3.push(obj.id)
    }
  }

  if (a3.length === 0) {
    return false
  }

  for (let item of a3) {
    if (a1.includes(item)) {
      return true
    }
  }

  return false
}

export default {
  state: {
    molecules: [],
    molBis: {},
    molSaved: []
  },
  mutations: {
    clearMolecules: (state) => {
      state.molecules = []
      state.molBis = {}
    },
    clearMolSaved: (state) => { state.molSaved = [] },
    setMolSaved: (state, payload) => { state.molSaved = payload },
    setMolecules: (state, payload) => { state.molecules = payload },
    setMolecule: (state, key, value) => { state.molecules[key] = value },
    saveMolecule: (state, payload) => {
      let index = state.molSaved.findIndex(mol => mol.id === payload.id)
      if (index < 0) { state.molSaved.push(payload) }
    },
    addMolecule: (state, payload) => {
      if (payload.id) {
        if (state.molBis[payload.id]) {
          if (!state.molBis[payload.id].requests.includes(payload.requests[0])) {
            payload.requests = state.molBis[payload.id].requests.concat(payload.requests)
          }
          if (!state.molBis[payload.id].sources.includes(payload.sources[0])) {
            payload.sources = state.molBis[payload.id].sources.concat(payload.sources)
          }
        }
        state.molBis[payload.id] = payload
      }
    }
  },
  actions: {
    searchMolecules: async function ({ commit, state }, payload) {
      commit('setLoading', true)
      let names = []
      for (let frag of store.getters.selectedRequests) {
        console.log(frag.name)
        names.push(frag.name)

        let exist = await axios.get(server + '/get/chembl/' + frag.name)
          .then(res => {
            console.log('exist')
            console.log(res.data)
            return res.data
          })
          .catch(() => {
            console.log('error')
            return []
          })

        if (exist.length <= 0) {
          await chembl.search_molecule_structures(frag.name)

        }

        let exist2 = await axios.get(server + '/get/pubchem/' + frag.name)
          .then(res => {
            console.log('exist')
            console.log(res.data)
            return res.data
          })
          .catch(() => {
            console.log('error')
            return []
          })

        if (exist2.length <= 0) {
          await pubchem.search_molecule_structures(frag.name)
        }

      }

      let url = server + '/match/chembl,pubchem/' + names.toString()

      console.log(url)

      state.molecules = await axios.get(url)
        .then(res => {
          console.log('matchinnnnnnnnnnnnnnnnnnng')
          console.log(res.data)
          return res.data
        })
        .catch(() => {
          console.log('error')
          return []
        })

      // commit('setLoading', false)
      console.log('endrequest')
    },
    searchWithPubchem: async function ({ commit, state }, payload) {
      commit('setLoading', true)
      // await pubchem.search_molecule_structures(payload)
      let names = []
      for (let frag of store.getters.selectedRequests) {
        console.log(frag.name)
        names.push(frag.name)

        let exist = await axios.get(server + '/get/pubchem/' + frag.name)
          .then(res => {
            console.log('exist')
            console.log(res.data)
            return res.data
          })
          .catch(() => {
            console.log('error')
            return []
          })

        if (exist.length <= 0) {
          await pubchem.search_molecule_structures(frag.name)
        }
      }

      let url = server + '/match/pubchem/' + names.toString()

      console.log(url)

      state.molecules = await axios.get(url)
        .then(res => {
          console.log('matchinnnnnnnnnnnnnnnnnnng')
          console.log(res.data)
          return res.data
        })
        .catch(() => {
          console.log('error')
          return []
        })

      // commit('setLoading', false)
      console.log('endrequest')
    },
    searchWithChembl: async function ({ commit, state }, payload) {
      commit('setLoading', true)
      console.log('recherche.....')

      let names = []
      for (let frag of store.getters.selectedRequests) {
        console.log(frag.name)
        names.push(frag.name)

        let exist = await axios.get(server + '/get/chembl/' + frag.name)
          .then(res => {
            console.log('exist')
            console.log(res.data)
            return res.data
          })
          .catch(() => {
            console.log('error')
            return []
          })

        if (exist.length <= 0) {
          await chembl.search_molecule_structures(frag.name)
        }
      }

      let url = server + '/match/chembl/' + names.toString()

      console.log(url)

      state.molecules = await axios.get(url)
        .then(res => {
          console.log('matchinnnnnnnnnnnnnnnnnnng')
          console.log(res.data)
          return res.data
        })
        .catch(() => {
          console.log('error')
          return []
        })

      // commit('setLoading', false)
      console.log('endrequest')
    },
    clearMolecules: ({ commit }) => {
      commit('clearMolecules')
    },
    clearMolSaved: ({ commit }) => {
      commit('clearMolSaved')
    },
    setMolSaved: ({ commit }, key, value) => {
      commit('setMolSaved', key, value)
    },
    setMolecule: ({ commit }, key, value) => {
      commit('setMolecule', key, value)
    },
    addMolecule: ({ commit }, payload) => {
      commit('addMolecule', payload)
    },
    saveMolecule: ({ commit }, payload) => {
      commit('saveMolecule', payload)
    }
  },
  getters: {
    molecules: state => state.molecules.filter(mol => molInDb(mol.sources, store.getters.dbSelected)),
    molSaved: state => state.molSaved,
    molSavedSelected: state => state.molSaved.filter(mol => mol.isSelected)
  }
}
