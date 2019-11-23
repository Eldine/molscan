<template>
  <div>
    <div class="container" v-infinite-scroll="loadMore" infinite-scroll-distance="5">
      <TheHeader />
      <div class="page flex">
        <section>
          <div class="ui transparent vertical menu submenu">
            <div class="item" style="padding-top:17px; padding-bottom:17px;background: #FFFAFA;color:#666">
              <strong>Fragments à recherchés </strong>
            </div>
            <div class="item searchs">
              <perfect-scrollbar class="scroll">
                <div class="itemList">
                  <div class="ui checkbox" v-for="(request,index) in requests" :key="index">
                    <input type="checkbox" :id="'box'+index" v-model="request.isSelected">
                    <label :for="'box'+index">{{request.name}} <i class="delete icon" @click="deleteRequest(request)"></i></label>
                  </div>
                </div>
              </perfect-scrollbar>
            </div>
            <label for="file" class="item import-file">
              <i class="arrow red alternate circle up icon"></i>
              Importer</label>
            <input type="file" id="file" @change="importerTexte" style="display:none">
            <a class="item" @click.prevent="clearRequests"><i class="trash alternate outline icon"></i> Tout vider </a>
            <div class="ui dropdown item" @click.stop="hideMenus(); hideMenu2 =  !hideMenu2">{{display3dT}} <i class="dropdown icon"></i>
              <div class="menu" :class="{'transition visible': hideMenu2}">
                <a class="item" @click.stop="display3d = false; hideMenus(); display3dT='Affichage 2D'">Affichage 2D</a>
                <a class="item" @click.stop="display3d = true; hideMenus(); display3dT='Affichage 3D'">Affichage 3D</a>
              </div>
            </div>
          </div>
          <div class="ui transparent vertical menu submenu" style="margin-top:-2px!important; ">
            <div class="item" style="padding-top:12px; padding-bottom:15px;background: #FFFAFA;color:#666">
              <strong>Bases de données chimiques</strong>
            </div>
            <div class="item searchs" style="background: #FFF">
              <div class="itemList">
                <div class="ui checkbox" v-for="(database,index) in databases" :key="index">
                  <input type="checkbox" :id="'database'+index" v-model="database.isSelected">
                  <label :for="'database'+index" style="font-size: 13.5px!important">{{database.name}}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="ui transparent vertical menu submenu" style="margin-top:-2px!important">
            <div class="item" style="padding-top:12px; padding-bottom:15px;background: #FFFAFA;color:#666">
              <strong>Molécules sauvegardées </strong>
            </div>
            <div class="item searchs" style="background: #FFF">
              <perfect-scrollbar class="scroll v2" style="background: #FFF; height: 70px; margin-bottom: 10px">
                <div class="itemList">
                  <div class="ui checkbox" v-for="(mol,index) in molSaved" :key="index">
                    <input type="checkbox" :id="'sav'+index" v-model="mol.isSelected">
                    <label :for="'sav'+index">{{mol.formula}} <i class="delete icon" @click="deleteMolSaved(mol)"></i></label>
                  </div>
                </div>
              </perfect-scrollbar>
              <div class="ui tiny basic icon fluid buttons">
                <button class="ui button" @click="clearMolSaved"><i class="trash alternate outline icon"></i></button>
                <button class="ui button" @click="exportToSDF"><i class="download icon"></i></button>
              </div>
            </div>
          </div>
        </section>
        <div class="results">
          <sui-segment v-if="loading" class="message-result">
            <sui-dimmer active inverted>
              <sui-loader content="Recherche en cours" />
            </sui-dimmer>
          </sui-segment>
          <div class="message-result" v-if="!loading && requests.length > 0 && results.length <= 0 && !firstRequest" style="color:#555">Auncun résultat trouvé pour les fragments sélectionnés</div>
          <div class="message-result" v-if="!loading && requests.length > 0 && results.length <= 0 && firstRequest" style="color:#555">Commencer la recherche en cliquant sur le <br> bouton correspondant ci-dessus</div>
          <div class="message-result" v-if="requests.length == 0 && !loading">Ajouter un nouveau fragment moléculaire dans la liste de vos recherches <br> en renseignant son code smile dans le champ correspondant.</div>
          <masonry :cols="3" :gutter="12" v-if="!loading">
            <div v-for="(mol,index) in results" :key="index">
              <molecule-view is="sui-card" v-if="hiding" :molecule="mol" :index="index" :max="molecules.length" />
              <molecule-view v-else :molecule="mol" :index="index" :max="molecules.length" />
            </div>
          </masonry>
        </div>
      </div>
    </div>
    <moleculeDetail v-if="seeDetail" :molecules="results" :index="detailIndex"></moleculeDetail>
  </div>
</template>
<script>
// import store from './../store'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
import moleculeView from './molecule/Molecule'
import moleculeDetail from './molecule/MoleculeDetail'
import TheHeader from './theHeader/TheHeader'
const Entities = require('html-entities').XmlEntities
const entities = new Entities()

export default {
  name: 'MoleculeSearch',
  components: { moleculeView, InfiniteLoading, moleculeDetail, TheHeader },
  data: function () {
    return {
      page: 0,
      hiding: true,
      strictT: 'Recherche non stricte',
      display3dT: 'Affichage 2D',
      databaseT: 'Rechercher partout',
      display3d: false,
      strict: false,
      newRequest: '',
      database: 'all',
      isNewSearch: false,
      isStrictSearch: false,
      hideMenu1: false,
      hideMenu2: false,
      hideMenu3: false,
      hideMenu4: false,
      nbRequest: 20,
      results: [],
      selectedRequestNames: [],
      detailIndex: 0,
      seeDetail: false,
      firstRequest: true
    }
  },
  computed: {
    loading: function () { return this.$store.getters.loading },
    databases: function () { return this.$store.getters.databases },
    dbSelected: function () { return this.$store.getters.dbSelected },
    requests: function () { return this.$store.getters.requests },
    selectedRequests: function () { return this.$store.getters.selectedRequests },
    molecules: function () { return this.$store.getters.molecules.filter(mol => this.inArray(mol.requests, this.selectedRequestNames)) },
    molSaved: function () { return this.$store.getters.molSaved },
    molSavedSelected: function () { return this.$store.getters.molSavedSelected }
  },
  watch: {
    molecules: {
      handler: function (value) {
        console.log('change:' + value.length)
        this.$store.dispatch('setLoading', false)
        this.setMoleculesDisplay(this.display3d)
        this.updateResults()
      },
      deep: true
    },
    selectedRequests: {
      handler: function (value) {
        // this.selectedRequestNames = []
        // for (let request of value) {
        //   this.selectedRequestNames.push(request.name)
        // }
      },
      deep: true
    },
    requests: {
      handler: function (value) {
        console.log('request change')
        if (this.requests.length === 0) {
          this.$store.dispatch('clearMolecules')
          this.firstRequest = true
        }
        // this.search()
      },
      deep: true
    },
    display3d: function (value) {
      this.setMoleculesDisplay(value)
    }
  },
  methods: {
    updateResults: function () {
      this.results = []
      this.page = 0
      this.loadMore()
    },
    search: function () {
      this.firstRequest = false
      this.selectedRequestNames = []
      for (let request of this.selectedRequests) {
        this.selectedRequestNames.push(request.name)
      }
      this.requests.forEach((request) => {
        if (request.isSelected) {
          console.log('------')
          if (this.databases[0].isSelected && this.databases[1].isSelected && !request.pubchemRequested && !request.chemblRequested) {
            this.$store.dispatch('searchMolecules', request.name)
            // request.pubchemRequested = true
            // request.chemblRequested = true
          } else if (this.databases[1].isSelected && !request.chemblRequested) {
            this.$store.dispatch('searchWithChembl', request.name)
            // request.chemblRequested = true
          } else {
            this.databases[0].isSelected = true
            if (!request.pubchemRequested) { this.$store.dispatch('searchWithPubchem', request.name) }
            // request.pubchemRequested = true
          }
        }
      })
      this.updateResults()
    },
    loadMore: async function () {
      let more = Math.min(this.molecules.length, this.page + 20)
      console.log('infinite: +' + more)
      let cids = []
      let response
      for (let i = this.page; i < more; i++) {
        let mol = this.molecules[i]
        if (mol.requested === false) {
          cids.push(mol.id)
        }
      }

      if (cids.length > 0) {
        let url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + cids.toString() + '/property/MolecularFormula,MonoisotopicMass,IUPACName,CanonicalSMILES,InChIKey,InChI,MolecularWeight'
        response = await axios.get(url)
          .then(response => {
            console.log('suceeeeeeeeeeeeeeeeees')
            return response
          })
          .catch((error) => {
            console.log(error)
            return []
          })
      }
      let index = 0
      for (let i = this.page; i < more; i++) {
        let mol = this.molecules[i]
        index++
        if (response) {
          let property = response.data.PropertyTable.Properties[index]
          if (property) {
            mol.name = property.IUPACName
            mol.formula = property.MolecularFormula
            mol.smile = property.CanonicalSMILES
            mol.inchi_key = property.InChIKey
            mol.inchi = property.InChI
            mol.weight = property.MolecularWeight
            mol.heavy_atom_count = property.HeavyAtomCount
            mol.monoisotopic_mass = property.MonoisotopicMass
          }
        }
        this.results.push(mol)
        this.page++
      }
      this.refreshResults()
      // console.log('nb : +' + this.molecules.length)
    },
    setMoleculesDisplay: function (value) {
      if (value) {
        this.molecules.forEach((molecule) => {
          molecule.img = molecule.img3d
        })
        this.refreshResults()
      } else {
        this.molecules.forEach((molecule) => {
          molecule.img = molecule.img2d
        })
        this.refreshResults()
      }
    },
    displayImgTo2d: function (molecule) {
      molecule.img = molecule.img2d
    },
    displayImgTo3d: function (molecule) {
      molecule.img = molecule.img3d
    },
    addRequest: function (item) {
      // this.molecules = []
      // item = 'O=Cc1ccc(O)c(OC)c1'
      item = entities.encode(item.trim())
      // this.$store.dispatch('clearMolecules')
      let itemInRequests = false
      if (this.requests.length > 0) {
        for (let request of this.requests) {
          if (request.name === item) {
            itemInRequests = true
            console.log('in request')
            break
          }
        }
      }

      if (item !== '' && !itemInRequests) {
        console.log('add-request')
        this.$store.dispatch('addRequest', {
          name: item,
          isSelected: true,
          pubchemRequested: false,
          chemblRequested: false
        })
      }
    },
    deleteRequest: function (request) {
      this.$store.dispatch('setRequests', this.requests.filter(i => i !== request))
    },
    clearRequests: function () {
      this.$store.dispatch('clearRequests')
    },
    importerTexte: function (ev) {
      const file = ev.target.files[0]
      var reader = new FileReader()
      reader.onload = _ => {
        // this.text = reader.result
        let requests = reader.result.split(/[\s,;\t\n]+/)
        console.log(requests)

        requests.forEach((request) => {
          this.addRequest(request)
        })
      }
      reader.readAsText(file)
    },
    refreshResults: function () {
      let app = this
      for (var i = 0; i < 5; i++) {
        setTimeout(function () { app.hiding = true }, i * 20)
        setTimeout(function () { app.hiding = false }, i * 30)
        setTimeout(function () { app.hiding = true }, i * 40)
      }
    },
    hideMenus: function () {
      this.hideMenu1 = false
      this.hideMenu2 = false
      this.hideMenu3 = false
      this.hideMenu4 = false
    },
    inArray: function (a1, a2) {
      this.$store.dispatch('setLoading', true)
      if (a2.length === 0) {
        return false
      }
      if (a2.length > a1.length) {
        return false
      }
      for (let item of a2) {
        if (!a1.includes(item)) {
          return false
        }
      }
      return true
    },
    clearMolSaved: function () { this.$store.dispatch('clearMolSaved') },
    deleteMolSaved: function (mol) {
      this.$store.dispatch('setMolSaved', this.molSaved.filter(i => i !== mol))
    },
    exportToSDF: function () {
      console.log('export--' + this.molSavedSelected.length)
      let mols = []

      for (let mol of this.molSavedSelected) { mols.push(mol.id) }
      if (mols.length > 0) { location.href = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + mols.toString() + '/SDF' }
    },
    documentClick: function (e) {
      this.hideMenus()
    }
  },
  mounted: function () {
    document.addEventListener('click', this.documentClick)
    this.$root.$on('close', _ => { this.seeDetail = false })
    this.$root.$on('seeDetail', (val) => {
      this.detailIndex = val
      this.seeDetail = true
      console.log('val: ' + val)
    })

    this.$root.$on('saveMol', (val) => { this.$store.dispatch('saveMolecule', val) })
    this.$root.$on('addRequest', (val) => { this.addRequest(val) })
    this.$root.$on('search', () => { this.search() })
  },
  destroyed: function () {
    // important to clean up!!
    document.removeEventListener('click', this.documentClick)
  }
}

</script>
<style scoped src="./molScan.css"></style>
<style src="./../assets/css/vue2-perfect-scrollbar.css"></style>
