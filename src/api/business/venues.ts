import request from '@/utils/request'




export default {
    /**
     * 获取场馆列表
     * @param params 查询参数
     * @returns 
     */
    list(params?: any) {
        return request({
            url: '/venues',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 获取场馆详情
     * @param id 场馆ID
     * @returns 
     */
    detail(id: number | string) {
        return request({
            url: '/venues/' + id,
            method: 'get',
        })
    },
    /**
     * 创建场馆
     * @param data 场馆数据
     * @returns 
     */
    create(data: any) {
        return request({
            url: '/venues',
            method: 'post',
            data
        })
    },
    /**
     * 更新场馆
     * @param data 场馆数据
     * @returns 
     */
    put(data: any) {
        return request({
            url: '/venues/',
            method: 'put',
            data
        })
    },

    /**
     * 删除场馆
     * @param id 场馆ID
     * @returns
     * */
    delete(id: number | string) {
        return request({
            url: '/venues/',
            method: 'delete',
            data: { id }
        })
    }
}