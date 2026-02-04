<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="dialogVisible" width="650px" @close="handleClose"
        :close-on-click-modal="false">

        <!-- 提交按钮 -->
        <div class="px-6">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
                <el-row :gutter="24">
                    <el-col :span="14">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-row :gutter="24">
                            <el-col :span="12">
                                <el-form-item label="状态">
                                    <el-switch v-model="form.status" :active-value="1" :inactive-value="2"
                                        active-text="启用" inactive-text="禁用" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="色值">
                                    <el-color-picker v-model="form.color" />
                                    <div class="w-12 h-4 ml-5" v-if="form.color"
                                        :style="{ 'background-color': form.color }"></div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="介绍" class="mb-6">
                            <el-input v-model="form.introduction" type="textarea" :rows="8" placeholder="请输入介绍"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="ml-auto">
                        <el-form-item label="图片" prop="path">
                            <div class="avatar-uploader">
                                <div v-if="form.path" class="relative ">
                                    <img v-if="isPath(form.path) === 1" :src="toURL(form.path)" />
                                    <video v-if="isPath(form.path) === 2" controls>
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
                                    accept="image/*" style="display: none;">
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="音频" prop="audio">
                    <div>
                        <div v-if="form.audio" class="relative ">
                            <audio v-if="form.audio" class="cover-image2" controls>
                                <source :src="toURL(form.audio)" type="audio/mpeg">
                            </audio>
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" @click="form.audio = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="pathInput2" v-else
                            class=" w-full h-full rounded-lg px-6 flex flex-col items-center justify-center cursor-pointer ">
                            <span class="text-gray-500 text-sm font-bold text-[#409eff]">点击上传</span>
                        </label>
                        <input type="file" name="audio" id="pathInput2" @change="handleHeadSuccess" accept=".mp3"
                            style="display: none;">
                    </div>
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
import { ElNotification } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/themes'
import { uploadFiles, uploadImage } from '@/api/utils'
import { checkFileRatio } from '@/utils/utils'

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
    audio: [
        { required: true, message: '请上传音频', trigger: 'change' }
    ],
    path: [
        { required: true, message: '请上传图片', trigger: 'change' }
    ],
    introduction: [
        { required: true, message: '请输入介绍', trigger: 'blur' },
        { min: 2, max: 225, message: '长度在 2 到 225 个字符', trigger: 'blur' }
    ],
    color: [
        { required: true, message: '请选择色值', trigger: 'change' }
    ]
})
const form = ref<any>({
    username: '',
    head: '',
    status: 2,
})
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// 处理导师头像上传
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

const handleHeadSuccess = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resetInput = () => { e.target.value = ""; };

    // const isImage = file.type.startsWith("image/");
    const isAudio = file.type === "audio/mpeg";

    // 校验文件类型和大小
    if (isAudio && file.size > MAX_VIDEO_SIZE) {
        ElNotification.error('音频大小不能超过 20MB');
        resetInput();
        return;
    }
    if (!isAudio) {
        ElNotification.error('仅支持上传 MP3 音频');

        resetInput();
        return;
    }

    // 文件通过校验
    form.value.audio = file;

    resetInput();
    formRef.value?.validateField('audio');
}

const handleResourceSuccess = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resetInput = () => { e.target.value = ""; };

    const isImage = file.type.startsWith("image/");


    if (isImage && file.size > MAX_IMAGE_SIZE) {
        alert("图片大小不能超过 5MB");
        resetInput();
        return;
    }
    if (!isImage) {
        alert("仅支持上传图片类型的文件");
        resetInput();
        return;
    }



    try {
        await checkFileRatio(file, '9:16');
        // 文件通过校验
        form.value.path = file;

        if (isImage) {
            form.value.color = await getImageMainColor(file);
        }
    } catch (err: any) {
        ElNotification.error(err.message);
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
const handleClose = () => {
    dialogVisible.value = false
    form.value = {
        id: undefined,
        name: '',
        status: 2,
        path: '',
        color: '',
        introduction: ''
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

        if (form.value.path instanceof File) {
            const res = await uploadImage({
                file: form.value.path,
                info: { referer: 'resource', type: 'image' }
            })
            form.value.path = res.url
        }
        if (form.value.audio instanceof File) {
            const res = await uploadFiles({
                file: form.value.audio,
                info: { referer: 'resource', type: 'audio' }
            })
            form.value.audio = res
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

const open = (row: any) => {

    form.value = {
        status: 2,
        ...row
    }
    formRef.value?.resetFields()

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

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return rgbToHex(r, g, b);
}
function rgbToHex(r: number, g: number, b: number) {
    return (
        '#' +
        [r, g, b]
            .map(v => v.toString(16).padStart(2, '0'))
            .join('')
    );
}


async function getImageMainColor(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    // 等待图片加载
    await new Promise(res => img.onload = res);

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, 10, 10);

    return getMainColorFromCanvas(canvas);
}


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
