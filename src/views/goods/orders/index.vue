<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-Medium">订单管理</h2>
            <div class="flex items-center space-x-2">
            </div>
        </div>
        <!-- 顶部操作区 -->
        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="mb-4 flex justify-between items-center">
                <div class=" flex  ml-auto items-center space-x-5 w-[35%]">
                    <el-select v-model="searchForm.status" placeholder="选择状态" class="w-40">
                        <el-option label="待支付" :value="1" />
                        <el-option label="已支付" :value="2" />
                        <el-option label="已退款" :value="3" />
                    </el-select>
                    <el-select v-model="searchForm.order_status" placeholder="选择状态" class="w-40">
                        <el-option label="待付款" :value="1" />
                        <el-option label="待体验" :value="2" />
                        <el-option label="体验中" :value="3" />
                        <el-option label="已体验" :value="4" />
                    </el-select>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <!-- 表格区域 -->
            <el-table :data="tableData" :empty-text="'暂无订单'"
                :header-cell-style="{ background: '#F5F6FA', color: '#666666' }" :max-height="MAX_HEIGHT"
                header-row-class-name="header-row" v-loading="loading">
                <el-table-column label="用户头像" width="100">
                    <template #default="scope">
                        <el-avatar :size="52" :src="scope.row.user_avatar" />
                    </template>
                </el-table-column>

                <el-table-column label="用户昵称" prop="user_nickname" />

                <el-table-column label="商品名称" prop="goods_name" />

                <el-table-column label="商品价格">
                    <template #default="scope">
                        <span>¥ {{ scope.row.goods_price }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="商品类型" prop="goods_type_str" />


                <el-table-column label="设备 ID" prop="device_id" />

                <el-table-column label="支付金额">
                    <template #default="scope">
                        <span>¥ {{ scope.row.pay_amount }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="订单号" prop="payment_number" />

                <el-table-column label="支付状态" prop="status_str" />

                <el-table-column label="使用状态" prop="order_status_str" />

                <el-table-column label="支付时间" prop="paid_at" />

                <el-table-column label="退款时间" prop="refund_at" />

                <el-table-column label="创建时间" prop="created_at" />

                <el-table-column align="center" label="操作" fixed="right" width="188">
                    <template #default="scope">
                        <div v-if="scope.row.status === 2">
                            <el-button size="small" type="primary" text @click="goOrderRefund(scope.row.id)">
                                <span :class="{ 'text-[#f00]': scope.row.order_status === 4 }">退款</span>
                            </el-button>

                            <!-- 体验中 -->
                            <el-button v-if="scope.row.order_status === 3" size="small" type="primary" text
                                @click="goOrderClose(scope.row.id)">
                                <span>关闭订单</span>
                            </el-button>
                        </div>
                        <div
                            v-if="scope.row.status === 0 && scope.row.paid_at && !scope.row.refund_at && !scope.row.refund_status">
                            <el-button size="small" type="primary" text @click="goOrderRefund(scope.row.id)">
                                <span>退款</span>
                            </el-button>
                        </div>
                        <span v-else>-</span>
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
import { ref } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import api from '@/api/admin/orders'
import { useWindowHeight } from '@/hooks/useWindowHeight'
const MAX_HEIGHT = useWindowHeight(270)
// 搜索表单
const searchForm = ref<any>({
})

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
    api.getOrders({ ...searchForm.value, page: currentPage.value, limit: pageSize.value }).then(res => {
        tableData.value = res.data
        total.value = res.total || 0
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const handleReset = () => {
    searchForm.value = {
        status: 1
    }
    handleSearch()
}
function goOrderClose(value: number) {
    const confirmFun = function () {
        if (loading.value) {
            return
        }
        loading.value = true

        const data = { order_id: value }
        api.closeOrders(data)
            .then(() => {
                loading.value = false

                ElNotification({
                    type: 'success',
                    title: '',
                    message: '已操作',
                    duration: 3000
                })

                //  0.5 秒后查询情况
                setTimeout(() => {
                    handleSearch()
                }, 500)
            })
            .catch(() => {
                loading.value = false
            })
    }

    ElMessageBox.confirm('确定只关闭订单不退款吗', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            confirmFun()
        })
        .catch(() => { })
}

function goOrderRefund(value: number) {
    const confirmFun = function () {
        if (loading.value) {
            return
        }
        loading.value = true

        const data = { order_id: value }
        api.postOrders(data)
            .then(() => {
                loading.value = false

                ElNotification({
                    type: 'success',
                    title: '',
                    message: '已操作',
                    duration: 3000
                })

                //  0.5 秒后查询情况
                setTimeout(() => {
                    handleSearch()
                }, 500)
            })
            .catch(() => {
                loading.value = false
            })
    }

    ElMessageBox.confirm('确定要退款吗', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            confirmFun()
        })
        .catch(() => { })
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
