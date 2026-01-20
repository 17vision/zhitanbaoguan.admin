export function includes(f: string[], s: string[], mustAll: boolean = false): boolean {
    const diff = f.filter((value) => s.includes(value))
    if (mustAll) {
        return diff.length === s.length
    }
    return diff.length > 0
}

type RatioType = '9:16' | '16:9' | '1:1'

// 竖屏 9:16（允许误差）
function checkRatio9x16(width: number, height: number): boolean {
    if (!width || !height) return false
    const ratio = width / height
    return ratio >= 0.52 && ratio <= 0.60
}

// 横屏 16:9（允许误差）
function checkRatio16x9(width: number, height: number): boolean {
    if (!width || !height) return false
    const ratio = width / height
    return ratio >= 1.70 && ratio <= 1.85
}

// 正方形 1:1
function checkRatio1x1(width: number, height: number): boolean {
    if (!width || !height) return false
    const ratio = width / height
    return ratio >= 0.95 && ratio <= 1.05
}
function getFileSize(
    file: File
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        // 图片
        if (file.type.startsWith('image/')) {
            const img = new Image()
            img.onload = () => {
                resolve({ width: img.width, height: img.height })
                URL.revokeObjectURL(img.src)
            }
            img.onerror = reject
            img.src = URL.createObjectURL(file)
            return
        }

        // 视频
        if (file.type.startsWith('video/')) {
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                resolve({
                    width: video.videoWidth,
                    height: video.videoHeight
                })
                URL.revokeObjectURL(video.src)
            }
            video.onerror = reject
            video.src = URL.createObjectURL(file)
            return
        }

        reject(new Error('不支持的文件类型'))
    })
}

export async function checkFileRatio(
    file: File,
    target: RatioType
): Promise<{
    pass: boolean
    width: number
    height: number
    ratio: number
}> {
    const { width, height } = await getFileSize(file)
    const ratio = width / height

    let pass = false
    let ratioStr = ''
    switch (target) {
        case '9:16':
            pass = checkRatio9x16(width, height)
            ratioStr = '9:16'
            break
        case '16:9':
            pass = checkRatio16x9(width, height)
            ratioStr = '16:9'
            break
        case '1:1':
            pass = checkRatio1x1(width, height)
            ratioStr = '1:1'
            break
    }
    if (!pass) {
        throw new Error(`请上传${ratioStr}的文件`)
    }
    return { pass, width, height, ratio }
}
