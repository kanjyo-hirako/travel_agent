import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'vant/es/toast/style/index.mjs'
import 'vant/es/dialog/style/index.mjs'
import './styles/common.css'

createApp(App).use(router).use(Vant).mount('#app')//.use是注入，.mount是挂载
