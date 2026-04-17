import request from '@/utils/request'




export default {
    /**
     * 获取列表
     * @param params 查询参数
     * @returns 
     */
    list(params?: any) {
        return request({
            url: '/venue_introductions',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 获取详情
     * @param id ID
     * @returns 
     */
    detail(id: number | string) {
        return request({
            url: '/venue_introductions/' + id,
            method: 'get',
        })
    },
    /**
     * 创建
     * @param data 数据
     * @returns 
     */
    create(data: any) {
        return request({
            url: '/venue_introductions',
            method: 'post',
            data
        })
    },
    /**
     * 更新
     * @param data 数据
     * @returns 
     */
    put(data: any) {
        return request({
            url: '/venue_introductions/',
            method: 'put',
            data
        })
    },
    /**
     * 删除
     * @param id ID
     * @returns
     *  
     * */
    delete(id: number | string) {
        return request({
            url: '/venue_introductions/',
            method: 'delete',
            data: {
                id
            }
        })
    }
}