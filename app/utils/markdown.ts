import { rehypeHighlight } from '@nuxtjs/mdc/runtime'
import mdcHighlighter from '#mdc-highlighter'

const highlight = {
  highlighter: mdcHighlighter,
  theme: { default: 'light-plus', dark: 'dark-plus' }
}

/**
 * 后台预览用的 markdown 解析。
 *
 * 客户端拿不到 `#mdc-imports`（其中的依赖引用了 node 内置模块，浏览器里会抛错），
 * 解析器会静默丢掉 highlight 插件，导致预览里的代码块没有高亮。
 * 这里显式注册 highlight 插件，并复用 mdc 生成的 shiki highlighter 与站点主题。
 */
export function parsePreviewMarkdown(content: string) {
  return parseMarkdown(content, {
    rehype: {
      plugins: {
        highlight: { instance: rehypeHighlight, options: highlight }
      }
    },
    highlight,
    toc: {
      depth: 3,
      searchDepth: 3
    }
  })
}
