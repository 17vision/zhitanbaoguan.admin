import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/daily_sentences',
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
            url: '/daily_sentences/' + id,
            method: 'get',
        })
    },

    create(data: any) {
        return request({
            url: '/daily_sentences',
            method: 'post',
            data
        })
    },

    update(data: any) {
        return request({
            url: '/daily_sentences',
            method: 'put',
            data
        })
    },

    delete(id: any) {
        return request({
            url: '/daily_sentences',
            method: 'delete',
            data: {
                id
            }
        })
    },

}