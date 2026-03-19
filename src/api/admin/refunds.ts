import request from '@/utils/request'

export default {
    /**
     * 获取列表
     * @param params 查询参数
     * @returns 
     */
    getRefunds(params?: any) {
        return request({
            url: '/refunds',
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
    createRefund(data: any) {
        return request({
            url: '/refunds/reject',
            method: 'post',
            data
        })
    },

}