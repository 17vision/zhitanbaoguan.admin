import request from '@/utils/request'


/**
 * 获取作业分组列表
 * @param params 查询参数
 * @returns 
 */
function getOrganizations(params?: any) {
    return request({
        url: '/getOrganizations',
        method: 'get',
        params: {
            page: 1,
            limit: 10,
            ...params
        }
    })
}

export default {
    getOrganizations
}