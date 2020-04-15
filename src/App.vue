<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
import headerCom from './components/Header'

export default {
  name: 'app',
  components:{
  }
}
</script>

<style>
html,body,#app {
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #eeeff1;
}
</style>
