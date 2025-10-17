<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <h3 class="text-lg font-medium">章节列表</h3>
            <el-button type="primary" size="small" @click="handleAddChapter">
                <el-icon class="mr-1">
                    <Plus />
                </el-icon>添加
            </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column label="背景" width="140">
                <template #default="{ row }">
                    <el-image v-if="row.background" :src="row.background" fit="cover" class="w-20 h-20 rounded" />
                </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column prop="description" label="内容" show-overflow-tooltip />
            <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleEditChapter(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDeleteChapter(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 章节列表 -->
        <el-dialog :title="chapter.id ? '编辑章节' : '添加章节'" v-model="chapterDialogVisible" width="50%">
            <el-form label-width="100px" :model="chapter" ref="chapterFormRef" :rules="rules">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="课程标题" prop="title">
                            <el-input v-model="chapter.title" placeholder="请输入课程标题" />
                        </el-form-item>
                        <el-form-item label="课程时长" prop="duration">
                            <el-input-number :min="0" v-model="chapter.duration" placeholder="请输入课程时长" />
                        </el-form-item>
                        <el-form-item label="音频资源" prop="resource_id">
                            <el-select v-model="chapter.resource_id" placeholder="请选择音频资源">
                                <el-option v-for="item in audioList" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图片" prop="background">
                            <div class="avatar-uploader">
                                <div v-if="chapter.background" class="relative ">
                                    <img :src="toURL(chapter.background)" class="cover-image" />
                                    <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                        <el-icon :size="24" class="text-red-500 " @click="chapter.background = ''">
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
                    </el-col>
                </el-row>
                <el-form-item label="课程内容">
                    <el-input v-model="chapter.description" type="textarea" placeholder="请输入课程内容" :rows="4" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="danger" @click="chapterDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Plus, Close, Upload } from '@element-plus/icons-vue'
import api from '@/api/admin/api'
import { uploadImage } from '@/api/utils'
const route = useRoute()

const audioList = ref<any[]>([])
const tableData = ref<any[]>([])
const chapterDialogVisible = ref(false)
const chapter = ref<any>({})
const chapterFormRef = ref<any>(null)

const rules = {
    title: [
        { required: true, message: '请输入课程标题', trigger: 'blur' },
    ],
    duration: [
        { required: true, message: '请输入课程时长', trigger: 'blur' },
    ],
    background: [
        { required: true, message: '请上传课程图片', trigger: 'blur' },
    ],
}
// 添加章节
const handleAddChapter = () => {
    chapter.value = {}
    chapterDialogVisible.value = true
}

const handleEditChapter = (row: any) => {
    chapter.value = { ...row }
    chapterDialogVisible.value = true
}
const handleDeleteChapter = async (row: any) => {
    await api.deleteCoursesChapters(row.id)
    ElMessage.success('删除成功')
    getList()
}
// 处理封面上传
const handleCoverSuccess = (e: any) => {
    const file = e.target.files[0]
    chapter.value.background = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
}

const handleSubmit = async () => {
    if (chapter.value.background instanceof File) {
        const res = await uploadImage({
            file: chapter.value.background,
            info: { referer: "course_chapter" }
        })
        chapter.value.background = res.url
    }
    for (const key in chapter.value) {
        if (!chapter.value[key] && chapter.value[key] !== 0) {
            delete chapter.value[key]
        }
    }
    if (chapter.value.id) {
        await api.updateCoursesChapters(chapter.value)
    } else {
        chapter.value.course_id = route.query.id
        await api.createCoursesChapters(chapter.value)
    }
    chapterDialogVisible.value = false
    getList()
}

const validate = () => {
    return new Promise((resolve, reject) => {
        if (tableData.value.length === 0) {
            ElMessage.warning('请添加课程章节')
            reject('请添加课程章节')
        } else {
            resolve({})
        }
    })
}
defineExpose({
    validate
})

const getList = async () => {
    const res = await api.getCoursesChapters(route.query.id as string)
    tableData.value = res as unknown as any[]
}
onMounted(async () => {
    getList()
    getAudioList()
})

const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}
const getAudioList = async () => {
    const res = await api.getResources({ type: 3, limit: 1000 })
    audioList.value = res.data
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
