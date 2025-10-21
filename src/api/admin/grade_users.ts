import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/grade_users',
            method: 'get',
            params: {
                ...params
            }
        })
    },

    detail(id: any) {
        return request({
            url: '/grade_users/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/grade_users',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/grade_users',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/grade_users',
            method: 'delete',
            data: {
                id
            }
        })
    },

}