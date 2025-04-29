import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/svg-icon/svg-icon.ts'
import "default-passive-events";
import installStore from './stores/init'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(installStore)
app.use(router)
app.mount('#app')
