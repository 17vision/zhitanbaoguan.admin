import request from '@/utils/request'

export default {

    // 获取课程列表
    getCourses(params: any) {
        return request({
            url: '/courses',
            method: 'get',
            params
        })
    },
    // 获取课程详情
    getCoursesDetail(params: any) {
        return request({
            url: '/courses',
            method: 'get',
            params
        })
    },
    // 创建课程
    createCourse(data: any) {
        return request({
            url: '/courses',
            method: 'post',
            data
        })
    },
    // 更新课程
    updateCourse(data: any) {
        return request({
            url: '/courses',
            method: 'put',
            data
        })
    },
    // 删除课程
    deleteCourse(data: any) {
        return request({
            url: '/courses',
            method: 'delete',
            data
        })
    },

    // 获取课程下的所有章节
    getCoursesChapters(id: string) {
        return request({
            url: '/course_chapters',
            method: 'get',
            params: {
                course_id: id
            }
        })
    },
    // 获取课程下的所有章节详情
    getCoursesChaptersDetail(params: any) {
        return request({
            url: '/course_chapters',
            method: 'get',
            params
        })
    },
    // 获取课程下的所有章节详情
    createCoursesChapters(data: any) {
        return request({
            url: '/course_chapters',
            method: 'post',
            data
        })
    },

    // 获取导师列表
    getTutors(params: any) {
        return request({
            url: '/tutors',
            method: 'get',
            params
        })
    },

    // 创建导师
    createTutor(data: any) {
        return request({
            url: '/tutors',
            method: 'post',
            data
        })
    },
    // 更新导师
    updateTutor(data: any) {
        return request({
            url: '/tutors',
            method: 'put',
            data
        })
    },
    // 删除导师
    deleteTutor(data: any) {
        return request({
            url: '/tutors',
            method: 'delete',
            data
        })
    },

}