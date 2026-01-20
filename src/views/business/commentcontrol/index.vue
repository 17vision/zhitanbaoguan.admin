<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">评论管控</h2>
            <div class="flex items-center space-x-2">
                <!-- <el-button type="primary" :icon="Delete" @click="handleDelete()">批量删除</el-button> -->
            </div>
        </div>
        <!-- 顶部操作区 -->
        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="mb-4 flex justify-between items-center">
                <div>
                    <el-select v-model="course_id" placeholder="选择课程" style="width: 240px" @change="handleSearch">
                        <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </div>
                <div class=" flex  ml-auto items-center space-x-5 ">
                    <el-input v-model="searchForm.name" placeholder="搜索评论内容…" class="w-64" clearable />
                    <div>
                        <el-date-picker v-model="searchForm.time" type="daterange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" />
                    </div>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <!-- 表格区域 -->
            <el-table v-loading="loading" :data="tableData" row-key="id"
                :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="MAX_HEIGHT"
                @selection-change="handleSelectionChange" :tree-props="{ children: 'replies' }">
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column prop="user.nickname" label="用户名称" />
                <el-table-column prop="updated_at" label="评论时间" />
                <el-table-column prop="content" label="评论内容" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
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
// import { Delete } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import api from '@/api/admin/courses_messages'
import course from '@/api/admin/api'

import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
// 搜索表单
const searchForm = ref<any>({})
const course_id = ref<number>(0)
const options = ref<any[]>([])
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
    api.list({ ...searchForm.value, course_id: course_id.value, page: currentPage.value, limit: pageSize.value }).then(res => {
        tableData.value = res.data
        total.value = res.total || 0
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const handleReset = () => {
    searchForm.value = {
    }
    handleSearch()
}

const selection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
    selection.value = val

}
// 删除课程
const handleDelete = (row?: any) => {
    if (row) {
        // 单个删除
        ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
            type: 'warning'
        }).then(async () => {
            // TODO: 实现删除逻辑
            const data = row.course_message_id ? { course_message_reply_id: row.id } : { course_message_id: row.id }
            await api.delete(data)
            ElNotification.success('删除成功')
            handleSearch()
        })
    } else {
        // 批量删除
        if (selection.value.length === 0) {
            ElNotification.warning('请选择要删除的数据')
            return
        }
        ElMessageBox.confirm('确定要删除这些数据吗？', '提示', {
            type: 'warning'
        }).then(async () => {
            // TODO: 实现批量删除逻辑
            // await api.delete(selection.value.map((item: any) => item.id))
            ElNotification.success('删除成功')
            handleSearch()
        })
    }

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

onMounted(async () => {
    // TODO: 获取课程列表
    const res = await course.getCourses({ limit: 1000 })
    options.value = res.data
    course_id.value = options.value.length > 0 ? options.value[0].id : null
    handleSearch()
})
</script>
