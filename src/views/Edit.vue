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
                            <div class="title">
                                <span>{{index+1}}.</span>
                                <input class="questTitle" type="text" placeholder="请输入题目名称" v-model="questInfo[index].questTitle">
                            </div>
                            <div class="answer">
                                <div v-for="(i,k) in item.answers" :key = k>
                                    <input type="radio" disabled v-if="questInfo[index].type == 'radio'"> 
                                    <input type="checkbox" disabled v-if="questInfo[index].type == 'checkbox'"> 
                                    <input class="answers" type="text" v-model="questInfo[index].answers[k]">
                                </div>
                            </div>
                            <textarea name="textAns" id="textQuest" cols="20" rows="5" v-if="questInfo[index].type == 'text'"></textarea>
                            <el-row class="questBtns">
                                <el-button type="primary" class="delBtn" @click="removeQuest(index)" icon="el-icon-delete" circle></el-button>
                            </el-row>
                        </li>
                    </ul>
                </div>
                <div class="footer" @click="changeOpts">
                    <div v-if="showOpt">
                        <el-button class="addBtns" @click="addOpts('radio')" plain>单选题</el-button>
                        <el-button class="addBtns" @click="addOpts('checkbox')" plain>多选题</el-button>
                        <el-button class="addBtns" @click="addOpts('text')" plain>文字题</el-button>
                    </div>
                    <div v-else>
                        <el-button class="showOpts" @click.stop="showOpts">添加问题</el-button>
                    </div>
                </div>
                <div class="btns">
                    <el-button class="btn" @click="saveQuest">保存问卷</el-button>
                    <el-button type="primary" class="btn publicBtn" @click="publicQuest">发布问卷</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import headerCom from '../components/Header'
import axios from 'axios'

export default {
    props:['id'],
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
        },
        // 删除题目
        removeQuest:function(i){
            this.questInfo.splice(i,1);
        },
        // 保存问卷
        saveQuest:function(){
            let id = this.$route.params.id;
            if(this.projectName == ''){
                this.$alert('请先输入问卷名称','问卷名称不能为空',{
                    confirmButtonText: '好'
                })
            }else if(id>=0){
                window.localStorage.setItem(this.projectName,JSON.stringify(this.questInfo));
                this.$store.commit('updateProjects',{
                    code: 1,
                    id: id,
                    content: this.projectName
                })
                this.$message({
                    message: '恭喜！保存成功！',
                    type: 'success'
                });
                this.$router.go(-1);
            }
            else{
                let questList = this.$store.state.projects;
                // 判断是是否有重复的名称
                if(questList.includes(this.projectName)){
                    this.$alert('名称不能相同','此名称已存在',{
                            confirmButtonText: '好'
                        })
                }else{
                    // 名称不重复，保存
                    window.localStorage.setItem(this.projectName,JSON.stringify(this.questInfo));
                    this.$store.commit('updateProjects',{
                        code: 0,
                        value: this.projectName
                    });
                    this.$message({
                        message: '恭喜！保存成功！',
                        type: 'success'
                    })
                    this.$router.go(-1);
                }
            }
        },
        // 发布问卷
        publicQuest:function(){
            let self = this;
            let time = new Date();
            axios({
                method: 'post',
                url: '/public',
                data:{
                    username: self.$store.state.userInfo.username,
                    projectName: self.projectName,
                    questInfo: JSON.stringify(self.questInfo),
                    time: time.toLocaleString()
                }
            }).then(function(res){
                if(res.data.code == 3){
                    self.$message({
                        type: 'warning',
                        message: '请先填写问卷名哦！'
                    })
                }else if(res.data.code == 2){
                    self.$message({
                        type: 'warning',
                        message: '问卷内容不能为空哦！'
                    })
                }else if(res.data.code == 0){
                    self.$message({
                        type: 'error',
                        message: '服务器错误！请稍后再试'
                    })
                }else if(res.data.code == 1){
                    window.localStorage.removeItem(self.projectName);
                    if(self.$route.params.id != undefined){
                        self.$store.commit('delProject',self.$route.params.id);
                    }
                    self.$message({
                        type: 'success',
                        message: "发布成功！您可以到 '我的发布' 中查看你发布的问卷信息",
                    })
                    self.$router.push({path: '/'})
                }
            })
        }
    },
    beforeMount:function(){
        if(this.$route.params.id >= 0){
            this.projectName = this.$store.state.projects[this.$route.params.id];
            this.questInfo = JSON.parse(window.localStorage.getItem(this.projectName));
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
            background-color: white;
            width: 850px;
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
                .title{
                    font-size: 2em;
                }
                .questList{
                    list-style-type: none;
                    position:relative;
                    padding-bottom: 10px;
                    .questTitle{
                        border: 0;
                        outline: none;
                        font-size: 1.2rem;
                        width:90%;
                    }
                    #textQuest{
                        outline: none;
                        font-size: 1em;
                        width: 90%;
                        margin: 5px auto;
                    }
                    .questBtns{
                        height: 40px;
                        line-height: 40px;
                        display: flex;
                        padding-right: 20px;
                        justify-content: flex-end;
                    }
                }
                .answer{
                    display: flex;
                    flex-direction: column;
                    .answers{
                        height: 40px;
                        line-height: 40px;
                        font-size: 1rem;
                        width: 90%;
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
                    width: 70%;
                }
            }
            .btns{
                margin: 10px 0;
                display: flex;
                justify-content: flex-end;
                .btn{
                    width: 15%;
                    height: 40px;
                    margin-right: 2em;
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