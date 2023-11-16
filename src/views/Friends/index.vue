<template>
  <!-- 好友栏目 -->
  <div class="haoyou">
    <!-- 头部搜索 -->
    <div class="tou">
      <!-- 搜索框 -->
      <div class="input">
        <el-input prefix-icon="Search" @input="chaxun" v-model="input" placeholder="搜索">
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

    <!-- 这里是好友列表-->
    <div class="boxlian">

      <div v-for="(item, t) in fdata" :key="t">
        <el-divider style="margin:0" />

        <span style="font-size:14px;color:#999999;margin-left:5px">{{ item.key }}</span>
        <div class="liaotianlan" @click="tiao(i)" :class="{ dsdsds: asasa == i.id }" v-for="(i, j) in item.list" :key="i.id">
          <div class="logo">
            <el-badge class="item"> </el-badge>

            <img :src="i.userHead" alt="" />
          </div>
          <div class="title">
            <p>{{ i.userName }}</p>

            <!-- <p 
    style="font-size: 13px; margin-top: 5px; color: #999999"
    v-show="item.status==2">{{item.fuserName}}请求添加您好友...</p> -->
          </div>
        </div>
      </div>

    </div>


  </div>
  <div class="right">

    <div v-if="!userData" class="tubiao">
      <img src="../../assets/20230329165133.jpg" alt="">
    </div>

    <div v-if="userData" class="xiang">
      <div class="boxuser">
        <img style="width:40px ;height:40px;" :src="userData.userHead" alt="">
        <p class="titles"><span>{{ userData.userName }}</span> <el-icon style="cursor: pointer;">
            <MoreFilled />
          </el-icon></p>
        <div>

        </div>

      </div>

      <div class="fbtn">
        <el-button @click="dianji" type="success">发送消息</el-button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { chatFriends } from "../../api/user.js";
import { useCounterStore } from "../../store/index";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import Pinyin from "js-pinyin";
import { useRouter, useRoute } from 'vue-router'
import socket from "../../utils/scoket";
const fdata = ref();
const store = useCounterStore();
const router = useRouter()
const asasa = ref('')
const { userInfo, remove } = storeToRefs(store);
const haoyou=()=>{
  chatFriends(userInfo.value.id).then((res) => {
  paixu(res.data);
});
}
haoyou()
socket.on('haoyoushua',()=>{
  haoyou()
})
const route = useRoute();
console.log(route.query);
// 排序
const paixu = (origin) => {
  // 将目标数据进行排序
  origin = origin.sort((pre, next) =>
    Pinyin.getFullChars(pre.userName).localeCompare(
      Pinyin.getFullChars(next.userName)
    )
  );
  const newArr = [];
  origin.map((item) => {
    // 取首字母
    const key = Pinyin.getFullChars(item.userName).charAt(0);
    const index = newArr.findIndex((subItem) => subItem.key === key);
    if (index < 0) {
      newArr.push({
        key: key,
        list: [item],
      });
    } else {
      newArr[index].list.push(item);
    }
  });
  fdata.value = newArr;

};
const userData = ref(null)
const tiao = (tiem) => {

  asasa.value = tiem.id;

  userData.value = tiem

}

const dianji = () => {
  // userData.value
  router.push({
    name: 'chatwindow',
    query: {
      id: userData.value.id,
      dakau: true
    }

  })
}
</script>
<style scoped lang="scss">
.boxlian {
  height: 91%;
  overflow: scroll;
}

.haoyou {

  float: left;
  width: 200px;
  height: 100%;
  background: #e4e3e4;
}

.tou {
  display: flex;
  box-sizing: border-box;
  height: 50px;
  border-right: 1px solid rgba(209, 209, 209, 0.4);
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

.liaotianlan {
  cursor: pointer;
  width: 100%;
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 50px;
  background: #e4e3e4;
  padding: 8px 12px;
  //   border-top: 1px solid #cac7c7;

  &:hover {
    background: #cccbca;
  }

  :deep(.el-badge) {
    position: absolute;
    top: 2px;
    left: 40px;
  }

  :deep(.el-badge__content.is-fixed) {
    top: 4px;
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
    width: 120px;
    position: relative;

    margin-top: 10px;
    margin-left: 5px;


    p {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.dsdsds {
  background-color: #cccbca;
}

.right {
  float: left;

  width: 75.3%;
  height: 100%;

  background-color: #f7f7f7;
}

.tubiao {
  width: 200px;
  height: 300px;
  // margin: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 3px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    -webkit-filter: blur(1px);
    /* Chrome, Safari, Opera */
    filter: blur(2px);
  }
}

.xiang {
  width: 400px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-20%, -70%);
  // transform: translateX(-50%);
  // transform: translateY(-50%);
  // background-color: #585858;
}

.fbtn {
  position: absolute;

  top: 60%;
  left: 50%;

  transform: translate(-50%);
}

.boxuser {

  position: absolute;
  left: 50%;
  transform: translate(-50%);
  display: flex;

  img {
    margin-right: 10px;
  }

  .titles {

    display: flex;
    justify-content: space-between;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
      line-height: 40px;
    }

  }
}</style>
