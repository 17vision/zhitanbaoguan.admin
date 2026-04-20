<template>
    <div class="page-container">
        <el-card v-loading="$store.loading" shadow="never" class="form-card">
            <div class="card-header">
                <span class="card-title">{{ ruleForm.id ? '编辑场馆' : '创建场馆' }}</span>
            </div>

            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="90px" label-position="right"
                class="mt-4 form-grid">
                <!-- 左列 -->
                <div class="form-col">
                    <el-form-item label="场馆名称" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入场馆名称" clearable />
                    </el-form-item>

                    <el-form-item label="联系手机" prop="phone">
                        <el-input v-model="ruleForm.phone" placeholder="请输入手机号" clearable />
                    </el-form-item>

                    <el-form-item label="所属组织" prop="organization_id">
                        <el-select v-model="ruleForm.organization_id" placeholder="请选择组织" filterable>
                            <el-option v-for="item in organizationList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="场馆地址" prop="address">
                        <el-input v-model="ruleForm.address" placeholder="请输入场馆地址" clearable />
                    </el-form-item>
                    <el-form-item label="小程序路径" prop="qrcode_root">
                        <el-input v-model="ruleForm.qrcode_root" placeholder="请输入小程序路径" clearable />
                    </el-form-item>
                </div>

                <!-- 右列 -->
                <div class="form-col">
                    <el-form-item label="场馆封面">
                        <div class="avatar-uploader">
                            <div v-if="ruleForm.cover" class="relative w-full h-full">
                                <img :src="toUrl(ruleForm.cover)" class="w-full h-full object-cover rounded-lg" />
                                <div class="absolute top-1 right-1 bg-black/50 p-1 rounded-full cursor-pointer w-6 h-6 cursor-pointer flex items-center justify-center"
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
                            <el-form-item class="mb-0 flex-1">
                                <el-time-select v-model="ruleForm.open_time" format="HH:mm:ss" placeholder="开门"
                                    style="width:140px" />
                            </el-form-item>
                            <span class="text-gray-400">—</span>
                            <el-form-item class="mb-0 flex-1">
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
                <el-form-item label="场馆介绍" prop="introduction" class="form-full">
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
import organizationsApi from '@/api/business/organization'
import { uploadFiles } from '@/api/utils'

interface RuleForm {
    id?: string
    phone: string
    name: string
    introduction: string
    organization_id?: string
    cover?: string | File
    address?: string
    open_time?: string
    close_time?: string
    longitude?: string
    latitude?: string
    [key: string]: any
}

const router = useRouter()
const route = useRoute()
const ruleFormRef = ref<FormInstance>()

const organizationList = ref<any[]>([])

const initialForm = (): RuleForm => ({
    phone: '',
    name: '',
    introduction: '',
    organization_id: '',
    cover: '',
    address: '',
    open_time: '',
    close_time: '',
    longitude: '',
    latitude: '',
})

const toUrl = (cover: string | File) => {
    if (typeof cover === 'string') {
        return cover
    } else {
        return URL.createObjectURL(cover)
    }
}

const ruleForm = reactive<RuleForm>(initialForm())

const rules = reactive<FormRules<RuleForm>>({
    name: [{ required: true, message: '请输入场馆名称', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' },
    ],
    organization_id: [{ required: true, message: '请选择组织', trigger: 'change' }],
    address: [{ required: true, message: '请输入场馆地址', trigger: 'blur' }],
    open_time: [{ required: true, message: '请选择开门时间', trigger: 'change' }],
    close_time: [{ required: true, message: '请选择关门时间', trigger: 'change' }],
})

const submitRole = () => {
    ruleFormRef.value?.validate(async (valid) => {
        if (!valid) return
        const data = { ...ruleForm }
        if (data.cover instanceof File) {
            const res = await uploadFiles({
                file: data.cover,
                info: { referer: 'venue', type: 'image' }
            })
            data.cover = res.url
        }
        const api = data.id ? venuesApi.put : venuesApi.create
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
    organizationsApi.list({ page: 1, limit: 100 }).then(res => {
        organizationList.value = res.data
    })
    if (id) {
        const res = await venuesApi.detail(id)
        Object.assign(ruleForm, res)
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
    width: 230px;
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