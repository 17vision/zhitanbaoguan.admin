<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="800px" :close-on-click-modal="false">

        <!-- 提交按钮 -->
        <div class="px-6" style="overflow-y: auto; max-height: 600px;">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="2" active-text="启用"
                        inactive-text="禁用" />
                </el-form-item>

                <el-form-item label="图片" prop="cover">
                    <div class="avatar-uploader">
                        <div v-if="form.thumbnail" class="relative w-full h-full">
                            <img :src="toURL(form.thumbnail)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" @click="form.thumbnail = ''">
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
                        <input type="file" name="thumbnail" id="teacherAvatarInput" @change="handleTeacherAvatarSuccess"
                            accept="image/*" style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="音频" prop="path">
                    <div>
                        <div v-if="form.path" class="relative ">
                            <audio v-if="form.path" class="cover-image2" controls>
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
                        <input type="file" name="path" id="pathInput" @change="handleResourceSuccess" accept=".mp3"
                            style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="介绍" prop="introduction" class="mb-6">
                    <el-input v-model="form.introduction" type="textarea" :rows="4" placeholder="请输入介绍" maxlength="200"
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
import api from '@/api/admin/ringtones'
import { uploadImage, uploadFiles } from '@/api/utils'

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
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    thumbnail: [
        { required: true, message: '请上传图片', trigger: 'change' }
    ],
    path: [
        { required: true, message: '请上传资源', trigger: 'change' }
    ],
    introduction: [
        { required: true, message: '请输入介绍', trigger: 'blur' },
        { min: 2, max: 225, message: '长度在 2 到 225 个字符', trigger: 'blur' }
    ]
})
const form = ref<any>({
    status: 2,
})
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.thumbnail = file
    e.target.value = ''
    formRef.value?.validateField('thumbnail')
}

const handleResourceSuccess = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resetInput = () => { e.target.value = ""; };

    // const isImage = file.type.startsWith("image/");
    const isAudio = file.type === "audio/mpeg";

    // 校验文件类型和大小
    // if (isImage && file.size > MAX_IMAGE_SIZE) {
    //     alert("图片大小不能超过 5MB");
    //     resetInput();
    //     return;
    // }
    if (isAudio && file.size > MAX_VIDEO_SIZE) {
        alert("音频大小不能超过 20MB");
        resetInput();
        return;
    }
    if (!isAudio) {
        alert("仅支持上传 MP3 音频");
        resetInput();
        return;
    }

    // 文件通过校验
    form.value.path = file;

    resetInput();
    formRef.value?.validateField('path');
};

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
        if (form.value.thumbnail instanceof File) {
            const res = await uploadImage({
                file: form.value.thumbnail,
                info: { referer: 'resource', type: 'image' }
            })
            form.value.thumbnail = res.url
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
        status: 2,
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
