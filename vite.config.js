import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { //主要是加上这段代码
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://172.20.10.7:80',	//实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ' ')
      },
    }
  }


})
  