<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="650px" :close-on-click-modal="false">

        <!-- 提交按钮 -->
        <div class="px-6">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
                <el-row :gutter="24">
                    <el-col :span="14">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入标题" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-form-item label="作者" class="mb-6">
                            <el-input v-model="form.author" placeholder="写下作者的名字" />
                        </el-form-item>
                        <el-form-item label="文案" class="mb-6">
                            <el-input v-model="form.text" type="textarea" :rows="11" placeholder="写下你每日的动力来源"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class="ml-auto">
                        <el-form-item label="图片" prop="image">
                            <div class="avatar-uploader">
                                <div v-if="form.image" class="relative w-full h-full">
                                    <img :src="toURL(form.image)" class="cover-image" />
                                    <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                        <el-icon :size="24" @click="form.image = ''">
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
                                <input type="file" name="image" id="teacherAvatarInput"
                                    @change="handleTeacherAvatarSuccess" accept="image/*" style="display: none;">
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
import { Upload, Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/daily_sentences'
import { uploadImage, uploadFiles } from '@/api/utils'
import { checkFileRatio } from '@/utils/utils'

// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '请上传图片', trigger: 'change' }
    ],
    text: [
        { required: true, message: '请输入介绍', trigger: 'blur' },
        { min: 2, max: 225, message: '长度在 2 到 225 个字符', trigger: 'blur' }
    ]
})
const form = ref<any>({
    image: '', // 资源图片
    text: '', // 资源介绍
})
// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.image = file
    e.target.value = ''
    formRef.value?.validateField('image')
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
        if (form.value.image instanceof File) {
            const res = await uploadImage({
                file: form.value.image,
                info: { referer: 'resource', type: 'image' }
            })
            form.value.image = res.url
        }
        if (form.value.path instanceof File) {
            const res = await uploadFiles({
                file: form.value.path,
                info: { referer: 'resource', type: 'audio' }
            })
            form.value.path = res
        }
        if (form.value.id) {
            for (const key in form.value) {
                if (!form.value[key]) {
                    delete form.value[key]
                }
            }
            await api.update(form.value)
            ElNotification.success('更新成功')
        } else {
            await api.create(form.value)
            ElNotification.success('创建成功')
        }
        emit('submit', form.value)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = async (row: any) => {
    if (row?.id) {
        const res = await api.detail(row.id)
        form.value = res
    } else {
        form.value = {
        }
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
    aspect-ratio: 9/16;
    border: 1px dashed #ccc;
    border-radius: 8px;
    display: flex;
}

.cover-image {
    width: 100%;
}
</style>
