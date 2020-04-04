<template>
    <div>
        <header-com :active="1"></header-com>
        <div class="edit">
            <div class="editor">
                <div class="header">
                    <input type="text" class="title" placeholder="问卷题目" v-model="projectName">
                </div>
                <div class="main">
                    <ul class="questList" v-if="questInfo.length != 0">
                        <li v-for="(item,index) in questInfo" :key=index>
                            <div style="text-align: center">
                                <span>{{index+1}}.</span>
                                <input class="questTitle" type="text" placeholder="请输入题目名称" v-model="questInfo[index].questTitle">
                            </div>
                            <!-- 选中单选框 -->
                            <div class="radio" v-if="questInfo[index].type == 'radio'">
                                <div v-for="(i,k) in item.answers" :key=k >
                                    <input type="radio" disabled> 
                                    <input class="radios" type="text" v-model="questInfo[index].answers[k]">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="footer" @click="changeOpts">
                    <div v-if="showOpt">
                        <el-button class="addBtns" @click="addOpts('radio')" plain>单选题</el-button>
                        <el-button class="addBtns" plain>多选题</el-button>
                        <el-button class="addBtns" plain>文字题</el-button>
                    </div>
                    <div v-else>
                        <el-button class="showOpts" @click.stop="showOpts">添加问题</el-button>
                    </div>
                </div>
                <div class="btns">
                    <el-button class="btn">保存问卷</el-button>
                    <el-button type="primary" class="btn publicBtn">发布问卷</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import headerCom from '../components/Header'

export default {
    data:()=>{
        return{
            projectName: '',
            questInfo: [],
            checked: null,
            showOpt: false,
        }
    },
    components:{
        headerCom,
    },
    methods:{
        showOpts: function(){
            this.showOpt = !this.showOpt;
        },
        changeOpts: function(){
            if(this.showOpt){
                this.showOpt = !this.showOpt;
            }
        },
        // 添加题目
        addOpts:function(type){
            // 类型为单选或者多选
            if(type == 'radio' || type == 'checkbox'){
                this.questInfo.push(
                    {
                        questTitle: '请输入题目',
                        type: type,
                        answers:['选项1','选项2','选项3']
                    }
                )
            }
            // 类型是文本
            else{
                this.questInfo.push({
                    questTitle: '请输入题目',
                    type: type
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    input{
        border: 0;
        outline: none;
    }
    .edit{
        display: flex;
        justify-content: center;
        .editor{
            width: 80vw;
            margin-top: 50px;
            border: 1px solid gray;
            display: flex;
            flex-direction: column;
            .header{
                width: 95%;
                height: 70px;
                line-height: 70px;
                margin: 0 auto;
                text-align: center;
                border-bottom: 1px solid gray;
                display: flex;
                justify-content: center;
                .title{
                    outline: none;
                    border: 0;
                    font-size: 1.5rem;
                    text-align: center;
                }
            }
            .main{
                margin-top: 20px;
                margin-left: 10px;
                margin-right: 10px;
                .questList{
                    list-style-type: none;
                    .questTitle{
                        border: 0;
                        outline: none;
                        font-size: 1rem;
                        width: 600px;
                        text-align: center;
                    }
                }
                .radio{
                    display: flex;
                    flex-direction: column;
                    .radios{
                        height: 40px;
                        line-height: 40px;
                        font-size: 1rem;
                    }
                }
            }
            .footer{
                width: 95%;
                height: 60px;
                line-height: 60px;
                text-align: center;
                border-bottom: 1px solid gray;
                margin: 0 auto;
                .addBtns{
                    animation: flash .2s linear;
                }
                .showOpts{
                    width: 600px;
                }
            }
            .btns{
                margin: 10px 0;
                display: flex;
                justify-content: flex-end;
                .btn{
                    width: 100px;
                    height: 40px;
                    margin-right: 50px;
                }
            }
        }
    }
    @keyframes flash {
        0% {
            opacity: 0;
            margin:0 20px;
        }
        50% {
            opacity: .3;
            margin:0 15px;
        }
        100% {
            opacity: 1;
            margin: 0 10px;
        }
        
    }
</style>