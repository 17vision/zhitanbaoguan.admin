<template>
    <div>
        <div class="flex justify-end w-full mb-4">
            <el-button type="primary" @click="goAddWorkflow">添加</el-button>
        </div>

        <div v-for="(item, index) in homeworks" :key="index">
            <template v-if="item.isEdit">
                <el-form ref="formRef" label-width="100px">
                    <el-form-item label="作业标题">
                        <el-input v-model="item.title" placeholder="请输入作业标题" />
                    </el-form-item>

                    <el-form-item label="作业描述">
                        <el-input v-model="item.content" type="textarea" :rows="4" placeholder="请输入作业描述" />
                    </el-form-item>

                    <el-form-item label="作业配置">
                        <div class="flex justify-end w-full mb-4">
                            <el-button @click="goAddConfig(item)">添加</el-button>
                        </div>

                        <div class="w-full" v-for="(configItem, configIndex) in item.config" :key="configIndex">
                            <div class="flex items-center gap-2 w-full mb-2">
                                <el-input v-model="configItem.label" placeholder="请输入标题" />
                                <el-input v-model="configItem.placeholder" placeholder="请输入占位符" />
                                <el-icon @click="item.config.splice(configIndex, 1)">
                                    <Remove />
                                </el-icon>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="flex justify-end w-full mb-4">
                    <el-button type="primary" size="small" @click="goSave(item)">保存</el-button>
                </div>
            </template>

            <template v-else>
                <div class="flex justify-end w-full mb-4">
                    <el-button type="primary" size="small" @click="goEditHomework(item)">编辑</el-button>
                    <el-button type="danger" size="small" @click="goDeleteHomework(item)">删除</el-button>
                </div>
                <div>
                    <el-form ref="formRef" label-width="100px">
                        <el-form-item label="作业标题">
                            <el-input :value="item.title" readonly />
                        </el-form-item>

                        <el-form-item label="作业描述">
                            <el-input :value="item.content" readonly />
                        </el-form-item>

                        <el-form-item label="作业配置">
                            <div class="w-full" v-for="(configItem, configIndex) in item.config" :key="configIndex">
                                <div class="flex gap-2 w-full mb-2">
                                    <el-input :value="configItem.label" />
                                    <el-input :value="configItem.placeholder" />
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/admin/api'
import { Remove } from '@element-plus/icons-vue'

interface ConfigItem {
    label: string
    placeholder: string
}

interface Homewrok {
    isEdit: boolean
    id?: number
    title: string
    content: string
    config: ConfigItem[]
}

const course_id = ref(0)

const homeworks = ref<Homewrok[]>([])

const route = useRoute()

const loading = ref(false)

onMounted(async () => {
    getList()
})

async function getList() {
    course_id.value = parseInt(route.query.id as string)
    const res = await api.getCourseHomeworks({ course_id: course_id.value })
    homeworks.value = res as unknown as Homewrok[]
}

function goEditHomework(value: Homewrok) {
    value.isEdit = true
}

function goDeleteHomework(value: Homewrok) {
    ElMessageBox.confirm('确定要删除作业吗')
        .then(() => {
            if (loading.value) {
                return
            }
            loading.value = true
            api.deleteCourseHomeworks(value.id).then(() => {
                loading.value = false

                getList()
            }).catch(() => {
                loading.value = false
            })
        })
        .catch(() => {

        })
}

function goAddWorkflow() {
    homeworks.value.push({
        isEdit: true,
        id: 0,
        title: '',
        content: '',
        config: []
    })

    console.log(homeworks.value)
}

function goAddConfig(value: Homewrok) {
    value.config.push({
        label: '',
        placeholder: ''
    })
}

function goSave(value: Homewrok) {
    if (loading.value) {
        return
    }
    loading.value = true

    const data = {
        id: value.id,
        course_id: course_id.value,
        title: value.title,
        content: value.content,
        config: JSON.stringify(value.config)
    }

    if (value.id) {
        api.updateCourseHomeworks(data).then(() => {
            value.isEdit = false
            loading.value = false
        }).catch(() => {
            loading.value = false
        })
    } else {
        api.createCourseHomeworks(data).then(() => {
            value.isEdit = false
            loading.value = false
        }).catch(() => {
            loading.value = false
        })
    }
}

const validate = () => {
    return new Promise((resolve, reject) => {
        const item = homeworks.value.find((item) => item.isEdit == true)
        if (item) {
            ElMessage.warning('请保存作业')
            reject('请保存作业')
        } else {
            resolve({})
        }
    })
}
defineExpose({
    validate
})
</script>

<style lang="scss" scoped></style>
