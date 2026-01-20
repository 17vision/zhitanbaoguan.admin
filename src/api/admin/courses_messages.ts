import request from '@/utils/request'

export default {

    list(params?: any) {
        return request({
            url: '/courses/messages',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },

    delete(data: { course_message_id?: number, course_message_reply_id?: number }) {
        return request({
            url: '/courses/messages',
            method: 'delete',
            data
        })
    },

}