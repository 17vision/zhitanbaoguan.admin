import request from '@/utils/request'

export default {
    /**
     * 获取列表
     * @param params 查询参数
     * @returns 
     */
    getOrders(params?: any) {
        return request({
            url: '/orders',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 退款
     * @returns 
     */
    postOrders(data: any) {
        return request({
            url: '/orders/refund',
            method: 'post',
            data
        })
    },
    /**
     * 退款
     * @returns 
     */
    closeOrders(data: any) {
        return request({
            url: '/orders/close',
            method: 'post',
            data
        })
    },

}