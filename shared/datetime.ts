export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const pad = (value: number) => String(value).padStart(2, '0')

const TOKENS: Record<string, (date: Date) => string> = {
  YYYY: date => String(date.getFullYear()),
  MM: date => pad(date.getMonth() + 1),
  DD: date => pad(date.getDate()),
  HH: date => pad(date.getHours()),
  mm: date => pad(date.getMinutes()),
  ss: date => pad(date.getSeconds())
}

export function dateFormat(value: string | number | Date, format = DATETIME_FORMAT) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Invalid Date'

  return format.replaceAll(/YYYY|MM|DD|HH|mm|ss/g, token => TOKENS[token]!(date))
}

export function isDateTime(value: string) {
  const parsed = new Date(value.replace(' ', 'T'))
  return !Number.isNaN(parsed.getTime()) && dateFormat(parsed) === value
}
