import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/resources',
            method: 'get',
            params: {
                ...params
            }
        })
    },

    detail(id: any) {
        return request({
            url: '/resources/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/resources',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/resources',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/resources',
            method: 'delete',
            data: {
                id
            }
        })
    },

}