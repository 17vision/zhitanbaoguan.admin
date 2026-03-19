<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">大空间课程管理</h2>
            <div class="flex items-center space-x-2">
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

                <el-table-column label="名称" prop="name" />

                <el-table-column label="价格" prop="price">
                    <template #default="scope">
                        <span v-if="scope.row.price">¥ {{ scope.row.price }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>

                <el-table-column label="缩略图" width="200">
                    <template #default="scope">
                        <el-image class="rounded-lg" :src="scope.row.cover" fit="cover"
                            style="width: 80px; height: 80px;" :preview-src-list="[scope.row.cover]"
                            :preview-teleported="true" />
                    </template>
                </el-table-column>

                <el-table-column label="状态" prop="list_status_str" />

                <el-table-column label="创建时间" prop="created_at" />

                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template #default="scope">
                        <el-button size="small" type="primary" text @click="handleEdit(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="primary" v-if="scope.row.list_status === 1" text
                            @click="handlePublish(scope.row.id, 2, scope.row.price)">上架</el-button>
                        <el-button size="small" type="danger" v-if="scope.row.list_status === 2" text
                            @click="handlePublish(scope.row.id, 1, scope.row.price)">下架</el-button>
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
import { ref } from 'vue'
import api from '@/api/admin/workflows'
import createVue from './create.vue'
import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
const createVueRef = ref<InstanceType<typeof createVue>>()
// 搜索表单
const searchForm = ref<any>({})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索
const handleSearch = async () => {
    loading.value = true
    // TODO: 实现搜索逻辑
    api.getlist({ ...searchForm.value, page: currentPage.value, limit: pageSize.value }).then(res => {
        tableData.value = res.data
        total.value = res.total || 0
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const handleReset = () => {
    searchForm.value = {}
    handleSearch()
}


// 编辑课程
const handleEdit = (id: any) => {
    // TODO: 实现编辑课程逻辑
    createVueRef.value?.open(id)
}

// 发布/下架课程
const handlePublish = (id: any, list_status: number, price: string) => {
    if (list_status === 2) {
        if (!price) {
            ElNotification.error('请先设置价格')
            return
        }
        return
    }
    ElMessageBox.confirm(`确定要${list_status === 2 ? '上架' : '下架'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        api.putWorkflows({ id, list_status }).then(() => {
            ElNotification.success(`${list_status === 2 ? '上架' : '下架'}成功`)
            handleSearch()
        })
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
