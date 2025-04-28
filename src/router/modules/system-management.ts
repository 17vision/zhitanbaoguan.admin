import type { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/system',
        name: 'system',
        meta: {
            title: '系统管理',
        }, 
        redirect: '/system/permission',
        children:[
            {
                path: 'permission',
                name: 'permission',
                component: () => import('@/views/system/permission/index.vue'),
                meta: {
                    title: '权限管理',
                },
            },
            {
                path: 'role',
                name: 'role',
                component: () => import('@/views/system/role/index.vue'),
                meta: {
                    title: '角色管理',
                },
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/system/user/index.vue'),
                meta: {
                    title: '用户管理',
                },
            },
        ]
    },
];
export default routes;
