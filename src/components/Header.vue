<template>
    <div>
    <el-container>
        <el-header height="60">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#409eff">
                <el-menu-item index="1">我的项目</el-menu-item>
                <el-menu-item index="2">我的发布</el-menu-item>
                <el-menu-item index="3">回收站</el-menu-item>
                <el-menu-item index="4" disabled>消息中心</el-menu-item>
                <el-menu-item index="5" class="rightBtn" @click="toLogin">退出登录</el-menu-item>
            </el-menu>
        </el-header>
    </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '1',
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        toLogin(){
            //触发store中logout方法，清除本地存储状态
            this.$store.commit('logout');
            this.$message({
                message: '退出登录成功',
                type: 'success'
            })
            this.$router.push({path:'/login'})
            console.log(this.$store.state.userInfo);
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-header{
        padding: 0 0;
        .rightBtn{
            float: right;
        }
    }
</style>