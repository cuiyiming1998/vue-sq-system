<template>
    <div>
        <header-com :active="4"></header-com>
        <div class="main">
            <ul>
                <li v-for="(item,index) in projects" :key=index>
                    <div class="items">
                        <div class="content">
                            <p>{{item.projectName}}</p>
                            <span>
                                <i class="el-icon-user"></i>
                                发起者：{{item.username}}
                            </span>
                            <span>
                                <i class="el-icon-time"></i>
                                时间：{{item.time}}
                            </span>
                        </div>
                        <div class="btn">
                            <el-button> 立即参与 </el-button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="block">
                <el-pagination
                    layout="prev, pager, next"
                    :total="1">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import headerCom from '../components/Header'

export default {
    data(){
        return {
            projects:[]
        }
    },
    methods:{

    },
    components:{
        headerCom
    },
    beforeMount(){
        const self = this;
        axios({
            method: 'get',
            url: '/square',
        }).then((res)=>{
            self.projects = res.data;
        })
    }
}
</script>

<style lang="scss" scoped>
    .main{
        margin: 0 auto;
        width: 80%;
        background-color: white;
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
                            font-size: 1.4em;
                            color:  #484848;
                            cursor: pointer;
                        }
                        p:hover{
                            color: #4876ff;
                        }
                        span{
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
        .block{
            text-align: center;
        }
    }
</style>