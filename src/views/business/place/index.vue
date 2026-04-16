<template>
    <div>
        <div v-loading="$store.loading" class="p-5">
            <div v-if="includes(app.routeNames, ['place.create'])" class="flex items-center mb-5">
                <el-button type="primary" size="small" @click="goCreate">添加</el-button>
            </div>
            <div class="bg-white rounded-lg shadow-md p-4">
                <div class="mb-4 flex justify-between items-center">
                    <div class=" flex  ml-auto items-center space-x-5 w-[50%]">
                        <el-select v-model="req.venue_id" placeholder="全部" class="w-32">
                            <el-option v-for="value in venues" :key="value.id" :label="value.name" :value="value.id" />
                        </el-select>
                        <el-button type="primary" @click="fetchData">搜索</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </div>
                </div>
                <el-table :data="tableData" class=" w-full"
                    :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="maxHeight">
                    <el-table-column label="点位名" prop="name" min-width="140" />

                    <el-table-column label="封面" prop="cover" width="180">
                        <template #default="scope">
                            <div v-if="scope.row.cover" class="cover-img">
                                <img :src="scope.row.cover" alt="封面" />
                            </div>
                            <div v-else class="cover-empty">-</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="状态" prop="status_str" width="100" />

                    <el-table-column label="介绍" prop="introduction" min-width="220">
                        <template #default="scope">
                            <div class="line-clamp-3 text-gray-500 text-xs" :title="scope.row.introduction">
                                {{ scope.row.introduction }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="创建时间" prop="created_at" width="180" />


                    <el-table-column v-if="includes(app.routeNames, ['place.create', 'place.update', 'place.delete'])"
                        label="操作" align="center" fixed="right" width="180">
                        <template #default="scope">
                            <el-button v-if="includes(app.routeNames, ['place.update']) && scope.row.status == 2"
                                link size="small" type="primary" text @click="goPublish(scope.row)">上线</el-button>
                            <el-button v-if="includes(app.routeNames, ['place.update']) && scope.row.status == 1"
                                link size="small" type="danger" text @click="goPublish(scope.row)">下线</el-button>
                            <el-button v-if="includes(app.routeNames, ['place.list'])" link size="small" type="primary"
                                text @click="goList(scope.row)">子集列表</el-button>
                            <el-button v-if="includes(app.routeNames, ['place.introduction'])" link size="small" type="primary"
                                text @click="goPlacet(scope.row)">音频列表</el-button>
                            <el-button v-if="includes(app.routeNames, ['place.update'])" link size="small"
                                type="primary" text @click="goEdit(scope.row)">编辑</el-button>
                            <el-button v-if="includes(app.routeNames, ['place.delete'])" link size="small" type="danger"
                                text @click="deleteFn(scope.row)">删除</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApp } from '@/stores/app'
import { includes } from '@/utils/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'

import placesApi from '@/api/business/places'
import venuesApi from '@/api/business/venues'

const maxHeight = useWindowHeight(200)



const router = useRouter()

const app = useApp()

const total = ref<number>(0)

const venues = ref<Array<any>>([])
const req = reactive<PaginateReq>({
    page: 1,
    limit: 20
})

const tableData = ref<Array<any>>([])

onMounted(function () {
    req.page = 1
    venuesApi.list({ page: 1, limit: 999 }).then((res: Record<string, any>) => {
        if (res && res.data) {
            venues.value = res.data
            req.venue_id = venues.value.length > 0 ? venues.value[0].id : undefined
            fetchData()
        }
    })
})


function fetchData() {
    if (req.venue_id == undefined) return

    const data = { ...req }
    placesApi
        .list(data)
        .then((res: Record<string, any>) => {
            if (res && res.data) {
                tableData.value = res.data
            }

            total.value = res.total

        })
}

function goCreate() {
    router.push({ name: 'place.create' })
}

function goEdit(value: any): void {
    if (value && value.id) {
        router.push({ name: 'place.create', query: { id: value.id } })
    }
}


const goPlacet = (item: any) => {
    if (item?.id) router.push({ name: 'place.introduction', query: { place_id: item.id } })
}

const goList = (value: any): void => {
    if (value && value.id) {
        router.push({ name: 'place.list', query: { parent_id: value.id, venue_id: value.venue_id } })
    }
}
function handleReset() {
    req.page = 1
    req.venue_id = venues.value.length > 0 ? venues.value[0].id : undefined
    fetchData()
}

// 删除景点/场馆
const deleteFn = async (item: any) => {
    // 无 ID 直接返回
    if (!item?.id) return

    // 弹出确认框
    ElMessageBox.confirm('确定要删除这条数据吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            // 调用删除接口
            await placesApi.delete(item.id)

            // 成功提示
            ElNotification.success({
                title: '删除成功',
                message: '数据已删除'
            })

            // 刷新列表
            fetchData()
        } catch (err) {
            // 失败提示
            ElNotification.error({
                title: '删除失败',
                message: '删除过程出现异常'
            })
        }
    })
}

// 上线 / 下线切换
const goPublish = async (row: { id: string; status: number }) => {
    if (!row?.id) return

    const targetStatus = row.status === 1 ? 2 : 1
    const actionText = targetStatus === 1 ? '上线' : '下线'

    // 确认弹窗
    await ElMessageBox.confirm(
        `确定要将该记录${actionText}吗？`,
        '操作确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).catch(() => {
        // 取消操作
        return Promise.reject()
    })

    try {
        await placesApi.put({
            id: row.id,
            status: targetStatus,
        })

        ElNotification.success({
            title: '操作成功',
            message: `${actionText}成功`,
        })

        fetchData()
    } catch (err) {
        ElNotification.error({
            title: '操作失败',
            message: `${actionText}失败，请稍后重试`,
        })
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

.cover-img {
    width: 120px;
    height: 70px;
    border-radius: 6px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
