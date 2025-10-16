import request from '@/utils/request'

export function uploadImage(data: {
    file: File | Blob | string,
    info: {
        /**
         * 引用来源 
         * course 课程封面
         * tutor 导师头像
         * course_chapter 课程章节封面
         */
        referer: string,
    }
}) {
    return request({
        url: '/images',
        method: 'post',
        data
    })
}
