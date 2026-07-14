import request from '@/utils/request'




export default {
    /**
     * 获取列表
     * @param params 查询参数
     * @returns 
     */
    list(params?: any) {
        return request({
            url: '/combine_templates',
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
            url: '/combine_templates/' + id,
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
            url: '/combine_templates',
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
            url: '/combine_templates/',
            method: 'put',
            data
        })
    },
    delete(id: number | string) {
        return request({
            url: '/combine_templates/',
            method: 'delete',
            data: { id }
        })
    },
    /**
        * 排序
        * @param data 数据
        * @returns 
        */
    sort(ids: number[]) {
        return request({
            url: '/combine_templates/sorts',
            method: 'POST',
            data: {
                ids
            }

        })
    },
    /**
        * 获取小程序码
        * @param id 场馆ID
        * @returns
        */
    qrcode(id?: any) {
        return request({
            url: 'combine_templates/qrcode',
            method: 'post',
            data: {
                id
            }
        })
    },
}