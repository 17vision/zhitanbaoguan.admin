import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/ringtones',
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
            url: '/ringtones/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/ringtones',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/ringtones',
            method: 'put',
            data
        })
    },

    delete(ids: any) {
        return request({
            url: '/ringtones',
            method: 'delete',
            data: {
                ids: String(ids)
            }
        })
    },

}