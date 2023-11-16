// import VueRouter from 'vue-router'

import {createRouter, createWebHistory} from "vue-router";

import {getToken,removeToken} from "../utils/auth";


// import routes from "./routes"
// 1. 定义路由组件.
// 也可以从其他文件导入

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。


const routes = [
  {path: "/", redirect: {name: "home"}},

  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("../login/index.vue"),
  },
  {path: "/about", component: () => import("../components/aa.vue")},

  // 首页
  {
    path: "/home",
    redirect: {name: "chatwindow"},

    name: "home",
    component: () => import("../views/home/index.vue"),

    // 聊天栏
    children: [
      {
        path: "chatwindow",
        name: "chatwindow",

        component: () => import("../views/chatwindow/index.vue"),
       
        
// 聊天框
        // children: [
        //   {
        //     path: "liaotian",
        //     name: "liaotians",
        //     component: () => import("../views/chatwindow/liaotiankuang.vue"),
        //     props: true
        //   },
        // ],
      },
      {
        path: "friend",
        name: "friend",

        component: () => import("../views/Friends/index.vue"),
      },
    ],
  },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单

var router = createRouter({
  history: createWebHistory(),
  routes,
});

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from, getToken());
  // 判断用户是否登录
  if (!getToken() && to.name !== "login") next({name: "login"});
  // 用户已经登录
  // else if(getToken()&& to.name == "login") next({name:'home'});
  else next()
});

// 后置路由守卫
router.afterEach((to, from) => {
  
// 如果是跳到登录页面，断开链接
  if(to.name=="login"){
    removeToken()
 
  //  scoket.disconnect()
  }
  // sendToAnalytics(to.fullPath)
});

export default router;
