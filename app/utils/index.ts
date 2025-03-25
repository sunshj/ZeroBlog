export function flattenTree<T extends { children?: T[] }>(tree?: T[]): T[] {
  const result: T[] = []

  function recurse(nodes: T[] | undefined) {
    if (!nodes) return

    for (const node of nodes) {
      result.push(node)
      recurse(node.children)
    }
  }

  recurse(tree)
  return result
}

export function groupBy<T>(array: T[], getKey: (item: T) => PropertyKey) {
  return array.reduce(
    (acc, item) => {
      const key = getKey(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<PropertyKey, T[]>
  )
}

export function uniqueBy<T, K extends keyof T>(array: T[], getKey?: K | ((item: T) => T[K])) {
  const result: T[] = []
  const keys = new Set()

  array.forEach(item => {
    const key = getKey ? (typeof getKey === 'function' ? getKey(item) : item[getKey]) : item
    if (!keys.has(key)) {
      keys.add(key)
      result.push(item)
    }
  })

  return result
}

export function escapeHtml(text: string) {
  const element = document.createElement('div')
  element.textContent = text
  return element.innerHTML
}

export function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  if (!intervals.length) return []

  // 首先将区间按起始位置排序
  intervals.sort((a, b) => a[0] - b[0])

  const merged = [intervals[0]!] // 初始化合并后的区间列表

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i]!
    const lastMerged = merged.at(-1)!

    // 如果当前区间与最后一个合并的区间重叠，则合并它们
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]) // 更新合并区间的结束位置
    } else {
      merged.push(current) // 如果不重叠，直接添加当前区间
    }
  }

  return merged
}
