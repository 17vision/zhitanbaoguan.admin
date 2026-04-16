<template>
    <div>
        <div v-loading="$store.loading" class="p-5">
            <div v-if="includes(app.routeNames, ['venue.create'])" class="flex items-center mb-5">
                <el-button type="primary" size="small" @click="goCreate">添加</el-button>
            </div>
            <div class="bg-white rounded-lg shadow-md p-4">
                <div class="mb-4 flex justify-between items-center">
                    <div class=" flex  ml-auto items-center space-x-5 w-[50%]">
                        <el-select v-model="req.status" placeholder="全部状态" clearable class="w-32">
                            <el-option label="已发布" :value="1" />
                            <el-option label="未发布" :value="0" />
                        </el-select>
                        <el-button type="primary" @click="fetchData">搜索</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </div>
                </div>
                <el-table :data="tableData" class=" w-full"
                    :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="maxHeight">

                    <el-table-column label="场馆名" prop="name" />
                    <el-table-column label="场馆封面" prop="cover">
                        <template #default="scope">
                            <div v-if="scope.row.cover" class="logo-wrap">
                                <img :src="scope.row.cover" alt="" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="手机号码" prop="phone" />
                    <el-table-column label="场馆地址" prop="address" />

                    <el-table-column label="状态" prop="status_str" />
                    <el-table-column label="场馆介绍" prop="introduction">
                        <template #default="scope">
                            <div class="text-xs text-gray-500  line-clamp-3" :title="scope.row.introduction">{{
                                scope.row.introduction }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="created_at" />


                    <el-table-column v-if="includes(app.routeNames, ['venue.create', 'venue.update', 'venue.delete'])"
                        label="操作" align="center" fixed="right" width="200">
                        <template #default="scope">
                            <el-button v-if="includes(app.routeNames, ['venue.update'])" link size="small"
                                type="primary" text @click="goEdit(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination class="mt-5" background hide-on-single-page layout="total, prev, pager, next"
                    :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useApp } from '@/stores/app'
import { includes } from '@/utils/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'
import venuesApi from '@/api/business/venues'
const maxHeight = useWindowHeight(200)



const router = useRouter()

const app = useApp()

const total = ref<number>(0)

const req = reactive<PaginateReq>({
    page: 1,
    limit: 20
})

const tableData = ref<Array<any>>([])

onBeforeMount(function () {
    req.page = 1
    fetchData()
})

function handleReset() {
    req.page = 1
    req.status = undefined
    fetchData()
}

function fetchData() {


    const data = { ...req }
    venuesApi
        .list(data)
        .then((res: Record<string, any>) => {
            if (res && res.data) {
                tableData.value = res.data
            }

            total.value = res.total

        })
}

function goCreate() {
    router.push({ name: 'venue.create' })
}

function goEdit(value: any): void {
    if (value && value.id) {
        router.push({ name: 'venue.create', query: { id: value.id } })
    }
}



</script>

<style lang="scss" scoped>
.el-upload--picture-card {
    --el-upload-picture-card-size: 148px;
    background-color: var(--el-fill-color-lighter);
    border: 1px dashed var(--el-border-color-darker);
    border-radius: 6px;
    box-sizing: border-box;
    width: 168px;
    height: 168px;
    cursor: pointer;
    vertical-align: top;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.title-card {
    width: 168px;
    height: 48px;
}

.logo-wrap,
.title-wrap {
    img {
        width: 160px;
    }

    .el-icon {
        color: #f00;
    }
}
</style>
