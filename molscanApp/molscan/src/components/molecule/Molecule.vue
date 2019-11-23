<template>
    <div :title='molecule.name' class='ui card msrItem'>
      <img :src="molecule.img" class="mol-img" @click="seeDetail" style="border-radius: 0px!important;" />
      <sui-label class="save-label" size="mini" color="grey" slot="corner" corner="right" @click="save">
        <sui-icon name="save" class="save" />
      </sui-label>
      <sui-card-content style="border: 0px">
        <sui-card-header> {{molecule.formula}} </sui-card-header>
        <sui-card-meta> {{ molecule.sources.length > 1 ? "sources" : "source" }}: {{molecule.sources.toString()}} </sui-card-meta>
        <sui-card-meta> Poids : {{molecule.id}} g/mol</sui-card-meta>
        <span class="mol-num"> {{index+1}} / {{max}} </span>
        <sui-card-description></sui-card-description>
      </sui-card-content>
    </div>
</template>
<script>
export default {
  props: {
    molecule: Object,
    index: Number,
    max: Number
  },
  methods: {
    seeDetail: function () {
      // console.log('detail:' + this.index)
      this.$root.$emit('seeDetail', this.index)
    },
    save: function () {
      this.molecule.isSelected = false
      let molecule = {}
      molecule.id = this.molecule.id
      molecule.formula = this.molecule.formula
      molecule.isSelected = false
      this.$root.$emit('saveMol', molecule)
    }
  }
}

</script>
<style>

.scroll2 {
  /*background: #fff;*/
  font-weight: bolder;
  font-size: 16px;
  /*width: 200px;*/
  height: 22px;
  /*margin-left: -2px;*/
  max-height: 200px;
}


.mol-num {
  float: right;
  font-size: 12px;
}

.mol-img {
  background-color: #f9f9f9;
}

.msrItem {
  /*border-radius: 2px;*/
  background-color: rgba(255, 255, 255, .98);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, .2) !important;
  color: #444;
  font-family: 'brandon' !important;
  width: 100% !important;
  height: 330px;
  border-radius: 0 !important;
  margin: 0px !important;
  margin-bottom: 15px !important;
}

.card-meta {
  word-break: break-all;
}

.save-label {
  display: none !important;
  cursor: pointer !important;
}

.save-label .save {
  cursor: pointer !important;
}

.msrItem:hover {
  background-color: #87CEFA !important;
}

.msrItem .mol-img {
  cursor: pointer;
  height: 220px;
  margin: 10px 10px 5px 10px;
}

.msrItem:hover .save-label {
  display: block !important;
}

</style>
