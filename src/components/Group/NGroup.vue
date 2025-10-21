<template>
    <div>
        <el-drawer v-model="drawerOpen" direction="rtl" :append-to-body="true" :with-header="false" :size="'278px'">
            <div class="flex flex-col w-[238px] shrink-0 mx-auto mt-4">
                <el-button type="primary" class="w-full" @click="goCreate(0)">新增</el-button>
                <el-tree class="mt-4" ref="groupTree" node-key="id" highlight-current :data="groups" empty-text="暂无分组"
                    :props="treeProps" @node-click="onNodeClick" :draggable="draggable" @node-drop="handleDrop"
                    :allow-drop="allowDrop">
                    <template #default="{ node, data }">
                        <div class="flex items-center w-full h-full" @mouseover="onNodeMouseover(data)"
                            @mouseleave="onNodeMouseleave(data)">
                            <span>{{ node.label }}</span>

                            <div class="flex ml-auto">
                                <span v-if="data.count > 0" class="mr-1">{{ data.count }}</span>
                                <el-dropdown placement="right-start">
                                    <span class="el-dropdown-link">
                                        <el-icon v-if="data.showDrop" class="more-icon" size="16">
                                            <MoreFilled />
                                        </el-icon>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="goCreate(data.id)">新增子分组</el-dropdown-item>
                                            <el-dropdown-item @click="goEdit(data)">重命名</el-dropdown-item>
                                            <el-dropdown-item @click="goDelete(data.id)">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </div>
                    </template>
                </el-tree>

                <!-- 创建分组 -->
                <el-dialog v-model="dialog.visible" :title="dialog.title" :show-close="false" :destroy-on-close="true"
                    class="max-w-[600px] min-w-[400px] rounded-xl" center>
                    <el-form label-width="80px">
                        <el-form-item label="分组名称">
                            <el-input v-model="dialog.name" placeholder="请输入分组名称" maxlength="12" clearable />
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input v-model="dialog.description" placeholder="请输入分组描述" maxlength="12" clearable />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button class="ml-auto" @click="dialog.visible = false">取消</el-button>
                        <el-button type="primary" @click="doCreate">确认</el-button>
                    </template>
                </el-dialog>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import { ref, reactive, nextTick, onMounted } from 'vue'
import type {
    NodeDropType,
    RenderContentContext,
    ElTree
} from 'element-plus'
import api from '@/api/admin/homework_groups'



interface Prop {
    groupId?: number
    draggable?: boolean
}

interface Tree {
    id: number
    name: string
    type: number
    childs?: Tree[]
    showDrop?: boolean
}


const treeProps = {
    id: 0,
    showDrop: false,
    children: 'childs',
    label: 'name'
}

const drawerOpen = ref<boolean>(false)

const props = withDefaults(defineProps<Prop>(), {
    draggable: true
})

function open() {
    drawerOpen.value = true
}

const loading = ref<boolean>(false)

const groupTree = ref<InstanceType<typeof ElTree>>()

const groups = ref<Tree[]>()

const dialog = reactive({
    visible: false,
    title: '新增分组',
    description: '',
    name: '',
    id: 0,
    parent_id: 0
})

const emits = defineEmits(['onGroupSelect'])

const getGroup = (id: number): Tree | undefined => {
    function findGroup(groups: Tree[] = [], id: number): Tree | undefined {
        for (const item of groups) {
            if (item.id === id) {
                return item
            }
            if (item.childs && item.childs.length > 0) {
                const found = findGroup(item.childs, id)
                if (found) return found
            }
        }
        return undefined
    }

    return findGroup(groups.value, id)
}
watchEffect(() => {
    if (props.groupId) {
        groupTree.value?.setCurrentKey(props.groupId)
        const data = getGroup(props.groupId)
        if (data) {
            onNodeClick(data)
        }
    }
})
onMounted(() => {
    fetchMediaGroups()

})

function fetchMediaGroups() {
    api.gethomework_groups().then((res: Record<string, any>) => {
        groups.value = res as Tree[]

        nextTick(() => {
            if (res.length > 0) {
                // const id = props.groupId ?? res[0]['id']
                // if (groupTree.value) {
                //     groupTree.value.setCurrentKey(id)
                // }
            }
        })
    })
}

// 素材组
function goCreate(value: number) {
    dialog.parent_id = value
    dialog.visible = true
    dialog.name = ''
    dialog.description = ''
    dialog.id = 0
}

function goEdit(value: Record<string, any>) {
    dialog.visible = true
    dialog.name = value.name
    dialog.description = value.description
    dialog.id = value.id
    dialog.parent_id = 0
}

function goDelete(value: number) {
    ElMessageBox.confirm('删除分组后，分组下的素材会移动到父级分组，是否确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        if (loading.value) {
            return
        }

        loading.value = true

        api.deleteHomework_group(value)
            .then(() => {
                loading.value = false

                ElNotification({
                    type: 'success',
                    title: '',
                    message: '删除成功',
                    duration: 3000
                })

                fetchMediaGroups()
            })
            .catch(() => {
                loading.value = false
            })
    })
}

function doCreate() {
    if (!dialog.name || dialog.name.length > 16) {
        ElNotification({
            type: 'error',
            title: '',
            message: '分组名称长度在 1 和 16 之间',
            duration: 3000
        })
        return
    }

    if (loading.value) {
        return
    }
    loading.value = true

    const data: Record<string, any> = { name: dialog.name, description: dialog.description }
    if (dialog.parent_id) {
        data.parent_id = dialog.parent_id
    }

    if (dialog.id) {
        data.id = dialog.id
    }
    if (data.id) {
        api.updateHomework_group(data)
            .then(() => {
                loading.value = false

                ElNotification({
                    type: 'success',
                    title: '',
                    message: '修改成功',
                    duration: 3000
                })

                dialog.visible = false

                fetchMediaGroups()
            })
            .catch(() => {
                loading.value = false

                ElNotification({
                    type: 'error',
                    title: '',
                    message: '修改失败',
                    duration: 3000
                })
            })
        return
    }
    api.createHomework_group(data)
        .then(() => {
            loading.value = false

            ElNotification({
                type: 'success',
                title: '',
                message: '新增成功',
                duration: 3000
            })

            dialog.visible = false

            fetchMediaGroups()
        })
        .catch(() => {
            loading.value = false

            ElNotification({
                type: 'error',
                title: '',
                message: '新增失败',
                duration: 3000
            })
        })
}

const onNodeClick = (data: Tree) => {
    emits('onGroupSelect', { id: data.id, name: data.name })
}

const onNodeMouseover = (data: Tree) => {
    data.showDrop = true
}

const onNodeMouseleave = (data: Tree) => {
    data.showDrop = false
}

type Node = RenderContentContext['node']

const handleDrop = async (
    _draggingNode: Node,
    dropNode: Node,
    dropType: NodeDropType,
) => {
    if (dropType === 'inner') {
        await api.updateHomework_group({
            old_group_id: _draggingNode.data.id,
            new_group_id: dropNode.data.id
        })
    } else {
        await api.updateHomework_group({
            old_group_id: _draggingNode.data.id,
        })
    }
    fetchMediaGroups()
}
const allowDrop = (_draggingNode: Node, _dropNode: Node, dropType: NodeDropType) => {
    // 只允许拖到节点内部
    if (dropType === 'inner') {
        return true
    }
    // 禁止同层级前后排序
    return true
}
defineExpose({ open })
</script>

<style lang="scss">
.el-tree-node__content {
    height: 36px;
    margin-bottom: 5px;
    border-radius: 6px;
}

.el-dialog--center .el-dialog__footer {
    text-align: end;
}

.el-tree .is-current>.el-tree-node__content {
    background-color: #eef7ff;
    color: #409eff;

    .more-icon {
        color: #409eff;
    }
}
</style>