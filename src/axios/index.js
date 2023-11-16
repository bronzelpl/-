

//导入axios
import axios from 'axios'
import { ElMessage } from 'element-plus'
import {getToken,removeToken}from '../utils/auth'

import router from '../router/router'
// let {increment} =storeToRefs(store)
// const router = useRouter(); //方法一


var instance = axios.create({
    baseURL: 'http://172.20.10.7:3000/api',
    timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  });
  instance.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

// s判断是否需要携带token
    if(config.url.includes('/meng')){

      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {


  if(response.data.status===401){
    ElMessage.error('登录已过期，请重新登录！')
    // 移除token
    removeToken()
 
    router.push({ name: 'login' })
    
  }
    // 对响应数据做点什么
    return response.data;


    
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  export default instance