<template>
    <el-dialog :title="form.id ? '编辑导师' : '新增导师'" v-model="dialogVisible" width="600px">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="导师名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入导师名称" maxlength="20" show-word-limit />
            </el-form-item>

            <el-form-item label="导师图片" prop="avatar">
                <div class="avatar-uploader">
                    <div v-if="form.avatar" class="relative w-full h-full">
                        <img :src="toURL(form.avatar)" class="cover-image" />
                        <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                            <el-icon :size="24" @click="form.avatar = ''">
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
                    <input type="file" name="avatar" id="teacherAvatarInput" @change="handleTeacherAvatarSuccess"
                        accept="image/*" style="display: none;">
                </div>
            </el-form-item>
            <el-form-item label="导师介绍" prop="introduction" class="mb-6">
                <el-input v-model="form.introduction" type="textarea" :rows="3" placeholder="请输入导师介绍" maxlength="200"
                    show-word-limit />
            </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <div class="flex justify-end mx-6">
           
        </div>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import {  Upload, Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/api'
import { uploadImage } from '@/api/utils'
// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    username: [
        { required: true, message: '请输入导师名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    avatar: [
        { required: true, message: '请上传导师图片', trigger: 'change' }
    ],
})
const form = ref<any>({
    username: '',
    avatar: '',
})

// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.avatar = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
    formRef.value?.validateField('avatar')
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
        if (form.value.avatar instanceof File) {
            const res = await uploadImage({
                file: form.value.avatar,
                info: {
                    referer: 'tutor'
                }
            })
            form.value.avatar = res.url
        }
        if (form.value.id) {
            for (const key in form.value) {
                if (!form.value[key]) {
                    delete form.value[key]
                }
            }
            await api.updateTutor(form.value)
            ElMessage.success('更新成功')
        } else {
            await api.createTutor(form.value)
            ElMessage.success('创建成功')
        }
        emit('submit', form.value)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = (row: any) => {
    form.value = {...row}
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
