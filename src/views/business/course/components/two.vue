<template>
    <div class="p-14">
        <el-form ref="formRef" :model="form" label-width="120px">
            <div class="grid grid-cols-2 ">
                <!-- 手机端背景图 -->
                <el-form-item label="手机端背景图">
                    <div class="avatar-uploader">
                        <div v-if="form.phoneBackground" class="relative ">
                            <img :src="toURL(form.phoneBackground)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" class="text-red-500 " @click="form.phoneBackground = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="phoneBackgroundInput" v-else
                            class=" w-full h-full rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ">
                            <img :src="Icon" alt="" class="w-4 h-4">

                            <div class="text-[#666666]">点击上传手机端背景图</div>
                            <div class="text-[#8A82BA] text-sm mt-1">支持 jpg、png 格式</div>
                        </label>
                        <input type="file" name="phoneBackground" id="phoneBackgroundInput"
                            @change="handlePhoneBackgroundSuccess" accept="image/*" style="display: none;">
                    </div>
                </el-form-item>

                <!-- 头盔端3D场景 -->
                <el-form-item label="头盔端3D场景">
                    <div class="avatar-uploader">
                        <div v-if="form.helmetScene" class="relative ">
                            <img :src="toURL(form.helmetScene)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" class="text-red-500 " @click="form.helmetScene = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="helmetSceneInput" v-else
                            class=" w-full h-full rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ">
                            <img :src="Icon" alt="" class="w-4 h-4">
                            <div class="text-[#666666]">点击上传头盔端3D场景文件</div>
                            <div class="text-[#8A82BA] text-sm mt-1">支持 gITF、GLB 格式</div>
                        </label>
                        <input type="file" name="helmetScene" id="helmetSceneInput" @change="handleHelmetSceneSuccess"
                            accept="image/*" style="display: none;">
                    </div>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import Icon from '@/assets/image/course/shangchuan.png'
import { checkFileRatio } from '@/utils/utils'

import { Upload, Close } from '@element-plus/icons-vue'
// 表单引用
const formRef = ref()
const form = ref<any>({
    phoneBg: '',
    helmetScene: ''
})
const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}

const handlePhoneBackgroundSuccess = async (e: any) => {
    const file = e.target.files[0]
    try {
        await checkFileRatio(file, '1:1')
        form.value.phoneBackground = file

    } catch (error) {
        ElNotification.error(error)
    }
    e.target.value = ''
}
const handleHelmetSceneSuccess = async (e: any) => {
    const file = e.target.files[0]
    try {
        await checkFileRatio(file, '1:1')
        form.value.helmetScene = file

    } catch (error) {
        ElNotification.error(error.message)
    }
    e.target.value = ''
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
defineExpose({
    validate
})
</script>

<style lang='scss' scoped>
.avatar-uploader {
    width: 260px;
    height: 260px;
    border: 1px dashed #ccc;
    border-radius: 16px;
    display: flex;
}

.cover-image {
    width: 100%;
    height: 100%;
    border-radius: 16px;
}
</style>
