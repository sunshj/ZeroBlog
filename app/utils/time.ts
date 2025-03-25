import { formatDate, formatTimeAgo } from '@vueuse/core'

export function timeAgo(datetime: string | number) {
  return formatTimeAgo(new Date(datetime), {
    messages: {
      justNow: '刚刚',
      past: (n: any) => (/\d/.test(n) ? `${n}前` : n),
      future: (n: any) => (/\d/.test(n) ? `${n}内` : n),
      month: (n: number, past: boolean) => (n === 1 ? (past ? '上个月' : '下个月') : `${n} 月`),
      year: (n: number, past: boolean) => (n === 1 ? (past ? '去年' : '明年') : `${n}年`),
      day: (n: number, past: boolean) => (n === 1 ? (past ? '昨天' : '明天') : `${n}天`),
      week: (n: number, past: boolean) => (n === 1 ? (past ? '上周' : '下周') : `${n}周`),
      hour: (n: string | number) => `${n}小时`,
      minute: (n: string | number) => `${n}分钟`,
      second: (n: string | number) => `${n}秒`,
      invalid: '无效日期'
    }
  })
}

export function formatTime(datetime: string | number, format = 'YYYY-MM-DD HH:mm:ss') {
  return formatDate(new Date(datetime), format)
}
