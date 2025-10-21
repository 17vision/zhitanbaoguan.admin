import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/user_homework',
            method: 'get',
            params: {
                ...params
            }
        })
    },


    create(data: any) {
        return request({
            url: '/user_homework',
            method: 'post',
            data
        })
    },



    delete(id: any) {
        return request({
            url: '/user_homework',
            method: 'delete',
            data: {
                id
            }
        })
    },

}