<template>
    <el-dialog :title="form.id ? '编辑班级成员' : '新增班级成员'" v-model="dialogVisible" width="800px">
        <div class="flex justify-center">
            <el-transfer v-model="user_ids" :titles="['未选择', '已选择']" :props="{
                key: 'id',
                label: 'nickname',
            }" :data="users" />
        </div>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import api from '@/api/admin/grade_users'
import { getUsers } from "@/api/system/user";
const route = useRoute()
// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const user_ids = ref([])
const emit = defineEmits(['submit'])
// 表单校验规则
const form = ref<any>({
})


// 提交表单
const handleSubmit = async () => {
    try {
        if (!user_ids.value.length) {
            ElNotification.error('请选择班级成员')
            return
        }
        const data = {
            grade_id: route.query.id,
            user_ids: user_ids.value.join(',')
        }
        user_ids.value = []
        ElNotification.success('保存成功')
        await api.create(data)
        emit('submit', form.value)
        dialogVisible.value = false
    } catch (error) {
        console.log(error)
    }
}

const open = async (row: any) => {
    if (row) {
        const res = await api.detail(row.id)
        form.value = { ...res }
    } else {
        form.value = { ...row }
    }
    dialogVisible.value = true
}

defineExpose({
    open
})

const users = ref<any>([])
onMounted(() => {
    getUsers({ page: 1, limit: 1000 }).then(res => {
        users.value = res.data || []
    })
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
