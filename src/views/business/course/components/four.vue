<template>
    <div>
        <el-form ref="formRef" :model="form" label-width="100px">
            <el-form-item label="作业标题">
                <el-input v-model="form.homework.title" placeholder="请输入作业标题" />
            </el-form-item>

            <el-form-item label="作业描述">
                <el-input v-model="form.homework.description" type="textarea" :rows="4" placeholder="请输入作业描述" />
            </el-form-item>

            <el-form-item label="作业类型">
                <el-select v-model="form.homework.type" placeholder="请选择作业类型">
                    <el-option label="每日" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                </el-select>
            </el-form-item>

            <div class="grid grid-cols-2 gap-8">
                <el-form-item label="开始时间">
                    <el-date-picker v-model="form.homework.startTime" type="datetime" placeholder="选择开始时间"
                        format="YYYY/MM/DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>

                <el-form-item label="截止时间">
                    <el-date-picker v-model="form.homework.endTime" type="datetime" placeholder="选择截止时间"
                        format="YYYY/MM/DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
// 表单引用
const formRef = ref()
const form = ref({
    homework: {
        title: '',
        description: '',
        type: '',
        startTime: '',
        endTime: ''
    }
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
defineExpose({
    validate
})
</script>

<style lang='scss' scoped></style>
