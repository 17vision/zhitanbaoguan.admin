import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/scenes',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },

    detail(id: any) {
        return request({
            url: '/scenes/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/scenes',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/scenes',
            method: 'put',
            data
        })
    },

    delete(ids: any) {
        return request({
            url: '/scenes',
            method: 'delete',
            data: {
                ids: String(ids)
            }
        })
    },

}