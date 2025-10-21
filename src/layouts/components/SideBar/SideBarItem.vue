<template>
    <div v-if="!item?.meta.hidden">
        <el-menu-item v-if="onlyOneChild(item?.children)" :index="item?.path"
            :class="{ 'only-grade': onlyGrade(item?.path, item?.children), 'is-active': isActive(item) }">
            <el-icon v-if="item?.meta.icon" size="18" class="flex front-icon">
                <SvgIcon :icon="`${item.meta.icon}`" />
            </el-icon>

            <template #title>
                <span>{{ item?.meta.title }}</span>
            </template>
        </el-menu-item>

        <el-sub-menu v-else :index="item?.path || ''">
            <template #title>
                <el-icon v-if="item?.meta.icon" size="18" class="flex front-icon">
                    <SvgIcon :icon="`${item.meta.icon}`" />
                </el-icon>

                <span>{{ item?.meta.title }}</span>
            </template>

            <side-bar-item v-for="child in item?.children" :key="child.path" :is-nest="true" :item="child"
                class="nest-menu" />
        </el-sub-menu>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

defineProps({
    item: {
        type: Object as PropType<AppRoute.Route>,
    },
    isNest: {
        type: Boolean,
        default: false,
    },
    basePath: {
        type: String,
        default: "",
    },
});

function onlyOneChild(children: AppRoute.Route[] = []): boolean {
    if (!Array.isArray(children) || children.length === 0) {
        // 没有子路由，认为是“只有一个子项”
        return true;
    }

    // 过滤掉隐藏的子路由
    const visibleChildren = children.filter(child => !child.meta?.hidden);

    // 如果只有一个可见子路由，且没有 alwaysShow 强制显示父级，则认为父级可折叠为子项
    if (visibleChildren.length === 1 && !visibleChildren[0].meta?.alwaysShow) {
        return true;
    }

    // 如果没有可见子项，也可以认为“只有一个”
    if (visibleChildren.length === 0) {
        return true;
    }

    // 其他情况需要显示父级菜单
    return false;
}

function onlyGrade(path: string | undefined, children: AppRoute.Route[] = []): boolean {
    if (!path) {
        return false;
    }

    if (path.split("/").length > 2) {
        return false;
    }

    if (children.length === 1) {
        if (!children[0].meta.alwaysShow) {
            return true;
        }
        return false;
    }
    return false;
}
function isActive(path: any) {
    if (!path) {
        return false;
    }
    return path?.children && path?.children[0]?.path === route.path
}
</script>
