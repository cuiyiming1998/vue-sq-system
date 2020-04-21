<template>
  <div id="app">
      <router-view/>
      <el-container>
      <el-footer>
        <p> 调查问卷自动生成与分析系统 </p>
        <p> Designed by cuiyiming1998</p>
      </el-footer>
      </el-container>
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

<style lang="scss">
html,body,#app {
  min-height: 100%;
  padding: 0;
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #eeeff1;
  position: relative;
  footer{
    box-sizing: border-box;
    height: 50px;
    width: 80%;
    margin: 0 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #cccccc;
    color: #cccccc;
    margin-top: 100px;
    z-index: 1;
    p{
      margin: 0;
      font-size: 0.6em;
    }
  }
}
</style>
