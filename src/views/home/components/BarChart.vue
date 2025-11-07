<template>
    <div ref="chartRef" :style="{ height: height, width: width }" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
    chartData: { type: Object, required: true }
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        setOptions()
    }
}

const setOptions = () => {
    if (chart) {
        chart.setOption(props.chartData)
    }
}

onMounted(() => {
    initChart()
})

watch(() => props.chartData, () => {
    setOptions()
}, { deep: true })
</script>