<template>
    <div>
        <div v-loading="loading" class="p-5">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-position="'right'" label-width="120px">
                <el-form-item :label="t('basic.nickname')" prop="nickname">
                    <el-input v-model="ruleForm.nickname" :placeholder="t('notify.msg27')" clearable />
                </el-form-item>

                <el-form-item :label="t('basic.phone')" prop="phone">
                    <el-input v-model="ruleForm.phone" :placeholder="t('notify.msg28')" clearable />
                </el-form-item>
                <el-form-item :label="t('notify.msg456')" prop="receive_share">
                    <el-switch v-model="ruleForm.receive_share" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('basic.email')" prop="email">
                    <el-input v-model="ruleForm.email" :placeholder="t('notify.msg31')" clearable />
                </el-form-item>

                <el-form-item :label="t('basic.gender')">
                    <el-select v-model="ruleForm.gender" :placeholder="t('notify.msg32')">
                        <el-option :label="t('basic.man')" :value="1" />
                        <el-option :label="t('basic.woman')" :value="2" />
                    </el-select>
                </el-form-item>

                <el-form-item :label="t('basic.type')">
                    <el-select v-model="ruleForm.type" :placeholder="t('notify.msg23')">
                        <el-option :label="t('basic.team')" :value="1" />
                        <el-option :label="t('basic.company')" :value="2" />
                    </el-select>
                </el-form-item>

                <el-form-item :label="t('basic.organizationName')" prop="name">
                    <el-input v-model="ruleForm.name" :placeholder="t('notify.msg38')" clearable />
                </el-form-item>


                <el-form-item :label="t('basic.password')" prop="password">
                    <el-input type="password" v-model="ruleForm.password" :placeholder="t('notify.msg30')"
                        show-password />
                </el-form-item>


                <el-form-item class="mt-6">
                    <el-button v-loading="loading" type="primary" @click="doSubmit">{{ t('basic.confirm') }}</el-button>
                    <el-button @click="goBack">{{ t('basic.back') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { isPhone, isEmail, isPassword } from '@/utils/validate'
import { getOrganization, createOrUpdateOrganizations } from "@/api/system/organizations"
import { useI18n } from 'vue-i18n'

interface RuleForm {
    id: number;
    nickname: string;
    phone: string;
    email: string;
    gender: number;
    receive_share: number;
    type: number;
    name: string;
    password: string;
}

const loading = ref<boolean>(false);

const { t } = useI18n()

const initialForm = (): RuleForm => ({
    id: 0,
    nickname: '',
    phone: '',
    email: '',
    gender: 1,
    receive_share: 0,
    type: 1,
    name: '',
    password: ''
});

const route: RouteLocationNormalizedLoaded = useRoute();

const router = useRouter();

const ruleForm = reactive<RuleForm>(initialForm());

const ruleFormRef = ref<FormInstance>();


const rules = reactive<FormRules<RuleForm>>({
    nickname: [
        {
            required: true,
            validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback(new Error(t('notify.msg27')));
                }

                callback();
            },
            trigger: "blur",
        },
    ],
    phone: [
        {
            required: true,
            validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback(new Error(t('notify.msg28')));
                }

                if (!isPhone(value)) {
                    return callback(new Error(t('notify.msg33')));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback(new Error(t('notify.msg30')));
                }

                if (!isPassword(value)) {
                    return callback(new Error(t('notify.msg34')));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
    email: [
        {
            required: false,
            validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback();
                }

                if (!isEmail(value)) {
                    return callback(new Error(t('notify.msg35')));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
    name: [
        {
            required: false,
            validator: (rule: any, value: any, callback: any) => {
                let str = t('notify.msg25')
                if (ruleForm.type === 1) {
                    str = t('notify.msg24')
                }

                if (!value) {
                    return callback(new Error(str));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
});

onMounted(function () {
    if (route && route.query && route.query.id) {
        if (typeof route.query.id === "string") {
            ruleForm.id = parseInt(route.query.id);

            initializeData();
        }
    }
});

function initializeData() {
    loading.value = true;

    getOrganization(ruleForm.id)
        .then((res: Record<string, any>) => {
            const whiteList: string[] = ["nickname", "phone", "email", "gender", "receive_share", "type", "name"];
            for (const key in res) {
                if (!whiteList.includes(key)) {
                    delete res[key];
                }
            }
            Object.assign(ruleForm, res);

            loading.value = false;
        })
        .catch(() => { });
}

function doSubmit() {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            fetch();
        }
    });

    function fetch() {
        if (loading.value) {
            return;
        }

        loading.value = true;

        const data: Record<string, any> = { ...ruleForm };

        for (const key in data) {
            if (data[key] === "" || data[key] === null || data[key] === undefined) {
                delete data[key]
            }
        }

        createOrUpdateOrganizations(data)
            .then(() => {
                loading.value = false;

                ElNotification({
                    type: "success",
                    title: "",
                    message: t('notify.msg39'),
                    duration: 3000,
                });

                setTimeout(() => {
                    goBack();
                }, 1200);
            })
            .catch(() => {
                loading.value = false;

                ElNotification({
                    type: "error",
                    title: "",
                    message: t('notify.msg40'),
                    duration: 3000,
                });
            });
    }
}

function goBack() {
    router.back();
}
</script>
