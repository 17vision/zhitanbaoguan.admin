<template>
    <div>
        <div v-loading="$store.loading" class="p-5">
            <div v-if="includes(app.routeNames, ['place.create'])" class="flex items-center mb-5">
                <el-button type="primary" size="small" @click="goCreate">添加</el-button>
                <el-button type="primary" size="small" @click="handleSort">排序</el-button>
                <el-button type="primary" size="small" @click="handleGenerate">一键生成</el-button>
                <el-button type="primary" size="small" @click="handleDownload">批量下载</el-button>
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
                    <el-table-column label="点位名" prop="name" width="140" />

                    <el-table-column label="封面" prop="cover" width="100">
                        <template #default="scope">
                            <div v-if="scope.row.cover" class="cover-img">
                                <el-image :src="scope.row.cover" show-progress alt="封面"
                                    @click="handleClick(scope.row.cover)" />
                            </div>
                            <div v-else class="cover-empty">-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="小程序码" prop="qrcode" width="100">
                        <template #default="scope">
                            <div v-if="scope.row.qrcode" class="w-[50px] h-[50px]">
                                <img :src="scope.row.qrcode" alt="" @click="handleClick(scope.row.qrcode)" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status_str" width="100" />

                    <el-table-column label="介绍" prop="introduction">
                        <template #default="scope">
                            <div class="line-clamp-3 text-gray-500 text-xs" :title="scope.row.introduction"
                                v-html="scope.row.introduction">
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="创建时间" prop="created_at" width="180" />


                    <el-table-column label="操作" align="center" fixed="right" width="180">
                        <template #default="scope">
                            <div class="flex gap-4 items-center justify-center">
                                <!-- 上下线 -->
                                <el-button v-if="includes(app.routeNames, ['place.update'])" link size="small"
                                    :type="scope.row.status == 1 ? 'danger' : 'primary'" text
                                    @click="goPublish(scope.row)">
                                    {{ scope.row.status == 1 ? '下线' : '上线' }}
                                </el-button>
                                <el-button v-if="includes(app.routeNames, ['place.list'])" link size="small"
                                    type="primary" text @click="goList(scope.row)">子集列表</el-button>
                                <!-- 更多操作 → 合并成下拉菜单 -->
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <el-button link size="small" type="primary" text>更多</el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['place.update'])"
                                                command="edit">编辑
                                            </el-dropdown-item>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['place.update'])"
                                                command="qrcode">生成小程序码
                                            </el-dropdown-item>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['venue.update'])"
                                                command="download">
                                                下载小程序码
                                            </el-dropdown-item>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['place.introduction'])"
                                                command="audio">音频列表
                                            </el-dropdown-item>
                                            <el-dropdown-item v-if="includes(app.routeNames, ['place.delete'])"
                                                command="delete" divided>删除
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
        <el-image-viewer v-if="showPreview" :url-list="srcList" show-progress @close="showPreview = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApp } from '@/stores/app'
import { includes } from '@/utils/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'
import JSZip from 'jszip'
import placesApi from '@/api/business/places'
import venuesApi from '@/api/business/venues'

const maxHeight = useWindowHeight(240)



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
// 表格更多操作
function handleCommand(cmd: string, row: any) {
    switch (cmd) {
        case 'qrcode': setQrcode(row); break
        case 'list': goList(row); break
        case 'audio': goPlacet(row); break
        case 'edit': goEdit(row); break
        case 'delete': deleteFn(row); break
        case 'download': downloadFn(row); break
    }
}

function goEdit(value: any): void {
    if (value && value.id) {
        router.push({ name: 'place.create', query: { id: value.id } })
    }
}

const showPreview = ref(false)
const srcList = ref<string[]>([])
const handleClick = (url: string) => {
    if (!url) return

    showPreview.value = true
    srcList.value = [url]
}

const downloadFn = async (row: any) => {
    if (!row?.id) return

    try {
        const res = await fetch(row.qrcode)
        const blob = await res.blob()

        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url

        // 自动识别后缀
        const ext = row.qrcode.split('.').pop()?.split('?')[0] || 'png'
        a.download = `${row.name || '二维码'}.${ext}`

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        URL.revokeObjectURL(url)

        ElNotification.success({
            title: '成功',
            message: '下载完成'
        })
    } catch (err) {
        ElNotification.error({ title: '失败', message: '小程序码下载失败，请稍后重试' })
    }
}

const goPlacet = (item: any) => {
    if (item?.id) router.push({ name: 'place.introduction', query: { place_id: item.id, title: item.name } })
}

const goList = (value: any): void => {
    if (value && value.id) {
        router.push({ name: 'place.list', query: { parent_id: value.id, venue_id: value.venue_id, title: value.name } })
    }
}
function handleReset() {
    req.page = 1
    req.venue_id = venues.value.length > 0 ? venues.value[0].id : undefined
    fetchData()
}
const setQrcode = async (row: any) => {
    if (!row?.id) return

    try {
        await placesApi.qrcode(row.id)
        ElNotification.success({ title: '成功', message: '小程序码生成成功' })
        fetchData()
    } catch (err) {
        ElNotification.error({ title: '失败', message: '小程序码生成失败，请稍后重试' })
    }
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

const handleGenerate = async () => {
    if (!tableData.value || tableData.value.length === 0) return

    const list = tableData.value.map(item => placesApi.qrcode(item.id))
    Promise.all(list).then(() => {
        ElNotification.success({
            title: '成功',
            message: '小程序码生成成功'
        })
        fetchData()

    }).catch(() => {
        ElNotification.error({
            title: '失败',
            message: '小程序码生成失败，请稍后重试'
        })
    })
}

const handleDownload = async () => {
    if (!tableData.value || tableData.value.length === 0) return

    const list = tableData.value.map(item => ({
        name: item.name,
        qrcode: item.qrcode
    }))

    if (list.length > 0) {
        const zip = new JSZip()
        const images = zip.folder('images')
        const promises = list.map(async (item) => {
            const response = await fetch(item.qrcode)
            const blob = await response.blob()
            const filename = item.name + '.png'
            images?.file(filename, blob)
        })
        await Promise.all(promises)
        const content = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        a.download = '小程序码.zip'
        a.click()
        URL.revokeObjectURL(url)
        ElNotification.success({
            title: '成功',
            message: '下载完成'
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
        width: 120px;
    }

    .el-icon {
        color: #f00;
    }
}

.cover-img {
    width: 80px;
    height: 50px;
    border-radius: 6px;

    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
