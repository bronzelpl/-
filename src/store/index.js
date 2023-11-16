import {defineStore} from "pinia";
import {getUser} from "../api/user";
import {getToken,removeToken} from "../utils/auth";
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useCounterStore = defineStore("counter", {
  state: () => ({
    token: getToken(),
    // 用户信息
    userInfo: JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : {},
    // 当前联系人信息
    Current: null,
  }),

  
  getters: {
    // double: (state) => state.count * 2,

    doubleCount: (state) => state.Current ,
  },
  actions: {
    // 定义获取用户信息的接口
    async increment() {
      const {data} = await getUser();
  
      // 用户信息永久化
      localStorage.setItem("user", JSON.stringify(data));
      this.userInfo = data;

      console.log(this.userInfo);
    },
    // 设置当前联系人的信息
    getCurrent(data) {
      this.Current = data;
    },
    // 删除用户信息和token
    remove(){
localStorage.removeItem("user")
removeToken()
    }
  },
});
