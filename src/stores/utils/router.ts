import type { RouteRecordRaw, Router } from 'vue-router'
import config from '@/config/config'
const modulesRoutes = import.meta.glob(['@/views/**/*.{vue,tsx}', '!@/layouts/**/*.{vue,tsx}'])
const BasicLayout = () => import('@/layouts/index-layout.vue')
const IframeLayout = () => import('@/layouts/iframe.vue')

/**
 * 初始化路由
 * @param router 路由实例
 * @param menus 菜单数据
 * @returns 处理后的路由和菜单名称
 */
export default function initRoutes(router: Router, menus: Array<any>): AppRoute.InitRoutesData {
	const tempRoutes: Array<AppRoute.Route> = []
	const tempNames: Array<string> = []
	
	// 查找根路由
	const index = menus.findIndex((item) => item.path === '/')

	// 处理根路由
	if (config.remote) {
		// 远程模式下添加根路由
		router.addRoute({
			path: '/',
			name: 'index',
			component: () => import('@/layouts/index-layout.vue'),
			redirect: () => ({ name: menus[0]?.name as string }),
			children: [],
		})
	} else {
		// 本地模式下处理根路由
		if (index === -1) {
			// 如果没有根路由，添加一个
			menus.unshift({
				path: '/',
				name: 'index',
				component: 'Layout',
				redirect: () => ({ name: menus[0]?.name as string }),
			})
		} else {
			// 将根路由移到第一位
			menus = menus.splice(index, 1).concat(menus)
		}
	}

	const layoutName = menus[0]['name']
	
	/**
	 * 生成菜单和路由
	 * @param routes 路由数组
	 * @param menus 菜单数据
	 * @param prefix 路径前缀
	 */
	function generateMenu(routes: Array<AppRoute.Route>, menus: Array<any>, prefix = '') {
		menus.forEach((item) => {
			// 处理路径
			const path = prefix + item.path
			
			// 处理重定向
			let redirect = item.redirect
			if (!item.redirect && item.children && item.children.length > 0) {
				redirect = path === '/' 
					? path + item.children[0]['path'] 
					: path + '/' + item.children[0]['path']
			}

			// 处理组件
			let component
			if (!prefix && item.path === '/') {
				// 根路由使用基础布局
				component = BasicLayout
			} else if (prefix && item.children && item.children.length > 0) {
				// 有子菜单的中间路由不需要组件
				component = null
			} else {
				if (item.iframe) {
					// iframe类型使用iframe布局
					component = IframeLayout
				} else if (!item.link) {
					// 处理组件路径
					if (!item.component && (!item.children || item.children.length === 0)) {
						item.component = path.substring(1)
					}

					if (item.component) {
						component = modulesRoutes[`/src/views/${item.component}.vue`]
					}
				}
			}

			// 处理激活路径
			const activePath = item.active_path || 
				(item.children && item.children.length > 0 && prefix ? prefix : undefined)
			
			// 创建菜单对象
			const menu: AppRoute.Route = {
				path: path,
				name: item.name,
				redirect: redirect,
				component: config.remote ? item.component : component,
				meta: config.remote ? { ...item.meta } : {
					title: item.title,
					icon: item.icon,
					alwaysShow: item.always_show ?? false,
					hidden: item.hidden ? true : false,
					keepAlive: item.keep_alive ? true : false,
					link: item.link ?? '',
					iframe: item.iframe ?? '',
					activePath: activePath
				},
				children: []
			}

			// 处理只有一个子菜单且不需要一直显示的情况
			if (item.children && item.children.length === 1 && !item.children[0]['always_show']) {
				item.children[0]['active_path'] = item.path
				menu.meta.title = item.children[0]['title']
				menu.meta.icon = item.children[0]['icon'] ?? item['icon']
			}

			// 递归处理子菜单
			if (item.children && item.children.length > 0 && menu.children) {
				const newPath = path === '/' ? path : path + '/'
				generateMenu(menu.children, item.children, newPath)
			} else {
				delete menu.children
			}

			// 添加到路由数组
			routes.push(menu)
			tempNames.push(item.name)

			// 处理历史路由
			const history =
				router && router.options && router.options.routes && router.options.routes
					? router.options.routes[0]
					: null
			if (
				history &&
				history.children &&
				history.children.findIndex((value) => value.path === menu.path) !== -1
			) {
				history.children.push(menu as RouteRecordRaw)
			}
			
			// 添加到路由实例
			if (config.remote) {
				router.addRoute('index', menu as RouteRecordRaw)
			} else {
				if (item.path !== '/') {
					router.addRoute(layoutName, menu as RouteRecordRaw)
				} else {
					router.addRoute(menu as RouteRecordRaw)
				}
			}
		})
	}

	// 生成菜单和路由
	generateMenu(tempRoutes, menus)

	// 添加404路由
	const notFound: RouteRecordRaw = {
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () => import('@/views/errors/404.vue'),
		meta: {
			title: '上错星球啦'
		}
	}
	router.addRoute(notFound)

	return { menus: tempRoutes, routeNames: tempNames }
}
