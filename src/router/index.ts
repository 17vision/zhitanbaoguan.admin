import { createRouter, createWebHistory, createWebHashHistory, } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from '@/utils/progress'
import { getToken, removeToken } from '@/utils/auth'
import { useUser } from '@/stores/user'
import { flattenDeep } from 'lodash';
import config from '@/config/config'

/**
 * 添加整个文件夹的 modules
 */
export let asyncRoutes: RouteRecordRaw[] = [];
const modules: Record<string, { default: RouteRecordRaw[] }> = import.meta.glob('./modules/*.ts', { eager: true });
export const _modules = Object.keys(modules).map(v =>
    modules[v].default.map(a => ({
        ...a,
    }))
);
asyncRoutes = flattenDeep(_modules);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/personal/login.vue'),
        hidden: true,
        meta: {
            title: '登录注册'
        }
    }
]

const { PROD, BASE_URL } = import.meta.env

const router = createRouter({
    history: PROD === true ? createWebHistory(BASE_URL) : createWebHashHistory(BASE_URL),
    routes: routes,
    strict: true,
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve) => {
            if (savedPosition) {
                return savedPosition
            } else {
                if (from.meta.saveSrollTop) {
                    const top: number = document.documentElement.scrollTop || document.body.scrollTop
                    resolve({ left: 0, top })
                }
            }
        })
    }
})

const whiteList = ['/login']

router.beforeEach(async (to: AppRoute.ToRoute, _from, next) => {
    NProgress.start()

    if (to.meta.title && !to.meta.link) {
        document.title = to.meta.title
    }

    function toRedirect() {
        removeToken()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
    }

    const token = getToken()
    if (token) {
        if (to.path === '/login') {
            if (to.query?.must) {
                next()
            } else {
                next({ path: '/' })
                NProgress.done()
            }
        } else {
            const user = useUser()
            if (user.accessAbility) {
                // 如果是链接，直接打开链接，其他就 next
                if (to.meta.link) {
                    window.open(to.meta.link, '_blank')
                    NProgress.done()
                    next(false)
                } else {
                    next()
                }
            } else {
                try {
                    let accessAbility = false
                    const menus: Array<Record<string, any>> = await user.getUserInfo()
                    // 开发环境使用本地路由，生产环境使用后端路由
                    if (config.remote) {
                        // 开发环境：使用本地定义的路由
                        accessAbility = user.setRoutes(router, asyncRoutes)
                    } else {
                        // 生产环境：使用后端返回的路由
                        if (!menus || menus.length === 0) {
                            throw new Error('No menu data available')
                        }
                        accessAbility = user.setRoutes(router, menus)
                    }

                    if (!accessAbility) {
                        throw new Error('Failed to set routes')
                    }

                    // 重新导航到目标路由
                    next({ ...to, replace: true })
                } catch (error) {
                    console.error('Route initialization failed:', error)
                    toRedirect()
                }
            }
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            toRedirect()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router
