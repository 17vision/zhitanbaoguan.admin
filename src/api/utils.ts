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
        /**
         * 资源类型
         * image 图片
         * video 视频
         * audio 音频
         */
        type?: string,
        /**
         * 是否返回缩略图
         */
        both?: boolean,
    }
}) {
    return request({
        url: '/images',
        method: 'post',
        isFormData: true,
        data
    })
}
export function uploadFiles(data: {
    file: File | Blob | string,
    info: {
        /**
         * 引用来源 
         * course 课程封面
         * tutor 导师头像
         * course_chapter 课程章节封面
         */
        referer: string,
        /**
         * 资源类型
         * image 图片
         * video 视频
         * audio 音频
         */
        type?: string,
    }
}) {
    return request({
        url: '/files',
        method: 'post',
        isFormData: true,
        data
    })
}
