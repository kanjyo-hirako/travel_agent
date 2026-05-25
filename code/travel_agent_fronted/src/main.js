import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import Vant from 'vant'
import './styles/common.css'

createApp(App).use(router).use(Vant).mount('#app')//.use是注入，.mount是挂载
