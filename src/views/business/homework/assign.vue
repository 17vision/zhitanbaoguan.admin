<template>
    <el-dialog :title="form.id ? '编辑班级' : '新增班级'" v-model="dialogVisible" width="600px">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="分配类型" prop="type">
                <el-radio-group v-model="type">
                    <el-radio label="0">用户</el-radio>
                    <el-radio label="1">班级</el-radio>
                </el-radio-group>
            </el-form-item>


            <el-form-item label="用户" v-if="type === '0'" class="mb-6" prop="user_id">
                <el-select v-model="form.user_id" style="width: 220px;" placeholder="请选择用户" @change="handleUserChange">
                    <el-option v-for="item in users" :key="item.id" :label="item.nickname" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="班级" v-if="type === '1'" class="mb-6" prop="grade_id">
                <el-select v-model="form.grade_id" style="width: 220px;" placeholder="请选择班级">
                    <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="作业完成时间" prop="end_at">
                <el-date-picker v-model="form.end_at" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择作业完成时间" format="YYYY-MM-DD HH:mm:ss"
                    :default-time="new Date(0, 0, 0, 23, 59, 59)" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import api from '@/api/admin/grades'
import user_homework from '@/api/admin/user_homework'
import { getUsers } from "@/api/system/user";
import { onMounted } from 'vue'
const type = ref('0')
const route = useRoute()
// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()

const tableData = ref<any>([])
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    end_at: [
        { required: true, message: '请选择作业完成时间', trigger: 'blur' }
    ],
    grade_id: [
        { required: true, message: '请选择班级', trigger: 'blur' }
    ],
    user_id: [
        { required: true, message: '请选择用户', trigger: 'blur' }
    ],
})
const form = ref<any>({
})

const handleUserChange = (val: any) => {
    const user = tableData.value.find((item: any) => item.user_id === val)
    form.value.end_at = user.end_at
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
// 提交表单
const handleSubmit = async () => {
    try {
        await validate()
        await user_homework.create({
            ...form.value,
            homework_id: route.query.id,
        })
        ElMessage.success('创建成功')
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
const grades = ref<any>([])
onMounted(() => {
    getUsers({ page: 1, limit: 1000 }).then(res => {
        users.value = res.data || []
    })
    api.list({ page: 1, limit: 1000 }).then(res => {
        grades.value = res.data || []
    })
    user_homework.list({ page: 1, limit: 1000, homework_id: route.query.id }).then(res => {
        tableData.value = res.data
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
