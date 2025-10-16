<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <!-- 课程基本信息 -->
            <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 class="text-lg font-medium mb-6 flex items-center">
                    <el-icon class="mr-2">
                        <Document />
                    </el-icon>
                    课程基本信息
                </h3>
                <el-form-item label="课程标题" prop="title" class="mb-6">
                    <el-input v-model="form.title" placeholder="请输入课程标题" maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="课程描述" prop="description" class="mb-6">
                    <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入课程描述" maxlength="500"
                        show-word-limit />
                </el-form-item>
                <div class="grid grid-cols-2 gap-6">
                    <el-form-item label="所属分类" prop="category">
                        <el-select v-model="form.category" placeholder="请选择分类" class="w-full">
                            <el-option label="睡眠" value="sleep" />
                            <el-option label="冥想" value="meditation" />
                            <el-option label="专注" value="focus" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="难度级别" prop="level">
                        <el-select v-model="form.level" placeholder="请选择难度" class="w-full">
                            <el-option label="初级" value="beginner" />
                            <el-option label="中级" value="intermediate" />
                            <el-option label="高级" value="advanced" />
                        </el-select>
                    </el-form-item>
                </div>
            </div>

            <!-- 导师信息 -->
            <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 class="text-lg font-medium mb-6 flex items-center">
                    <el-icon class="mr-2">
                        <User />
                    </el-icon>
                    导师信息
                </h3>
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <el-form-item label="导师名称" prop="teacher">
                            <el-input v-model="form.teacher" placeholder="请输入导师名称" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-form-item label="导师介绍" prop="teacherDescription" class="mb-6">
                            <el-input v-model="form.teacherDescription" type="textarea" :rows="3" placeholder="请输入导师介绍"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </div>

                    <el-form-item label="导师图片" prop="teacherAvatar">
                        <div class="avatar-uploader">
                            <div v-if="form.teacherAvatar" class="relative w-full h-full">
                                <img :src="toURL(form.teacherAvatar)" class="cover-image" />
                                <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                    <el-icon :size="24" @click="form.teacherAvatar = ''">
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
                            <input type="file" name="teacherAvatar" id="teacherAvatarInput"
                                @change="handleTeacherAvatarSuccess" accept="image/*" style="display: none;">
                        </div>
                    </el-form-item>
                </div>

            </div>

            <!-- 课程封面 -->
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium mb-6 flex items-center">
                    <el-icon class="mr-2">
                        <Picture />
                    </el-icon>
                    课程封面
                </h3>
                <el-form-item prop="cover">
                    <div class="avatar-uploader">
                        <div v-if="form.cover" class="relative ">
                            <img :src="toURL(form.cover)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" class="text-red-500 " @click="form.cover = ''">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <label for="coverInput" v-else
                            class=" w-full h-full rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ">
                            <el-icon class="text-gray-400 text-32px mb-3">
                                <Upload />
                            </el-icon>
                            <span class="text-gray-500 text-sm">点击上传</span>
                        </label>
                        <input type="file" name="cover" id="coverInput" @change="handleCoverSuccess" accept="image/*"
                            style="display: none;">
                    </div>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { User, Upload, Picture, Close, Document } from '@element-plus/icons-vue'
import { ref } from 'vue'
// 表单引用
const formRef = ref()
// 表单校验规则
const rules = ref<any>({
    title: [
        { required: true, message: '请输入课程标题', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入课程描述', trigger: 'blur' },
        { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
    ],
    category: [
        { required: true, message: '请选择课程分类', trigger: 'change' }
    ],
    level: [
        { required: true, message: '请选择难度级别', trigger: 'change' }
    ],
    teacher: [
        { required: true, message: '请输入导师名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    teacherAvatar: [
        { required: true, message: '请上传导师图片', trigger: 'change' }
    ],
    teacherDescription: [
        { required: true, message: '请输入导师介绍', trigger: 'blur' },
        { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
    ]
})
const form = ref<any>({
    category: '',
    level: '',
    teacher: '',
    teacherAvatar: '',
    teacherDescription: '',
    cover: '',
})

// 处理导师头像上传
const handleTeacherAvatarSuccess = (e: any) => {
    const file = e.target.files[0]
    form.value.teacherAvatar = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
    formRef.value?.validateField('teacherAvatar')
}

const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}

// 处理课程封面上传
const handleCoverSuccess = (e: any) => {
    // 检查文件类型
    const file = e.target.files[0]
    form.value.cover = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
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
