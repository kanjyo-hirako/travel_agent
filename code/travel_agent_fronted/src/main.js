import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'vant/es/toast/style/index.mjs'
import 'vant/es/dialog/style/index.mjs'
import './styles/common.css'

const app = createApp(App)
app.use(router).use(Vant).mount('#app')

// Signal splash screen that Vue is ready
if (window.__splashReady) {
  window.dispatchEvent(new CustomEvent('splash:done'))
} else {
  window.__vueReady = true
}
