import request from '@/utils/request'

export default {

    /**
     * 获取课程列表
     * @param params 查询参数
     * @returns 
     */
    getCourses(params?: any) {
        return request({
            url: '/courses',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 获取课程详情
     * @param id 课程ID
     * @returns 
     */
    getCoursesDetail(id: string) {
        return request({
            url: '/courses/' + id,
            method: 'get',
        })
    },
    /**
     * 创建课程
     * @param data 课程数据
     * @returns 
     */
    createCourse(data: any) {
        return request({
            url: '/courses',
            method: 'post',
            data
        })
    },
    /**
     * 更新课程
     * @param data 课程数据
     * @returns 
     */
    updateCourse(data: any) {
        return request({
            url: '/courses',
            method: 'put',
            data
        })
    },
    /**
     * 删除课程
     * @param id 课程ID
     * @returns 
     */
    deleteCourse(id: any) {
        return request({
            url: '/courses',
            method: 'delete',
            data: {
                id
            }
        })
    },
    /**
     * 获取课程下的所有章节
     * @param id 课程ID
     * @returns 
     */
    getCoursesChapters(id: string) {
        return request({
            url: '/course_chapters',
            method: 'get',
            params: {
                course_id: id
            }
        })
    },
    /**
     * 获取课程下的所有章节详情
     * @param params 查询参数
     * @returns 
     */
    getCoursesChaptersDetail(params: any) {
        return request({
            url: '/course_chapters',
            method: 'get',
            params
        })
    },
    /**
     * 创建课程章节
     * @param data 课程章节数据
     * @returns 
     */
    createCoursesChapters(data: any) {
        return request({
            url: '/course_chapters',
            method: 'post',
            data
        })
    },
    /**
     * 更新课程章节
     * @param data 课程章节数据
     * @returns 
     */
    updateCoursesChapters(data: any) {
        return request({
            url: '/course_chapters',
            method: 'put',
            data
        })
    },
    /**
     * 删除课程章节
     * @param id 课程章节ID
     * @returns 
     */
    deleteCoursesChapters(id: any) {
        return request({
            url: '/course_chapters',
            method: 'delete',
            data: {
                id
            }
        })
    },
    /**
     * 获取导师列表
     * @param params 查询参数
     * @returns 
     */
    getTutors(params?: any) {
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
    /**
     * 创建导师
     * @param data 导师数据
     * @returns 
     */
    createTutor(data: any) {
        return request({
            url: '/tutors',
            method: 'post',
            data
        })
    },
    /**
     * 更新导师
     * @param data 导师数据
     * @returns 
     */
    updateTutor(data: any) {
        return request({
            url: '/tutors',
            method: 'put',
            data
        })
    },
    /**
     * 删除导师
     * @param id 导师ID
     * @returns 
     */
    deleteTutor(id: any) {
        return request({
            url: '/tutors',
            method: 'delete',
            data: {
                id
            }
        })
    },
    /**
     * 获取资源列表
     * @param params 查询参数
     * @returns 
     */
    getResources(params?: any) {
        return request({
            url: '/resources',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 创建资源
     * @param data 资源数据
     * @returns 
     */
    createResource(data: any) {
        return request({
            url: '/resources',
            method: 'post',
            data
        })
    },
    /**
     * 更新资源
     * @param data 资源数据
     * @returns 
     */
    updateResource(data: any) {
        return request({
            url: '/resources',
            method: 'put',
            data
        })
    },
    /**
     * 删除资源
     * @param id 资源ID
     * @returns 
     */
    deleteResource(id: any) {
        return request({
            url: '/resources',
            method: 'delete',
            data: {
                id
            }
        })
    },
    /**
     * 获取资源组列表
     * @param params 查询参数
     * @returns 
     */
    getResource_groups(params?: any) {
        return request({
            url: '/resource_groups',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 创建资源组
     * @param data 资源组数据
     * @returns 
     */
    createResource_group(data: any) {
        return request({
            url: '/resource_groups',
            method: 'post',
            data
        })
    },
    /**
     * 更新资源组
     * @param data 资源组数据
     * @returns 
     */
    updateResource_group(data: any) {
        return request({
            url: '/resource_groups',
            method: 'put',
            data
        })
    },
    /**
     * 删除资源组
     * @param id 资源组ID
     * @returns 
     */
    deleteResource_group(id: any) {
        return request({
            url: '/resource_groups',
            method: 'delete',
            data: {
                id
            }
        })
    }
}