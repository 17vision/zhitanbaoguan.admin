<template>
    <div>
        <div v-loading="$store.loading" class="p-5">
            <div v-if="includes(app.routeNames, ['venue.create'])" class="flex items-center mb-5">
                <el-button type="primary" size="small" @click="goCreate">添加</el-button>
                <el-button type="primary" size="small" @click="handleSort">排序</el-button>

            </div>
            <div class="bg-white rounded-lg shadow-md p-4">
                <div class="mb-4 flex justify-between items-center">
                    <div class=" flex  ml-auto items-center space-x-5 w-[50%]">
                        <el-select v-model="req.status" placeholder="全部状态" clearable class="w-32">
                            <el-option label="已发布" :value="1" />
                            <el-option label="未发布" :value="2" />
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
                    <el-table-column label="小程序码" prop="qrcode">
                        <template #default="scope">
                            <div v-if="scope.row.qrcode" class="logo-wrap">
                                <img :src="scope.row.qrcode" alt="" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="手机号码" prop="phone" />
                    <el-table-column label="场馆地址" prop="address" />

                    <el-table-column label="状态" prop="status_str" />
                    <el-table-column label="场馆介绍" prop="introduction">
                        <template #default="scope">
                            <div class="line-clamp-3 text-gray-500 text-xs" :title="scope.row.introduction"
                                v-html="scope.row.introduction">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="created_at" />


                    <el-table-column v-if="includes(app.routeNames, ['venue.create', 'venue.update', 'venue.delete'])"
                        label="操作" align="center" fixed="right" width="220">
                        <template #default="scope">
                            <div class="flex items-center justify-center space-x-2">
                                <!-- 上下线 合并为一个按钮 -->
                                <el-button v-if="includes(app.routeNames, ['venue.update'])" link size="small"
                                    :type="scope.row.status === 1 ? 'danger' : 'primary'" text
                                    @click="goPublish(scope.row)">
                                    {{ scope.row.status === 1 ? '下线' : '上线' }}
                                </el-button>
                                <el-button v-if="includes(app.routeNames, ['venue.update'])" link size="small"
                                    type="primary" text @click="goEdit(scope.row)">
                                    编辑
                                </el-button>
                                <!-- 更多操作 下拉菜单 -->
                                <el-dropdown @command="(cmd) => handleVenueCommand(cmd, scope.row)">
                                    <el-button link size="small" type="primary" text>更多</el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['venue.update'])"
                                                command="qrcode">
                                                生成小程序码
                                            </el-dropdown-item>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['venue.introduction'])"
                                                command="audio">
                                                音频列表
                                            </el-dropdown-item>

                                            <el-dropdown-item v-if="includes(app.routeNames, ['venue.delete'])"
                                                command="delete" divided>
                                                删除
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>

                <el-pagination class="mt-5" background hide-on-single-page layout="total, prev, pager, next"
                    :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
            </div>
            <SortableList ref="reference" @confirm="confirm" />

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

const maxHeight = useWindowHeight(240)



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

// 场馆列表更多操作
const handleVenueCommand = (cmd: string, row: any) => {
    switch (cmd) {
        case 'qrcode':
            setQrcode(row)
            break
        case 'audio':
            goPlacet(row)
            break
        case 'edit':
            goEdit(row)
            break
        case 'delete':
            deleteFn(row)
            break
    }
}

function goEdit(value: any): void {
    if (value && value.id) {
        router.push({ name: 'venue.create', query: { id: value.id } })
    }
}
function goPlacet(value: any): void {
    if (value?.id) router.push({ name: 'venue.introduction', query: { venue_id: value.id } })
}

const setQrcode = async (row: any) => {
    if (!row?.id) return

    try {
        await venuesApi.qrcode(row.id)
        ElNotification.success({ title: '成功', message: '小程序码生成成功' })
        fetchData()
    } catch (err) {
        ElNotification.error({ title: '失败', message: '小程序码生成失败，请稍后重试' })
    }
}
// 删除
function deleteFn(row: any) {
    if (!row?.id) return

    ElMessageBox.confirm('确定要删除这条数据吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await venuesApi.delete(row.id)
            ElNotification.success({ title: '成功', message: '删除成功' })
            fetchData()
        } catch (err) {
            ElNotification.error({ title: '失败', message: '删除失败，请稍后重试' })
        }
    }).catch(() => {
        // 取消操作
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
        await venuesApi.put({
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
        await venuesApi.sort(list)
        ElNotification.success({
            title: '排序成功',
            message: '数据排序已更新'
        })
        fetchData()
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
