import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/grades',
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
            url: '/grades/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/grades',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/grades',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/grades',
            method: 'delete',
            data: {
                id
            }
        })
    },

}