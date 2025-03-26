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
