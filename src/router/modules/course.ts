import type { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/course',
        name: 'course',
        meta: {
            title: '课程管理',
        },
        component: () => import('@/views/business/course/index.vue'),
    },
    {
        path: '/course/add',
        name: 'course.create',
        meta: {
            title: '添加课程',
            hidden: true,
        },
        component: () => import('@/views/business/course/create.vue'),
    },
];
export default routes;
