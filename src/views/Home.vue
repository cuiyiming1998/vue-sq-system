<template>
  <div class="home">
      <header-com :active="1"></header-com>
      <new-project v-if="isSaved == false"></new-project>
      <projects v-else></projects>
  </div>
</template>

<script>
import store from '@/store'
import headerCom from '../components/Header'
import newProject from '../components/NewProject'
import projects from '../components/Projects'

export default {
  store,
  name: 'Home',
  data(){
    return {
      isSaved: false,
    }
  },
  methods: {
  },
  components:{
    headerCom,
    newProject,
    projects
  },
  beforeMount: function(){
    this.$store.commit('fresh');
    if(this.$store.state.projects.length > 0){
      this.isSaved = true
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>
