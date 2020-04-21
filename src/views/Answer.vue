<template>
    <div>
        <header-com :active="4"></header-com>
        <h1>{{projInfo.projectName}}</h1>
    </div>
</template>

<script>
import axios from 'axios'
import headerCom from '../components/Header'

export default {
    data(){
        return {
            projInfo: this.$route.query, // 回答的问卷信息
        }
    },
    methods:{

    },
    components:{
        headerCom
    },
    beforeMount(){
        let self = this;
        axios({
            method: 'get',
            url: '/getProject',
            params:{
                username: self.projInfo.username,
                projectName: self.projInfo.projectName
            }
        })
    }
}
</script>

<style lang="scss" scoped>

</style>