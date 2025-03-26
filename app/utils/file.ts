export function blobToBase64(blob: Blob, urlSafe = false) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      let base64 = (reader.result as string)?.split(',')[1] as string
      if (urlSafe) {
        base64 = base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
      }
      resolve(base64)
    })
    reader.addEventListener('error', reject)
    reader.readAsDataURL(blob)
  })
}

export function compressImage(image: string | File, quality = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // 处理跨域问题

    // 处理不同类型的输入（URL 或 File）
    if (typeof image === 'string') {
      img.src = image // 直接使用 URL
    } else if (image instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result // 读取文件并转换为 Data URL
        } else {
          reject(new Error('文件读取失败'))
        }
      })
      reader.addEventListener('error', () => reject(new Error('文件读取失败')))
    } else {
      return reject(new Error('无效的图片输入'))
    }

    img.addEventListener('load', function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('无法获取 Canvas 上下文'))

      // 计算新尺寸（最大宽高 500px）
      const scale = Math.min(500 / img.width, 500 / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // 压缩图片并转换为 Blob
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(URL.createObjectURL(blob)) // 返回 Object URL
          } else {
            reject(new Error('Blob 生成失败'))
          }
        },
        'image/png',
        quality
      )
    })

    img.addEventListener('error', () => reject(new Error('图片加载失败')))
  })
}
