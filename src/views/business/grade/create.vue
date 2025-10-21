<template>
    <el-dialog :title="form.id ? '编辑班级' : '新增班级'" v-model="dialogVisible" width="600px">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="班级名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入班级名称" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="班级负责人" prop="user_id">
                <el-select v-model="form.user_id" placeholder="请选择班级负责人">
                    <el-option v-for="item in users" :key="item.id" :label="item.nickname" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="班级描述" class="mb-6">
                <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入班级描述" maxlength="200"
                    show-word-limit />
            </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <div class="flex justify-end mx-6">

        </div>
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
import { getUsers } from "@/api/system/user";

// 对话框是否可见
const dialogVisible = ref(false)
// 表单引用
const formRef = ref()
const emit = defineEmits(['submit'])
// 表单校验规则
const rules = ref<any>({
    name: [
        { required: true, message: '请输入班级名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入班级描述', trigger: 'blur' },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ],
})
const form = ref<any>({
    name: '',
    avatar: '',
})


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

        if (form.value.id) {
            for (const key in form.value) {
                if (!form.value[key]) {
                    delete form.value[key]
                }
            }
            await api.update(form.value)
            ElMessage.success('更新成功')
        } else {
            await api.create(form.value)
            ElMessage.success('创建成功')
        }
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
