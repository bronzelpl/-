<template>
  <div>
    <p class="title">
      <span>{{ dataUser.fuserName }}</span>
    </p>
  </div>
  
 <div v-if="increase" class="tianjia">

    <div><img :src="dataUser.fuserHead" alt="">
      <span>添加对方为微信好友</span>
      <el-button @click="kapUser" type="success">添加</el-button>
    </div>
  </div>
  <div @mousewheel="gundong" class="box" ref="box" :class="{ boxtow: shownav == 2 }">

    <ul>
      <li v-show="ffg">没有更多了</li> 
   <!-- 发送人的消息  -->
   <li class="left">
        <span class="time">{{ dataUser.time }}</span>
        <div class="left_box">
          <img src="" alt="" />
          <p class="left_nei">{{ dataUser.text }}</p>
        </div>
      </li> 

      <li v-for="(item, index) in chatObject" :key="index">

        <!-- 如果发送人的id和当前用户的id -->
   <li v-show="item.tid == store.userInfo.id" class="left">
        <span class="time">2022.13.22</span>
        <div class="left_box">
          <img src="" alt="" />
          <p class="left_nei">{{ item.data.res }}</p>
        </div>
      </li>

      <li v-show="item.fid == store.userInfo.id && item.tid
        == dataUser.id" class="right">
        <div class="right_box">
          <p class="left_nei">{{ item.data.res }}</p>
          <img src="" alt="" />
        </div>
      </li>

      </li>

    </ul>
  </div>
  <!-- <AgoraVideo :dataUser="props.dataUser" :socket="socket" 
  /> -->
  <div class="fason">
    <div class="ziti">
      <span>
        <i class="iconfont icon-smiling"></i>
        <i class="iconfont icon-wenjianjia"></i>

        <i class="iconfont icon-jianqie"></i>
      </span>

      <span class="rigth">
        <i class="iconfont icon-24gl-telephone"></i>
        <i @click="shipin" class="iconfont icon-video"></i>
      </span>
    </div>
    <el-input @keydown.enter.prevent="fasong(1)" @focus="fsfs" v-model="desc" type="textarea" resize="none" />


    <div class="fdf">发送·1</div>
  </div>
</template>

<script setup>

import AgoraVideo from '../../components/AgoraVideo.vue'
import { onMounted, ref, watch, inject, reactive, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { chatFriends } from "../../api/user";
import { useCounterStore } from "../../store/index";


import { ElMessage, ElMessageBox } from "element-plus";
import socket from "../../utils/scoket";


const store = useCounterStore();

const props = defineProps(["dataUser", "socket", 'userNews','bbc', 'toi']);
const nums = ref(props.dataUser.id)

const uid=props.dataUser.id
const emit = defineEmits(['zuijin', "messages",'guans'])
const route = useRoute();
const increase = ref(false)
let ffg = ref(false)
let chatObject = ref([])
// 获取到聊天信息框
const box = ref()

onMounted(() => {

  crollToBottom()
})
// 发送信息，页面保持在最底部
const crollToBottom = () => {

  nextTick(() => {
    box.value.scrollTo({
      top: box.value.scrollHeight,
      behavior: 'instant'
    });
  })


}

// 打开本地视频聊天框
const shipin=()=>{
  emit('guans')
    
}

let gnb=ref(true)
const desc = ref('');
const shownav = ref(props.dataUser.status)

const fsfs=()=>{
  // id传过去

socket.emit('fafa',props.dataUser.id)
}
// 发送按钮
const fasong = (id) => {

  if (desc.value.length == 0 && id == 1) return ElMessage({
    message: "不能发送空白消息",
    type: "warning",
  });
  // 消息载体
  let news = {
    fid: store.userInfo.id,//发送人的id
    tid: props.dataUser.id,//接收人的id
    data: {
      res: id == 1 ? desc.value : '我同意了你的好友请求！',//实际消息
      status: 1//消息类型 文字1，图片2，文件3
    },//消息载体
    num:10,
    time: +new Date//发送时间
  }

  // 这是发送信息接口
  props.socket.emit("fasong", news,store.userInfo)
  crollToBottom()
  das.value=true
  // 这里把用户的发送信息存入userNews
  emit('messages', news)
  // 清空聊天框
  desc.value = ''



}

let sd = ref(1)
let hum = ref(0)

// 没有聊天数据后调用事件到顶部
socket.on('tiaoaa',()=>{
  gnb.value=false
  nextTick(() => {
      box.value.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    })
})
// 滚动事件
const gundong = () => {


  
  // 禁止滚动到底部


  sd.value = 2
  if (box.value.scrollTop == 0) {
    hum.value++
if(gnb.value==true){
  notes(hum.value, 3)

   
    nextTick(() => {
      box.value.scrollTo({
        top: 100,
        behavior: 'instant'
      });
    })
}

  
  }
}
// 从数据库中查询聊天记录
const notes = (page, num) => {

  const gdata = {
    id: store.userInfo.id + '',//用户id
    duifangid: props.dataUser.id + '',//接收人的id
    pages: page,//开始查找的位置 
    pageNum: num//一页的数量

  }
  socket.emit('ersonal', gdata)
}

// 这里接收返回的聊天记录
socket.on('fanersonal', (data, a) => {


  if (data.length == 0) {

    nextTick(() => {
      box.value.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    })
    ffg.value = true
  }

  let arr = []
  if (data.length !== 0) {
    data.forEach((item) => {
      item.data.forEach((i) => {
        arr.push(i)
      })
    })
  }
  chatObject.value = [...arr, ...chatObject.value]

  if (sd.value === 1) { crollToBottom() }

})
let das=ref(false)
watch(() => props.toi, (res) => {
;

  nums.value = props.toi
das.value=true

})

// 监听userNews的变化，然后更新chatObject
watch(props.userNews, (a, b) => {
  nums.value=props.toi

 
  gnb.value=true
  sd.value = 1
  hum.value=0
  // box.value.scrollTop
  // 这是服务器删除userNews后的情况
  if (Object.keys(props.userNews).length == 0) {
    // notes(0,3)
  }
  function foo() {
      return new Promise(function(resolve, reject){
       
        // 返回最近聊天
        socket.on('sdxc',()=>{das.value=true
          resolve(123);
  })

      })
    }


foo().then((res)=>{if(res==123){

  if(das.value){

  if (props.userNews[props.dataUser.id]) {



 if (nums.value == props.dataUser.id) {


  let num = props.userNews[props.dataUser.id].length
  props.userNews[props.dataUser.id][num]
  chatObject.value = [...chatObject.value, props.userNews[props.dataUser.id][num - 1]]


  crollToBottom()
}

}
das.value=false

}
return
}}

)
if(das.value){


  if (props.userNews[props.dataUser.id]) {



 if (nums.value == props.dataUser.id) {


  let num = props.userNews[props.dataUser.id].length
  props.userNews[props.dataUser.id][num]
  chatObject.value = [...chatObject.value, props.userNews[props.dataUser.id][num - 1]]


  crollToBottom()
}

}
das.value=false

}

}, { immediate: true })


// 监听传来的用户状态，是否显示添加好友按钮
// 监听聊天对象变化，然后更新聊天记录
watch(() => props.dataUser, (res) => {
  // nums.value=props.dataUser.id
console.log(props.dataUser.id);
  sd.value = 1
  gnb.value=true
  hum.value=0
  // id传过去

  // 一打开聊天框在这里获取数据库中的聊天记录
  notes(0, 3)

  if (res.status == 2) {
    increase.value = true
  } else {
    increase.value = false
  }

  let nwid = {
    id: store.userInfo.id,
    tid: props.dataUser.id
  }
  // 这里监听未读信息的标识。

  if (props.dataUser !== 0) {
    socket.emit('biaoshi', nwid)
  }

  if (props.userNews[props.dataUser.id]) {
    chatObject.value = [...props.userNews[props.dataUser.id]]


    crollToBottom()
  } else { chatObject.value = [] }
  // 这里监听更新聊天记录


}, { immediate: true })

// 同意好友事件
const kapUser = () => {

  increase.value = false
  shownav.value = 1
  console.log(props.dataUser);

  
let asa={userHead:props.dataUser.fuserHead,

  userName:props.dataUser.fuserName,
  id:props.dataUser.id,
  num:props.dataUser.num,
  status:props.dataUser.status,
  text:props.dataUser.text,
  time:props.dataUser.time
}

  props.socket.emit('Agree', {


    fidata: asa,//申请人的信息
    tdata: {
      ...store.userInfo,//被申请人的信息
      time: new Date().toLocaleString(),
    }
  })

}
// 同意后发送同意信息
socket.on('fasongt', () => {

  fasong(2)
})
// 同意后，刷新最近聊天列表
props.socket.on("shuaxin", (data) => {

  emit('zuijin')

})

// 一进来就先获取一下
// chatFriends(route.query.id)
// // 监听路由变化在获取
</script>

<style scoped lang="scss">
// ::-webkit-scrollbar-button{overflow: hidden;}
.title {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e7e7e7;
  padding-left: 20px;

  span {
    line-height: 50px;
  }
}

.tianjia {
  position: sticky;
  box-sizing: border-box;
  padding: 10px;
  top: 0;
  z-index: 999;
  // width: 610px;
  height: 50px;
  background: #fff;

  img {
    width: 30px;
    height: 30px;

    vertical-align: middle;
  }

  span {
    font-size: 13px;
    margin-left: 20px;
    color: #727070;
  }

  .el-button--success {
    float: right;
    height: 25px;

    background: #58b32b;
  }
}

.box {
  position: relative;
  overflow: scroll;
  width: 100%;
  box-sizing: border-box;
  height: calc(100% - 200px);
  background-color: #f5f5f5;
  padding: 10px 20px;

  .left {
    text-align: center;

    p {
      min-height: 30px;
      background-color: #ffffff;
      line-height: 30px;

      font-size: 13px;
      padding: 0 5px;
      margin-left: 20px;
      position: relative;
      border-radius: 4px;

      text-align: left;

      &::before {
        content: "";
        display: inline-block;

        position: absolute;
        top: 10px;
        left: -5px;
        border-width: 5px 5px 5px 0px;
        border-style: solid;
        border-color: transparent rgb(255, 255, 255) transparent;
        // background-color: #000;
      }
    }

    .left_box {
      display: flex;
      margin-top: 10px;
    }

    img {
      width: 30px;

      height: 30px;
    }

    .time {
      text-align: center;
      color: #f2ffff;
      background-color: #dadada;
      font-size: 12px;
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .right {
    margin-top: 40px;
    display: flex;
    flex-direction: row-reverse;

    p {
      min-height: 30px;
      background-color: #95ec69;
      line-height: 30px;
      padding: 0 5px;
      margin-right: 20px;
      position: relative;
      border-radius: 4px;

      text-align: left;

      &::before {
        content: "";
        display: inline-block;

        position: absolute;
        top: 10px;
        right: -5px;
        border-width: 5px 0px 5px 5px;
        border-style: solid;
        border-color: transparent #95ec69 transparent;
        // background-color: #000;
      }
    }
  }

  .right_box {
    display: flex;

    img {
      width: 30px;
      height: 30px;
    }
  }

  .left_nei {
    // width: 200px !important;
    word-wrap: break-word;

    //word-break设置强行换行;normal 亚洲语言和非亚洲语言的文本规则，允许在字内换行
    font-size: 18px;
    word-break: normal;
  }
}

.boxtow {
  height: calc(100% - 250px);
  ;
}

.fason {
  height: 150px;
  width: 100%;
  padding: 2px 20px;
  box-sizing: border-box;
  background: #95ec69;
  background-color: #f5f5f5;
  border-top: 1px solid #ececec;

  .ziti {
    i {
      font-size: 14px;

      margin-left: 10px;

      &:nth-child(1) {
        margin-left: 0;
      }
    }
  }

  .rigth {
    float: right;
  }

  .int {
    width: 100%;
    height: 90px;
    line-height: 0;
    background-color: #f5f5f5;
    border: 0;
    outline: none;

    &:focus {
      line-height: 0;
      border: 0px transparent #fff !important;
    }
  }
}

:deep(.el-textarea__inner) {
  height: 90px;
  box-shadow: 0 0 0;

  background: #f5f5f5;
}

// 滚动条的宽度

::-webkit-scrollbar {
  width: 6px;
  /* 竖向滚动条宽度 */
  height: 6px;
  /* 横向滚动条高度 */
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* 滚动条样式 */

  background-color: #d2d2d2;
  /* 滚动条颜色 */
}

.fdf {
  float: right;
  width: 50px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  background-color: #e9e9e9;
  color: #07c160;
  border-radius: 4px;
  font-size: 12px;
}
</style>
