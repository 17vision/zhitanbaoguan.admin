import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowHeight(offset = 0) {
    const height = ref(window.innerHeight - offset)

    const updateHeight = () => {
        height.value = window.innerHeight - offset
    }

    onMounted(() => window.addEventListener('resize', updateHeight))
    onUnmounted(() => window.removeEventListener('resize', updateHeight))

    return height
}
