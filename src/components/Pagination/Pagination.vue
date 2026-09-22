<template>
    <div class="pagination-container">
        <el-pagination
            :background="background"
            :current-page="page"
            :page-size="limit"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            :hide-on-single-page="hideOnSinglePage"
            @update:current-page="handleCurrentChange"
            @update:page-size="handleSizeChange"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    // 总条数
    total: {
        type: Number,
        required: true,
        default: 0,
    },
    // 当前页码 (支持 v-model:page)
    page: {
        type: Number,
        default: 1,
    },
    // 每页显示条目个数 (支持 v-model:limit)
    limit: {
        type: Number,
        default: 10,
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
        type: Array<number>,
        default: () => [10, 20, 50, 100],
    },
    // 布局结构：总数 | 每页条数选择 | 上一页/页码/下一页 | 跳转
    layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper',
    },
    // 是否增加背景色
    background: {
        type: Boolean,
        default: true,
    },
    // 只有一页时是否隐藏
    hideOnSinglePage: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])

// 切换每页条数
const handleSizeChange = (val: number) => {
    emit('update:limit', val)
    emit('update:page', 1) // 切换条数时通常重置回到第 1 页
    emit('pagination', { page: 1, limit: val })
}

// 切换当前页码
const handleCurrentChange = (val: number) => {
    emit('update:page', val)
    emit('pagination', { page: val, limit: props.limit })
}
</script>

<style scoped>
.pagination-container {
    margin-top: 20px;
}

.pagination-container :deep(.el-pagination) {
    display: flex;
    align-items: center;
    width: 100%;
}

/* 核心 CSS：将总数推向最左侧，剩余组件靠右对齐 */
.pagination-container :deep(.el-pagination__total) {
    margin-right: auto;
}
</style>
