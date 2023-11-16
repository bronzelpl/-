<template>
  <!-- 好友栏目 -->
  <div class="haoyou">
    <div class="flet">
      <!-- 头部搜索 -->
      <div class="tou">
        <!-- 搜索框 -->
        <div class="input">
          <el-input
            prefix-icon="Search"
            @input="chaxun"
            v-model="input"
            placeholder="搜索"
          >
            <i slot="suffix" class="el-input__icon el-icon-date"></i>
          </el-input>
        </div>
        <!-- 添加好友 -->
        <div class="vag">
          <el-icon>
            <Plus />
          </el-icon>
        </div>
      </div>
      <!-- 这个是加好友 -->
      <div class="xha" v-if="input.length !== 0">
        <div v-if="dbc">

          <div  v-for="(item, index) in arrs.chaxun"
            :key="item.id">
            <div v-show="item.id!==userInfo.id"
            @click="Dor(item)"
            class="box"
           
          >
            <div class="logo">
              <img :src="item.userHead" alt="" />
            </div>

            <p>{{ item.userName }}</p>
          </div>
          </div>
        
        </div>

        <div
          style="font-size: 12px; text-align: center; line-height: 40px"
          v-else
        >
          无法找到该用户
        </div>
      </div>
      <!-- 这里是最近聊天 -->
     <div class="boxlian">

      <div
     
        @click="tiao(item)"
        class="liaotianlan"
        :class="{dsdsds: asasa == item.id}"
        v-for="(item, index) in arrs.data"
        :key="index"
       >
        <div class="logo">

          <el-badge v-if="item.num!==0"  :value="item.num" class="item">
          </el-badge>
          <img :src="item.fuserHead" alt="" />
          
        </div>
        <div class="title">
          <p>{{ item.fuserName }}</p>
          <p class="xiaoxi">
            {{ item.text }}
          </p>
          <span class="riqi">{{ item.time }}</span>
          <!-- <p 
          style="font-size: 13px; margin-top: 5px; color: #999999"
          v-show="item.status==2">{{item.fuserName}}请求添加您好友...</p> -->
        </div>
      </div>
     </div>
    </div>
    <!-- {{ dataUser }} -->
    <div class="right">


      <el-popover
    placement="top-start"
   
    :width="200"
    trigger="hover"
    content="退出登录"
  >
    <template #reference>
      <span @click="tuichu" class="xxx">

<el-icon><CloseBold /></el-icon>
</span>
    </template>
  </el-popover>
      
      <!-- 子路由 -->
      <!-- <router-view />
       -->
      <liaotiankuang
        v-if="openDor"
        @zuijin="zuijin"
        @messages="messages"
        @guans="kai"
        :bbc="bbc"
        :userNews="userNews"
        :dataUser="dataUser"
        :socket="socket"
        :toi="toi"
      />

      <AgoraVideo v-if="viaco"
       @guans="guan" 
       :tid="tid" 
      :dataUser="dataUser" 
      :bbc="bbc"
      :socket="socket" 
      :sdp="sdp"
  />
    </div>
  </div>
</template>

<script setup>
import AgoraVideo from '../../components/AgoraVideo.vue'
import liaotiankuang from "./liaotiankuang.vue";
import {recentchats, findFriends} from "../../api/user";
import {storeToRefs} from "pinia";
import {ElMessage, ElMessageBox} from "element-plus";

import {useCounterStore} from "../../store/index";
import {reactive, ref,onMounted} from "vue";
import {useRouter,useRoute} from "vue-router";
import {provide} from "vue";
import socket from "../../utils/scoket";

const router = useRouter();
const viaco=ref(false)
const store=useCounterStore()
const {userInfo,remove} = storeToRefs(store);
const route = useRoute();
const bbc= ref(1)
let arrs = reactive({data: {}, chaxun: {}, xiangxi: {}});
let asasa = ref("");
let dbc = ref(false);

let mid=ref()
const toi=ref(0)
let sdp=ref()
const guan=()=>{
 
  viaco.value=false
}

const kai=()=>{
 bbc.value=1
 viaco.value=true
}
// 每次登录都尝试重连
socket.connect();
const fusers=ref()
const tid=ref(1)
socket.on('dakaishi',(tuser)=>{
 
console.log(tid.value);
viaco.value=true
tid.value=tuser.id
bbc.value=2
})


// 接收ice
const fice=ref()

socket.on('chonf',()=>{
  ElMessage({
    message: "对方已经是您的好友",
    type: "warning",
  });

})
let openDor = ref(false);
// 查询好友·
const chaxun = () => {
  findFriends(input.value).then((res) => {
    if (res.code == 200) {
      arrs.chaxun = res.data;
      dbc.value = true;
    } else {
      dbc.value = false;
    }
  });
};


// 重复添加提示
socket.on("zhongdfu", () => {
  ElMessage({
    message: "您已发送请求,请等待回复",
    type: "warning",
  });
});
// 定义一个对象，用来保存用户接收的信息
const userNews = ref({});
// {
//   id:[{},{}]//发信人的id
// }
socket.on('bnm',(res)=>{
  toi.value=res.tid
 
})
// 这是接收信息
socket.on("receive", (res,users) => {
// 发送消息看看好友是否已经更改了头像等信息
let fuser= arrs.data.filter((item)=>{
  return item.id==users.id
})
 
  // // 这里判断名字或头像的变化

  if(fuser[0].fuserHead!==users.userHead||fuser[0].fuserName!==users.userName){
    // 有一个不同就提醒后端更改
    console.log(232323);
    socket.emit('genggai',userInfo.value.id,users)
  }
socket.emit('dsdsx')
  toi.value=res.fid
  // 根据发送人的不同，追加到userNews中
  // 先判断userNews中是否已经有了发送人的信息
  // 存在的情况，把接收的信息追加进去
  if (userNews.value[res.fid]) {
    userNews.value[res.fid].push(res);
  }
  // 不存在的情况添加相应的发送人信息
  else {
    userNews.value[res.fid] = [res];
  }
  socket.emit('submission',userNews.value,userInfo.value.id)
});
// 这里是聊天记录已经保存数据库，请求本地的聊天记录清空，
socket.on('qingkong',()=>{
  // ={}
  
for(let key in userNews.value){
    delete userNews.value[key];
}


  console.log('收到了全员广播');
})
// 这里把自己发送的信息存入userNews
const messages = (data) => {

// 这里要变成tid，
  if(userNews.value[data.tid]){
    userNews.value[data.tid].push(data);
   
  }else{
    userNews.value[data.tid] = [data];
  }

  // 存完后提交到后端
  socket.emit('submission',userNews.value,userInfo.value.id)
};

// 进来就请求一下聊天记录
socket.emit("getrecords",userInfo.value.id)
// 后端返回的聊天记录
socket.on('fanrecord',(data)=>{

userNews.value=data
})


// 接受好友请求
socket.on("send", (data) => {
  // 接收到用户的信息，返回给服务器

  zuijin();
  // 接受了好友请求，刷新页面
});
const Dor = (item) => {
  ElMessageBox.confirm(
    `是否向${item.userName}发送好友请求？`,

    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",

      draggable: true,
    }
  )

    //   item.id,//添加好友的id
    //          arr//我的id
    .then(() => {
  
      const data = {
        tid: item.id,
        fid: userInfo.value.id, //申请人的id
        fuserName: userInfo.value.userName, //申请人的名字
        fuserHead: userInfo.value.userHead,
        status: 2, //申请状态2申请中
        time: new Date().toLocaleString(),
      };

      // 发送添加好友信息
      socket.emit("addFriends", data);

   
    })
    .catch(() => {});
};
socket.on('bus',()=>{

ElMessage({
type: "success",
message: "好友请求发送成功！",
});
})
let dataUser = null;

// 声明一个对应聊天对象的聊天信息
let chatObject = reactive({});
// let newFInde=reactive([])
const tiao = (tiem) => {
  asasa.value = tiem.id;
mid.value=tiem.id
  // 找到相应的聊天信息，传递给聊天组件
  openDor.value = true;

  dataUser = tiem;

  // 跳转到首页
};

// 获取最近聊天
const zuijin = () => {

socket.emit('zuijinf',userInfo.value.id)
};

function foo() {
      return new Promise(function(resolve, reject){
       
        // 返回最近聊天
socket.on('fanhuizuijin',(res)=>{
  arrs.data = res.data;
  resolve(res.data);
})

      })
    }
    foo().then((res)=>{


      if(route.query.dakau){
      if(arrs.data){
 let asx= arrs.data.filter((item)=>{
     return item.id==route.query.id
    })

    asasa.value=asx[0].id
    dataUser=asx[0]
    openDor.value = true;

      }
    
  }
    }

    )





zuijin();
// onMounted(()=>{ dfg()})
const tuichu=()=>{
  // 断开链接
  socket.close()
// 删除用户信息
  store.remove()
  location.reload();
  router.push({name:'login'})
 
}
const input = ref("");
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 0px;


  /* 竖向滚动条宽度 */
  height: 6px;
  /* 横向滚动条高度 */
}

.xha {
  cursor: pointer;
  height: calc(100% - 50px);
  overflow: scroll;

  .box {
    margin-top: 10px;
    line-height: 30px;

    &:hover {
      background-color: #cdcccc;
    }

    display: flex;
  }

  .logo {
    width: 30px;
    height: 30px;
    margin-right: 5px;
    background: #585858;

    img {
      width: 100%;

      height: 100%;
    }
  }
}

.tou {
  display: flex;
  box-sizing: border-box;
  height: 50px;

  background: #f7f7f7;

  padding: 12px 10px;

  .is-loading {
    line-height: 50px;
  }

  .input {
    width: 150px;

    :deep(.el-input) {
      height: 20px;
    }

    :deep(.el-input__wrapper) {
      background: #e2e2e2;
      font-size: 12px;
    }
  }
}

.vag {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  padding-top: 3px;
  margin-top: 3px;
  cursor: pointer;
  margin-left: 5px;
  text-align: center;
  border-radius: 2px;

  color: #585858;
  font-size: 12px;

  background: #e2e2e2;
}

.haoyou {
  display: flex;
  width: 100%;
  height: 100%;
  background: blue;

  .flet {
    width: 250px;
    height: 100%;
    background: #e5e4e4;

    .liaotianlan {
      cursor: pointer;

      position: relative;
      display: flex;
      box-sizing: border-box;
      height: 50px;
      background: #e4e3e4;
      padding: 8px 12px;
      border-bottom: 1px solid #cac7c7;

      &:hover {
        background: #cccbca;
      }

      :deep(.el-badge){
        position: absolute;
        top: 2px;left: 40px;
      }
      :deep(.el-badge__content.is-fixed){top: 4px;
      width: 5px;
      font-size: 8px;
    }
    
      .logo {
        width: 40px;
        height: 40px;
margin-right: 5px;
        background: #585858;

        img {
          width: 100%;

          height: 100%;
        }
      }

      .title {
        position: relative;
        margin-left: 5px;

        p {
          font-size: 14px;
        }
      }
    }

    .dsdsds {
      background-color: #cccbca;
    }
  }

  .right {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgb(239, 139, 9);

    .xxx{
      position: absolute;
      right: 5px;
      top: 5px;

      cursor: pointer;
      color: #6f6e6e;
    }
  }
}

.riqi {
  position: absolute;
  right: -20px;
  font-size: 12px;
  top: 2px;
  color: #999999;

  transform: scale(0.8);
  color: #999999;
}

.xiaoxi {
  width: 150px;
  font-size: 10px;
  margin-top: 5px;
  margin-left: -20px;
  transform: scale(0.7);
  color: #999999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.boxlian{
  height: 92%;
  overflow: scroll; }
</style>
