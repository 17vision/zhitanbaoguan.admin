import request from '@/utils/request'

export default {
    /**
     * 获取作业分组列表
     * @param params 查询参数
     * @returns 
     */
    gethomework_groups(params?: any) {
        return request({
            url: '/homework_groups',
            method: 'get',
            params: {
                ...params
            }
        })
    },
    /**
     * 获取作业分组详情
     * @param id 作业分组ID
     * @returns 
     */
    getHomework_groupDetail(id: any) {
        return request({
            url: '/homework_groups/' + id,
            method: 'get',
        })
    },
    /**
     * 添加作业分组
     * @param data 作业分组数据
     * @returns 
     */
    createHomework_group(data: any) {
        return request({
            url: '/homework_groups',
            method: 'post',
            data
        })
    },
    /**
     * 更新作业分组
     * @param data 作业分组数据
     * @returns 
     */
    updateHomework_group(data: any) {
        return request({
            url: '/homework_groups',
            method: 'put',
            data
        })
    },
    /**
     * 删除作业分组
     * @param id 作业分组ID
     * @returns 
     */
    deleteHomework_group(id: any) {
        return request({
            url: '/homework_groups',
            method: 'delete',
            data: {
                id
            }
        })
    },

}