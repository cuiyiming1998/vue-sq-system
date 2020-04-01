<template>
    <el-form class="login-container" ref="form" label-position="top" :model="form" :rules="rules" label-width="80px">
        <h1 class="login-title">注册</h1>
        <!-- 通过prop属性设置需要验证的值 -->
        <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证密码" prop="repassword">
            <el-input type="password" v-model="form.repassword" placeholder="确认您的密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <div class="btns">
                <el-button type="primary" @click="signUp('form')">注册</el-button>
        </div>
        <div class="btns">
                <el-button @click="goPre">返回</el-button>
        </div>
    </el-form>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        // 自定义验证规则
        // var rePassword = (rule,value,callback)=>{
        //     if(value !== this.form.password){
        //         callback(new Error('两次密码输入不一致！'));
        //     }else{
        //         callback()
        //     }
        // }
        return {
            form: {
            username: '',
            password: '',
            repassword:'',
            email:'',
            },
            rules: {
                // 对name进行验证
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                // 对password进行验证
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                repassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    // 自定义规则引入
                    // {validator: rePassword}
                ]
            },
        };
    },
    methods:{
        // 注册时发送数据
        signUpPost: function(){
            const self = this;
            axios({
                method: 'post',
                url: '/signup',
                data: {
                    username: self.form.username,
                    password: self.form.password,
                    email: self.form.email
                }
            }).then(function(res){
                if(res.data.code == 1){
                    self.$parent.isSignin = !self.$parent.isSignin;
                    self.$message({
                        type: 'success',
                        message: '注册成功！'
                    })
                }else if(res.data.code == 0){
                    self.$message.error('用户名已存在，请重新注册');
                    self.form.password = self.form.username = self.form.repassword = '';
                }
            })
        },
        // 注册方法
        signUp: function(form){
            this.$refs[form].validate((valid)=>{
                if(valid){
                    // 两次密码输入验证
                    if(this.form.repassword != this.form.password){
                        this.$message.error('两次密码输入不一样！');
                        this.$refs[form].resetFields();
                    }else{
                        // 邮箱验证
                        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                        if(this.form.email != ''){
                            if(mailReg.test(this.form.email)){
                                this.signUpPost();
                            }else{
                                this.$message.error('请输入正确的邮箱格式！')
                                this.$refs[form].resetFields();
                            }
                        }else{
                            this.signUpPost();
                        }
                    }
                }else{
                    return false;
                }
            })
        },
        // 返回方法
        goPre: function(){
            this.$parent.isSignin = !this.$parent.isSignin;
        }
    },
}
</script>

<style lang="scss" scoped>
    .login-container{
        width: 70%;
        position: relative;
    }
    .login-title{
        text-align: center;
    }
    .btns{
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin-bottom: 15px;
        .el-button{
            width:90%;
            margin-left: 0;
        }
    }
</style>