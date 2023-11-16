<template>
  <div class="playerbox">
    <div class="row">
      <div>
        <button type="button" @click="cpc" id="join">JOIN</button>
        <button type="button" id="leave">LEAVE</button>
      </div>
    </div>
    <div class="fuser">

      <template v-if="bbc == 2">

        <img v-if="fasongfang" :src="fasongfang.userHead" alt="">
        <span v-if="fasongfang">{{ fasongfang.userName }}</span>
      </template>
      <template v-if="bbc == 1">
        <span style="color:#fff">
        </span>
        <img :src="dataUser.fuserHead" alt="">
        <span>{{ dataUser.fuserName }}</span>

        <span v-show="yaoqing" style="font-size: 12px;">等待对方接收邀请...</span>
      </template>
    </div>
    <div class="yuanduan" v-show="twoShi">
      <video class="jieshou" autoplay preload></video>
    </div>

    <video v-if="sds" autoplay preload class="playerboxx"></video>

    <div @click="guan" class="guaduan">
      <el-icon class="xx">
        <Close />
      </el-icon>
    </div>

    <div @click="tongyi" v-show="bbc == 2" class="guaduan guanbox">
      <!-- <span>{{ bbc }}</span> -->
      <el-icon>
        <VideoCamera />
      </el-icon>
    </div>
  </div>
</template>
<script setup>
// import AgoraRTC from "agora-rtc-sdk-ng";
import { reactive, onMounted, watch, ref } from "vue";
import socket from "../utils/scoket";
import { useCounterStore } from "../store/index";
// import { fi } from "element-plus/es/locale";
const store = useCounterStore();
const emit = defineEmits(["guans"]);
const props = defineProps(["socket", "dataUser", "fuser", 'bbc', "sdp",'tid']);
console.log(props.tid);

const constraints = reactive({
  video: true,
  audio: true,
});
let pc1;
let pc2;
let sds = ref(true);
let yaoqing = ref(true)
let fasongfang = ref()

const twoShi = ref(false)
// 同意视频聊天
const tongyi = () => {
  console.log(props.tid);
  twoShi.value = true
  // 接收方开启摄像头
  openCamera().then(async (res) => {
    
    if (res == '1') {
     
      let co = {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }, // 谷歌的公共服务         
    {
      url: "turn:172.20.10.7:3478",
      username: 'lpl', // 用户名   
      credential: 111111 // 密码         
    }
    ],
    
    };


      // 创建接收方的rtc
      pc2 = new RTCPeerConnection(co);
      // 监听通过服务器发送给对方的sdp事件，创建ice
      pc2.addEventListener("icecandidate", (e) => onIceCandidateTwo(pc2, e));

      let ass= pc2.iceConnectionState
      console.log(ass);
    
      pc2.addEventListener("track", (res) => {
        console.log('获取到发送方的源');
        let jiehsouvideo = document.querySelector(".jieshou");
        jiehsouvideo.srcObject = res.streams[0];
        console.log(res.streams[0]);
      });
      // 打开摄像头后，把流传给pc2
      stream.getTracks().forEach((track) => pc2.addTrack(track, stream));
      // 通知对方同意视频聊天
      socket.emit('tongyi',props.tid)
    }

  })

  const onIceCandidateTwo = (pc, event) => {
  
    if (event.candidate !== null) {
      try {
        //发送ice
        const req = {
          type: "candidate",
          content: event.candidate,
        };
console.log(event);
        // fasongfang
      
       socket.emit("iceTwo", JSON.stringify(req), fasongfang.value.id);
       console.log(11111);
      } catch (e) {
        // onAddIceCandidateError(pc, e);
      }
    }
    //console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }

}

// 接收到同意聊天
socket.on('mytTongyi',()=>{
  twoShi.value = true
// 创建本地的rtc
cpc()
})
// 接收sdp
socket.on("recipient",  async(res, fuser) => {

  fasongfang.value = fuser
  yaoqing.value = false
  const event = JSON.parse(res);
      switch (event["type"]) {
        //接收sdp
        case "sdp":
          const desc_pc1 = event["content"];
          // 把发送方的sdp存到接收方
          await pc2.setRemoteDescription(new RTCSessionDescription(desc_pc1));
          // 生成接收方的sdp
          const desc_pc2 = await pc2.createAnswer();
          // 接收方的存到本地
          await pc2.setLocalDescription(desc_pc2);
          //发送answer
          const req = {
            type: "answer_sdp",
            content: desc_pc2,
          };
          // websocket.send(JSON.stringify(req));
          socket.emit("farecipient", JSON.stringify(req), fuser.id, store.userInfo);
      }

 
});
 // 接收ice
 socket.on("rice", async (res) => {
    let data = JSON.parse(res);
    // new RTCIceCandidate(data.content)
    pc2.addIceCandidate(new RTCIceCandidate(data.content)).then(() => { });
  });
//  接收接收方的sdp
socket.on("jieshousdp", async (res, fuser) => {

yaoqing.value = false
console.log("进程完成");
const event = JSON.parse(res);
switch (event["type"]) {
  case "answer_sdp":
    const desc_pc2 = event["content"];
    await pc1.setRemoteDescription(new RTCSessionDescription(desc_pc2));
}
});
// 接收接收方的ice
socket.on('jice', (res) => {
  let data = JSON.parse(res);
  pc1.addIceCandidate(new RTCIceCandidate(data.content)).then(() => { });
})
// 关闭摄像头,关闭视频聊天
const guan = () => {

  emit("guans");

  close()
  // 通知对方关闭
  socket.emit('close')
};

const close = () => {
  pc1 = null
  pc2 = null
  var jieshou = document.querySelector(".jieshou")
  if (jieshou.srcObject) {
    let jieshouObj = jieshou.srcObject.getTracks();
    for (let i = 0; i < jieshouObj.length; i++) {
      jieshouObj[i].stop();
    }
  }
  var tracks = document.querySelector(".playerboxx").srcObject.getTracks();
  for (var i = 0; i < tracks.length; i++) {
    tracks[i].stop();
  }
  // 通知接收方关闭
}
// 先开启摄像头,在创建rtc
   // 这里对生成视频进行配置
   let userMediaConstraints = ref(
  {
  audio: false, // 是否获取音频
  video: {
    facingMode: 'environment',  // 环境表示后置摄像头，使用user表示采用前置
    // 宽高的配置比较灵活，由于video一般都会显示固定宽高比，所以使用ideal理想值即可
    width: {
      ideal: 400,
      // min: 1024,
      // max: 1920
    },
    height: {
      ideal: 460,
      // min: 776,
      // max: 1080
    }
  }
}
)
// 开启摄像头
let stream;
let openCamera = () => {
  return new Promise(async (resolve, reject) => {

//以下是此方法的兼容性写法，


    try {

      if (navigator.mediaDevices.getUserMedia === undefined) {
				     navigator.mediaDevices.getUserMedia = function (constraints) {
				          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia||MediaDevices;
				          if (!getUserMedia) {
							  this.nav=false
				              return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
				          }
					          return new Promise(function (resolve, reject) {
					           		getUserMedia.call(navigator, constraints, resolve, reject);
					           });
				          }
				 }

      stream = await navigator.mediaDevices.getUserMedia(userMediaConstraints.value);

      const video = document.querySelector(".playerboxx");
      video.srcObject = stream;
      resolve('1') //成功后的回调
    } catch (error) {
      console.error("Error opening video camera.", error);
    }



  })

}

// 创建AgoraRTCClient对象
const cpc = async () => {
  const configuration = {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }, // 谷歌的公共服务         
    {
      url: "turn:172.20.10.7:3478",
      username: 'lpl', // 用户名   
      credential: 111111 // 密码         
    }
    ]

  };
  //源连接，
  pc1 = new RTCPeerConnection(configuration);

  pc1.addEventListener("track", (res) => {
    console.log('获取到远端源');
    let jiehsouvideo = document.querySelector(".jieshou");
    jiehsouvideo.srcObject = res.streams[0];
    console.log(res.streams[0]);
  });
  // 发送ice 
  pc1.addEventListener("icecandidate", (e) => onIceCandidate(pc1, e));
  //把localStream的音视频，放到源中
  stream.getTracks().forEach((track) => pc1.addTrack(track, stream));
  try {
    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };

    //创建和设置连接描述
    const desc_pc1 = await pc1.createOffer(offerOptions);
    //发送sdp
    const req = {
      type: "sdp",
      content: desc_pc1,
    };
    props.socket.emit(
      "videoSdp",
      JSON.stringify(req),
      props.dataUser.id,
      store.userInfo
    );
    await pc1.setLocalDescription(desc_pc1);
  } catch (e) {
    // onCreateSessionDescriptionError(e);
  }
  // 把准备好的ice也发送到另一方
  async function onIceCandidate(pc, event) {
    if (event.candidate !== null) {
      try {
        //发送ice
        const req = {
          type: "candidate",
          content: event.candidate,
        };
        props.socket.emit("ice", JSON.stringify(req), props.dataUser.id);
      } catch (e) {
        // onAddIceCandidateError(pc, e);
      }
    }

    //console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }


};

// 如果是拨打方创建本地rtc
if (props.bbc == 1) {
  openCamera().then((res) => {
   // 打开对方的 视频聊天框
   props.socket.emit("ship", props.dataUser.id,store.userInfo);
  })
}
onMounted(() => { });
</script>

<style lang="scss" scoped>
.playerbox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 500px;

  z-index: 9;
  background-color: rgb(31, 32, 32);

  video {
    position: absolute;
    z-index: 999;
    top: 100px;
    width: 100%;
  }

  .yuanduan {
    position: absolute;

    z-index: 999999;
    top: 5px;
    right: 10px;
    width: 80px;
    height: 120px;
    // background-color: bisque;

    .jieshou {
      position: absolute;
      top: 0;
      z-index: 999999999999;
    }
  }
}

.fuser {
  display: flex;
  padding: 5px;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    color: aliceblue;
    margin-top: 10px;
    margin-left: 5px;
  }
}

.guaduan {
  width: 40px;
  position: absolute;
  bottom: 20px;
  left: 60%;

  transform: translateX(-50%);
  height: 40px;
  border-radius: 50%;
  background: red;

  text-align: center;
  // line-height: 20px;

  .xx {
    color: aliceblue;
    font-size: 20px;
    margin-top: 10px;
    line-height: 50px;
    cursor: pointer;
  }
}

.guanbox {
  box-sizing: border-box;
  background-color: green;
  font-size: 20px;
  padding-top: 8px;
  left: 40%;
  color: rgb(255, 255, 255);
}
</style>
