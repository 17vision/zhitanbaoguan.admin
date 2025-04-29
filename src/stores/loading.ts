import { defineStore } from 'pinia'

interface requestsState {
    /**
     * 未处理的请求列表
     */
    requests: Array<string>
}

export const useLoading = defineStore('loading', {
    state: (): requestsState => ({
        requests: [] 
    }),
    getters: {
        loading(state): boolean {
            return state.requests.length > 0
        }
    },
    actions: {
        setRequest(value: string) {
            this.requests.push(value)
        },
        removeRequest(value: string) {
            const index = this.requests.indexOf(value)
            if (index > -1) {
                this.requests.splice(index, 1)
            }
        }
    }
})
