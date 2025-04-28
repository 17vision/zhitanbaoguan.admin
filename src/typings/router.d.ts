import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta extends AppRoute.RouteMeta {
    keepAlive?: boolean; //是否保持 alive 状态
    title: string; // 页面标题
    hidden?: boolean; // 是否隐藏
    isFullPage?: boolean; // 是否全屏
    link?: string; // 外链
    icon?: string; // 图标
    hiddenInTag?: boolean; // 是否在标签页中隐藏
    requiresAuth?: boolean; // 是否需要登录
  }
}