<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        {{ title }}
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const title = ref('仪表盘')

onMounted(async () => {

})
</script>

<style scoped lang="scss"></style>
