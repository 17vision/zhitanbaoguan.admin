<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="650px" @close="handleClose"
        :close-on-click-modal="false">

        <!-- 提交按钮 -->
        <div class="px-6">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
                <el-row :gutter="24">
                    <el-col :span="14">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name" readonly placeholder="请输入名称" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-form-item label="价格" prop="price">
                            <el-input v-model="form.price" placeholder="请输入价格" type="number" />
                        </el-form-item>
                        <el-form-item label="介绍" class="mb-6">
                            <el-input v-model="form.description" readonly type="textarea" :rows="8" placeholder="请输入介绍"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="ml-auto">
                        <el-form-item label="图片" prop="cover">
                            <div class="avatar-uploader">
                                <div v-if="form.cover" class="relative ">
                                    <img v-if="isPath(form.cover) === 1" :src="toURL(form.cover)" />
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ElNotification } from 'element-plus'
import { ref } from 'vue'
import api from '@/api/admin/workflows'

// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],



    introduction: [
        { required: true, message: '请输入介绍', trigger: 'blur' },
        { min: 2, max: 225, message: '长度在 2 到 225 个字符', trigger: 'blur' }
    ],
})
const form = ref<any>({
})




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
const handleClose = () => {
    dialogVisible.value = false
    form.value = {
        id: undefined,
    }
    nextTick(() => {
        formRef.value?.clearValidate()
    })
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
            await api.putWorkflows(form.value)
            ElNotification.success('更新成功')
        }
        emit('submit', form.value)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = async (id: any) => {

    const res = await api.getDetail(id)

    form.value = {
        ...res
    }
    formRef.value?.resetFields()

    dialogVisible.value = true
}

defineExpose({
    open
})




</script>

<style lang='scss' scoped>
.avatar-uploader {
    width: 100%;
    border-radius: 8px;
    display: flex;
}

.cover-image {
    width: 100%;
}
</style>
