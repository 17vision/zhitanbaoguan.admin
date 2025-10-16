<template>
    <div>
        <div class="p-4 relative">
            <!-- 页面标题 -->
            <div class="flex justify-between items-center mb-6 py-4 sticky top-0 bg-white z-10">
                <h2 class="text-xl font-bold">新增课程</h2>
                <div class="space-x-2">
                    <el-button @click="handleSaveDraft">保存草稿</el-button>
                    <el-button type="primary" @click="handlePublish">发布课程</el-button>
                </div>
            </div>

            <!-- 步骤导航 -->
            <div class="mb-6">
                <el-steps :active="activeStep" finish-status="success">
                    <el-step title="基础信息">
                        <template #icon>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="场景设置">
                        <template #icon>
                            <el-icon>
                                <Picture />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="章节内容">
                        <template #icon>
                            <el-icon>
                                <Document />
                            </el-icon>
                        </template>
                    </el-step>
                    <el-step title="课后作业">
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
                <OneVue :form="formData" ref="nextRef"></OneVue>
            </div>

            <!-- 场景设置 -->
            <div v-if="activeStep === 1">
                <TwoVue :form="formData" ref="nextRef"></TwoVue>
            </div>

            <!-- 章节内容 -->
            <div v-if="activeStep === 2">
                <ThreeVue :form="formData" ref="nextRef"></ThreeVue>
            </div>

            <!-- 课后作业 -->
            <div v-if="activeStep === 3">
                <FourVue :form="formData" ref="nextRef"></FourVue>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Picture, Document, EditPen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import OneVue from './components/one.vue'
import TwoVue from './components/two.vue'
import ThreeVue from './components/three.vue'
import FourVue from './components/four.vue'
const router = useRouter()
// 当前步骤
const activeStep = ref(0)
const nextRef = ref<InstanceType<typeof OneVue | typeof TwoVue | typeof ThreeVue | typeof FourVue>>(null)
// 表单数据
const formData = reactive<any>({})





// 上一步
const handlePrev = () => {
    if (activeStep.value > 0) {
        activeStep.value--
    }
}

// 下一步
const handleNext = () => {
    if (nextRef.value) {
        nextRef.value?.validate().then(() => {
            activeStep.value++
        })
    }
}

// 保存草稿
const handleSaveDraft = () => {
    ElMessage.success('保存草稿成功')
    if (nextRef.value) {
        nextRef.value?.validate().then(() => {
            router.go(-1)

        })
    }
}

// 发布课程
const handlePublish = () => {
    ElMessage.success('发布课程成功')
    router.go(-1)


}



</script>

<style scoped></style>
