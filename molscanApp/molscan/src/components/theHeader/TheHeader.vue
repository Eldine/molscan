<template>
  <header>
    <div class="container">
      <h2><span>Mol</span>Scan</h2>
      <div class="search-div">
        <div class="ui icon input input-search">
          <input type="text" placeholder="Ajouter un fragment" v-model="newRequest" @keyup.enter="addRequest(newRequest); newRequest = ''">
          <i class="plus brown link icon" @click="addRequest(newRequest); newRequest = ''"></i>
        </div>
        <div class="search-group" @click="search">
          <button class="ui right labeled icon button search-btn">
            Rechercher
          </button>
          <i class="circular inverted search icon"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data: function () {
    return {
      newRequest: ''
    }
  },
  methods: {
    addRequest: function (item) {
      this.$root.$emit('addRequest', item)
    },
    search: function () {
      this.$root.$emit('search')
    }
  }
}
</script>

<style scoped>
#page {
  padding: 10px;
  width: 79em;
  margin: auto;
  opacity: 0.98;
  /*overflow-y: hidden;*/
}

header {
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /*background-image: url('./../assets/a5.jpg') !important;*/
  background-size: 100% 100%;
  box-shadow: 0 0 1px #555;
  padding: 5px 0px 0px 0px !important;
}

.input-search {
  width: 100% !important;
  border-radius: 0px !important;
}

input {
  border-radius: 3px 0 0 3px !important;
  /*border: 0px !important;*/
}

.container {
  width: 77.5em;
  margin: auto;
}

h2 {
  color: #fff;
  float: left;
  margin-top: 5px;
}

h2 span {
  color: #fff;
}

.search-div {
  float: right;
  margin-top: 3px;
  width: 550px;
  display: flex;
  /*height: 5px;*/
  /*background: red*/
}

.search-btn {
  width: 110px;
  background-color: transparent !important;
}

.search-group {
  display: flex;
  border-radius: 0 2px 2px 0;
  background-color: #f8f8f8 !important;
  margin-left: 2px !important;
}

.search-group i {
  margin: 5px 5px 0 0;
}

.search-btn .icon {
  /*background-color:red!important;*/
  margin-left: 100px;
  width: 10px;
  height: 10px;
  float: right;
}

</style>
