<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: serif;
}

body{
  background: linear-gradient(to bottom, rgba(148, 162, 198, .6) 0%,rgba(151,198,255,0) 100%);
  /*background: linear-gradient(to bottom, rgba(26,26,26,.0) 0%,rgba(50,50,50,.1) 100%);*/
  /*background-image: url('./assets/bg1.jpg');*/
  /*background: #eee;*/
  background-size: 100% 100%;
  background-attachment:  fixed;
  /*height: 100%!important;*/
  overflow: auto;
}

</style>
