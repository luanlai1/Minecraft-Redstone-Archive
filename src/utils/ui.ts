import type { App } from 'vue'
import { reactive } from 'vue'

// Toast
// 所有操作有反馈
export interface ToastItem {
  id: number
  text: string
}

let toastSeq = 0
export const toasts = reactive<ToastItem[]>([])

export function toast(text: string): void {
  const id = ++toastSeq
  toasts.push({ id, text })
  window.setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx > -1) toasts.splice(idx, 1)
  }, 2400)
}

// 滚动入场
export const vReveal = {
  mounted(el: HTMLElement, binding: { value?: number }) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('is-visible')
      return
    }
    const delay = binding.value ?? 0
    el.style.setProperty('--reveal-delay', `${delay}ms`)

    const show = () => el.classList.add('is-visible')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show()
            io.unobserve(el)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(el)

    // 无论观察器是否触发，1.5s内一定显示。
    // 避免（内容永远停在 opacity:0）这种最坏情况（无头截图/打印/观察器异常都会出现）。
    const fallback = window.setTimeout(show, 1500 + delay)

    const target = el as HTMLElement & { __io?: IntersectionObserver; __fb?: number }
    target.__io = io
    target.__fb = fallback
  },
  unmounted(el: HTMLElement) {
    const target = el as HTMLElement & { __io?: IntersectionObserver; __fb?: number }
    target.__io?.disconnect()
    if (target.__fb) window.clearTimeout(target.__fb)
  },
}

export function installUi(app: App): void {
  app.directive('reveal', vReveal)
}