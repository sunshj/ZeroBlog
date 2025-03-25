export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('content:file:afterParse', file => {
    if (file._extension === 'md') {
      file.sticky ??= 0
      file.hidden ??= false
    }
  })
})
