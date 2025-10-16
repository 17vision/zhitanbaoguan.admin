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


                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <el-form-item label="课程标题" prop="title" class="mb-6">
                            <el-input v-model="form.title" placeholder="请输入课程标题" maxlength="50" show-word-limit />
                        </el-form-item> <el-form-item label="所属分类" prop="category">
                            <el-select v-model="form.category" placeholder="请选择分类" class="w-full">
                                <el-option label="睡眠" :value="1" />
                                <el-option label="专注" :value="2" />
                                <el-option label="减压" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="难度级别" prop="difficulty">
                            <el-select v-model="form.difficulty" placeholder="请选择难度" class="w-full">
                                <el-option label="初级" :value="1" />
                                <el-option label="中级" :value="2" />
                                <el-option label="高级" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择导师" prop="tutor_id">
                            <el-select v-model="form.tutor_id" placeholder="请选择导师" class="w-full">
                                <el-option v-for="item in tutor_list" :key="item.id" :label="item.username"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item prop="cover" label="课程封面">
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
                            <input type="file" name="cover" id="coverInput" @change="handleCoverSuccess"
                                accept="image/*" style="display: none;">
                        </div>
                    </el-form-item>
                </div>


                <el-form-item label="课程描述" class="mb-6">
                    <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入课程描述" maxlength="500"
                        show-word-limit />
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { Upload, Close, Document } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api/admin/api'
import { uploadImage } from '@/api/utils'

// 表单引用
const formRef = ref()
const route = useRoute()
const router = useRouter()
const tutor_list = ref<any>([])
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
    difficulty: [
        { required: true, message: '请选择难度级别', trigger: 'change' }
    ],
})
const form = ref<any>({
})


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
        formRef.value?.validate(async (valid: boolean) => {
            if (valid) {
                // 处理文件上传
                if (form.value.cover instanceof File) {
                    const res = await uploadImage({ file: form.value.cover, info: { referer: 'course' } })
                    form.value.cover = res.url
                }
                if (form.value.id) {
                    for (const key in form.value) {
                        if (!form.value[key]) {
                            delete form.value[key]
                        }
                    }
                    const res = await api.updateCourse(form.value)
                    resolve(res)
                    return
                }
                const res = await api.createCourse(form.value)
                resolve(res)
                router.push({ name: 'course.create', query: { id: res.id } })
            } else {
                reject(new Error('校验失败'))
            }
        })
    })
}
defineExpose({
    validate
})

const getTutorList = async () => {
    const res = await api.getTutors({
        limit: 100,
    })
    tutor_list.value = res.data
}

onMounted(() => {
    getTutorList()
    if (route.query.id) {
        api.getCoursesDetail(
            route.query.id as string
        ).then((res: any) => {
            form.value = res
        })
    }

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
