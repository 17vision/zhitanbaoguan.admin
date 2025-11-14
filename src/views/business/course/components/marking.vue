<template>
    <div>
        <el-dialog v-model="dialogVisible" width="800px" title="音频标记" :close-on-click-modal="false">
            <!-- 顶部：音频 + 偏移设置 -->
            <div class="audio-box">
                <!-- 左侧：音频控件 -->
                <div class="audio-left">
                    <el-form :inline="true">
                        <el-form-item label="标记偏移（秒）">
                            <el-input v-model.number="reactionOffset" type="number" min="0" step="0.1"
                                style="width: 120px" />
                        </el-form-item>
                        <el-form-item>
                            <el-switch v-model="useOffset" active-text="应用偏移" inactive-text="不应用偏移" />
                        </el-form-item>
                    </el-form>

                    <div class="tips">
                        将标记时间 **自动减去** {{ reactionOffset }} 秒，用于补偿真人反应延迟。
                    </div>
                </div>

                <!-- 右侧：偏移设置 + 开关 -->
                <div class="audio-right">
                    <audio ref="audioRef" controls :src="audioUrl"></audio>

                </div>
            </div>

            <el-divider />

            <!-- 文案列表 -->
            <div class="paragraphs">
                <div v-for="(p, i) in paragraphs" :key="i" class="paragraph" :class="{ active: p.time }">
                    <div class="text">{{ p.text }}</div>

                    <div class="right-box">
                        <el-button size="small" type="primary" @click="markTime(i)">
                            标记
                        </el-button>
                        <span v-if="p.time" class="time">{{ formatTime(p.time) }}</span>
                    </div>
                </div>
            </div>

            <template #footer>
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </template>

        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/admin/api'

const audioRef = ref(null)
const audioUrl = ref('')
const useOffset = ref(true) // 默认使用偏移量
const fromData = ref({})
const dialogVisible = ref(false)
const paragraphs = ref([])
const reactionOffset = ref(0.5) // 标记时间偏移，单位秒


const markTime = (index) => {
    const audio = audioRef.value
    if (!audio) return

    let time = audio.currentTime
    if (useOffset.value) {
        time = Math.max(0, time - reactionOffset.value)
    }

    paragraphs.value[index].time = time
}

const formatTime = t => {
    const h = (t / 3600 | 0).toString().padStart(2, '0')
    const m = ((t % 3600) / 60 | 0).toString().padStart(2, '0')
    const s = (t % 60 | 0).toString().padStart(2, '0')
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`
}

const save = async () => {
    await api.updateCoursesChapters({ id: fromData.value.id, description_times: JSON.stringify(paragraphs.value) })
    dialogVisible.value = false
}
const openDialog = (data) => {
    fromData.value = data
    audioUrl.value = data.resource?.path || ''
    if (data.description_times) {
        paragraphs.value = JSON.parse(data.description_times)
    } else {
        paragraphs.value = (data.description || '')
            .split(/\r?\n/)
            .filter(line => line.trim() !== '')
            .map((text, index) => ({
                id: index + 1,
                text,
                time: null
            }))
    }

    dialogVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style>
.audio-box {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    justify-content: space-between;
}

.offset-box {
    margin-top: 12px;
}

.audio-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
}

.tips {
    font-size: 13px;
    color: #666;
    margin-top: 4px;
}

.paragraphs {
    max-height: 420px;
    overflow-y: auto;
    padding-right: 8px;
}

.paragraph {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: #f8f9fc;
    border: 1px solid transparent;
    transition: 0.25s ease;
}

.paragraph:hover {
    background: #eef5ff;
    border-color: #d6e4ff;
}

.paragraph.active {
    background: #e8f3ff;
    border-color: #8bb3ff;
}

.text {
    flex: 1;
    margin-right: 20px;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap;
}

.right-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

.time {
    font-size: 12px;
    color: #1a73e8;
}
</style>
