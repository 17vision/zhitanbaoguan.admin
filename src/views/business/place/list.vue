<template>
    <div v-loading="$store.loading" class="p-5">
        <div v-if="includes(app.routeNames, ['place.create'])" class="flex items-center gap-3 mb-5">
            <el-button type="primary" size="small" @click="goCreate">
                添加
            </el-button>
            <el-button size="small" @click="goBack">返回</el-button>
            <el-button type="primary" size="small" @click="handleSort">排序</el-button>

        </div>

        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="flex   items-center justify-between  w-full mb-4">
                <div class="text-lg font-semibold">{{ title }}</div>

                <div class=" ml-auto space-x-5 ">
                    <el-select v-model="req.status" placeholder="全部状态" clearable style="width: 200px;">
                        <el-option label="已发布" :value="1" />
                        <el-option label="未发布" :value="2" />
                    </el-select>

                    <el-button type="primary" @click="fetchData">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <el-table :data="tableData" :max-height="maxHeight"
                :header-cell-style="{ background: '#F5F6FA', color: '#666' }" class="w-full">
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

                <el-table-column label="介绍" prop="introduction" >
                    <template #default="scope">
                        <div class="line-clamp-3 text-gray-500 text-xs" :title="scope.row.introduction"
                            v-html="scope.row.introduction">
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" prop="created_at" width="180" />

                <el-table-column v-if="includes(app.routeNames, ['place.update', 'place.delete'])" label="操作"
                    align="center" fixed="right" width="280">
                    <template #default="scope">
                        <el-button v-if="includes(app.routeNames, ['place.update']) && scope.row.status == 2" link
                            size="small" type="primary" text @click="goPublish(scope.row)">上线</el-button>
                        <el-button v-if="includes(app.routeNames, ['place.update']) && scope.row.status == 1" link
                            size="small" type="danger" text @click="goPublish(scope.row)">下线</el-button>
                        <el-button v-if="includes(app.routeNames, ['place.list'])" link size="small" type="primary"
                            @click="goList(scope.row)">
                            子集列表
                        </el-button>
                        <el-button v-if="includes(app.routeNames, ['place.introduction'])" link size="small"
                            type="primary" text @click="goPlacet(scope.row)">音频列表</el-button>
                        <el-button v-if="includes(app.routeNames, ['place.update'])" link size="small" type="primary"
                            @click="goEdit(scope.row)">
                            编辑
                        </el-button>

                        <el-button v-if="includes(app.routeNames, ['place.delete'])" link size="small" type="danger"
                            @click="deleteFn(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="mt-5 flex justify-center" background hide-on-single-page
                layout="total, prev, pager, next" :total="total" :page-size="req.limit" v-model:current-page="req.page"
                @current-change="fetchData" />
        </div>
        <SortableList ref="reference" @confirm="confirm" />

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApp } from '@/stores/app'
import { includes } from '@/utils/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'
import { ElMessageBox, ElNotification } from 'element-plus'
import placesApi from '@/api/business/places'

const maxHeight = useWindowHeight(240)
const router = useRouter()
const route = useRoute()
const app = useApp()

const total = ref(0)
const tableData = ref<any[]>([])

const req = reactive({
    page: 1,
    limit: 20,
    status: undefined,
})

const venue_id = computed(() => route.query.venue_id)
const parent_id = computed(() => route.query.parent_id)
const title = computed(() => route.query.title || '点位列表')

// 获取列表
const fetchData = async () => {
    try {
        const params = {
            ...req,
            venue_id: venue_id.value,
            parent_id: parent_id.value,
        }
        const res = await placesApi.list(params)
        tableData.value = res.data || []
        total.value = res.total || 0
    } catch (err) {
        ElNotification.error({ title: '加载失败', message: '获取场馆列表失败' })
    }
}

// 重置
const handleReset = () => {
    req.page = 1
    req.status = undefined
    fetchData()
}

// 删除
const deleteFn = async (item: any) => {
    if (!item?.id) return

    try {
        await ElMessageBox.confirm('确定要删除这条数据吗？删除后无法恢复！', '提示', {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
        })

        await placesApi.delete(item.id)
        ElNotification.success({ title: '删除成功', message: '数据已删除' })
        fetchData()
    } catch (err: any) {
        if (err === 'cancel') return
        ElNotification.error({ title: '删除失败', message: '删除过程出现异常' })
    }
}

const goCreate = () => {
    router.push({
        name: 'place.create',
        query: { venue_id: venue_id.value, parent_id: parent_id.value },
    })
}

const goBack = () => {
    router.back()
}

const goEdit = (item: any) => {
    if (item?.id) router.push({ name: 'place.create', query: { id: item.id } })
}

const goPlacet = (item: any) => {
    if (item?.id) router.push({ name: 'place.introduction', query: { place_id: item.id, title: item.name } })
}
const goList = (item: any) => {
    if (item?.id) {
        router.push({
            name: 'place.list',
            query: { parent_id: item.id, venue_id: item.venue_id, title: item.name },
        })
    }
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

const reference = ref()
const handleSort = () => {
    reference.value?.open(tableData.value)
}

const confirm = async (list: any) => {

    if (list.length > 0) {
        await placesApi.sort(list)
        ElNotification.success({
            title: '排序成功',
            message: '数据排序已更新'
        })
        fetchData()
    }
}

watch(
    () => route.query,
    () => {
        req.page = 1
        fetchData()
    },
    { deep: true }
)

onMounted(() => {
    fetchData()
})
</script>

<style lang="scss" scoped>
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