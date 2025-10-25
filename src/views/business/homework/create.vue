<template>
    <div class="create-fluid">
        <el-card shadow="hover" class="form-card">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-[#333]">{{ form.id ? '编辑作业' : '创建作业' }}</span>
                </div>
            </template>

            <el-form ref="formRef" label-width="100px" :model="form" :rules="rules" class="space-y-4">
                <el-form-item label="作业标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入作业标题" clearable class="w-[320px]" />
                </el-form-item>

                <el-form-item label="分组" prop="homework_group_id">
                    <el-input v-model="form.group_name" readonly placeholder="请选择分组" class="w-[320px]"
                        @click="openSelectGroup()">
                        <template #suffix>
                            <el-icon><i class="el-icon-folder-opened" /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="资源" prop="resource_id">
                    <el-select v-model="form.resource_id" placeholder="请选择资源" clearable filterable class="w-[320px]">
                        <el-option v-for="item in resourcesList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="作业描述" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入作业描述" show-word-limit
                        maxlength="300" class="w-[500px]" />
                </el-form-item>
                <div class="flex justify-end w-full mb-2">
                    <el-button type="primary" plain @click="goAddConfig(form)">+ 添加配置项</el-button>
                </div>

                <div class="config-list  rounded-lg p-3 space-y-3 border border-gray-100" v-if="form.config.length">
                    <div v-for="(configItem, configIndex) in form.config" :key="configIndex"
                        class="flex items-center gap-2">
                        <el-input v-model="configItem.label" placeholder="标题" class="w-[180px]" clearable />
                        <el-input v-model="configItem.placeholder" placeholder="占位提示" class="w-[240px]" clearable />
                        <el-button type="danger" plain circle size="small" @click="form.config.splice(configIndex, 1)">
                            <el-icon>
                                <Remove />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </el-form>
        </el-card>

        <div class="footer-bar">
            <div class="footer-actions">
                <el-button @click="router.go(-1)">取消</el-button>
                <el-button type="primary" :loading="loading" @click="goSave()">保存</el-button>
            </div>
        </div>
        <n-group ref="groupTreeRef" draggable :groupId="form.homework_group_id" @onGroupSelect="onGroupSelect" />
    </div>
</template>


<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/admin/homework'
import resources from '@/api/admin/resources'
import { Remove } from '@element-plus/icons-vue'
import NGroup from '@/components/Group/NGroup.vue'

const router = useRouter()
const route = useRoute()

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

const formRef = ref()
const form = ref<Homewrok>({
    title: '',
    content: '',
    config: []
})
const groupTreeRef = ref<InstanceType<typeof NGroup>>()
const loading = ref(false)
const resourcesList = ref<any[]>([])
const homework_id = ref(0)

const rules = reactive({
    title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入作业描述', trigger: 'blur' }],
    homework_group_id: [{ required: true, message: '请选择分组', trigger: 'blur' }]
})

onBeforeMount(async () => {
    homework_id.value = parseInt(route.query.id as string)
    if (homework_id.value) {
        const res = await api.getHomeworkDetail(homework_id.value)
        form.value = res as unknown as Homewrok
    }
    const resList = await resources.list({ page: 1, limit: 100 })
    resourcesList.value = resList.data
})

function goAddConfig(value: Homewrok) {
    value.config.push({ label: '', placeholder: '' })
}

async function goSave() {
    await formRef.value?.validate()
    if (loading.value) return
    loading.value = true

    if (!form.value.config.length) {
        ElNotification.error('请添加作业配置')
        loading.value = false
        return
    }

    for (const item of form.value.config) {
        if (!item.label) {
            ElNotification.error('请输入标题')
            loading.value = false
            return
        }
    }

    const data: any = {
        homework_group_id: form.value.homework_group_id,
        id: form.value.id,
        title: form.value.title,
        resource_id: form.value.resource_id || null,
        content: form.value.content,
        config: JSON.stringify(form.value.config)
    }

    try {
        if (form.value.id) {
            await api.updateHomework(data)
        } else {
            await api.createHomework(data)
        }
        ElNotification.success('保存成功')
        router.go(-1)
    } catch {
        ElNotification.error('保存失败')
    } finally {
        loading.value = false
    }
}

function openSelectGroup() {
    groupTreeRef.value?.open()
}

function onGroupSelect(value: any) {
    form.value.homework_group_id = value.id
    form.value.group_name = value.name
    formRef.value?.validateField('homework_group_id')
}
</script>

<style lang="scss" scoped>
.create-fluid {
    background: #f5f7fa;
    padding: 24px;
    min-height: calc(100vh - var(--header---nav-bar-height));
    position: relative;
}

.form-card {
    margin: 0 auto 100px auto; // 预留底部按钮空间
    border-radius: 12px;
}

/* ✅ 固定底部按钮栏 */
.footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
    padding: 12px 0;
    z-index: 10;
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    margin-right: 24px;
    gap: 12px;
}

.el-form-item__label {
    font-weight: 500;
    color: #444;
}
</style>
