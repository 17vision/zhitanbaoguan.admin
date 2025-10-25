import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/resource_groups',
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
            url: '/resource_groups/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/resource_groups',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/resource_groups',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/resource_groups',
            method: 'delete',
            data: {
                id
            }
        })
    },

}