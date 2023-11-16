import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'


import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia()
import '../public/icon/iconfont.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import VConsole from 'vconsole';

// const vConsole = new VConsole();

// 接下来即可照常使用 `console` 等方法


// 结束调试后，可移除掉
// vConsole.destroy();

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.provide('socket', socket);
app.use(pinia).use(router).use(ElementPlus).mount('#app')
