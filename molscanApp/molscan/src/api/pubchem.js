import axios from 'axios'

import store from './../store'

const server = 'http://localhost:3000'
// import Vue from 'vue'

// let cross = 'https://cors-anywhere.herokuapp.com/'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let request = async function (url, ms) {
  let res
  await axios.get(url)
    .then(await sleep(ms))
    .then(response => { res = response })
    .catch(error => {
      res = error.response
    })
  return res
}

export default {
  search_molecule_structures: async (smile) => {
    console.log('api -- pubchem:' + store.getters.requests.length)
    // let code = 'Cc1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5'
    // let code = 'O=Cc1ccc(O)c(OC)c1'
    // let link = 'https://pubchem.ncbi.nlm.nih.gov/search/#query=CC(%3DO)Oc1ccccc1C(%3DO)O&tab=substructure&page=2'
    // let code = 'CC(=O)Oc1ccccc1C(=O)O'
    // let code = 'N#N'
    smile = smile.trim()
    let url1 = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/substructure/smiles/' + smile + '/json?MaxRecords=800000&MaxSeconds=2000'
    let nbRequest = 20
    let pubchemRes = []
    store.dispatch('setLoading', true)
    // let url = server + '/add/pubchem/' + smile + '/' + cids.toString()

    while (nbRequest > 0) {
      let response = await request(url1, 0)
      console.log('ok : ' + response)
      if (response.data.Waiting !== undefined) {
        let key = response.data.Waiting.ListKey
        console.log('1res' + nbRequest + ' : waiting ' + key)
        let wait = 0
        while (nbRequest > 0) {
          store.dispatch('setLoading', true)
          let url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/' + key + '/cids/json'
          response = await request(url, 5000)
          if (response.data.IdentifierList !== undefined) {
            console.log('2res' + nbRequest + ' : success')
            pubchemRes = response.data.IdentifierList.CID
            nbRequest = 0
          } else if (response.data.Waiting !== undefined) {
            console.log('2res' + nbRequest + ' : waiting')
            wait++
            if (wait > 4) { break }
            key = response.data.Waiting.ListKey
            nbRequest--
          } else {
            console.log('2res' + nbRequest + ' : error')
            nbRequest--
            break
          }
        }
      } else {
        console.log('1res' + nbRequest + ' : error')
        nbRequest--
      }
    }

    let cids = pubchemRes
    cids = cids.slice(0,100000)

    console.log(cids.length)

    let url = server + '/add'
    console.log(url)

    let res = cids.toString()

    if (cids.length > 0) {
      await axios.post(url, { db: 'pubchem', frag: smile, res: res })
        .then(console.log('adding in db'))
        .catch(() => {
          console.log('error')
        })
    }
    // for (var j in cids) {
    //   let cid = cids[j]
    //   let mol = {}
    //   let url2 = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + cid + '/PNG?record_type='
    //   mol.id = cid
    //   mol.requests = [smile]
    //   mol.sources = ['pubchem']
    //   mol.img2d = url2 + '2d'
    //   mol.img3d = url2 + '3d'
    //   mol.img = mol.img2d
    //   mol.requested = false
    //   mol.isSelected = false
    // let property = response.data.PropertyTable.Properties[j]
    // mol.name = property.IUPACName
    // mol.formula = property.MolecularFormula
    // mol.smile = property.CanonicalSMILES
    // mol.inchi_key = property.InChIKey
    // mol.inchi = property.InChI
    // mol.weight = property.MolecularWeight
    // mol.heavy_atom_count = property.HeavyAtomCount
    // mol.monoisotopic_mass = property.MonoisotopicMass
    // store.dispatch('addMolecule', mol)
    //   store.dispatch('setLoading', true)
    // }

    return cids.length
  }
}
