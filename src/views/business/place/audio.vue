<template>
    <div class="page-container">
        <el-card v-loading="$store.loading" shadow="never" class="form-card">
            <div class="card-header">
                <span class="card-title">{{ ruleForm.id ? '编辑音频' : '创建音频' }}</span>
            </div>

            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px" label-position="right"
                class="mt-4">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入名称" clearable style="width: 400px" />
                </el-form-item>

                <el-form-item label="音频" prop="voice">
                    <div class="avatar-uploader">
                        <div v-if="ruleForm.voice" class="relative w-full h-full flex">
                            <audio :src="toUrl(ruleForm.voice)" controls class="w-50 h-20 object-cover rounded-lg" />
                            <div class="absolute top-1 right-1 bg-black/20 p-1 rounded-full w-6 h-6 cursor-pointer flex items-center justify-center"
                                @click="ruleForm.voice = ''">
                                <el-icon size="16" color="red">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>

                        <label v-else for="coverInput"
                            class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <span class="text-gray-500 text-xs mt-1">点击上传</span>
                        </label>
                        <input type="file" id="coverInput" accept="audio/*" @change="handleCoverSuccess"
                            class="hidden" />
                    </div>
                </el-form-item>

                <el-form-item label="介绍" prop="content">
                    <el-input v-model="ruleForm.content" type="textarea" :rows="8" placeholder="请输入介绍" clearable
                        style="width: 400px" />
                </el-form-item>

                <el-form-item class="form-footer">
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
import { Close } from '@element-plus/icons-vue'

import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification } from "element-plus";
import place_introductionsApi from "@/api/business/place_introductions";
import { uploadFiles } from '@/api/utils'

interface RuleForm {
    id?: string;
    voice: string | File;
    name: string;
    content: string;
    [key: string]: any;
}

const initialForm = (): RuleForm => ({
    voice: "",
    name: "",
    content: "",
});

const router = useRouter();
const route = useRoute();
const ruleForm = reactive<RuleForm>(initialForm());
const ruleFormRef = ref<FormInstance>();

const place_id = computed(() => route.query.place_id as string);

// 校验规则
const rules = reactive<FormRules<RuleForm>>({

    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    voice: [{ required: true, message: "请上传音频", trigger: "blur" }],
    content: [{ required: true, message: "请输入介绍", trigger: "blur" }],
});

// 提交
function submitRole() {
    ruleFormRef.value?.validate(async (valid) => {
        if (!valid) return;

        const data: any = { place_id: place_id.value, ...ruleForm };
        if (data.voice instanceof File) {
            const res = await uploadFiles({
                file: data.voice,
                info: { referer: 'place', type: 'audio' }
            })
            data.voice = res.url
        }
        const api = data.id ? place_introductionsApi.put : place_introductionsApi.create;

        try {
            for (const key in data) {
                if (data[key] === '' || data[key] === null || data[key] === undefined || data[key] === 0) {
                    delete data[key]
                }
            }
            await api(data);
            ElNotification.success({
                title: "成功",
                message: ruleForm.id ? "修改成功" : "创建成功",
                duration: 2500,
            });
            setTimeout(() => goBack(), 800);
        } catch (err) {
            ElNotification.error({
                title: "失败",
                message: ruleForm.id ? "修改失败" : "创建失败",
            });
        }
    });
}


const handleCoverSuccess = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    ruleForm.voice = file;
    ruleFormRef.value?.validateField('voice');
    (e.target as HTMLInputElement).value = ''
}

// 返回
function goBack() {
    router.back();
}

const toUrl = (voice: string | File) => {
    if (typeof voice === 'string') {
        return voice
    } else {
        return URL.createObjectURL(voice)
    }
}

onMounted(async () => {
    const { id } = route.query as { id?: string };
    if (id) {
        const res = await place_introductionsApi.detail(id)
        for (const key in res) {
            if (res[key]) {
                ruleForm[key] = res[key]
            }
        }
    }
});
</script>

<style scoped>
.page-container {
    max-width: 800px;
    margin: 30px auto;
    padding: 0 20px;
}

.form-card {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    padding: 24px 36px;
}

.card-header {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.form-footer {
    text-align: center;
    margin-top: 30px;
}

:deep(.el-form-item) {
    margin-bottom: 22px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}
</style>