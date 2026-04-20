<template>
    <el-dialog v-model="visible" title="排序调整" width="600px">
        <!-- 拖拽列表容器 -->
        <div ref="listRef" class="sortable-list">
            <div v-for="(item, index) in localList" :key="item.id" class="sortable-item">
                <span class="drag-handle">☰</span>
                <span class="num">{{ index + 1 }}.</span>
                <span class="name">{{ item.name }}</span>
            </div>
        </div>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm">
                确认保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, nextTick, onUnmounted } from "vue"
import Sortable from "sortablejs"

const visible = ref(false)
const listRef = ref(null)
const localList = ref([])
let sortable = null

// 打开弹窗
defineExpose({ open })
function open (list) {
    visible.value = true
    localList.value = [...list]

    nextTick(() => {
        initSortable()
    })
}

// 初始化拖拽
function initSortable () {
    // 销毁旧实例，避免重复绑定
    if (sortable) {
        sortable.destroy()
        sortable = null
    }

    if (!listRef.value) return

    sortable = Sortable.create(listRef.value, {
        animation: 200,            // 动画流畅度
        handle: ".drag-handle",    // 只有手柄可拖动
        ghostClass: "sort-ghost",  // 拖拽占位样式
        chosenClass: "sort-chosen",// 选中样式
        dragClass: "sort-drag",    // 拖动中样式

        // 拖拽结束
        onEnd (evt) {
            const { oldIndex, newIndex } = evt
            const item = localList.value.splice(oldIndex, 1)[0]
            localList.value.splice(newIndex, 0, item)
        },
    })
}

// 确认保存
const emit = defineEmits(["confirm"])
function handleConfirm () {
    emit("confirm", localList.value.map(item => item.id), localList.value)
    visible.value = false
}

// 页面销毁时清理
onUnmounted(() => {
    if (sortable) {
        sortable.destroy()
        sortable = null
    }
})
</script>

<style scoped>
/* 列表容器 */
.sortable-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 600px;
    overflow-y: auto;
    padding: 4px;
}

/* 列表项 */
.sortable-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    cursor: default;
    transition: all 0.2s ease;
    user-select: none;
}

/* 拖拽手柄 */
.drag-handle {
    font-size: 18px;
    color: #999;
    cursor: grab !important;
}

.drag-handle:active {
    cursor: grabbing !important;
}

/* 序号 */
.num {
    color: #666;
    min-width: 30px;
}

/* 名称 */
.name {
    flex: 1;
    color: #333;
}

/* 拖拽占位（半透） */
.sort-ghost {
    opacity: 0.3 !important;
    background: #f0f2f5 !important;
}

/* 选中时 */
.sort-chosen {
    background: #f5f7fa !important;
    border-color: #409eff !important;
}

/* 拖动中 */
.sort-drag {
    opacity: 0.9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>