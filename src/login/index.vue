
 <script setup>

import { ref,reactive,computed } from 'vue';


// 引入存储token的方法
import {setToken} from '../utils/auth'


// 引入注册

import zhucepo from './components/zhucepo.vue'

// 引入登录api
import {uploadApi} from '../api/user'

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
// 引入pinia
import{useCounterStore}from'../store/index'

import { storeToRefs } from 'pinia'

import {useRouter} from 'vue-router'
// let {increment} =storeToRefs(store)

const store = useCounterStore()

const router=useRouter()

const dialogVisible=ref(true)
    const closeAvatarDialog=(data)=> {
            dialogVisible.value = false
          }
// 表单组件
const form = reactive({
  userNname: '111',
  passWord: '11111111',

})

// 表单校验
const rules = reactive({
  userNname: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 1, max: 5, message: '用户名不能多于6个字符', trigger: 'blur' },
  ],
  
  passWord: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度不能少于8个字符', trigger: 'blur' },
  ],

})


  const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
       uploadApi(form).then((res)=>{

       if(res.code==200){
        // 登录成功把token存入本地

        setToken(res.token)
        
// 登录成功，调用获取用户信息的接口
        store.increment()
        // 跳转到首页
        router.push({ name: 'home' })
        ElMessage({
    message: '登录成功！',
    type: 'success',
  })
       }else if(res.code==201){
        ElMessage.error('用户不存在！')
       }else if(res.code==202){
        ElMessage.error('密码错误！')

       }

       })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const ruleFormRef = ref()

const name =ref(null)

// 关闭弹窗
const zhuceOpen=()=>{

 
  centerDialogVisible.value=false
}


const centerDialogVisible = ref(false)
</script>


<template>



    <div class="big_box">
   

      <div class="box">

   
     
  <el-form 
  ref="ruleFormRef"
  :rules="rules"
:model="form" 

:hide-required-asterisk="true">
    <el-form-item prop="userNname" label="账号：">
      <el-input clearable  v-model="form.userNname" />
    </el-form-item>
  
    <el-form-item prop="passWord" label="密码：">
      <el-input clearable  show-password v-model="form.passWord" />
    </el-form-item> 
    <!-- <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item> -->
    
 <div class="btn">
  <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
      <el-button  @click="centerDialogVisible = true">注册</el-button>
    </el-form-item>
 </div>
  </el-form>


  
      </div>
   

   {{  name}}
    </div>
    <!-- 注册组件 -->
  <zhucepo :centerDialogVisible="centerDialogVisible"
  
  :option="1" :titlse="'注册孟游账号'" @zhuceOpen="zhuceOpen">

<span>sdsdsd</span>
</zhucepo>

  </template>

<style scoped lang="scss">
.big_box{

  position: relative;
  height:100vh;
  background-image:
   url(https://qq-web.cdn-go.cn/im.qq.com_new/b673bd69/img/video-qq9-poster.9983927f.png.webp) ;
background-size: 100%;
background-repeat: no-repeat;



.box{

  box-sizing: border-box;
  position: absolute;
  left: 30%;
top:50%;
transform: translate(-10%,-70%);
// transform: translateX();

  width: 30vw;
  height: 50vh;
// height: 300px;
padding: 30px;
margin: auto;
background-color: black;

border-radius: 10px;
background: rgba(0,0,0,.5);

}
}

.btn{position: absolute;
  left: 45px;
bottom: 10vh;}
::v-deep(.el-form-item__label) {color: #fff;

font-size: 16px;}
::v-deep(.el-button) {
  // width: 100px;
  margin-right: 20px;
  }
</style>