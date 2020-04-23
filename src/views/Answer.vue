<template>
    <div>
        <header-com :active="4"></header-com>
        <div class="main">
            <div class="title">
                <h1>{{projInfo.projectName}}</h1>
                <div class="thanks">
                    <p>感谢您抽出宝贵时间参与我们的调查!</p>
                    <p>发起者：{{projInfo.username}}</p>
                </div>
            </div>
            <ul class="questList">
                <!-- 循环问题列表 -->
                <li v-for="(item,index) in questions" :key=index>
                    <div class="questTitle">
                        <span>{{index+1}}.</span>
                        {{item.title}}
                    </div>
                    <!-- 循环选项列表 -->
                    <div v-if="item.type == 'radio' ">
                        <el-radio-group v-model="answers[index]" class="inputs">
                            <el-radio v-for="(i,k) in item.answers" :key=k :label="i">{{i}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-if="item.type == 'checkbox'">
                        <el-checkbox-group v-model="answers[index]" class="inputs">
                            <el-checkbox v-for="(i,k) in item.answers" :key=k :label="i"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <textarea name="textAns" v-model="answers[index]" id="textQuest" cols="100" rows="5" v-if="item.answers == null"></textarea>
                </li>
            </ul>
            <div class="answerBtn">
                <el-button class="answer" type="primary" @click="submit">提交问卷</el-button>
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
            projInfo: this.$route.query, // 回答的问卷信息
            questions: [], // 问题信息
            answers: [], // 答案信息
        }
    },
    methods:{
        // 用户提交问卷
        submit:function(index){
            let self = this;
            axios({
                method: 'post',
                url: '/submitAnswer',
                data:{
                    author: self.projInfo.username, // 问卷发起者
                    projectName: self.projInfo.projectName, // 问卷名
                    questions: self.questions, // 问题
                    answer: self.answers, // 作答信息
                    username: self.$store.state.userInfo.username // 作答者
                }
            }).then((res)=>{
                // 提交成功
                if(res.data.code == 1){
                    self.$message({
                        message: '提交成功！感谢您的参与!',
                        type: 'success'
                    })
                    self.$router.go(-1);
                }else{
                    // 提交失败
                    self.$message({
                        message: '服务器走神了，稍后再试!',
                        type: 'error'
                    })
                }
            })
        },
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
                projectName: self.projInfo.projectName,
            }
        }).then((res)=>{
            self.questions = res.data.questions;
            // 将多选题的答案类型初始化为数组
            for(let i=0;i<self.questions.length;i++){
                if(self.questions[i].type == 'checkbox'){
                    self.answers[i] = [];
                }else{
                    self.answers[i] = '';
                }
            }
        })
    }
}
</script>

<style lang="scss" scoped>
    .main{
        width: 850px;
        margin: 30px auto 0 auto;
        padding-bottom: 20px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h1{
            margin: 0;
        }
        .title{
            width: 90%;
            padding-top: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-bottom: 3px solid skyblue;
            p{
                margin: 10px auto;
                color: #aaa;
            }
        }
        .questList{
            width: 90%;
            margin: 30px auto 0 auto;
            padding: 0;
            list-style: none;
            border-bottom: 1px solid #ccc;
            li{
                padding: 20px;
                .questTitle{
                    width: 100%;
                    margin-bottom: 20px;
                    font-size: 1.2em;
                    font-weight: bold;
                    span{
                        font-size: 0.8em;
                    }
                }
            }
            .inputs{
                display: flex;
                flex-direction: column;
                .el-checkbox , .el-radio{
                    margin: 6px 0;
                }
            }
        }
        .answerBtn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            margin-top: 40px;
            text-align: center;
            .answer{
                width: 50%;
            }
        }
    }
</style>