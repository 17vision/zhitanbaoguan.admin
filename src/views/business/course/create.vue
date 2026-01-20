<template>
    <div>
        <div class="pt-4 relative">
            <!-- 页面标题 -->
            <div class="flex justify-between items-center px-5 ">
                <div class="flex items-center">
                    <div v-for="(item, index) in steps" :key="index"
                        :class="['step-item', { 'active': activeStep === index }]" @click="handleStepChange(index)">
                        <img :src="activeStep === index ? item.activeIcon : item.icon" alt="">
                        <div>{{ item.title }}</div>
                    </div>
                </div>
                <div class="space-x-2 mr-5">
                    <el-button type="primary" @click="handleAddChapter" v-if="activeStep === 2">
                        <el-icon class="mr-1">
                            <Plus />
                        </el-icon>添加章节
                    </el-button>
                    <el-button type="primary" @click="handlePublish">
                        <template #icon>
                            <img :src="fabu" alt="" class="w-4 h-4">
                        </template>
                        发布课程
                    </el-button>
                </div>
            </div>

        </div>
        <div class="m-5 bg-white  h-[calc(100vh-260px)] overflow-y-auto  rounded-[8px]">
            <!-- 基础信息 -->
            <div v-if="activeStep === 0">
                <OneVue :formData="formData" ref="nextRef"></OneVue>
            </div>

            <!-- 场景设置 -->
            <div v-if="activeStep === 1">
                <TwoVue :formData="formData" ref="nextRef"></TwoVue>
            </div>

            <!-- 章节内容 -->
            <div v-if="activeStep === 2">
                <ThreeVue :formData="formData" ref="nextRef"></ThreeVue>
            </div>
        </div>
        <!-- 底部操作按钮 -->
        <div class="btn-group">
            <el-button @click="handlePrev" :disabled="activeStep === 0">上一步</el-button>
            <div class="space-x-4">
                <el-button @click="handleBack">取消</el-button>
                <el-button type="primary" plain @click="handleSaveDraft">保存草稿</el-button>
                <el-button type="primary" @click="handleNext" v-if="activeStep < 2">下一步</el-button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import kc1 from '@/assets/image/course/kc1.png'
import fabu from '@/assets/image/course/fabu.png'
import kc11 from '@/assets/image/course/kc11.png'
import kc2 from '@/assets/image/course/kc2.png'
import kc22 from '@/assets/image/course/kc22.png'
import kc3 from '@/assets/image/course/kc3.png'
import kc33 from '@/assets/image/course/kc33.png'
import { useRouter } from 'vue-router'
import OneVue from './components/one.vue'
import TwoVue from './components/two.vue'
import ThreeVue from './components/three.vue'
import api from '@/api/admin/api'
const router = useRouter()
const route = useRoute()

const activeStep = ref(0)

const steps = ref([
    {
        title: '基础信息',
        icon: kc1,
        activeIcon: kc11
    },
    {
        title: '场景设置',
        icon: kc2,
        activeIcon: kc22
    },
    {
        title: '章节内容',
        icon: kc3,
        activeIcon: kc33
    },
])
// 当前步骤
const nextRef = ref<InstanceType<typeof OneVue> | InstanceType<typeof TwoVue> | InstanceType<typeof ThreeVue>>()
// 表单数据
const formData = ref<any>({})
// 上一步
const handlePrev = () => {
    if (activeStep.value > 0) {
        activeStep.value--
    }
}

const handleStepChange = (val: number) => {
    if (route.query.id) {
        activeStep.value = val
    }
}
// 下一步
const handleNext = () => {
    if (nextRef.value) {
        nextRef.value?.validate().then((res: any) => {
            formData.value = { ...formData.value, ...res }
            activeStep.value++
        })
    }
}

// 添加章节
const handleAddChapter = () => {
    if (activeStep.value === 2) {
        (nextRef.value as { addChapter?: () => void })?.addChapter?.()
    }
}
// 返回列表
const handleBack = () => {
    router.push({ name: 'course.index' })
}
// 保存草稿
const handleSaveDraft = () => {
    ElNotification.success('保存草稿成功')
    if (nextRef.value) {
        nextRef.value?.validate().then(() => {
            router.push({ name: 'course.index' })
        })
    }
}

// 发布课程
const handlePublish = async () => {
    if (nextRef.value) {
        const res = await nextRef.value?.validate() as any
        if (res.id || route.query.id) {
            await api.updateCourse({ id: res.id || route.query.id, status: 1 })
            ElNotification.success('发布课程成功')
            router.push({ name: 'course.index' })
        }
    }
}
</script>

<style scoped lang="scss">
.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 30px;
    padding: 0 0 10px;
    font-size: 12px;
    color: #666666;
    position: relative;

    &.active {
        border-bottom: 4px solid #7B68EE;
    }

    img {
        width: 30px;
        height: 30px;
        margin-bottom: 10px;
    }
}

.btn-group {
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: #fff;
    width: calc(100% - var(--side-bar-width));
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
