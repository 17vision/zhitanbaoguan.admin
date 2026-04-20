<template>
    <div class="editor-wrapper">
        <Toolbar :editor="editor" :default-config="toolbarConfig" :mode="mode" class="toolbar" />
        <Editor v-model="html" :default-config="editorConfig" :mode="mode" class="editor" @onCreated="handleCreated"
            @onChange="handleChange" />
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
const props = defineProps({
    modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
const html = ref('')
const mode = ref('default')

watch(() => props.modelValue, (val) => {
    html.value = val
}, { immediate: true })

// 工具栏配置（这里把图片显示出来）
const toolbarConfig = ref({
    toolbarKeys: [
        'bold', 'underline', 'italic', 'through',
        'fontSize', 'fontFamily', 'fontColor', 'bgColor',
        'lineHeight', 'justifyLeft', 'justifyCenter', 'justifyRight',
        'bulletedList', 'numberedList',
        'indent', 'delIndent',
        'insertLink', 'editLink', 'unLink',
        'insertImage', // 👈 图片按钮
        'insertTable', 'codeBlock', 'divider',
        'undo', 'redo', 'clearStyle'
    ]
})

// 编辑器配置
const editorConfig = ref({
    placeholder: '请输入内容...',
    MENU_CONF: {
        // 图片上传配置
        uploadImage: {
            server: '/api/admin/common/upload', // 你的上传接口
            fieldName: 'file',
            maxFileSize: 10 * 1024 * 1024,
            maxNumberOfFiles: 1,
            allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
            // 后端返回格式 { errno:0, data:{ url:'xxx' } }
            customInsert (res, insertFn) {
                if (res.errno === 0) {
                    insertFn(res.data.url)
                }
            }
        }
    }
})

function handleCreated (ed) {
    editor.value = ed
}

function handleChange () {
    emit('update:modelValue', html.value)
}

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
        editor.value = null
    }
})
</script>

<style scoped>
.editor-wrapper {
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow: hidden;
}

.toolbar {
    border-bottom: 1px solid #ebeef5 !important;
}

.editor {
    min-height: 300px;
}
</style>