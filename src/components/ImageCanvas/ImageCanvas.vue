<template>
    <el-dialog v-model="dialog.visible" :width="dialog.width" :title="title" :show-close="false">
        <div class="flex gap-2 justify-between">
            <div class="relative " :style="{ width: props.conWidth + 'px', height: props.conHeight + 'px' }">
                <canvas ref="imageCanvas" class="absolute top-0 left-0 imageCanvas" :width="props.conWidth"
                    :height="props.conHeight"></canvas>
                <canvas ref="selectionCanvas" class="absolute top-0 left-0 " :width="props.conWidth"
                    :height="props.conHeight"></canvas>
            </div>
            <div class="flex flex-col gap-2 ">
                <div class="h-[120px] w-[120px] flex justify-center items-center border border-gray-300">
                    <img v-if="imgUrl" :src="imgUrl" class="border border-gray-300" alt="preview"
                        style="max-width: 120px; max-height: 120px;" />
                </div>
            </div>
        </div>
        <div class="cropper-tools">
            <div>
                <div class="input-btn">
                    <label class="el-button el-button--info el-button--small" for="file">选择图片</label>
                    <input class="hidden" id="file" name="file" type="file" @change="chageImage" />
                </div>
        <el-button size="small" type="info" @click="actionHandler('rl')">向左旋转</el-button>
        <el-button size="small" type="info" @click="actionHandler('rr')">向右旋转</el-button>
        <el-button size="small" type="info" @click="actionHandler('fx')">左右镜像</el-button>
        <el-button size="small" type="info" @click="actionHandler('fy')">上下镜像</el-button>
            </div>
            <el-button type="primary" @click="cropperComplete">保存</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted, onUnmounted } from "vue";

interface Emits {
    (e: "onCropperComplete", value: string): void;
}

interface Props {
    title: string;
    conWidth?: number;
    conHeight?: number;
}


const emits = defineEmits<Emits>();

const selection = reactive({
    x: 50,
    y: 50,
    width: 150,
    height: 150,
    dragging: false,
    resizing: false,
    dragStartX: 0,
    dragStartY: 0,
    maxWidth: 300,
});

const props = withDefaults(defineProps<Props>(), {
    title: "",
    conWidth: 520,
    conHeight: 300,
});

const dialog = reactive({
    visible: false,
    width: "60%",
});

watch(
    () => props,
    () => {
        dialog.width = props.conWidth + 208 + "px";
    },
    {
        immediate: true,
    }
);


const open = async (file?: File) => {
    dialog.visible = true;
    if (file) {
        init(file);
    }
};

const imageCanvas = ref<HTMLCanvasElement>();
const selectionCanvas = ref<HTMLCanvasElement>();
const image = ref()
const imgUrl = ref<string>("");
const init = async (file: File) => {
    selection.x = (props.conWidth - selection.width) / 2;
    selection.y = (props.conHeight - selection.height) / 2;
    nextTick(() => {
        selectionCanvas.value?.addEventListener("mousedown", onMouseDown);
        const canvasElement: HTMLCanvasElement = imageCanvas.value as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                image.value = img;
                initImage(img);
            };
        }
    })

}
function chageImage() {
    const fileInput: HTMLInputElement = document.getElementById("file") as HTMLInputElement;
    const files: FileList = fileInput?.files as FileList;
    if (files.length > 0) {
        init(files[0]);
    }
}
const close = function () {
    dialog.visible = false;
};

const rotation = ref(0); // 角度
const mirrorX = ref(false);
const mirrorY = ref(false);
function actionHandler(value: string) {

    switch (value) {
        case "rl":
            rotation.value -= 90;
            drawTransformedImage();
            break;
        case "rr":
            rotation.value += 90;
            drawTransformedImage();
            break;
        case "fx":
            mirrorX.value = !mirrorX.value;
            drawTransformedImage();
            break;
        case "fy":
            mirrorY.value = !mirrorY.value;
            drawTransformedImage();
            break;
        default:
            break;
    }
}
function drawTransformedImage() {
    const canvasElement = imageCanvas.value!;
    const ctx = canvasElement.getContext("2d")!;
    if (!ctx || !image.value) return;

    const canvasW = canvasElement.width;
    const canvasH = canvasElement.height;

    const imgW = image.value.width;
    const imgH = image.value.height;

    const scale = selection.maxWidth / imgW;
    const scaledWidth = imgW * scale;
    const scaledHeight = imgH * scale;

    const angle = (rotation.value % 360) * Math.PI / 180;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();

    // 移动到中心旋转、镜像
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate(angle);
    ctx.scale(mirrorX.value ? -1 : 1, mirrorY.value ? -1 : 1);

    // 绘制图像（居中）
    ctx.drawImage(image.value, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

    ctx.restore();

    drawSelectionBox();   // 红框
}


const onMouseDown = (e: MouseEvent) => {

    const rect = imageCanvas.value!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const resizeMargin = 10;
    const resizeZoneX = selection.x + selection.width - resizeMargin;
    const resizeZoneY = selection.y + selection.height - resizeMargin;
    const canvasEl = selectionCanvas.value!;
    if (
        offsetX >= resizeZoneX &&
        offsetX <= selection.x + selection.width &&
        offsetY >= resizeZoneY &&
        offsetY <= selection.y + selection.height
    ) {
        selection.resizing = true;
        selection.dragStartX = offsetX;
        selection.dragStartY = offsetY;
        canvasEl.style.cursor = "nwse-resize"; // 右下角拉伸

        return;
    }

    if (
        offsetX > selection.x &&
        offsetX < selection.x + selection.width &&
        offsetY > selection.y &&
        offsetY < selection.y + selection.height
    ) {
        selection.dragging = true;
        selection.dragStartX = offsetX - selection.x;
        selection.dragStartY = offsetY - selection.y;
    }
};

const onMouseMove = (e: MouseEvent) => {
    const rect = selectionCanvas.value!?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const resizeMargin = 10;
    const resizeZoneX = selection.x + selection.width - resizeMargin;
    const resizeZoneY = selection.y + selection.height - resizeMargin;

    const canvasEl = selectionCanvas.value!;

    // 设置鼠标样式
    if (
        offsetX >= resizeZoneX &&
        offsetX <= selection.x + selection.width &&
        offsetY >= resizeZoneY &&
        offsetY <= selection.y + selection.height
    ) {
        canvasEl.style.cursor = "nwse-resize"; // 右下角拉伸
    } else if (
        offsetX > selection.x &&
        offsetX < selection.x + selection.width &&
        offsetY > selection.y &&
        offsetY < selection.y + selection.height
    ) {
        canvasEl.style.cursor = "move"; // 移动红框
    } else {
        canvasEl.style.cursor = "default"; // 普通区域
    }

    // 拖动缩放
    if (selection.resizing) {
        const newWidth = offsetX - selection.x;
        const newHeight = offsetY - selection.y;
        selection.width = Math.max(20, Math.min(newWidth, props.conWidth - selection.x));
        selection.height = Math.max(20, Math.min(newHeight, props.conHeight - selection.y));
        canvasEl.style.cursor = "nwse-resize"; // 右下角拉伸
        drawSelectionBox();
        return;
    }

    // 拖动移动
    if (selection.dragging) {
        selection.x = offsetX - selection.dragStartX;
        selection.y = offsetY - selection.dragStartY;
        selection.x = Math.max(0, Math.min(selection.x, props.conWidth - selection.width));
        selection.y = Math.max(0, Math.min(selection.y, props.conHeight - selection.height));
        drawSelectionBox();
    }
};

function initImage(img?: HTMLImageElement) {
    const canvasElement = imageCanvas.value!;
    const ctx = canvasElement.getContext("2d")!;
    const canvasW = props.conWidth;
    const canvasH = props.conHeight;
    ctx.clearRect(0, 0, canvasW, canvasH);

    if (img) {
        const scale = selection.maxWidth / img.width;
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        // 计算缩放比例（等比缩放至不超过 300 宽）
        ctx.drawImage(img, (canvasW - scaledWidth) / 2, (canvasH - scaledHeight) / 2, scaledWidth, scaledHeight);

    }
    drawSelectionBox();
}

function drawSelectionBox() {
    const canvasElement = selectionCanvas.value!;
    const ctx = canvasElement.getContext("2d")!;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);

    const handleSize = 8;
    ctx.fillStyle = "#EA7F26";
    ctx.fillRect(selection.x + selection.width - handleSize / 2, selection.y + selection.height - handleSize / 2, handleSize, handleSize);

    ctx.restore();
    drawOverlay(ctx);
    getSelectedImageUrl();


}

function drawOverlay(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // 半透明黑色

    const { x, y, width, height } = selection;
    const canvasW = selectionCanvas.value!.width;
    const canvasH = selectionCanvas.value!.height;

    // 上方遮罩
    ctx.fillRect(0, 0, canvasW, y);
    // 下方遮罩
    ctx.fillRect(0, y + height, canvasW, canvasH - (y + height));
    // 左侧遮罩
    ctx.fillRect(0, y, x, height);
    // 右侧遮罩
    ctx.fillRect(x + width, y, canvasW - (x + width), height);

    ctx.restore();
}

function getSelectedImageUrl() {
    const canvasElement = imageCanvas.value!;
    const ctx = canvasElement.getContext("2d")!;

    // 从主画布中裁剪红框区域
    const imageData = ctx.getImageData(selection.x, selection.y, selection.width, selection.height);

    // 创建一个离屏 canvas 用于生成新的图片
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = selection.width;
    outputCanvas.height = selection.height;

    const outputCtx = outputCanvas.getContext("2d")!;
    outputCtx.putImageData(imageData, 0, 0);

    // 转为 base64 图片并设置 imgUrl
    imgUrl.value = outputCanvas.toDataURL("image/jpeg");
}


onMounted(() => {
    nextTick(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    })
});

onUnmounted(() => {
    selectionCanvas.value?.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
});
const onMouseUp = () => {
    selection.dragging = false;
    selection.resizing = false;
};

function cropperComplete() {
    emits("onCropperComplete", imgUrl.value);
    close();
}
defineExpose({
    open,
    close,
});
</script>

<style>
.cropper-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}

.cropper-tools .input-btn {
    display: inline-block;
    margin-right: 12px;
}

.hidden {
    display: none;
}

.el-dialog {
    border-radius: 10px;
}

.el-dialog__header {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
    margin: 0 !important;
}

.el-dialog__body {
    padding-left: 16px !important;
    padding-right: 16px !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
}

.imageCanvas {
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%),
        linear-gradient(-45deg, #eee 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #eee 75%),
        linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
