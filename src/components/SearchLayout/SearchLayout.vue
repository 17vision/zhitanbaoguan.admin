<template>
    <div class="search-layout">
        <!-- label-suffix 控制冒号，如果在 css 中已经用 ::after 实现，可以移除这里的绑定以防双冒号 -->
        <el-form :inline="true" class="search-form" @keyup.enter="emit('search')" :label-suffix="showColon ? ':' : ''">
            <!-- 第一行：左侧首行查询 + 固定的3个控制按钮 | 右侧功能区 -->
            <div class="row-first">
                <div class="first-left">
                    <!-- 插槽 1：第一行固定查询项 -->
                    <div class="search-first-items">
                        <slot name="search" />
                    </div>

                    <!-- 第一行固定的 3 个控制按钮（位置固定不动） -->
                    <div class="fixed-btns" v-if="slots.search">
                        <el-button type="primary" @click="emit('search')" :icon="Search">
                            {{ searchText }}
                        </el-button>
                        <el-button @click="emit('reset')" :icon="Refresh">
                            {{ resetText }}
                        </el-button>
                        <!-- 仅在传入了 #more 插槽时显示高级筛选按钮 -->
                        <el-button v-if="hasMoreSlot" type="default" class="expand-btn" @click="toggleExpand">
                            {{ isExpanded ? collapseText : expandText }}
                            <el-icon class="el-icon--right">
                                <component :is="isExpanded ? ArrowUp : ArrowDown" />
                            </el-icon>
                        </el-button>
                    </div>
                </div>

                <!-- 插槽 2：右侧功能按钮区 -->
                <div class="first-right">
                    <slot name="action" />
                </div>
            </div>

            <!-- 插槽 3：第二行及以后高级查询区（手风琴折叠动画容器） -->
            <div v-if="hasMoreSlot" class="row-more-accordion" :class="{ 'is-expanded': isExpanded }">
                <div class="accordion-inner">
                    <div class="more-items-wrapper">
                        <slot name="more" />
                    </div>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'
import { ArrowDown, ArrowUp, Search, Refresh } from '@element-plus/icons-vue'

// 1. 使用基于类型的 Props 声明，并赋予默认值
interface Props {
    searchText?: string
    resetText?: string
    expandText?: string
    collapseText?: string
    showColon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    searchText: '查询',
    resetText: '重置',
    expandText: '高级筛选',
    collapseText: '收起筛选',
    showColon: true,
})

// 2. 基于类型的 Emits 声明，并将 $emit 规范命名为 emit
const emit = defineEmits<{
    (e: 'search'): void
    (e: 'reset'): void
    (e: 'more', isExpanded: boolean): void
}>()

const slots = useSlots()
const isExpanded = ref(false)

// 自动判断是否提供了 #more 插槽
const hasMoreSlot = computed(() => !!slots.more)

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    emit('more', isExpanded.value)
}
</script>

<style scoped lang="scss">
/* 原有样式保持不变，已十分完善 */
.search-layout {
    margin-bottom: 16px;

    .search-form {
        :deep(.el-form-item) {
            margin-top: 0;
            margin-right: 12px;
            margin-bottom: 0;
        }

        :deep(.el-select) {
            width: 120px;
        }

        :deep(.el-button + .el-button) {
            margin-left: 0px;
        }

        .row-first {
            display: flex;
            justify-content: space-between;
            align-items: self-start;
            gap: 16px;
            width: 100%;

            .first-left {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
                flex: 1;

                .search-first-items {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .fixed-btns {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;

                    .expand-btn {
                        margin-left: 4px;
                    }
                }
            }

            .first-right {
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                flex-shrink: 0;
            }
        }

        .row-more-accordion {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &.is-expanded {
                grid-template-rows: 1fr;
            }

            .accordion-inner {
                overflow: hidden;
            }

            .more-items-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                padding-top: 12px;
            }
        }
    }
}
</style>
