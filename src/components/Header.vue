<template>
    <el-header height="70">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff">
            <el-menu-item index="1" @click="toMain">我的项目</el-menu-item>
            <el-menu-item index="2">我的发布</el-menu-item>
            <el-menu-item index="3">回收站</el-menu-item>
            <el-menu-item index="4" disabled>消息中心</el-menu-item>
            <el-menu-item index="5" class="rightBtn" @click="Logout">退出登录</el-menu-item>
        </el-menu>
    </el-header>
</template>

<script>
export default {
    props:['active'],
    data() {
        return {
            activeIndex: this.active.toString(),
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        Logout(){
            //清除本地存储
            this.$store.commit('logout');
            this.$message({
                message: '退出登录成功',
                type: 'success'
            })
            this.$router.push({path:'/login'})
        },
        toMain(){
            this.$router.push({path: '/'})
        }
    },
    beforeMount:function(){
    }
}
</script>

<style lang="scss" scoped>
    .el-header{
        width: 100vw;
        padding: 0 0;
        .rightBtn{
            float: right;
        }
    }
    .el-menu-demo{
        height: 70px;
        line-height: 70px;
    }
    .el-menu--horizontal > .el-menu-item{
        height: 70px;
        line-height: 70px;
    }
</style>