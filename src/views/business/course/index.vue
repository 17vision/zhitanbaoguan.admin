<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">课程管理</h2>
            <div class="flex items-center space-x-2">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增课程</el-button>
            </div>
        </div>
        <!-- 顶部操作区 -->
        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="mb-4 flex justify-between items-center">
                <div class=" flex  ml-auto items-center space-x-5 w-[50%]">
                    <el-input v-model="searchForm.title" placeholder="搜索课程名称" class="w-64" clearable />
                    <el-select v-model="searchForm.status" placeholder="全部状态" clearable class="w-32">
                        <el-option label="已发布" :value="1" />
                        <el-option label="未发布" :value="0" />
                    </el-select>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>
            <!-- 表格区域 -->
            <el-table v-loading="loading" :data="tableData" 
                :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="MAX_HEIGHT"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column label="封面">
                    <template #default="{ row }">
                        <el-image v-if="row.cover" :src="row.cover" fit="cover" class="w-15 h-15 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="category_str" label="分类" />
                <el-table-column prop="difficulty_str" label="难度">
                    <template #default="{ row }">
                        <el-tag :type="row.difficulty === 1 ? 'success' : row.difficulty === 2 ? 'warning' : 'danger'">
                            {{ row.difficulty_str }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="duration" label="总时长" />
                <el-table-column prop="chapters" label="章节数">
                    <template #default="{ row }">
                        {{ row.chapters && row.chapters?.length || 0 }}
                    </template>
                </el-table-column>
                <el-table-column label="发布状态">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center gap-2">
                            <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                                @change="handleStatusChange(row)" />
                            <p>{{ row.status === 1 ? '已发布' : '未发布' }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="发布时间" width="180" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="mt-4 flex justify-end">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                    :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/api/admin/api'
import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
const router = useRouter()
// 搜索表单
const searchForm = ref<any>({
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 选中的行
const selectedRows = ref<any[]>([])

// 搜索
const handleSearch = async () => {
    loading.value = true
    // TODO: 实现搜索逻辑
    api.getCourses({ ...searchForm.value, page: currentPage.value, limit: pageSize.value }).then(res => {
        tableData.value = res.data
        total.value = res.total || 0
        loading.value = false
    }).catch(err => {
        loading.value = false
    })
}
const handleReset = () => {
    searchForm.value = {}
    handleSearch()
}
// 批量删除
const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要删除的课程')
        return
    }
    ElMessageBox.confirm('确定要删除选中的课程吗？', '提示', {
        type: 'warning'
    }).then(() => {
        // TODO: 实现批量删除逻辑
        ElMessage.success('删除成功')
    })
}

// 新增课程
const handleAdd = () => {
    // TODO: 实现新增课程逻辑
    router.push({ name: 'course.create' })
}

// 编辑课程
const handleEdit = (row: any) => {
    // TODO: 实现编辑课程逻辑
    router.push({ name: 'course.create', query: { id: row.id } })
}

// 删除课程
const handleDelete = (row: any) => {
    ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        // TODO: 实现删除逻辑
        await api.deleteCourse({ id: row.id })
        ElMessage.success('删除成功')
        // TODO: 刷新数据
        handleSearch()
    })
}

// 修改发布状态
const handleStatusChange = (row: any) => {
    // TODO: 实现状态修改逻辑
    api.updateCourse({ id: row.id, status: row.status }).then((res) => {
        if (res.status === 1) {
            ElMessage.success('发布成功')
        }
    })
}

// 表格选择
const handleSelectionChange = (rows: any[]) => {
    selectedRows.value = rows
}

// 分页大小改变
const handleSizeChange = (val: number) => {
    pageSize.value = val
    // TODO: 重新加载数据
    handleSearch()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    // TODO: 重新加载数据
    handleSearch()
}
handleSearch()
</script>
