import request from '@/utils/request'

export default {
    /**
     * 获取列表
     * @param params 查询参数
     * @returns 
     */
    getlist(params?: any) {
        return request({
            url: '/workflows',
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
    getDetail(id: any) {
        return request({
            url: '/workflows/' + id,
            method: 'get',
        })
    },
    /**
     * 退款
     * @returns 
     */
    putWorkflows(data: any) {
        return request({
            url: '/workflows',
            method: 'put',
            data
        })
    },

}