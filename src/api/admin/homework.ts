import request from '@/utils/request'

export default {
    /**
     * 获取作业
     * @param params 查询参数
     * @returns 
     */
    getHomeworks(params?: any) {
        return request({
            url: '/homework',
            method: 'get',
            params: {
                ...params
            }
        })
    },
    /**
     * 获取作业详情
     * @param id 作业ID
     * @returns 
     */
    getHomeworkDetail(id: any) {
        return request({
            url: '/homework/' + id,
            method: 'get',
        })
    },
    /**
     * 添加作业
     * @param data 作业数据
     * @returns 
     */
    createHomework(data: any) {
        return request({
            url: '/homework',
            method: 'post',
            data
        })
    },
    /**
     * 更新作业
     * @param data 作业数据
     * @returns 
     */
    updateHomework(data: any) {
        return request({
            url: '/homework',
            method: 'put',
            data
        })
    },
    /**
     * 删除作业
     * @param id 作业ID
     * @returns 
     */
    deleteHomework(id: any) {
        return request({
            url: '/homework',
            method: 'delete',
            data: {
                id
            }
        })
    },

}