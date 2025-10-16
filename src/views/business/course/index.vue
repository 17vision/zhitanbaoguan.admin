<template>
    <div class="p-4">
        <!-- 顶部操作区 -->
        <div class="mb-4 flex justify-between items-center">
            <div class="flex items-center space-x-2 w-[50%]">
                <el-input v-model="searchForm.keyword" placeholder="搜索课程名称" class="w-64" clearable />
                <el-select v-model="searchForm.category" placeholder="全部分类" clearable class="w-32">
                    <el-option label="睡眠" value="睡眠" />
                    <el-option label="冥想" value="冥想" />
                </el-select>
                <el-select v-model="searchForm.level" placeholder="全部难度" clearable class="w-32">
                    <el-option label="初级" value="初级" />
                    <el-option label="中级" value="中级" />
                    <el-option label="高级" value="高级" />
                </el-select>
                <el-select v-model="searchForm.status" placeholder="全部状态" clearable class="w-32">
                    <el-option label="已发布" value="published" />
                    <el-option label="未发布" value="draft" />
                </el-select>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
            <div class="flex items-center space-x-2">
                <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
                <el-button type="primary" @click="handleAdd">新增课程</el-button>
            </div>
        </div>

        <!-- 表格区域 -->
        <el-table v-loading="loading" :data="tableData" border style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="封面" width="120">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="cover" class="w-20 h-20 rounded" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="level" label="难度" width="120" />
            <el-table-column prop="duration" label="总时长" width="120" />
            <el-table-column prop="chapter_count" label="章节数" width="120" />
            <el-table-column label="发布状态" width="120">
                <template #default="{ row }">
                    <el-switch v-model="row.status" active-value="published" inactive-value="draft"
                        @change="handleStatusChange(row)" />
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
// 搜索表单
const searchForm = reactive({
    keyword: '',
    category: '',
    level: '',
    status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 选中的行
const selectedRows = ref([])

// 搜索
const handleSearch = () => {
    console.log('搜索条件：', searchForm)
    // TODO: 实现搜索逻辑
    
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
    console.log('编辑课程：', row)
    // TODO: 实现编辑课程逻辑
}

// 删除课程
const handleDelete = (row: any) => {
    ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
        type: 'warning'
    }).then(() => {
        // TODO: 实现删除逻辑
        ElMessage.success('删除成功')
    })
}

// 修改发布状态
const handleStatusChange = (row: any) => {
    console.log('修改状态：', row)
    // TODO: 实现状态修改逻辑
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
</script>
