import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);

const store = new Vuex.Store({
    // data
    state:{
        userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
        projects: []
    },
    // 计算属性
    getters:{

    },
    // methods
    mutations:{
        // 获取用户的登录信息
        setUserInfo: (state,value)=>{
            state.userInfo = value;
            window.localStorage.setItem('userInfo',JSON.stringify(value));
        },
        // 登出清除登录状态
        logout:(state)=>{
            state.userInfo = null;
            window.localStorage.removeItem('userInfo');
        },
        updateProjects:(state,value)=>{
            // 如果重新编辑
            if(value.code == 1){
                state.projects[value.id] = value.content;
            }else{
                state.projects.push(value.value)
            }
            window.localStorage.setItem('projects',JSON.stringify(state.projects))
        },
        // 删除项目更新项目列表
        delProject:(state,value)=>{
            state.projects.splice(value,1);
            window.localStorage.setItem('projects',JSON.stringify(state.projects));
        },
        // 刷新主页面重新获取项目列表
        fresh: (state)=>{
            if(window.localStorage.getItem('projects')){
                state.projects = JSON.parse(window.localStorage.getItem('projects'));
            }
        }
    },
    // 异步方法
    actions:{

    },
    // 模块
    modules:{

    }
})

export default store;