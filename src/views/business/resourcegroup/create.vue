<template>
    <el-dialog :title="form.id ? '编辑资源组' : '新增资源组'" v-model="dialogVisible" width="600px" >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="资源组名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资源组名称" maxlength="20" show-word-limit />
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
// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    name: [
        { required: true, message: '请输入资源组名称', trigger: 'blur' },
    ],
})
const form = ref<any>({
    name: '',
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
        if (form.value.id) {
            for (const key in form.value) {
                if (!form.value[key]) {
                    delete form.value[key]
                }
            }
            await api.updateResource_group(form.value)
            ElMessage.success('更新成功')
        } else {
            await api.createResource_group(form.value)
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
