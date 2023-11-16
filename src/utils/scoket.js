import io from 'socket.io-client'


// 引入pinia
import{useCounterStore}from'../store/index'

var socket=null
// 链接 服务端
export function sd(){
    const store = useCounterStore()
    socket = io('http://172.20.10.7:3002', {
        query: {id:store.userInfo.id},
        transports: ['websocket', 'polling'],
     
    })

    // 上线就把用户的id发过去
socket.on("connect", () => {

    const store = useCounterStore()
    socket.emit("message",store.userInfo.id)

    socket.on("message",(res)=>{

 
    })
});

socket.on("disconnect", (reason) => {
  // ...
  console.log("断开");
});
}

sd()



// 主动断开

// export const disconnect=()=>{
//     socket.disconnect()
// }
export default socket