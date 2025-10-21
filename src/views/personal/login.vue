<template>
    <div class="flex items-center justify-center w-screen h-screen body-bg min-w-[888px]">
        <div class="flex flex-col items-center mb-[120px] md:mr-0 lg:mr-[-160px] xl:mr-[-320px] ">
            <span class="text-white text-[40px] font-semibold">观息空间</span>
            <div class="w-[850px] h-[468px] form-bg mt-5">
                <div class="h-[468px] flex flex-col items-center w-[360px] ml-[470px] justify-center">
                    <el-form v-if="way == 2" ref="ruleFormRef"  :model="ruleForm" :rules="rules"
                        :label-position="isMini ? 'top' : 'left'" label-width="62px">
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="ruleForm.account" placeholder="请输入账号" clearable />
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"
                                show-password />
                        </el-form-item>

                        <el-form-item v-if="!isLogin" label="验证码" prop="captcha_code">
                            <el-input v-model="ruleForm.captcha_code" maxlength="4" placeholder="请输入验证码" clearable
                                class="w-[120px]" />

                            <el-image class="w-[98px] h-[38px] ml-2 curson-poinster" v-if="captcha" :src="captcha"
                                @click="refreshCaptcha" />
                        </el-form-item>
                    </el-form>
                    <div v-if="isLogin" v-loading="$store.loading" :class="{ 'login-btn': true, 'w-full': isMini }"
                        type="primary" @click="doLogin(ruleFormRef)">登录</div>
                    <div v-else v-loading="$store.loading" :class="{ 'w-full': isMini }" type="primary"
                        @click="doRegister(ruleFormRef)">注册</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { isPhone, isEmail } from '@/utils/validate'
import { useUser } from '@/stores/user'
import { getLoginQrcode, getCaptcha } from '@/api/personal'

interface FormData {
    account?: string;
    email?: string;
    password: string;
    captcha_key: string;
    captcha_code: string;
}

interface RuleForm {
    account: string
    password: string
    captcha_key: string
    captcha_code: string
}


const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    account: import.meta.env.DEV ? '13671638524' : '',
    password: import.meta.env.DEV ? '111111' : '',
    captcha_key: '',
    captcha_code: '',
})

const rules = reactive<FormRules<RuleForm>>({
    account: [
        {
            required: true, validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback(new Error('请输入账号'))
                }

                if (!isPhone(value) && !isEmail(value)) {
                    return callback(new Error('请输入手机号码或邮箱'))
                }
                callback()
            }, trigger: 'blur'
        },
    ],
    password: [
        {
            required: true, validator: (rule: any, value: any, callback: any) => {
                if (!value) {
                    return callback(new Error('请输入密码'))
                }

                if (value.length < 6 || value.length > 12) {
                    return callback(new Error('请输入 6-12 位密码'))
                }
                callback()
            }, trigger: 'blur'
        },
    ],
    captcha_code: [
        {
            required: true, validator: (rule: any, value: any, callback: any) => {
                if (isLogin.value) {
                    return callback()
                }

                if (!value) {
                    return callback(new Error('请输入验证码'))
                }

                if (value.length !== 4) {
                    return callback(new Error('请输入四位的验证码'))
                }
                callback()
            }, trigger: 'blur'
        },
    ]
})

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()
const user = useUser()
const captcha = ref<string>('')
const isLogin = ref<boolean>(true)
const isMini = ref<boolean>(false)
const way = ref<Number>(2)
const qrcode = reactive({
    key: '',
    path: '',
    ttl: 0,
    timer: 0
})

watch(isLogin, (value: boolean) => {
    if (!value && !captcha.value) {
        refreshCaptcha()
    }
})

onMounted(function () {
    window.addEventListener('resize', resizeHandler)

    resizeHandler()

    // buildQrcode()
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)

    clearTimer()
})

function resizeHandler() {
    if (!document.hidden) {
        isMini.value = document.body.getBoundingClientRect().width < 768
    }
}

function refreshCaptcha() {
    getCaptcha().then((res: Record<string, any>) => {
        ruleForm.captcha_key = res.captcha_key ?? ''
        captcha.value = res.captcha ?? ''
    })
}

function changeWay() {
    way.value = way.value == 1 ? 2 : 1
}

function doLogin(formEl: FormInstance | undefined) {
    if (!formEl) return

    formEl.validate((valid) => {
        if (valid) {
            fetch()
        }
    })

    function fetch() {

        const data: FormData = {
            password: ruleForm.password,
            captcha_key: ruleForm.captcha_key,
            captcha_code: ruleForm.captcha_code
        }

        if (isPhone(ruleForm.account)) {
            data.account = ruleForm.account
        } else if (isEmail(ruleForm.account)) {
            data.email = ruleForm.account
        }

        user.login(data).then(() => {
            let redirect: string = '/'
            if (Array.isArray(route.query.redirect)) {
                redirect = route.query.redirect[0] as string
            } else {
                redirect = route.query.redirect as string
            }

            if (!redirect || redirect === '/login') {
                redirect = '/'
            }
            router.push({ 'path': redirect })
        })
    }
}

function doRegister(formEl: FormInstance | undefined) {
    if (!formEl) return

    formEl.validate((valid) => {
        if (!valid) {
            ElNotification({
                type: 'error',
                title: '',
                message: '请填写正确的信息',
                duration: 3000,
            })
        } else {
            fetch()
        }
    })

    function fetch() {

        const data: FormData = {
            password: ruleForm.password,
            captcha_key: ruleForm.captcha_key,
            captcha_code: ruleForm.captcha_code
        }

        if (isPhone(ruleForm.account)) {
            data.account = ruleForm.account
        } else if (isEmail(ruleForm.account)) {
            data.email = ruleForm.account
        }

        user.register(data).then(() => {
            let redirect: string = '/'
            if (Array.isArray(route.query.redirect)) {
                redirect = route.query.redirect[0] as string
            } else {
                redirect = route.query.redirect as string
            }
            router.push({ 'path': redirect })
        })
    }
}

function buildQrcode() {

    getLoginQrcode(null).then((res: Record<string, any>) => {

        qrcode.key = res.key
        qrcode.path = res.path
        qrcode.ttl = res.ttl

        if (qrcode.key && qrcode.path) {
            runTimer()
        }
    })
}

function runTimer() {
    if (qrcode.timer) {
        clearInterval(qrcode.timer)
    }

    qrcode.timer = setInterval(() => {
        qrcode.ttl--
        if (qrcode.ttl < 0) {
            clearTimer()
        }

        reToken()
    }, 1000);
}

function clearTimer() {
    if (qrcode.timer) {
        clearInterval(qrcode.timer)
    }

    qrcode.timer = 0
}

function reToken() {
    if (qrcode.ttl % 3 === 0) {

        user.qrcodeLogin({ key: qrcode.key }).then(() => {

            clearTimer()

            let redirect: string = '/'
            if (Array.isArray(route.query.redirect)) {
                redirect = route.query.redirect[0] as string
            } else {
                redirect = route.query.redirect as string
            }
            router.push({ 'path': redirect })
        })
    }

}
</script>

<style lang="scss" scoped>
.body-bg {
    background-image: url("/src/assets/image/login/body-bg.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;

    .form-bg {
        background-image: url("/src/assets/image/login/form-bg.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
    }

    .login-btn {
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;
        width: 220px;
        height: 38px;
        line-height: 38px;
        border-radius: 6px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        color: #ffffff;
        border: 1px solid #15e6c0;
        background-image: linear-gradient(to bottom, #00c9ff 30%, #0072a8);

        &.cursor-wait {
            cursor: wait;
        }
    }

    .login-btn:hover {
        opacity: 0.8;
    }
}
</style>
