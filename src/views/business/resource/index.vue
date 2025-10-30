<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">资源管理</h2>
            <div class="flex items-center space-x-2">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增资源</el-button>
            </div>
        </div>
        <!-- 顶部操作区 -->
        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="mb-4 flex justify-between items-center">
                <div class=" flex  ml-auto items-center space-x-5 w-[50%]">
                    <el-input v-model="searchForm.name" placeholder="搜索名称" class="w-64" clearable />
                    <el-select v-model="searchForm.resource_group_id" placeholder="分组"  class="w-32">
                        <el-option :label="item.name" :value="item.id" v-for="item in statusList" :key="item.id" />
                    </el-select>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <!-- 表格区域 -->
            <el-table v-loading="loading" :data="tableData" style="width: 100%"
                :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="MAX_HEIGHT">
                <el-table-column prop="name" label="资源名称" width="120" />
                <el-table-column prop="type_str" label="类型" width="100" />
                <el-table-column prop="path" label="资源链接" width="200">
                    <template #default="{ row }">
                        <el-link :href="row.path" target="_blank">点击查看</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="thumbnail" label="缩略图">
                    <template #default="{ row }">
                        <el-image v-if="row.thumbnail" :src="row.thumbnail" fit="cover"
                            style="width: 50px; height: 50px" />
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" />
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
        <createVue ref="createVueRef" @submit="handleSearch" />
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api/admin/resources'
import resource_groups from '@/api/admin/resource_groups'
import createVue from './create.vue'
import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
const createVueRef = ref<InstanceType<typeof createVue>>()
// 搜索表单
const searchForm = ref<any>({
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const statusList = ref<any[]>([])

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
    createVueRef.value?.open({})
}

// 编辑课程
const handleEdit = (row: any) => {
    // TODO: 实现编辑课程逻辑
    createVueRef.value?.open(row)
}

// 删除课程
const handleDelete = (row: any) => {
    ElMessageBox.confirm('确定要删除该资源吗？', '提示', {
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
onMounted(async () => {
    resource_groups.list().then(res => {
        statusList.value = res as unknown as any[]
    })
})
</script>
