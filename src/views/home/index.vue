<template>
  <div class="boxs">
    <div class="big_box">
      <div class="box_left">
        <!-- 头像 -->
        <div @click="personal">
          <div v-if="!userInfo.userHead" class="headImg">
          <img class="imghead" src="../../assets/vue.svg" alt="" /></div>
<div v-else class="headImg">  <img class="imghead" :src="userInfo.userHead" alt=""></div>
        </div>
        <div class="tab">
          <div  v-for="(item,index) in nab" :key="item.id" class="tab_le">
            <el-icon @click="zhuye"  v-if="item.id==1" 
            :class="{bcolors:ac==1}"
            :size="20" class="colors">
              <ChatRound  />
              <!-- <UserFilled  v-if="item.id==2"/> -->
          
            </el-icon>
            <!-- {{item}} -->
            <el-icon @click="zhuyea" v-if="item.id==2"  :class="{bcolors:ac==2}"  :size="20" class="colors">
              <UserFilled />
            </el-icon>
          </div>
        </div>
      </div>

      <div class="box_right">
        <!-- 子路由 -->
        <router-view />
        <router-view name="RightSidebar"></router-view>
      </div>
    </div>
  </div>
    <!-- 注册组件 -->
    <popo :centerDialogVisible="centerDialogVisible"
  :option="2" :titlse="'个人信息'" @zhuceOpen="zhuceOpen">
</popo>
</template>
<script setup>
import { ref,reactive,computed,onMounted,inject,watch } from 'vue';
// 引入pinia
import{useCounterStore}from'../../store/index'
import {useRouter,useRoute } from 'vue-router'
// let {increment} =storeToRefs(store)
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import popo from '../../login/components/zhucepo.vue'
// let socket = inject("socket");
const route = useRoute();
const store = useCounterStore()
// 获取用户信息

const {userInfo}=storeToRefs(store)

const router=useRouter()

watch(route,
()=>{

if(route.name=='chatwindow'){
  ac.value=1
}else if(route.name=='friend'){
  ac.value=2
}
})
// 链接聊天
onMounted(() => {
// socket.emit("sss",()=>{
// })
            // socket.connected = true; // 默认false， 在和java调试中，
                                        // 需要打开链接 值变为true
            // socket.on("connect", () => {
            //     socket.emit("message",'你好aaaaaaa')

            //     socket.on("message",(res)=>{

            //       console.log(res);
            //     })
            // });
        });
        
const zhuye=()=>{
  ac.value=1
  router.push({name:'chatwindow'})
}
const zhuyea=()=>{
  ac.value=2
  router.push({name:'friend'})
}
// 关闭弹窗
const zhuceOpen=()=>{
centerDialogVisible.value=false
}
const centerDialogVisible = ref(false)
let nab =reactive([{
  id:1,
icon:' <ChatRound />'

},
{
  id:2,
  icon:'<UserFilled />'}
])

let ac=ref(1)

// 用户信息 
const personal=()=>{
  console.log(1);
  centerDialogVisible.value=true
  
}
</script>

<style scoped lang="scss">
.boxs {
  width: 100vw;
  height: 100vh;

  box-sizing: border-box;
  padding: 20px;
  background-color: rgb(184, 118, 38);

  .big_box {
    width: 860px;

    display: flex;
    height: 100%;
    margin: auto;
    background-color: aqua;
    .box_left {
      width: 50px;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
      background-color: #2e2e2e;

     
      .headImg {
        margin-top: 20px;
        width: 40px;
        height: 40px;

        background: #fff;
        .imghead{
          width: 40px;
        height: 40px;
      }
      }
      .tab {
        padding-top: 30px;
      }
      .tab_le {
        height: 40px;
        text-align: center;

        .colors {
          color: #959595;
          cursor: pointer;
          &:hover {
            color: #07c160 !important;
          }
        }

        .bcolors{
color: #07c160;
        }
        
      }
    }
  }

  .box_right {
    width: 100%;
    height: 100%;
    background: red;
  }
}
</style>
