import axios from 'axios'
import store from './../store'

const server = 'http://localhost:3000'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  search_molecule_structures: async (smile) => {
    store.dispatch('setLoading', true)
    console.log('api --chembl')
    let results = []
    let api = 'https://www.ebi.ac.uk/chembl/api/data/substructure/'
    let img2d = 'https://www.ebi.ac.uk/chembl/api/data/image/'
    // let smile = 'CC(=O)Oc1ccccc1C(=O)O'
    let data = await axios.get(api + smile + '?format=json&limit=5000')
      .then(response => response.data.molecules)
      .catch(_ => [])

    let limit = 5000

    for (var i in data) {
      if (i >= limit) { break }
      let mol = {}
      mol.sources = ['chembl']
      mol.isSelected = false
      mol.requests = [smile]
      mol.sourceId = data[i].molecule_chembl_id
      mol.requested = true
      mol.img2d = img2d + mol.sourceId
      mol.img3d = ''
      mol.img = mol.img2d
      mol.name = data[i].pref_name
      mol.formula = data[i].molecule_properties.full_molformula
      mol.smile = data[i].molecule_structures.canonical_smiles
      mol.inchi_key = data[i].molecule_structures.standard_inchi_key
      mol.inchi = data[i].molecule_structures.standard_inchi
      mol.weight = data[i].molecule_properties.mw_freebase
      mol.heavy_atom_count = data[i].molecule_properties.heavy_atoms
      mol.monoisotopic_mass = data[i].molecule_properties.mw_monoisotopic
      mol.id = await axios.get('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/InChIKey/' + mol.inchi_key.trim() + '/cids/txt')
        .then(response => {
          // console.log('suceeeeeeeeeeeeeeeeees')
          console.log(response.data)
          // id = response.data
          return response.data
        })
        .then(await sleep(10))
        .catch((er) => {
          console.log(er)
          console.log(mol.inchi_key)
          // id = mol.sourceId
          return mol.sourceId
        })

      console.log(mol.id)

      if (!isNaN(mol.id)) {
        results.push(mol.id)
      } else {
        results.push(mol.id + '&' + mol.name + '&' + mol.formula + '&' + mol.smile + '&' + mol.inchi_key + '&' +
          mol.inchi + '&' + mol.weight + '&' + mol.heavy_atom_count + '&' + mol.monoisotopic_mass)
      }

      // store.dispatch('addMolecule', mol)
      store.dispatch('setLoading', true)
    }

    let url = server + '/add'
    console.log(url)

    if (results.length > 0) {
      await axios.post(url, { db: 'chembl', frag: smile, res: results.toString() })
        .then(console.log('chembl adding in db '))
        .catch(() => {
          console.log('error')
        })
    }
  }
}
