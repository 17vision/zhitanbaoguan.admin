<template>
    <div>
        <el-dialog :title="form.id ? '编辑导师' : '新增导师'" v-model="dialogVisible" width="600px">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px"
                style="overflow-y: auto; max-height: 600px;">
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入资源名称" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option label="图片" :value="1" />
                        <el-option label="视频" :value="2" />
                        <el-option label=" 音频" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="分组" prop="resource_group_id">
                    <div class=" w-full" @click="openSelectGroup()">
                        <el-input v-model="form.resource_group_name" readonly placeholder="请输入分组" />
                    </div>
                </el-form-item>
                <el-form-item label="资源" prop="path" v-if="form.type">
                    <div>
                        <div v-if="form.path" class="relative w-full h-full">
                            <img v-if="form.type === 1" :src="toURL(form.path)" class="cover-image1" />
                            <video v-if="form.type === 2" class="cover-image2" controls>
                                <source :src="toURL(form.path)" type="video/mp4">
                            </video>
                            <audio v-if="form.type === 3" class="cover-image2" controls>
                                <source :src="toURL(form.path)" type="audio/mpeg">
                            </audio>
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
                            :accept="form.type === 1 ? 'image/*' : form.type === 2 ? 'video/*' : 'audio/*'"
                            style="display: none;">
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="default" @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </template>
        </el-dialog>
        <GroupVue ref="groupTreeRef" :draggable="true" :groupId="form.resource_group_id"
            @onGroupSelect="onGroupSelect" />
    </div>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/resources'
import { uploadImage, uploadFiles } from '@/api/utils'
import GroupVue from './Group.vue'
// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    name: [
        { required: true, message: '请输入资源名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择类型', trigger: 'change' },
    ],
    path: [
        { required: true, message: '请上传资源', trigger: 'change' },
    ],
})
const form = ref<any>({
    name: '',
    path: '', // 资源路径
})

const handleResourceSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.path = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
    formRef.value?.validateField('path')
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


const groupTreeRef = ref()
const openSelectGroup = () => {
    groupTreeRef.value.open()
}
const onGroupSelect = (group: any) => {
    form.value.resource_group_id = group.id
    form.value.resource_group_name = group.name
    formRef.value?.validateField('resource_group_id')
}
// 提交表单
const handleSubmit = async () => {
    try {
        await validate()
        if (form.value.path instanceof File) {
            if (form.value.type === 1) {
                const res = await uploadImage({
                    file: form.value.path,
                    info: { referer: 'resource', type: 'image', both: true }
                })
                form.value.thumbnail = res.thumbnail
                form.value.path = res.url
            } else {
                const res = await uploadFiles({
                    file: form.value.path,
                    info: { referer: 'resource', type: form.value.type === 2 ? 'video' : 'audio' }
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
    form.value = { ...row }
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

.cover-image1 {
    width: 100px;
    height: 100px;
}
</style>
