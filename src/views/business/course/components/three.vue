<template>
    <div class="p-4">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#F5F6FA', color: '#666666' }"
            :max-height="MaxHeight">
            <el-table-column prop="title" label="标题" width="100" />
            <el-table-column label="背景" width="140">
                <template #default="{ row }">
                    <video v-if="is_file(row.background)" class="cover-image2" controls>
                        <source :src="row.background" type="video/mp4">
                    </video>
                    <img v-else :src="row.background" class="cover-image" />

                </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column prop="resource_id" label="音频资源" width="350">
                <template #default="{ row }">
                    <audio controls v-if="row.resource">
                        <source :src="row.resource?.path" type="audio/mp3">
                    </audio>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="内容">
                <template #default="{ row }">
                    <div class="desc-cell" :title="row.description">
                        {{ row.description }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" v-if="row.resource && row.description"
                        @click="audioVueFn(row)">音频标记</el-button>
                    <el-button link type="primary" @click="handleEditChapter(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDeleteChapter(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 章节列表 -->
        <el-dialog :title="chapter.id ? '编辑章节' : '添加章节'" v-model="chapterDialogVisible" width="60%">
            <el-form label-width="100px" :model="chapter" ref="chapterFormRef" :rules="rules">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="课程标题" prop="title">
                            <el-input v-model="chapter.title" placeholder="请输入课程标题" />
                        </el-form-item>
                        <el-form-item label="课程时长" prop="duration">
                            <el-input-number :min="0" v-model="chapter.duration" placeholder="请输入课程时长" />
                            <span class="ml-2 text-gray-600">分钟</span>
                        </el-form-item>
                        <el-form-item label="音频资源" prop="resource_id">
                            <el-select v-model="chapter.resource_id" placeholder="请选择音频资源" clearable>
                                <el-option v-for="item in audioList" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图片" prop="background">
                            <div class="avatar-uploader">
                                <div v-if="chapter.background" class="relative ">
                                    <video v-if="is_file(chapter.background)" class="cover-image2" controls>
                                        <source :src="toURL(chapter.background)" type="video/mp4">
                                    </video>
                                    <img v-else :src="toURL(chapter.background)" class="cover-image" />
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
                                    accept=".jpg,.jpeg,.png,.gif,.mp4" style="display: none;">
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="课程内容">
                    <el-input v-model="chapter.description" type="textarea" placeholder="请输入课程内容" :rows="8" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="danger" @click="chapterDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
            </template>
        </el-dialog>
        <marking ref="audioVueRef" @save="getList"/>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Close, Upload } from '@element-plus/icons-vue'
import api from '@/api/admin/api'
import resources from '@/api/admin/resources'
import { uploadImage } from '@/api/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'
import Marking from './marking.vue'
const MaxHeight = useWindowHeight(300)
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
    resource_id: [
        { required: true, message: '请选择音频资源', trigger: 'change' },
    ]
}

const audioVueRef = ref<InstanceType<typeof Marking>>()

const audioVueFn = (row: any) => {
    audioVueRef.value?.openDialog(row)
}
// 添加章节
const addChapter = () => {
    chapter.value = {}
    chapterDialogVisible.value = true
}

const handleEditChapter = (row: any) => {
    chapter.value = { ...row }
    chapterDialogVisible.value = true
}
const handleDeleteChapter = async (row: any) => {
    ElMessageBox.confirm('确定要删除该章节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        await api.deleteCoursesChapters(row.id)
        ElMessage.success('删除成功')
        getList()
    })
}
// 处理封面上传
const handleCoverSuccess = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif' && file.type !== 'video/mp4' && file.type !== 'audio/mpeg') {
        ElMessage.error('文件格式不正确')
        return
    }
    chapter.value.background = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
}

const handleSubmit = async () => {
    await chapterFormRef.value.validate()
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
    validate,
    addChapter
})

const getList = async () => {
    const res = await api.getCoursesChapters(route.query.id as string)
    tableData.value = res as unknown as any[]
}
onMounted(async () => {
    getList()
    getAudioList()
})

const is_file = (str: string | File) => {
    if (!str) return false // 防止传入 null 或 undefined
    if (str instanceof File) {
        return str.type === 'video/mp4'
    }

    if (typeof str === 'string') {
        return str.toLowerCase().endsWith('.mp4')
    }

    return false
}

const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}
const getAudioList = async () => {
    const res = await resources.list({ type: 3, limit: 1000 })
    audioList.value = res.data
}
</script>

<style lang='scss' scoped>
.avatar-uploader {
    width: 220px;
    height: 220px;
    border: 1px dashed #ccc;
    border-radius: 12px;
    display: flex;
}

.cover-image {
    width: 100%;
    height: 100%;
}

.desc-cell {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* 限制显示两行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease;
    cursor: pointer;
}

.desc-cell:hover {
    color: #7B68EE;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
