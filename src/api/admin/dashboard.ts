import request from '@/utils/request'

export default {
    basic_info(params?: any) {
        return request({
            url: '/dashboard/basic_info',
            method: 'get',
            params: {
                ...params
            }
        })
    },
    single_data(params?: any) {
        return request({
            url: '/dashboard/single_data',
            method: 'get',
            params: {
                ...params
            }
        })
    },
    view_data(params?: any) {
        return request({
            url: '/dashboard/view_data',
            method: 'get',
            params: {
                ...params
            }
        })
    },
}