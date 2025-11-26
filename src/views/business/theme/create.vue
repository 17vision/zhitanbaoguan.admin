<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="800px">

        <!-- 提交按钮 -->
        <div class="px-6" style="overflow-y: auto; max-height: 600px;">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="名称" prop="username">
                    <el-input v-model="form.username" placeholder="请输入名称" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option label="图文" :value="1" />
                        <el-option label="日历" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用"
                        inactive-text="禁用" />
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
                <el-form-item label="资源" prop="path" v-if="form.type === 2">
                    <div>
                        <div v-if="form.path" class="relative ">
                            <img v-if="isPath(form.path) === 1" :src="toURL(form.path)" class="w-[100px] h-[200px]" />
                            <video v-if="isPath(form.path) === 2" class="w-[300px] h-[300px]" controls>
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
                <el-form-item label="色值" prop="color" v-if="form.type === 2">
                    <el-color-picker v-model="form.color" />
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
    type: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
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
    ],
    color: [
        { required: true, message: '请选择色值', trigger: 'change' }
    ]
})
const form = ref<any>({
    username: '',
    cover: '',
    status: 0,
})
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.cover = file
    e.target.value = ''
    formRef.value?.validateField('cover')
}

const handleResourceSuccess = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resetInput = () => { e.target.value = ""; };

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type === "video/mp4";

    // 校验文件类型和大小
    if (isImage && file.size > MAX_IMAGE_SIZE) {
        alert("图片大小不能超过 5MB");
        resetInput();
        return;
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
        alert("视频大小不能超过 50MB");
        resetInput();
        return;
    }
    if (!isImage && !isVideo) {
        alert("仅支持上传图片或 MP4 视频");
        resetInput();
        return;
    }

    // 文件通过校验
    form.value.path = file;

    try {
        let color;
        if (isImage) {
            color = await getImageMainColor(file);
        } else if (isVideo) {
            color = await getVideoMainColor(file);
        }

        if (color) {
            form.value.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }
    } catch (err) {
        console.error("获取主色失败:", err);
    } finally {
        resetInput();
        formRef.value?.validateField('path');
        formRef.value?.validateField('color');

    }
};



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

function getMainColorFromCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let r = 0, g = 0, b = 0;
    const count = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
    };
}

async function getImageMainColor(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    await img.decode(); // 等待加载

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, 10, 10);

    return getMainColorFromCanvas(canvas);
}

async function getVideoMainColor(file: File) {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');

    video.preload = 'auto';
    video.src = url;

    // 等待元数据加载
    await new Promise(res => video.onloadeddata = res);

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, 10, 10);

    return getMainColorFromCanvas(canvas);
}


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
