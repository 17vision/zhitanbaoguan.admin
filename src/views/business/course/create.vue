<template>
    <div>
        <div class="p-4 relative">
            <!-- 页面标题 -->
            <div class="flex justify-between items-center mb-6 py-4 sticky top-0 bg-white z-10">
                <h2 class="text-xl font-bold">{{ formData.id ? '编辑课程' : '新增课程' }}</h2>
                <div class="space-x-2">
                    <el-button @click="handleBack">返回列表</el-button>
                    <el-button @click="handleSaveDraft">保存草稿</el-button>
                    <el-button type="primary" @click="handlePublish">发布课程</el-button>
                </div>
            </div>

            <!-- 步骤导航 -->
            <div class="mb-6">
                <el-steps :active="activeStep" finish-status="success">
                    <el-step title="基础信息" @click="handleStepChange(0)">
                        <template #icon>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="场景设置" @click="handleStepChange(1)">
                        <template #icon>
                            <el-icon>
                                <Picture />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="章节内容" @click="handleStepChange(2)">
                        <template #icon>
                            <el-icon>
                                <Document />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="课后作业" @click="handleStepChange(3)">
                        <template #icon>
                            <el-icon>
                                <EditPen />
                            </el-icon>
                        </template>
                    </el-step>
                </el-steps>
            </div>

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

            <!-- 课后作业 -->
            <div v-if="activeStep === 3">
                <FourVue :formData="formData" ref="nextRef"></FourVue>
            </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="mt-6 flex justify-between p-5 sticky bottom-0 bg-white z-10">
            <el-button @click="handlePrev" :disabled="activeStep === 0">上一步</el-button>
            <div class="space-x-2">
                <el-button @click="handleSaveDraft">保存草稿</el-button>
                <el-button type="primary" @click="handleNext" v-if="activeStep < 3">下一步</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Picture, Document, EditPen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import OneVue from './components/one.vue'
import TwoVue from './components/two.vue'
import ThreeVue from './components/three.vue'
import FourVue from './components/four.vue'
import api from '@/api/admin/api'
const router = useRouter()
const route = useRoute()
// 当前步骤
const activeStep = ref(0)
const nextRef = ref<InstanceType<typeof OneVue | typeof TwoVue | typeof ThreeVue | typeof FourVue>>()
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

// 返回列表
const handleBack = () => {
    router.push({ name: 'course.index' })
}
// 保存草稿
const handleSaveDraft = () => {
    ElMessage.success('保存草稿成功')
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
        await api.updateCourse({ id: res.id, status: 1 })
        ElMessage.success('发布课程成功')
        router.push({ name: 'course.index' })
    }
}
</script>

<style scoped></style>
