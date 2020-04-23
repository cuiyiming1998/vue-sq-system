<template>
    <div>
        <header-com :active="2"></header-com>
        <div class="main" v-if="isPublic">
            <ul>
                <li v-for="(item,index) in projects" :key=index>
                    <div class="items">
                        <div class="content">
                            <p>{{item.projectName}}</p>
                            <span>
                                <i class="el-icon-time"></i>
                                {{item.time}}
                            </span>
                        </div>
                        <div class="btn">
                            <el-button type="danger" @click="deleteProj(item.projectName,index)" plain> 删除问卷 </el-button>
                            <el-button @click="toAnalyse(item.projectName)"> 查看结果 </el-button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="tip" v-else>
            <h1>您还没有发布过项目哦</h1>
            <h2>快去创建并发布吧</h2>
        </div>
    </div>
</template>

<script>
import headerCom from '../components/Header'
import axios from 'axios'

export default {
    data(){
        return {
            projects:[], // 获取的问卷列表
            isPublic: true // 用户是否有发布的问卷
        }
    },
    methods:{
        // 前往分析界面
        toAnalyse: function(projectName){
            this.$router.push({
                path:'/analyse',
                query:{
                    username: this.$store.state.userInfo.username,
                    projectName: projectName
                }
            })
        },
        // 删除发布的信息
        deleteProj: function(name,index){
            this.$confirm('确认要删除此已发布的问卷吗','提示',{
                confirmButtonText: '是',
                cancelButtonText: '再想想',
                type: 'warning'
            }).then(()=>{
                let self = this;
                axios({
                    method: 'post',
                    url: '/deletePubProj',
                    data:{
                        id: self.projects[index].projectId,
                        username: self.$store.state.userInfo.username,
                        projectName: name
                    }
                }).then((res)=>{
                    self.projects.splice(index,1);
                    if(self.projects.length == 0){
                        self.isPublic = false;
                    }
                })
            })
        }
    },
    components:{
        headerCom
    },
    beforeCreate(){
        let self = this;
        axios({
            method: 'post',
            url: '/myPublic',
            data:{
                username:self.$store.state.userInfo.username
            }
        }).then((res)=>{
            if(res.data.code == 1){
                self.projects =  res.data.publicData;
                self.isPublic = true;
            }else{
                self.isPublic = false;
            }
        })
    },
}
</script>

<style lang="scss" scoped>
    .main{
        margin: 0 auto;
        width: 80%;
        background-color: white;
        padding-bottom: 10px;
        ul{
            margin: 0 0;
            padding-left: 40px;
            padding-right: 40px;
            li{
                box-sizing: border-box;
                list-style: none;
                border-bottom: 1px solid #eaeaea;
                .items{
                    display: flex;
                    flex-direction: row;
                    .content{
                        width: 70%;
                        p{
                            font-size: 1.5em;
                            color:  #484848;
                            cursor: pointer;
                        }
                        p:hover{
                            color: #4876ff;
                        }
                        span{
                            color: #aaaaaa;
                            margin-top:10px;
                            margin-right:20px;
                        }
                    }
                    .btn{
                        display: flex;
                        width: 30%;
                        justify-content: flex-end;
                        align-items: center;
                    }
                }
            }
        }
    }
    .tip{
        height: calc(100vh - 231px);
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: gray;
        cursor: default;
    }
</style>