import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/tutors',
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
            url: '/tutors/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/tutors',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/tutors',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/tutors',
            method: 'delete',
            data: {
                id
            }
        })
    },

}