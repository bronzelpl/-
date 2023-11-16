import instance from '../axios/index'

// 注册
export const getDicts = (data) =>
instance({
    url: '/lan/newUser',
    method: 'post',
    data
  })
// 登录
  export const uploadApi = (data) =>
instance({
    url: '/lan/login',
    method: 'post',
    data
    
  })
// 获取用户信息
  export const getUser = (data) =>
  instance({
      url: '/meng/information',
      method: 'post',
      data
      
    })

    // 修改头像
  export const modifyAvatar = (data) =>
  instance({
      url: '/meng/Modify',
      method: 'post',
      data:{
        img:data
      }
      
    })
// 修改个人信息
    export const modifyInformation = (data) =>
    instance({
        url: '/meng/modifyInformation',
        method: 'post',
        data
        
      })

 
// 查询用户最近的聊天人
export const recentchats = (data) =>
instance({
    url: '/meng/recentchats',
    method: 'post',
    data:{id:data}
    
  })
   
  

  // 查找好友
export const findFriends = (data) =>
instance({
    url: '/lan/findFriends',
    method: 'post',
    data:{userName:data}
})


  // 获取当前聊天对象的信息
  export const chatFriends = (params) =>
  instance({
      url: '/meng/chatFriends',
      method: 'get',
      params:{id:params}
  })