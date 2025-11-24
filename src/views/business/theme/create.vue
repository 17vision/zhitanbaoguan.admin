<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="600px">

        <!-- 提交按钮 -->
        <div class="px-6" style="overflow-y: auto; max-height: 600px;">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="名称" prop="username">
                    <el-input v-model="form.username" placeholder="请输入名称" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="图片" prop="cover">
                    <div class="avatar-uploader">
                        <div v-if="form.cover" class="relative w-full h-full">
                            <img :src="toURL(form.cover)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" @click="form.cover = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="teacherAvatarInput" v-else
                            class=" w-full h-full rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ">
                            <el-icon class="text-gray-400 text-32px mb-3">
                                <Upload />
                            </el-icon>
                            <span class="text-gray-500 text-sm">点击上传</span>
                        </label>
                        <input type="file" name="cover" id="teacherAvatarInput" @change="handleTeacherAvatarSuccess"
                            accept="image/*" style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="资源" prop="path">
                    <div>
                        <div v-if="form.path" class="relative w-full h-full">
                            <img v-if="isPath(form.path) === 1" :src="toURL(form.path)" class="cover-image1" />
                            <video v-if="isPath(form.path) === 2" class="cover-image2" controls>
                                <source :src="toURL(form.path)" type="video/mp4">
                            </video>
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" @click="form.path = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="pathInput" v-else
                            class=" w-full h-full rounded-lg px-6 flex flex-col items-center justify-center cursor-pointer ">
                            <span class="text-gray-500 text-sm font-bold text-[#409eff]">点击上传</span>
                        </label>
                        <input type="file" name="path" id="pathInput" @change="handleResourceSuccess"
                            accept="image/*,.mp4" style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="签名" prop="introduction" class="mb-6">
                    <el-input v-model="form.introduction" type="textarea" :rows="6" placeholder="请输入签名" maxlength="200"
                        show-word-limit />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { Upload, Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/tutors'
import { uploadImage, uploadFiles } from '@/api/utils'

// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    username: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    cover: [
        { required: true, message: '请上传图片', trigger: 'change' }
    ],
    path: [
        { required: true, message: '请上传资源', trigger: 'change' }
    ],
    introduction: [
        { required: true, message: '请输入签名', trigger: 'blur' },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ]
})
const form = ref<any>({
    username: '',
    cover: '',
    status: 0,
})

// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.cover = file
    e.target.value = ''
    formRef.value?.validateField('cover')
}

const handleResourceSuccess = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type.startsWith('image') || file.type.startsWith('video')) {
        form.value.path = file
        e.target.value = ''
        formRef.value?.validateField('path')
    }
}

const isPath = (file: any) => {
    return file instanceof File ? file.type.startsWith('image') ? 1 : 2 : file.includes('.mp4') ? 2 : 1
}

const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}

const validate = () => {
    return new Promise((resolve, reject) => {
        formRef.value?.validate((valid: boolean) => {
            if (valid) {
                resolve(form.value)
            } else {
                reject(new Error('校验失败'))
            }
        })
    })
}
// 提交表单
const handleSubmit = async () => {
    try {
        await validate()
        if (form.value.path instanceof File) {
            if (form.value.type.startsWith('image')) {
                const res = await uploadImage({
                    file: form.value.path,
                    info: { referer: 'theme' }
                })
                form.value.path = res.url
            } else {
                const res = await uploadFiles({
                    file: form.value.path,
                    info: { referer: 'theme', type: 'video' }
                })
                form.value.path = res
            }
        }
        if (form.value.id) {
            for (const key in form.value) {
                if (!form.value[key]) {
                    delete form.value[key]
                }
            }
            await api.update(form.value)
            ElMessage.success('更新成功')
        } else {
            await api.create(form.value)
            ElMessage.success('创建成功')
        }
        emit('submit', form.value)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = (row: any) => {

    form.value = {
        status: 0,
        ...row
    }
    dialogVisible.value = true
}

defineExpose({
    open
})
</script>

<style lang='scss' scoped>
.avatar-uploader {
    width: 150px;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    display: flex;
}

.cover-image {
    width: 100%;
    height: 100%;
}
</style>
