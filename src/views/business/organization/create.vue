<template>
  <div class="page-container">
    <el-card v-loading="$store.loading" shadow="never" class="form-card">
      <div class="card-header">
        <span class="card-title">{{ ruleForm.id ? '编辑组织' : '创建组织' }}</span>
      </div>

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="110px"
        label-position="right"
        class="mt-4"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入组织名称"
            clearable
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item label="联系手机" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item label="组织介绍" prop="introduction">
          <el-input
            v-model="ruleForm.introduction"
            type="textarea"
            :rows="8"
            placeholder="请输入组织介绍"
            clearable
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item class="form-footer">
          <el-button type="primary" @click="submitRole" :loading="$store.loading">
            {{ ruleForm.id ? '保存修改' : '立即创建' }}
          </el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute} from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification } from "element-plus";
import organizationsApi from "@/api/business/organization";

interface RuleForm {
  id?: string;
  phone: string;
  name: string;
  introduction: string;
}

const initialForm = (): RuleForm => ({
  phone: "",
  name: "",
  introduction: "",
});

const router = useRouter();
const route = useRoute();
const ruleForm = reactive<RuleForm>(initialForm());
const ruleFormRef = ref<FormInstance>();

// 校验规则
const rules = reactive<FormRules<RuleForm>>({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
  name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
});

// 提交
function submitRole() {
  ruleFormRef.value?.validate(async (valid) => {
    if (!valid) return;

    const data = { ...ruleForm };
    const api = data.id ? organizationsApi.put : organizationsApi.create;

    try {
      await api(data);
      ElNotification.success({
        title: "成功",
        message: ruleForm.id ? "修改成功" : "创建成功",
        duration: 2500,
      });
      setTimeout(() => goBack(), 1200);
    } catch (err) {
      ElNotification.error({
        title: "失败",
        message: ruleForm.id ? "修改失败" : "创建失败",
      });
    }
  });
}

// 返回
function goBack() {
  router.back();
}

onMounted(() => {
  const { id } = route.query as { id?: string };
  if (id) {
    organizationsApi.detail(id).then((res) => {
      ruleForm.id = res.id;
      ruleForm.phone = res.phone;
      ruleForm.name = res.name;
      ruleForm.introduction = res.introduction;
    });
  }
});
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 24px 36px;
}

.card-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>