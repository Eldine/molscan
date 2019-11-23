<template>
  <div class="dimmer">
    <sui-icon class="close-icon" name="close inverted" size="big" @click="close" />
    <article v-if="molecule">
      <img :src="molecule.img" class="molimg" style="border-radius: 0px!important;" />
      <section>
        <p><strong>Nom <br> </strong>{{molecule.name}}</p>
        <p><strong>Formule chimque <br> </strong>{{molecule.formula}}</p>
        <p><strong>Smile <br> </strong>{{molecule.smile}}</p>
        <p><strong>Inchi <br> </strong>{{molecule.inchi}}</p>
        <p><strong>InchiKey <br> </strong>{{molecule.inchi_key}}</p>
        <p><strong>Poids <br> </strong>{{molecule.weight}} g/mol</p>
        <p><a :href="jsmol"  target="_blank">Visualiser en 3D</a></p>
        <p>
          <strong>
            {{ molecule.sources.length > 1 ? "sources" : "source" }} <br>
          </strong>{{molecule.sources.toString()}}
        </p>
      </section>
    </article>
  </div>
</template>
<script>
export default {
  props: {
    molecules: Array,
    index: Number
  },
  data: function () {
    return {
      molecule: this.molecules[this.index],
      jsmol: 'https://chemapps.stolaf.edu/jmol/jmol.php?model=' + this.molecules[this.index].smile
    }
  },
  methods: {
    close: function () {
      this.$root.$emit('close')
    }
  }
}

</script>
<style scoped>
.dimmer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000000;
  background-color: rgba(0, 0, 0, .95);
  background-size: 100% 100%;
  overflow: auto;
}

article {
  display: flex;
  width: 80%;
  height: 80%;
  margin: 5% auto;
  /*padding: 10px 10px;*/
  background-color: white;
  /*background: linear-gradient(rgba(0,0,0,.9), rgba(5,5,5,.9), rgba(0,0,0,.9)) ;*/
  /*background: linear-gradient(#000,#555) ;*/
  transform: translateY(0%);
}

.molimg {
  width: 70%;
  height: 100%;
  background-color: #f9f9f9;
}

section {
  background: white;
  width: 30%;
  height: 100%;
  padding: 10px;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  word-break: break-all;
  overflow-y: auto;
}

section p {
  font-size: 18px;
}

.close-icon {
  position: absolute;
  cursor: pointer;
  right: 5px;
  top: 10px;
}

</style>
