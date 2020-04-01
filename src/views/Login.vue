<template>
<div class="main">
    <div class="legend">
        <h1>AQ-System</h1>
    </div>
    <div class="main-box">
        <div class="login-box">
                <login-box v-if="isSignin" key="1"></login-box>
                <signup-box v-else key="2"></signup-box>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import LoginBox from '../components/LoginBox.vue'
import SignupBox from '../components/SignupBox.vue'
import 'animate.css'

export default {
    data:()=>{
        return{
            isSignin: true
        }
    },
    components:{
        LoginBox,
        SignupBox,
    }
}
</script>

<style lang="scss" scoped>
    .main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-image: linear-gradient(#3b5999,white);
        // animation: bganimation 15s infinite;
        .legend{
            position: absolute;
            left:0;
            top:0;
        }
    }
    .main-box{
        background: #fff;
        box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        flex-direction: row;
        width: 460px;
        max-width: 100%;
        min-height: 55vh;
    }
    .login-box{
        background: #fff;
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
</style>