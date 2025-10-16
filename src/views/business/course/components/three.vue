<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <h3 class="text-lg font-medium">课程列表</h3>
            <el-button type="primary" size="small" @click="handleAddChapter">
                <el-icon class="mr-1">
                    <Plus />
                </el-icon>添加
            </el-button>
        </div>

        <!-- 章节列表 -->
        <div v-for="(chapter, index) in chapters" :key="index" class="mb-6 bg-white p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-base font-medium">第{{ index + 1 }}节</h4>
                <div class="space-x-2">
                    <el-button type="primary" link @click="handleEditChapter(index)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button type="danger" link @click="handleDeleteChapter(index)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <el-form label-width="100px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="课程标题">
                            <el-input v-model="chapter.title" placeholder="请输入课程标题" />
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="课程时长">
                            <el-input v-model="chapter.timePoints" placeholder="请输入课程时长" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="课程内容">
                    <el-input v-model="chapter.content" type="textarea" placeholder="请输入课程内容" :rows="4" />
                </el-form-item>
                <el-form-item label="图片">
                    <div class="avatar-uploader">
                        <div v-if="chapter.cover" class="relative ">
                            <img :src="toURL(chapter.cover)" class="cover-image" />
                            <div class="absolute top-1 right-1 text-red-500 cursor-pointer">
                                <el-icon :size="24" class="text-red-500 " @click="chapter.cover = ''">
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
                        <input type="file" name="cover" id="coverInput" @change="handleCoverSuccess($event, index)"
                            accept="image/*" style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="音频">
                    <div class="flex items-center space-x-2">
                        <el-upload class="upload-demo" action="#" :auto-upload="false">
                            <el-button type="primary" link>上传音频</el-button>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Plus, Edit, Delete, Close, Upload} from '@element-plus/icons-vue'

const chapters = ref([])
// 添加章节
const handleAddChapter = () => {
    chapters.value.push({
        title: '',
        audio: '',
        timePoints: []
    })
}
const toURL = (file: File | string) => {
    if (!file) return ''
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    return file
}

// 处理封面上传
const handleCoverSuccess = (e: any, index: number) => {
    const file = e.target.files[0]
    chapters.value[index].cover = file
    e.target.value = '' // 清空文件输入框的值，以便下次上传时可以触发change事件
}
// 编辑章节
const handleEditChapter = (index: number) => {
    // 可以添加编辑逻辑
}

// 删除章节
const handleDeleteChapter = (index: number) => {
    chapters.value.splice(index, 1)
}

const validate = () => {
    return new Promise((resolve, reject) => {
        if (chapters.value.length === 0) {
            ElMessage.warning('请添加课程章节')
            reject('请添加课程章节')
        } else {
            resolve(true)
        }
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
