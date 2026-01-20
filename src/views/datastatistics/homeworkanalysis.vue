<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- 标题和导出按钮 -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-bold text-gray-800">作业分析</h1>
            <!-- <el-button type="primary" :icon="Download" class="export-btn">导出数据</el-button> -->
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

                    <div class="w-30 h-30 flex items-center justify-center rounded ">
                        <img :src="item.icon" alt="">
                    </div>
                    <div class="flex  items-center mt-1 text-xs text-[#999999]">
                        <!-- 日同比
                        <div
                            :class="item.change >= 0 ? 'text-green-500 ml-1 flex gap-1 items-center' : 'text-red-500 ml-1 gap-1 flex items-center'">
                            <p> {{ Math.abs(item.change) }}</p>
                            <img :src="item.change >= 0 ? ArrowDown : ArrowUp"
                                class="mr-0.5 w-3 h-3 transform rotate-180" />
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- 作业完成情况 -->
        <div class="bg-white p-6 rounded-lg shadow-sm mb-6 ">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">作业完成情况</h2>
                <div>
                    <!-- <el-input placeholder="请输入作业名" v-model="searchText" class="w-40" @keyup.enter="getBarData">
                        <template #suffix>
                            <el-icon class="cursor-pointer" @click="getBarData">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input> -->
                </div>
            </div>
            <BarChart :chart-data="barChartOptions" />
        </div>
        <!-- 用户作业完成数统计 -->
        <div class="bg-white p-6 rounded-lg shadow-sm ">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">用户作业完成数统计</h2>

            </div>
            <LineChart :chart-data="lineChartOptions" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import api from '@/api/admin/api'
import * as echarts from 'echarts'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import IconOne from '@/assets/image/datastatistics/one.png'
import IconTwo from '@/assets/image/datastatistics/two.png'
import IconThree from '@/assets/image/datastatistics/three.png'
import IconFour from '@/assets/image/datastatistics/four.png'
import IconFive from '@/assets/image/datastatistics/five.png'
import IconSix from '@/assets/image/datastatistics/six.png'
import IconSeven from '@/assets/image/datastatistics/seven.png'
import Icon8 from '@/assets/image/datastatistics/8.png'





const searchText = ref('')
const homeworkBarList = ref<any[]>([])
const barChartOptions = computed(() => ({
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
        bottom: 5,
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: homeworkBarList.value.map(item => item.homework_name),
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                formatter: function (params: any) {
                    var newParamsName = ""; // 最终拼接成的字符串
                    var paramsNameNumber = params.length; // 实际标签的个数
                    var provideNumber = 6; // 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = ""; // 表示每一次截取的字符串
                            var start = p * provideNumber; // 开始截取的位置
                            var end = start + provideNumber; // 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p == rowNumber - 1) { // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else { // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr; // 最终拼成的字符串
                        }
                    } else { // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName
                }
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
        }
    ],

    series: [
        {
            name: '完成',
            type: 'bar',
            barWidth: '8%',
            data: homeworkBarList.value.map(item => item.finished),
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
            name: '总数',
            type: 'bar',
            barWidth: '8%',
            data: homeworkBarList.value.map(item => item.total),
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
        // {
        //     name: '比例(%)',
        //     type: 'bar',
        //     barWidth: '8%',
        //     data: homeworkBarList.value.map(item => item.rate.replace("%", "")),
        //     itemStyle: {
        //         borderRadius: [15],
        //         color: {
        //             type: 'linear',
        //             x: 0,
        //             y: 0,
        //             x2: 0,
        //             y2: 1,
        //             colorStops: [
        //                 { offset: 0, color: '#C37EFF' },
        //                 { offset: 1, color: '#8815FF' }
        //             ]
        //         }
        //     }
        // }
    ]
}))


const from = ref({
    title: '',
    type: 1
})

const lineData = ref<any[]>([])
const lineChartOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: 10,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: lineData.value.map(item => item.nickname),
        axisLabel: {
            interval: 0,
            rotate: 40,
        },

    },
    yAxis: {
        type: 'value',
        name: '完成数量',

    },
    series: [
        {
            name: '完成作业数',
            type: 'line',
            smooth: true,
            data: lineData.value.map(item => item.count),
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
}))




const summaryData = ref([
    {
        title: '作业总数',
        value: 0,
        unit: '份',
        change: 0,
        icon: IconOne,
    },
    {
        title: '已完成',
        value: 0,
        unit: '人',
        change: 0,
        icon: IconTwo,
    },
    {
        title: '按时完成',
        value: 0,
        unit: '份',
        change: 0,
        icon: IconThree,
    },
    {
        title: '待完成',
        value: 0,
        unit: '份',
        change: 0,
        icon: IconFour,
    },
    {
        title: '超时完成',
        value: 0,
        unit: '份',
        change: 0,
        icon: IconFive,
    },
    {
        title: '未完成',
        value: 0,
        unit: '份',
        change: 0,
        icon: IconSix,
    },
    {
        title: '按时完成率',
        value: 0,
        unit: '%',
        change: 0,
        icon: IconSeven,
    }
    ,
    {
        title: '完成率',
        value: 0,
        unit: '%',
        change: 0,
        icon: Icon8,
    }
])


const getBarData = async () => {
    const res = await api.homeworkanalysis_view()
    console.log(res);

    homeworkBarList.value = res.homework_rates as any[] || []
    lineData.value = res.user_rankings as unknown as any[] || []

}

onMounted(async () => {
    const res = await api.homeworkanalysis_basic()
    const mapping = [
        { key: 'total', compare: 'collect_count_compare' },
        { key: 'finished', compare: 'like_count_compare' },
        { key: 'ontime_finished', compare: 'course_count_compare' },
        { key: 'pending', compare: 'message_count_compare' },
        { key: 'timeout_finished', compare: 'message_count_compare' },
        { key: 'unfinished', compare: 'message_count_compare' },
        { key: 'ontime_finished_rate', compare: 'message_count_compare' },
        { key: 'finished_rate', compare: 'message_count_compare' },
    ];

    summaryData.value = mapping.map((m, i) => {
        let rawValue = res[m.key] ?? 0

        // 如果是字符串带百分号
        if (typeof rawValue === 'string' && rawValue.includes('%')) {
            // 去掉 % 并转为数字
            rawValue = (rawValue.replace('%', ''))
        } else {
            // 尝试转为数字
            rawValue = Number(rawValue) || 0
        }

        return {
            ...summaryData.value[i],
            value: rawValue
        }
    })

    getBarData()
})
</script>

<style scoped lang="scss"></style>
