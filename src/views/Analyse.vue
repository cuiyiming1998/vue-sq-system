<template>
    <div class="container">
        <header-com :active="2"></header-com>
        <div class="main">
            <div class="questions" id="pdfDom">
                <div class="title">
                    <h1> {{projInfo.projectName}} 的调查结果</h1>
                </div>
                <ul>
                    <li v-for="(item,index) in questInfo" :key=index>
                        <h2>
                            <span>
                                {{index+1}}.
                            </span>
                            {{item.title}}
                        </h2>
                        <div v-if="item.type != 'text' " class="stats">
                                <div class="empty" v-if="answers[index].length == 0">
                                    <p>
                                        暂时还没有人回答这道题，快将问卷分享给朋友吧！
                                    </p>
                                </div>
                            <div v-for="(i,k) in answers[index]" :key=k class="percent">
                                <span>{{i.answer}}</span>
                                <span>{{i.count}}人</span>
                                <el-progress :percentage="percentage(i.count,index)" class="bar" ></el-progress>
                            </div>
                        </div>
                        <div v-else>
                            <div class="empty" v-if="answers[index].length == 0">
                                <p>
                                    暂时还没有人回答这道题，快将问卷分享给朋友吧！
                                </p>
                            </div>
                                <span  v-for="(i,k) in answers[index]" :key=k>
                                    <el-tag  v-if="i.answer != '' " class="tags">
                                            {{i.answer}}
                                    </el-tag>
                                </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="save-to-pdf">
                <el-button type='success' @click="getPdf()">将此问卷的结果保存到本地</el-button>
            </div>
        </div>
        <footer-com></footer-com>
    </div>
</template>

<script>
import headerCom from '../components/Header'
import footerCom from '../components/footerCom.vue'
import axios from 'axios'
import echarts from 'echarts'
import 'echarts/lib/chart/bar'

export default {
    data(){
        return {
            projInfo: this.$route.query,
            questInfo: [],  // 问题信息
            answers: [],  // 答案信息
        }
    },
    components:{
        headerCom,
        footerCom
    },
    computed:{
        htmlTitle(){
            return this.projInfo.projectName + '的调查结果'
        }
    },
    methods:{
        percentage(num,index){
            let sum = 0;
            for(let i=0;i<this.answers[index].length;i++){
                sum += this.answers[index][i].count;
            }
            let per = ((num/sum)*100).toFixed(1);
            return parseFloat(per);
        },
        showAns(index,k){
            console.log(this.answers[index][k]);
        }
    },
    created(){
        let self = this;
        axios({
            method: 'get',
            url : '/getAnswer',
            params: {
                projectId: self.projInfo.projectId, // 问卷Id
            }
        }).then((res)=>{
            if(res.data.code == 1){
                // 初始化数据
                let answer = res.data.answer;
                let questions = res.data.questInfo;
                for(let i=0;i<answer.length;i++){
                    for(let j=0;j<answer[i].length;j++){
                        answer[i][j].answer = JSON.parse(answer[i][j].answer);
                    }
                }
                self.questInfo = questions;
                self.answers = answer;
                return answer;
            }
        }).then((answer)=>{
            let questions = self.questInfo; // 问题信息
            let checkboxData = [];
            // 拼接多选题信息
            for(let i=0;i<answer.length;i++){
                for(let j=0;j<answer[i].length;j++){
                    if(typeof(answer[i][j].answer) === "object"){
                        answer[i][j].answer = answer[i][j].answer.join('+');
                    };
                }
            }
        })
    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
    .container{
        .main{
            width: 1000px;
            margin: 40px auto 0 auto;
            background-color: white;
            padding: 20px;
            .title{
                width: 80%;
                margin: 0 auto;
                padding-bottom: 20px;
                border-bottom: 3px solid skyblue;
                h1{
                    text-align: center;
                    margin: 0;
                }
            }
            ul li{
                list-style: none;
                padding: 10px 0;
                .stats{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    .percent{
                        width: 100%;
                        height: 30px !important;
                        line-height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        span{
                            text-align: center;
                            flex: 1;
                        }
                        .bar{
                            flex: 4;
                        }
                    }
                }
            }
        }
        .tags{
            margin: 10px 5px;
            cursor: default;
            transition: all .2s;
        }
        .tags:hover{
            background-color: #409eff;
            color: #fff;
        }
        .empty{
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #aaa;
        }
        .save-to-pdf{
            width: 100%;
            height: 60px;
            line-height: 60px;
            text-align: center;
        }
    }
</style>