<template>
    <div class="p-4">
        <!-- 顶部操作区 -->
        <div class="mb-4 flex justify-between items-center">
            <div class="flex items-center space-x-2 w-[25%]">
                <el-input v-model="searchForm.username" placeholder="搜索名称" class="w-64" clearable />
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
            <div class="flex items-center space-x-2">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
        </div>

        <!-- 表格区域 -->
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column label="头像" width="120">
                <template #default="{ row }">
                    <el-image v-if="row.avatar" :src="row.avatar" fit="cover" class="w-20 h-20 rounded" />
                </template>
            </el-table-column>
            <el-table-column prop="username" label="导师名称" width="200" />
            <el-table-column prop="introduction" label="介绍"/>
            <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                    <!-- <el-button link type="danger" @click="handleDelete(row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-4 flex justify-end">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <createVue ref="createVueRef" @submit="handleSearch" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api/admin/tutors'
import createVue from './create.vue'
const createVueRef = ref<InstanceType<typeof createVue>>()
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

// 搜索
const handleSearch = async () => {
    loading.value = true
    // TODO: 实现搜索逻辑
    api.list({ ...searchForm.value, page: currentPage.value, limit: pageSize.value }).then(res => {
        tableData.value = res.data
        total.value = res.total || 0
        loading.value = false
    }).catch(err => {
        loading.value = false
    })
}


// 新增课程
const handleAdd = () => {
    // TODO: 实现新增课程逻辑
    createVueRef.value?.open({})
}

// 编辑课程
const handleEdit = (row: any) => {
    // TODO: 实现编辑课程逻辑
    createVueRef.value?.open(row)
}

// 删除课程
const handleDelete = (row: any) => {
    ElMessageBox.confirm('确定要删除该导师吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        // TODO: 实现删除逻辑
        await api.delete(row.id)
        ElMessage.success('删除成功')
        handleSearch()
    })
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
