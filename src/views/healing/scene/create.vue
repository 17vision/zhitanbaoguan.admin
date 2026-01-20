<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" @close="handleClose" v-model="dialogVisible" width="800px"
        :close-on-click-modal="false">

        <!-- 提交按钮 -->
        <div class="px-6">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top"
                require-asterisk-position="right">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称" maxlength="20" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-switch v-model="form.status" :active-value="1" :inactive-value="2" active-text="启用"
                                inactive-text="禁用" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="分组" prop="scene_category_id">
                            <div class=" w-full" @click="openSelectGroup()">
                                <el-input v-model="form.scene_category_name" readonly placeholder="请输入分组" />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-checkbox-group v-model="form.type" @change="changeType">
                                <el-checkbox label="专注" :value="1" :disabled="disabledFn(true)" />
                                <el-checkbox label="睡眠" :value="2" :disabled="disabledFn(true)" />
                                <el-checkbox label="小憩" :value="3" :disabled="disabledFn(true)" />
                                <el-checkbox label="呼吸" :value="4" :disabled="disabledFn(false)" />
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="标签">
                            <div class=" w-full">
                                <el-input v-model="form.tag" placeholder="请输入标签使用、分隔" />
                            </div>
                        </el-form-item>
                        <el-form-item label="介绍" prop="introduction">
                            <el-input v-model="form.introduction" type="textarea" :rows="8" placeholder="请输入介绍"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-row :gutter="24">
                            <el-col :span="12">
                                <el-form-item label="图片" prop="image">
                                    <div :class="[disabledFn(true) ? 'avatar-uploader' : 'avatar-uploader2']">
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
                                            <span class="text-gray-500 text-[10px]">{{ disabledFn(true) ? '请上传1:1的图片' :
                                                '请上传9:16的图片' }}</span>
                                        </label>
                                        <input type="file" name="image" id="teacherAvatarInput"
                                            @change="handleTeacherAvatarSuccess" accept="image/*"
                                            style="display: none;">
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="视频" prop="video">
                                    <div class="avatar-uploader2">
                                        <div v-if="form.video" class="relative ">
                                            <img v-if="isPath(form.video) === 1" :src="toURL(form.video)" />
                                            <video v-if="isPath(form.video) === 2" controls>
                                                <source :src="toURL(form.video)" type="video/mp4">
                                            </video>
                                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                                <el-icon :size="24" @click="form.video = ''">
                                                    <Close />
                                                </el-icon>
                                            </div>
                                        </div>
                                        <label for="pathInput" v-else
                                            class=" w-full h-full rounded-lg px-6 flex flex-col items-center justify-center cursor-pointer ">
                                            <span class="text-gray-500 text-sm font-bold text-[#409eff]">点击上传</span>
                                            <span class="text-gray-500 text-[10px]">请上传9:16的视频</span>

                                        </label>
                                        <input type="file" name="video" id="pathInput" @change="handleResourceSuccess"
                                            accept=".mp4" style="display: none;">
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
    <GroupVue ref="groupTreeRef" :draggable="false" :groupId="form.scene_category_id" @onGroupSelect="onGroupSelect" />
</template>

<script lang='ts' setup>
import { ElNotification } from 'element-plus'
import { Upload, Close } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/scenes'
import { uploadImage, uploadFiles } from '@/api/utils'
import GroupVue from './Group.vue'
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
    type: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    image: [
        { required: true, message: '请上传图片', trigger: 'change' }
    ],
    video: [
        { required: true, message: '请上传视频', trigger: 'change' }
    ],
    introduction: [
        { required: true, message: '请输入介绍', trigger: 'blur' },
        { min: 2, max: 225, message: '长度在 2 到 225 个字符', trigger: 'blur' }
    ]
})
const form = ref<any>({
    status: 2,
})
const groupTreeRef = ref()
const openSelectGroup = () => {
    groupTreeRef.value.open()
}

const onGroupSelect = (group: any) => {
    form.value.scene_category_id = group.id
    form.value.scene_category_name = group.name
    formRef.value?.validateField('scene_category_id')
}
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
// 封面图片上传成功
const handleTeacherAvatarSuccess = async (e: any) => {
    const file = e.target.files[0]
    try {
        if (form.value.type && form.value.type.includes(4)) {
            await checkFileRatio(file, '1:1')
        } else {
            await checkFileRatio(file, '9:16')
        }
        form.value.image = file
        formRef.value?.validateField('image')
    } catch (error: any) {
        ElNotification.error(error.message)
    }
    e.target.value = ''
}

const handleResourceSuccess = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resetInput = () => { e.target.value = ""; };

    const isVideo = file.type === "video/mp4";

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
        ElNotification.error("视频大小不能超过 20MB");
        resetInput();
        return;
    }
    if (!isVideo) {
        ElNotification.error("仅支持上传 MP4 视频");
        resetInput();
        return;
    }


    try {
        await checkFileRatio(file, '9:16')
        // 文件通过校验
        form.value.video = file;
        let color;
        if (isVideo) {
            color = await getVideoMainColor(file);
        }

        if (color) {
            form.value.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }
    } catch (err) {
        console.error("获取主色失败:", err);
    } finally {
        resetInput();
        formRef.value?.validateField('video');
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
        video: '',
        image: '',
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
        if (form.value.image instanceof File) {
            const res = await uploadImage({
                file: form.value.image,
                info: { referer: 'resource', type: 'image' }
            })
            form.value.image = res.url
        }
        if (form.value.video instanceof File) {
            const res = await uploadFiles({
                file: form.value.video,
                info: { referer: 'resource', type: 'video' }
            })
            form.value.video = res
        }

        let data = {
            ...form.value,
            type: form.value.type?.join(',')
        }
        if (data.id) {
            for (const key in data) {
                if (!data[key]) {
                    delete data[key]
                }
            }
            await api.update(data)
            ElNotification.success('更新成功')
        } else {
            await api.create(data)
            ElNotification.success('创建成功')
        }
        emit('submit', data)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = async (row: any) => {
    if (row.id) {
        const res = await api.detail(row.id)
        form.value = {
            ...res,
            type: res.type?.split(',').map((v: string) => +v).filter(Boolean)
        }
    } else {
        form.value = {
            status: 2,
        }
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

    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
    };
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


const changeType = (val: any) => {
    if (val.includes(4)) {
        form.value.image = ''
    }
}


const disabledFn = (bool: boolean) => {
    const arr = Array.isArray(form.value.type) ? form.value.type : []
    return bool ? arr.includes(4) : arr.some((v: number) => v !== 4)
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

.avatar-uploader2 {
    width: 150px;
    aspect-ratio: 9/16;
    border: 1px dashed #ccc;
    border-radius: 8px;
    display: flex;
}

.cover-image {
    width: 100%;
}
</style>
