<template>
    <div class="page-container">
        <el-card v-loading="$store.loading" shadow="never" class="form-card">
            <div class="card-header">
                <span class="card-title">{{ ruleForm.id ? '编辑点位' : '创建点位' }}</span>
            </div>

            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="90px" label-position="right"
                class="mt-4 form-grid">
                <!-- 左列 -->
                <div class="form-col">
                    <el-form-item label="点位名称" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入点位名称" clearable />
                    </el-form-item>

                    <el-form-item label="所属场馆" prop="venue_id">
                        <el-select v-model="ruleForm.venue_id" placeholder="请选择场馆" filterable :disabled="!!venue_id">
                            <el-option v-for="item in venues" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="点位地址">
                        <el-input v-model="ruleForm.address" placeholder="请输入点位地址" clearable />
                    </el-form-item>
                    <el-form-item label="标签" prop="tags">
                        <el-input v-model="ruleForm.tags" placeholder="请输入标签，多个标签用逗号分隔" clearable />
                    </el-form-item>
                </div>

                <!-- 右列 -->
                <div class="form-col">
                    <el-form-item label="场馆封面">
                        <div class="avatar-uploader">
                            <div v-if="ruleForm.cover" class="relative w-full h-full">
                                <img :src="toUrl(ruleForm.cover)" class="w-full h-full object-cover rounded-lg" />
                                <div class="absolute top-1 right-1 bg-black/20 p-1 rounded-full w-6 h-6 cursor-pointer flex items-center justify-center"
                                    @click="ruleForm.cover = ''">
                                    <el-icon size="16" color="#fff">
                                        <Close />
                                    </el-icon>
                                </div>
                            </div>

                            <label v-else for="coverInput"
                                class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                <el-icon size="32" color="#8c939d">
                                    <Plus />
                                </el-icon>
                                <span class="text-gray-500 text-xs mt-1">点击上传</span>
                            </label>
                            <input type="file" id="coverInput" accept="image/*" @change="handleCoverSuccess"
                                class="hidden" />
                        </div>
                    </el-form-item>

                    <el-form-item label="营业时间">
                        <div class="flex gap-2 items-center">
                            <el-form-item prop="open_time" class="mb-0 flex-1">
                                <el-time-select v-model="ruleForm.open_time" format="HH:mm:ss" placeholder="开门"
                                    style="width:140px" />
                            </el-form-item>
                            <span class="text-gray-400">—</span>
                            <el-form-item prop="close_time" class="mb-0 flex-1">
                                <el-time-select v-model="ruleForm.close_time" format="HH:mm:ss" placeholder="关门"
                                    style="width:140px" />
                            </el-form-item>
                        </div>
                    </el-form-item>

                    <el-form-item label="经纬度">
                        <div class="flex gap-2">
                            <el-form-item prop="longitude" class="mb-0 flex-1">
                                <el-input v-model="ruleForm.longitude" placeholder="经度" style="width:100%" />
                            </el-form-item>
                            <el-form-item prop="latitude" class="mb-0 flex-1">
                                <el-input v-model="ruleForm.latitude" placeholder="纬度" style="width:100%" />
                            </el-form-item>
                        </div>
                    </el-form-item>
                </div>

                <!-- 介绍（通栏） -->
                <el-form-item label="介绍" prop="introduction" class="form-full">
                    <RichEditor v-model="ruleForm.introduction" placeholder="请输入场馆介绍" />
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item class="form-footer form-full">
                    <el-button type="primary" @click="submitRole" :loading="$store.loading">
                        {{ ruleForm.id ? '保存修改' : '立即创建' }}
                    </el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { Close, Plus } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import venuesApi from '@/api/business/venues'
import placesApi from '@/api/business/places'
import { uploadFiles } from '@/api/utils'

interface RuleForm {
    id?: string
    name: string
    introduction: string
    venue_id?: number
    parent_id?: number
    cover?: string | File
    address?: string
    open_time?: string
    close_time?: string
    tag?: string
    longitude?: string
    latitude?: string
    [key: string]: any
}

const router = useRouter()
const route = useRoute()
const ruleFormRef = ref<FormInstance>()

const venues = ref<any[]>([])

const initialForm = (): RuleForm => ({
    name: '',
    introduction: '',
    cover: '',
    address: '',
    open_time: '',
    close_time: '',
    longitude: '',
    latitude: '',
})

const venue_id = computed(() => {
    return +(route.query.venue_id as string || '')
})
const parent_id = computed(() => {
    return +(route.query.parent_id as string || '')
})

const ruleForm = reactive<RuleForm>(initialForm())

const rules = reactive<FormRules<RuleForm>>({
    name: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
    venue_id: [{ required: true, message: '请选择所属场馆', trigger: 'change' }],
    address: [{ required: true, message: '请输入点位地址', trigger: 'blur' }],
})

const toUrl = (cover: string | File) => {
    if (typeof cover === 'string') {
        return cover
    } else {
        return URL.createObjectURL(cover)
    }
}

const submitRole = () => {
    ruleFormRef.value?.validate(async (valid) => {
        if (!valid) return
        const data: any = { ...ruleForm }

        if (data.cover instanceof File) {
            const res = await uploadFiles({
                file: data.cover,
                info: { referer: 'place', type: 'image' }
            })
            data.cover = res.url
        }
        const api = data.id ? placesApi.put : placesApi.create
        try {
            for (const key in data) {
                if (data[key] === '' || data[key] === null || data[key] === undefined || data[key] === 0) {
                    delete data[key]
                }
            }
            await api(data)
            ElNotification.success({ title: '成功', message: ruleForm.id ? '修改成功' : '创建成功' })
            setTimeout(() => goBack(), 800)
        } catch (err) {
            ElNotification.error({ title: '失败', message: ruleForm.id ? '修改失败' : '创建失败' })
        }
    })
}

const handleCoverSuccess = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    ruleForm.cover = file
        ; (e.target as HTMLInputElement).value = ''
}

const goBack = () => {
    router.back()
}

onMounted(async () => {
    const { id } = route.query as { id?: string }
    venuesApi.list({ page: 1, limit: 100 }).then(res => {
        venues.value = res.data
    })

    if (id) {
        const res = await placesApi.detail(id)
        for (const key in res) {
            if (res[key]) {
                ruleForm[key] = res[key]
            }
        }

    } else if (venue_id.value || parent_id.value) {

        ruleForm.venue_id = venue_id.value
        ruleForm.parent_id = parent_id.value
    }
})
</script>

<style scoped>
.page-container {
    max-width: 900px;
    margin: 20px auto;
    padding: 0 20px;
}

.form-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    padding: 24px 32px;
}

.card-header {
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 14px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #222;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 32px;
}

.form-col {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-full {
    margin-top: 16px;
    grid-column: 1 / -1;
}

:deep(.el-form-item) {
    margin-bottom: 0 !important;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}

.form-footer {
    text-align: center;
    margin-top: 10px !important;
}

.avatar-uploader {
    width: 160px;
    aspect-ratio: 16 / 9;
    background: #fafafa;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
</style>