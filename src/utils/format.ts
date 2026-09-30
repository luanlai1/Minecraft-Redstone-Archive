/* 数字格式化：小于10000使用千分位：1000 -> 1,000；大于等于10000使用中文万位：12800 -> 1.3万 */
export function formatCount(value: number): string {
  const n = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  if (n >= 10000) {
    const wan = Math.round((n / 10000) * 10) / 10
    return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}万`
  }
  return n.toLocaleString('en-US')
}

// 相对时间提示，仅用于展示
export function formatDate(value: string): string {
  return value
}
