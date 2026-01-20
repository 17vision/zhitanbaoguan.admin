<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">班级管理</h2>
            <div class="flex items-center space-x-2">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增班级</el-button>
            </div>
        </div>
        <!-- 顶部操作区 -->
        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="mb-4 flex justify-between items-center">
                <div class=" flex  ml-auto items-center space-x-5 w-[35%]">
                    <el-input v-model="searchForm.name" placeholder="搜索名称" class="w-64" clearable />
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <!-- 表格区域 -->
            <el-table v-loading="loading" :data="tableData" 
                :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="MAX_HEIGHT">
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="description" label="班级描述" />
                <el-table-column label="操作" width="240" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="viewMembers(row)">查看班级成员</el-button>
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
        <createVue ref="createVueRef" @submit="handleSearch" />
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import api from '@/api/admin/grades'
import createVue from './create.vue'
import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
const router = useRouter()
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

const handleReset = () => {
    searchForm.value = {}
    handleSearch()
}

// 新增课程
const handleAdd = () => {
    // TODO: 实现新增课程逻辑
    createVueRef.value?.open(null)
}

const viewMembers = (row: any) => {
    // TODO: 实现查看班级成员逻辑
    router.push({ name: 'grade_user.index', query: { id: row.id } })

}
// 编辑课程
const handleEdit = (row: any) => {
    // TODO: 实现编辑课程逻辑
    createVueRef.value?.open(row)
}

// 删除课程
const handleDelete = (row: any) => {
    ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        // TODO: 实现删除逻辑
        await api.delete(row.id)
        ElNotification.success('删除成功')
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
