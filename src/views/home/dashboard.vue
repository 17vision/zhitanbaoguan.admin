<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- 标题和导出按钮 -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-bold text-gray-800">课程数据分析</h1>
            <el-button type="primary" :icon="Download" class="export-btn">导出数据</el-button>
        </div>
        <!-- 数据摘要卡片 -->
        <div class="grid grid-cols-4 gap-6 mb-6">
            <div v-for="item in summaryData" :key="item.title"
                class="bg-white rounded-lg shadow-sm flex-col p-5 flex    ">
                <div class=" flex   gap-5 h-full items-center">
                    <span class=" flex-1  font-[900] text-[#333333]">{{ item.title }}</span>
                    <div class="flex  gap-2 items-baseline flex-2">
                        <span class="text-2xl font-bold text-[#333]">{{ item.value }}</span>
                        <span class="ml-1 mt-2 text-[#999999]">{{ item.unit }}</span>
                    </div>
                </div>
                <div class=" flex  justify-between items-center mt-4">

                    <div class="w-12 h-12 flex items-center justify-center rounded ">
                        <img :src="item.icon" alt="">
                    </div>
                    <div class="flex  items-center mt-1 text-xs text-[#999999]">
                        日同比
                        <div
                            :class="item.change > 0 ? 'text-green-500 ml-1 flex gap-1 items-center' : 'text-red-500 ml-1 gap-1 flex items-center'">
                            <p> {{ Math.abs(item.change) }}</p>
                            <img :src="item.change > 0 ? ArrowDown : ArrowUp"
                                class="mr-0.5 w-3 h-3 transform rotate-180" />
                            <!-- <p> {{ item.changeUnit }}</p> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 单课数据 -->
        <div class="bg-white p-6 rounded-lg shadow-sm mb-6 ">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">单课数据</h2>
                <div>
                    <el-input placeholder="请输入课程名" v-model="from.searchText" class="w-40">
                        <template #suffix>
                            <el-icon class="cursor-pointer">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
            </div>
            <BarChart :chart-data="barChartOptions" />
        </div>
        <!-- 观看数据 -->
        <div class="bg-white p-6 rounded-lg shadow-sm ">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">观看数据</h2>
                <div class="flex items-center space-x-4">
                    <div class="w-32">
                        <el-select placeholder="情绪感知" v-model="from.searchType" class="w-32">
                            <el-option label="情绪感知" value="情绪感知" />
                        </el-select>
                    </div>
                    <div class="w-42">
                        <el-input placeholder="请输入课程名" v-model="from.searchText" class="w-40">
                            <template #suffix>
                                <el-icon class="cursor-pointer">
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="flex items-center "> <el-radio-group v-model="dateRange">
                            <el-radio-button label="日" />
                            <el-radio-button label="周" />
                            <el-radio-button label="月" />
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <LineChart :chart-data="lineChartOptions" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Download, Search } from '@element-plus/icons-vue'
import course from '@/assets/image/course.png'
import ArrowDown from '@/assets/image/ArrowDown.png'
import ArrowUp from '@/assets/image/ArrowUp.png'
import like from '@/assets/image/like.png'
import collect from '@/assets/image/collect.png'
import comment from '@/assets/image/comment.png'
import * as echarts from 'echarts'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'

const dateRange = ref('月')

const lineChartOptions = ref({
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: 30 }, (_, i) => `2024-${String(i + 1).padStart(2, '0')}`)
    },
    yAxis: {
        type: 'value',
        name: '单位(次)',

    },
    series: [
        {
            name: '情绪感知',
            type: 'line',
            smooth: true,
            data: [
                220, 182, 191, 234, 290, 330, 310, 280, 350, 400, 380, 360, 320, 280, 250, 230, 280, 320, 350, 380, 420, 400, 380, 350, 320, 280, 250, 260, 280, 300
            ],
            itemStyle: {
                color: '#A9A9F3'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: '#A9A9F3'
                    },
                    {
                        offset: 1,
                        color: '#FFFFFF'
                    }
                ])
            }
        }
    ]
})


const from = ref({
    searchType: '',
    searchText: ''
})
const barChartOptions = ref({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        top: '0',
        right: '0',
        icon: 'rect',
        selectedMode: false,
        itemWidth: 15,  // 设置图标宽度
        itemHeight: 15, // 设置图标高度
        borderRadius: 5  // 设置图标为圆角矩形

    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['净化身心', '缓解疲劳', '情绪感知', '克服恐惧'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '单位(次)',
        }
    ],
    series: [
        {
            name: '喜欢',
            type: 'bar',
            barWidth: '8%',
            data: [480, 180, 400, 350],
            itemStyle: {
                borderRadius: [15],
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#FFB5B5' }, // 顶部
                        { offset: 1, color: '#FF6363' }  // 底部
                    ]
                }
            }
        },
        {
            name: '收藏',
            type: 'bar',
            barWidth: '8%',
            data: [380, 240, 320, 300],
            itemStyle: {
                borderRadius: [15],

                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#FFD38B' },
                        { offset: 1, color: '#FF9D3B' }
                    ]
                }
            }
        },
        {
            name: '评论',
            type: 'bar',
            barWidth: '8%',
            data: [180, 280, 250, 280],
            itemStyle: {
                borderRadius: [15],

                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#C37EFF' },
                        { offset: 1, color: '#8815FF' }
                    ]
                }
            }
        }
    ]
})

const summaryData = ref([
    {
        title: '总课程数',
        value: 4,
        unit: '课',
        change: 1,
        changeUnit: '课',
        icon: course,
        iconBg: 'bg-blue-100',
        iconColor: '#409EFF'
    },
    {
        title: '总喜欢量',
        value: 234,
        unit: '次',
        change: -1,
        changeUnit: '次',
        icon: like,
        iconBg: 'bg-red-100',
        iconColor: '#F56C6C'
    },
    {
        title: '总收藏量',
        value: 443,
        unit: '次',
        change: 22,
        changeUnit: '次',
        icon: collect,
        iconBg: 'bg-yellow-100',
        iconColor: '#E6A23C'
    },
    {
        title: '总评论量',
        value: 321,
        unit: '条',
        change: 33,
        changeUnit: '条',
        icon: comment,
        iconBg: 'bg-purple-100',
        iconColor: '#67C23A'
    }
])
</script>

<style scoped lang="scss"></style>
