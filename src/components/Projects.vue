<template>
    <el-main>
        <div class="container">
            <el-button class="projects" @click="newEdit">
                <i class="el-icon-folder-add"></i>
                <h2>创建新项目</h2>
            </el-button>
            <el-button class="projects" v-for="(item,index) in projects" :key = index @click="toEdit(index)">
                <i class="el-icon-edit-outline"></i>
                <h2>
                    {{ item }}
                </h2>
            </el-button>
        </div>
    </el-main>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'

export default {
    data:()=>{
        return{

        }
    },
    computed: mapState([
        'projects'
    ]),
    methods:{
        newEdit:function(){
            this.$router.push({path:'/edit'})
        },
        toEdit:function(index){
            this.$router.push({
                name: 'Edit',
                params: {
                    id: index
                }
            })
        }
    },
    beforeMount(){
        console.log(this.projects)
    }
}
</script>

<style lang="scss" scoped>
    .el-main{
        width: 100%;
        padding: 2%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .container{
            width: 80%;
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            flex-wrap: wrap;
            .projects{
                width:21%;
                height: 200px;
                margin: 2%;
                border: 1px solid black;
                box-sizing: border-box;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                i{
                    font-size: 4em;
                }
            }
        }
    }
</style>