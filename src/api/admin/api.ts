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
    deleteCourse(data: any) {
        return request({
            url: '/courses',
            method: 'delete',
            data
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
            params: {
                page: 1,
                limit: 10,
                ...params
            }
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
     * 获取课程作业
     * @param params 查询参数
     * @returns 
     */
    getCourseHomeworks(params?: any) {
        return request({
            url: '/course_homework',
            method: 'get',
            params: {
                page: 1,
                limit: 10,
                ...params
            }
        })
    },
    /**
     * 添加作业
     * @param data 作业数据
     * @returns 
     */
    createCourseHomeworks(data: any) {
        return request({
            url: '/course_homework',
            method: 'post',
            data
        })
    },
    /**
     * 更新作业
     * @param data 作业数据
     * @returns 
     */
    updateCourseHomeworks(data: any) {
        return request({
            url: '/course_homework',
            method: 'put',
            data
        })
    },
    /**
     * 删除作业
     * @param id 作业ID
     * @returns 
     */
    deleteCourseHomeworks(id: any) {
        return request({
            url: '/course_homework',
            method: 'delete',
            data: {
                id
            }
        })
    },
    /**
 * 课程分析基本数据（个人）
 * @param id 作业ID
 * @returns 
 */
    courseanalysis_basic(params?: any) {
        return request({
            url: '/datastatistics/courseanalysis/basic',
            method: 'GET',
            params

        })
    },
    /**
 * 课程分析观看数据（个人）
 * @returns 
 */
    courseanalysis_view(params?: any) {
        return request({
            url: '/datastatistics/courseanalysis/view',
            method: 'GET',
            params

        })
    },
    /**
 * 获取脑机接口数据
 * @returns 
 */
    brain_machine_data(params: any) {
        return request({
            url: '/brain_machine_data',
            method: 'GET',
            params
        })
    },
    /**
 * 作业分析统计
 * @returns 
 */
    homeworkanalysis_basic(params?: any) {
        return request({
            url: '/datastatistics/homeworkanalysis/basic',
            method: 'GET',
            params
        })
    },
    /**
 * 作业分析统计
 * @returns 
 */
    homeworkanalysis_view(params?: any) {
        return request({
            url: '/datastatistics/homeworkanalysis/view',
            method: 'GET',
            params
        })
    },
}