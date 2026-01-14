<template>
    <div class="px-5 py-2 bg-[#F3F5F7] container-wrap">
        <div class="basic-title my-3">脑机数据</div>
        <div :class="[' flex gap-4', flex_col]">
            <!-- 下部分：图表展示 -->
            <div ref="chartWrap" class="bg-white flex-1  p-4 rounded-md ">
                <div class="flex flex-col items-center w-full chart">
                    <div class="flex justify-between w-full mb-4">
                        <span class="text-[#333333] font-medium">专注度(β波)</span>
                    </div>
                    <div class="text-[#999999] text-xs mb-2 self-start">単位（分）</div>
                    <VChart ref="chart" v-show="!chartEmpty" class="chart-container" :option="chartOption"
                        style="height: 400px;">
                    </VChart>
                    <div v-show="chartEmpty" class="flex flex-col justify-center items-center mb-auto">
                        <img class="flex" width="189" src="@/assets/image/datastatistics/chat-empty.png" />
                        <span class="text-[#999999] text-[14px] mt-3">暂无数据</span>
                    </div>
                </div>
            </div>
            <div ref="chartWrap" class="bg-white flex-1  p-4 rounded-md">
                <div class="flex flex-col items-center w-full chart">
                    <div class="flex justify-between w-full mb-4">
                        <span class="text-[#333333] font-medium">放松度(α波)</span>
                    </div>
                    <div class="text-[#999999] text-xs mb-2 self-start">単位（分）</div>
                    <VChart ref="chart2" v-show="!chartEmpty" class="chart-container" :option="chartOption2"
                        style="height: 400px;">
                    </VChart>
                    <div v-show="chartEmpty" class="flex flex-col justify-center items-center mb-auto">
                        <img class="flex" width="189" src="@/assets/image/datastatistics/chat-empty.png" />
                        <span class="text-[#999999] text-[14px] mt-3">暂无数据</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 上部分：两个数据卡片 -->
        <div class="flex gap-4 mb-4 mt-4">
            <!-- 专注度卡片 -->
            <div class="data-card bg-white flex-1 p-4 rounded-md">
                <div class="data-card-header bg-[#FFF5EB] p-4 rounded-md flex ">
                    <span class="text-[#FF9500] font-medium w-[100px] text-center">专注度(β波)</span>
                    <span class="text-[#FF9500] font-medium ml-[160px] w-[100px] text-center">放松度(α波)</span>
                    <span class="text-[#FF9500] ml-[250px]">时间</span>
                </div>
                <div class="data-list">
                    <div v-for="(item, index) in concentrationData" :key="index"
                        class="data-item border-b py-4 rounded-md flex ">
                        <span class="text-[#333333] text-center w-[100px]">{{ item.concentration_level }}</span>
                        <span class="text-[#333333]  ml-[160px]  text-center w-[100px]">{{ item.relaxation_level
                            }}</span>
                        <span class="text-[#666666]  ml-[200px] ">{{ item.created_at }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class=" mt-4">

            <!-- 分页 -->
            <div class="flex justify-end mb-4 w-full">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue'
import api from '@/api/admin/api'
import VChart from "vue-echarts"
import * as echarts from "echarts"
// 数据相关
const concentrationData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableLoading = ref(false)

// 图表相关
const chartWrap = ref()
const chartEmpty = ref(false)

const chartData = ref<any[]>([])

const chart = ref()
const chart2 = ref()

const flex_col = ref('')
// 分页处理
const handleSizeChange = (val: number) => {
    pageSize.value = val
    flex_col.value = val === 50 ? 'flex-col' : ''
    nextTick(() => {
        resizeChart()
    })
    fetchData()
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
    fetchData()
}

const grid = {
    left: '8%',
    right: '5%',
    top: '5%',
    bottom: '15%'
}
// 图表配置
const chartOption = computed(() => {
    return {
        tooltip: {
            trigger: 'axis',
            formatter: "単位（分）" + '<br/>{b} {c}',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid,
        xAxis: {
            axisLabel: {
                rotate: 45,
                interval: 0,
                formatter: function (value: string) {
                    return value.split(' ')[1]
                }
            },
            boundaryGap: false,
            type: 'category',
            data: chartData.value.map((item: any) => item.created_at),
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [
            {
                type: 'line',
                stack: 'Total',
                lineStyle: {
                    width: 2,
                    color: '#9950EE'
                },
                showSymbol: false,
                smooth: true,
                itemStyle: {
                    color: '#9950EE',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    opacity: 0.3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 1,
                            color: '#7D29C700'
                        },
                        {
                            offset: 0,
                            color: '#9950EE'
                        },
                    ])
                },
                emphasis: {
                    focus: 'series'
                },
                data: chartData.value.map((item: any) => item.concentration_level)
            },
        ]
    }
})
// 图表配置
const chartOption2 = computed(() => {
    return {
        tooltip: {
            trigger: 'axis',
            formatter: "単位（分）" + '<br/>{b} {c}',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#7B8AFF'
                }
            }
        },
        grid,
        xAxis: {
            axisLabel: {
                rotate: 45,
                interval: 0,
                formatter: function (value: string) {
                    return value.split(' ')[1]
                }
            },
            boundaryGap: false,
            type: 'category',
            data: chartData.value.map((item: any) => item.created_at),
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [
            {
                type: 'line',
                stack: 'Total',
                lineStyle: {
                    width: 2,
                    color: '#7B8AFF'
                },
                showSymbol: false,
                smooth: true,
                itemStyle: {
                    color: '#7B8AFF',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    opacity: 0.3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 1,
                            color: '#7B8AFF00'
                        },
                        {
                            offset: 0,
                            color: '#7B8AFF'
                        },
                    ])
                },
                emphasis: {
                    focus: 'series'
                },
                data: chartData.value.map((item: any) => item.relaxation_level)
            },
        ]
    }
})



// 获取数据
const fetchData = async () => {
    tableLoading.value = true
    try {
        // 这里使用现有的 API 调用获取数据
        const res = await api.brain_machine_data({
            page: currentPage.value,
            limit: pageSize.value
        })

        if (res && res.data) {
            const data = res.data || []
            total.value = (res as any).total || 0

            // 分离专注度和放松度数据
            concentrationData.value = data.map((item: any) => ({
                concentration_level: item.concentration_level,
                relaxation_level: item.relaxation_level,
                created_at: item.created_at
            }))
        }
    } catch (error) {
        console.error('', error)
        // 异常情况下使用模拟数据
    } finally {
        tableLoading.value = false
    }
}


let Timer: any = null
const getEcheartsData = async () => {
    try {
        const res = await api.brain_machine_data({
            page: 1,
            limit: pageSize.value
        })

        if (res && res.data) {
            const data = res.data || []
            chartData.value = data
        }
    } catch (error) {
        console.log(error)
    }
}

const startTimer = () => {
    stopTimer()
    Timer = setInterval(() => {
        getEcheartsData()
    }, 2500)
}

const stopTimer = () => {
    if (Timer) {
        clearInterval(Timer)
        Timer = null
    }
}

const resizeChart = () => {
    if (chart.value) {
        chart.value.resize()
    }
    if (chart2.value) {
        chart2.value.resize()
    }
}

onMounted(() => {
    startTimer()
    fetchData()
    getEcheartsData()
    window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
    stopTimer()
    window.removeEventListener('resize', resizeChart
    )
})
</script>

<style lang="scss" scoped>
$color1: #333333;
$color2: #666666;
$color3: #5f8aff;
$color4: #999999;

.container-wrap {
    min-height: calc(100vh - var(--nav-bar-height));
}

.basic-title {
    font-size: 20px;
    color: $color1;
    font-weight: 500;
}

.chart {
    height: 400px;

    .chart-container {
        width: 100%;
        height: 100%;
    }
}

.data-card {
    .data-item {
        padding: 16px;

        span {
            display: inline-block;
        }
    }
}

.cource-tabs {
    display: flex;
    background: #F6F6F6;
    border-radius: 6px;
    padding: 4px;

    .cource-tab {
        padding: 6px 16px;
        font-size: 14px;
        color: $color2;
        cursor: pointer;
        border-radius: 4px;

        &.active {
            background: #fff;
            color: #409EFF;
        }
    }
}
</style>
