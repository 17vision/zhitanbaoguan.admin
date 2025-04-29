import type { App } from 'vue'
import { useLoading } from './loading'
import { useApp } from './app'
import { useUser } from './user'
const store = {
    install(app: App) { // 全局注册
        const initLoading = useLoading()
        const appStore = {
            get loading() {
                return initLoading.loading
            },
            app: useApp(),
            user: useUser()
        }
        
        app.config.globalProperties.$store = appStore
        window.$store = appStore
    }
}

export default store