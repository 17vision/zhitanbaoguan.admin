import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/scene_categories',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },



    create(data: any) {
        return request({
            url: '/scene_categories',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/scene_categories',
            method: 'put',
            data
        })
    },

    delete(ids: any) {
        return request({
            url: '/scene_categories',
            method: 'delete',
            data: {
                ids: String(ids)
            }
        })
    },

}