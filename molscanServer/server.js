const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const db = require('sqlite-sync');
const port = 3000;

app.use(express.urlencoded({ limit: '1000MB', extended: true, parameterLimit: 1000000, }));

app.use(bodyParser.json({ limit: '1000MB', parameterLimit: 1000000 }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

db.connect('db/sqlite.db');

db.run("CREATE TABLE IF NOT EXISTS Fragments (name TEXT, source TEXT, result TEXT, UNIQUE(name, source));")

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Accept,X-Requested-With,Origin,Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/get/:db/:frag', async (req, res) => {
  if (req.params.db === 'pubchem' || req.params.db === 'chembl') {
    let name = req.params.frag
    let source = req.params.db
    let query = "SELECT * FROM Fragments WHERE name = '" + name + "' AND source = '" + source + "'"
    var rows = db.run(query);
    console.log(rows);
    res.send(rows)
  } else {
    res.send([])
  }
})

app.get('/add/:db/:frag/:res', async (req, res) => {
  if (req.params.db === 'pubchem' || req.params.db === 'chembl') {
    let name = req.params.frag
    let source = req.params.db
    let result = req.params.res
    db.run("INSERT OR IGNORE into Fragments VALUES ('" + name + "','" + source + "','" + result + "')");
    let query = "SELECT * FROM Fragments WHERE name = '" + name + "' AND source = '" + source + "'"
    console.log('add ' + req.params.frag + ' from ' + req.params.db)
    var rows = db.run(query);
    console.log(rows);
    res.send(rows)
  }
})

app.post('/add', async (req, res) => {
  console.log("post------------------------")
  console.log(req.body.res)
  let name = req.body.frag
  let source = req.body.db
  let result = req.body.res
  if (source === 'pubchem' || source === 'chembl') {
    db.run("INSERT OR IGNORE into Fragments VALUES ('" + name + "','" + source + "','" + result + "')");
    let query = "SELECT * FROM Fragments WHERE name = '" + name + "' AND source = '" + source + "'"
    console.log('add ' + name + ' from ' + source)
    var rows = db.run(query);
    console.log(rows);
    res.send(rows)
  }
})


app.get('/match/:dbs/:frags', async (req, res) => {
  let molBis = {}
  // on le cree 2 fois sinon le serveur plente lorque les 2 bases sont requetée
  let molBis2 = {}
  let dbs = req.params.dbs.split(',')
  let frags = req.params.frags.split(',')
  console.log(dbs)
  console.log(frags)
  for (let name of frags) {
    if (dbs.includes('pubchem')) {
      let query = "SELECT * FROM Fragments WHERE name = '" + name + "' AND source = 'pubchem'"
      console.log("search in pubchem db")
      let rows = db.run(query)
      // console.log(rows)
      if (rows.length > 0) {
        let frag = rows[0]
        for (let id of frag.result.split(',')) {
          let mol = buildPubchemMol(id, name)
          if (molBis[mol.id]) {
            if (!molBis[mol.id].requests.includes(mol.requests[0])) {
              mol.requests = molBis[mol.id].requests.concat(mol.requests)
            }
            if (!molBis[mol.id].sources.includes(mol.sources[0])) {
              mol.sources = state.molBis[mol.id].sources.concat(mol.sources)
            }
          }
      //     // console.log(mol)
          if (dbs.includes('chembl')) {
            molBis2[mol.id] = mol
          } else {
            molBis[mol.id] = mol
          }

        }
      }
    }

    if (dbs.includes('chembl')) {
      let query = "SELECT * FROM Fragments WHERE name = '" + name + "' AND source = 'chembl'"
      console.log("search in chembl db")
      let rows = db.run(query)
      if (rows.length > 0) {
        let frag = rows[0]
        for (let id of frag.result.split(',')) {
          let mol = buildChemblMol(id, name)
          if (molBis[mol.id]) {
            if (!molBis[mol.id].requests.includes(mol.requests[0])) {
              mol.requests = molBis[mol.id].requests.concat(mol.requests)
            }
            if (!molBis[mol.id].sources.includes(mol.sources[0])) {
              mol.sources = state.molBis[mol.id].sources.concat(mol.sources)
            }
          }
          // console.log(mol)
          molBis[mol.id] = mol
        }
      }
    }

  }

  let mol2 = []

  if (dbs.includes('chembl') && dbs.includes('pubchem')) {
    mol2 = Object.values(molBis)
  }

  let molecules = Object.values(molBis)

  molecules = molecules.concat(mol2)

  let results = molecules.filter(mol => allofA2inA1(mol.requests, frags))
  res.send(results.slice(0, 1000))
  console.log(molecules.length + " résultats trouvés")
})

var buildPubchemMol = function (id, name) {
  let mol = {}
  mol.id = id
  let url2 = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + mol.id + '/PNG?record_type='
  mol.requests = [name]
  mol.sources = ['pubchem']
  mol.img2d = url2 + '2d'
  mol.img3d = url2 + '3d'
  mol.img = mol.img2d
  mol.requested = false
  return mol
}

var buildChemblMol = function (id, name) {
  if (!isNaN(id)) {
    let mol = {}
    mol.id = id
    let url2 = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + mol.id + '/PNG?record_type='
    mol.requests = [name]
    mol.sources = ['chembl']
    mol.img2d = url2 + '2d'
    mol.img3d = url2 + '3d'
    mol.img = mol.img2d
    mol.requested = false
    return mol
  } else {
    let mol = {}
    let img2d = 'https://www.ebi.ac.uk/chembl/api/data/image/'
    let results = id.split("&")
    // console.log('results' + results)
    mol.sources = ['chembl']
    mol.isSelected = false
    mol.requests = [name]
    mol.requested = true
    mol.id = results[0]
    mol.img2d = img2d + mol.id
    mol.img3d = ''
    mol.img = mol.img2d
    mol.name = results[1]
    mol.formula = results[2]
    mol.smile = results[3]
    mol.inchi_key = results[4]
    mol.inchi = results[5]
    mol.weight = results[6]
    mol.heavy_atom_count = results[7]
    mol.monoisotopic_mass = results[8]
    return mol
  }
}

var allofA2inA1 = function (a1, a2) {
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
}

app.listen(port)
console.log(`Listening at http://localhost:${port}`)
