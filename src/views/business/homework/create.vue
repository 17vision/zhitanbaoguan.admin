<template>
    <div class="container mx-auto p-5">
        <div class="flex justify-end w-full mb-4">
            <!-- <el-button type="primary" @click="goAddWorkflow">添加</el-button> -->
        </div>

        <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
            <el-form-item label="作业标题" prop="title">
                <div class="flex items-center gap-2 w-[300px]">
                    <el-input v-model="form.title" placeholder="请输入作业标题" />
                </div>
            </el-form-item>
            <el-form-item label="分组" prop="homework_group_id">
                <div class="flex items-center gap-2 w-[300px]" @click="openSelectGroup()">
                    <el-input v-model="form.group_name" readonly placeholder="请输入分组" />
                </div>
            </el-form-item>
            <el-form-item label="资源" prop="resource_id">
                <div class="flex items-center gap-2 w-[300px]">
                    <el-select v-model="form.resource_id" placeholder="请选择资源">
                        <el-option v-for="item in resourcesList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item label="作业描述">
                <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入作业描述" />
            </el-form-item>

            <el-form-item label="作业配置" prop="config">
                <div class="flex justify-end w-full mb-4">
                    <el-button @click="goAddConfig(form)">添加</el-button>
                </div>

                <div class="w-full" v-for="(configItem, configIndex) in form.config" :key="configIndex">
                    <div class="flex items-center gap-2 w-full mb-2">
                        <el-input v-model="configItem.label" placeholder="请输入标题" />
                        <el-input v-model="configItem.placeholder" placeholder="请输入占位符" />
                        <el-icon @click="form.config.splice(configIndex, 1)">
                            <Remove />
                        </el-icon>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <div class="flex justify-end w-full mb-4">
            <el-button @click="router.go(-1)">取消</el-button>
            <el-button type="primary" @click="goSave()">保存</el-button>
        </div>
        <n-group ref="groupTreeRef" :draggable="false" :groupId="form.homework_group_id"
            @onGroupSelect="onGroupSelect" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/admin/homework'
import resources from '@/api/admin/api'
import { Remove } from '@element-plus/icons-vue'
import NGroup from '@/components/Group/NGroup.vue'
const router = useRouter()
interface ConfigItem {
    label: string
    placeholder: string
}

interface Homewrok {
    id?: number
    homework_group_id?: number
    resource_id?: number
    group_name?: string
    title: string
    content: string
    config: ConfigItem[]
}
const groupTreeRef = ref<InstanceType<typeof NGroup>>()
const homework_id = ref(0)

const formRef = ref()
const rules = reactive({
    title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入作业描述', trigger: 'blur' }],
    homework_group_id: [{ required: true, message: '请选择分组', trigger: 'blur' }],
})

const form = ref<Homewrok>({
    title: '',
    content: '',
    config: []
})

const route = useRoute()

const loading = ref(false)
const resourcesList = ref()
onMounted(async () => {
    getList()
    resources.getResources({ limit: 100 }).then((res) => {
        resourcesList.value = res.data
    })
})

async function getList() {
    homework_id.value = parseInt(route.query.id as string)
    if (homework_id.value) {
        const res = await api.getHomeworkDetail(homework_id.value)
        form.value = res as unknown as Homewrok
    }
}


function goAddConfig(value: Homewrok) {
    value.config.push({
        label: '',
        placeholder: ''
    })
    formRef.value?.validateField('config')
}

async function goSave() {
    await formRef.value?.validate()
    if (loading.value) {
        return
    }
    loading.value = true
    if (!form.value.config.length) {
        ElNotification.error('请添加作业配置')
        loading.value = false
        return
    }
    for (const item of form.value.config) {
        if (!item.label ) {
            ElNotification.error('请输入标题')
            loading.value = false
            return
        }
    }
    const data = {
        homework_group_id: form.value.homework_group_id,
        id: form.value.id,
        title: form.value.title,
        resource_id: form.value.resource_id,
        content: form.value.content,
        config: JSON.stringify(form.value.config)
    }
    if (form.value.id) {
        api.updateHomework(data).then(() => {
            router.go(-1)

            loading.value = false
        }).catch(() => {
            loading.value = false
        })
    } else {
        api.createHomework(data).then(() => {
            router.go(-1)

            loading.value = false
        }).catch(() => {
            loading.value = false
        })
    }
}

const openSelectGroup = () => {
    groupTreeRef.value?.open()
}


const onGroupSelect = (value: any) => {
    form.value.homework_group_id = value.id
    form.value.group_name = value.name
    formRef.value?.validateField('homework_group_id')
}
</script>

<style lang="scss" scoped></style>
