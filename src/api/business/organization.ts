import request from '@/utils/request'




export default {
    /**
     * 获取组织列表
     * @param params 查询参数
     * @returns 
     */
    list(params?: any) {
        return request({
            url: '/organizations',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 获取组织详情
     * @param id 组织ID
     * @returns 
     */
    detail(id: number) {
        return request({
            url: '/organizations/' + id,
            method: 'get',
        })
    },
    /**
     * 获取组织详情
     * @param id 组织ID
     * @returns 
     */
    create(data: any) {
        return request({
            url: '/organizations',
            method: 'post',
            data
        })
    },
    /**
     * 获取组织详情
     * @param id 组织ID
     * @returns 
     */
    put(data: any) {
        return request({
            url: '/organizations/',
            method: 'put',
            data
        })
    },
}