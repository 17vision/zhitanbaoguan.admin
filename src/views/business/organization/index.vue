<template>
  <div>
    <div v-loading="loading" class="p-5">
      <div v-if="includes(app.routeNames, ['organization.create'])" class="flex items-center mb-5">
        <el-button type="primary" size="small" @click="goCreate">添加</el-button>
      </div>

      <el-table :data="tableData" class="w-full" :max-height="maxHeight">
        <!-- <el-table-column :label="t('basic.type')" prop="type_str" />

        <el-table-column :label="t('basic.nickname')" prop="user.nickname" />

        <el-table-column :label="t('basic.gender')" prop="user.gender_str" />

        <el-table-column :label="t('basic.account')" prop="user.account" />

        <el-table-column :label="t('basic.phone')" prop="phone" />

        <el-table-column :label="t('basic.email')" prop="user.email" />

        <el-table-column :label="t('basic.organizationName')" prop="name" />

        <el-table-column :label="t('basic.createdAt')" prop="created_at" />

        <el-table-column :label="t('basic.updatedAt')" prop="updated_at" />

        <el-table-column v-if="includes(app.routeNames, ['organization.permission', 'organization.edit', 'organization.delete'])"
          :label="t('basic.action')" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button v-if="includes(app.routeNames, ['organization.edit'])" link size="small" type="primary" text @click="goEdit(scope.row)">{{
              t('basic.edit') }}</el-button>
            <el-button v-if="includes(app.routeNames, ['organization.delete'])" link size="small" type="primary" text @click="goDelete(scope.row)">{{
              t('basic.delete') }}</el-button>
          </template>
</el-table-column> -->
      </el-table>

      <el-pagination class="mt-5" background hide-on-single-page layout="total, prev, pager, next" :total="total" :page-size="req.limit"
        v-model:current-page="req.page" @current-change="fetchData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useApp } from '@/stores/app'
import { includes } from '@/utils/utils'
import { useWindowHeight } from '@/hooks/useWindowHeight'
import organizationsApi from '@/api/business/organization'
const maxHeight = useWindowHeight(200)
interface Dialog {
  visible: boolean
  title: string
  loading: boolean
}

const loading = ref<boolean>(false)

const router = useRouter()

const app = useApp()

const total = ref<number>(0)

const req = reactive<PaginateReq>({
  page: 1,
  limit: 20
})

const tableData = ref<Array<any>>([])

onBeforeMount(function () {
  req.page = 1
  fetchData()
})

function fetchData() {
  if (loading.value) {
    return
  }

  loading.value = true

  const data = { ...req }
  organizationsApi
    .getOrganizations(data)
    .then((res: Record<string, any>) => {
      if (res && res.data) {
        tableData.value = res.data
      }

      total.value = res.total

      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

function goCreate() {
  router.push({ name: 'organization.create' })
}

function goEdit(value: any): void {
  if (value && value.id) {
    router.push({ name: 'organization.edit', query: { id: value.id } })
  }
}

function toUrl(value: File): string {
  return window.URL.createObjectURL(value)
}
</script>

<style lang="scss" scoped>
.el-upload--picture-card {
  --el-upload-picture-card-size: 148px;
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  width: 168px;
  height: 168px;
  cursor: pointer;
  vertical-align: top;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.title-card {
  width: 168px;
  height: 48px;
}

.logo-wrap,
.title-wrap {
  img {
    width: 160px;
  }

  .el-icon {
    color: #f00;
  }
}
</style>
