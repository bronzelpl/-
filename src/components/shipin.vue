<template>

  
    

    <div class="playerbox">
      <div class="row">
            <div>
                <button type="button" id="join">JOIN</button>
                <button type="button" id="leave">LEAVE</button>
            </div>
        </div>

        <div class="yuanduan"></div>
    </div>
       
  
</template>
<script setup>
import AgoraRTC from "agora-rtc-sdk-ng";
import {reactive,onMounted} from 'vue'

const props = defineProps(["appId", "channel", 'token', 'uid']);
let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
};

let options = reactive({
    // Pass your App ID here.
    appId: props.appId,
    // Set the channel name.
    channel: props.channel,
    // Pass your temp token here.
    token: props.token,
    // Set the user ID.
    uid: props.uid,
})


const may =()=>{
console.log(11);
  //创建AgoraRTCClient对象
  rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

  // 监听“用户发布”事件，从中可以获得AgoraRTCRemoteUser对象。
  rtc.client.on("user-published", async (user, mediaType) => {
        // SDK触发“用户发布”事件时订阅远程用户
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // 如果远程用户发布视频曲目
        if (mediaType === "video") {
            // 获取AgoraRTCRemoteUser对象中的RemoteVideoTrack对象
            const remoteVideoTrack = user.videoTrack;
            // 以DIV元素的形式动态创建一个容器，用于播放远程视频曲目。
            const remotePlayerContainer = document.createElement("div");
            // 指定DIV容器的ID。您可以使用远程用户的uid.
            // remotePlayerContainer.id = user.uid.toString();
            // remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            // remotePlayerContainer.style.width = "640px";
            // remotePlayerContainer.style.height = "480px";
            // document.body.append(remotePlayerContainer);
let yuanduan=document.querySelector('.yuanduan')
            // 播放远程视频曲目。
             //传递DIV容器，SDK会在容器中动态创建一个播放器，用于播放远程视频曲目。
            remoteVideoTrack.play(yuanduan);
        }

        // 果远程用户发布了音轨。
        if (mediaType === "audio") {
            // 获取AgoraRTCRemoteUser对象中的RemoteAudioTrack对象
            const remoteAudioTrack = user.audioTrack;
            //播放远程音轨。无需传递任何DOM元素。
            remoteAudioTrack.play();
        }

        // 侦听“用户未发布”事件
        rtc.client.on("user-unpublished", user => {
            // 获取动态创建的DIV容器。
            const remotePlayerContainer = document.getElementById(user.uid);
            // 销毁集装箱。.
            remotePlayerContainer.remove();
        });
    });


        document.getElementById("join").onclick = async function () {

          console.log(222);
            // 加入RTC通道.
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            // 根据麦克风采样的音频创建本地音轨.
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // 根据摄像机拍摄的视频创建本地视频轨迹。
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            // 将本地音频和视频曲目发布到RTC频道
            await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
            // 以DIV元素的形式动态创建一个容器，用于播放本地视频曲目。
            // const localPlayerContainer = document.createElement("div");
            // 指定DIV容器的ID。您可以使用本地用户的uid。
            // localPlayerContainer.id = options.uid;
            // localPlayerContainer.textContent = "Local user " + options.uid;
            // localPlayerContainer.style.width = "640px";
            // localPlayerContainer.style.height = "480px";
            // document.body.append(localPlayerContainer);
  let bendibox= document.querySelector('.playerbox')
            // 播放本地视频曲目。
            // 递DIV容器，SDK会在容器中动态创建一个播放器，用于播放本地视频曲目。
            rtc.localVideoTrack.play(bendibox);
            console.log("publish success!");
        };

        document.getElementById("leave").onclick = async function () {
            // 销毁本地音频和视频曲目。

            console.log(22222222222222222222222222222222222222);
            rtc.localAudioTrack.close();
            rtc.localVideoTrack.close();

            // 遍历所有远程用户。
            rtc.client.remoteUsers.forEach(user => {
        
                // 销毁动态创建的DIV容器。
                const playerContainer = document.getElementById(user.uid);

             
                playerContainer && playerContainer.remove();
            });

            // 离开频道。
            await rtc.client.leave();
        };
    };



onMounted(()=>{
  
  may (),

console.log(2222);})
</script>

<style lang="scss" scoped>

.playerbox{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 350px;
height: 500px;

z-index: 999;
background-color: aqua;

.yuanduan{
  position: absolute;

  z-index: 999999;
  top: 5px;
  right: 10px;
  width: 80px;
height: 150px;
background-color: bisque;
}
}
</style>