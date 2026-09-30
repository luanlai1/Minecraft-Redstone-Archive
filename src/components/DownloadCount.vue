<script setup lang="ts">
/* 下载量展示 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatCount } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    value: number
    // 详情用大一号样式
    size?: 'sm' | 'md'
    // 是否做计数动画（骨架/后台表格可以关闭
    animated?: boolean
  }>(),
  { size: 'sm', animated: true },
)

// 初始就是真实值：动画只是从0数上来的视觉包装，不承载数据正确性
const display = ref(props.value)
const bumped = ref(false)
const root = ref<HTMLElement | null>(null)
let timer = 0
let io: IntersectionObserver | null = null
let bumpTimer = 0

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const COUNT_MS = 600
const FRAME_MS = 24

function runCountUp(target: number): void {
  window.clearInterval(timer)
  if (reduceMotion() || !props.animated || target <= 0) {
    display.value = target
    return
  }
  const start = Date.now()
  display.value = 0
  timer = window.setInterval(() => {
    const p = Math.min(1, (Date.now() - start) / COUNT_MS)
    const eased = 1 - Math.pow(1 - p, 3) // ease-out
    display.value = Math.round(target * eased)
    if (p >= 1) {
      window.clearInterval(timer)
      display.value = target
    }
  }, FRAME_MS)
}

function bump(): void {
  bumped.value = true
  window.clearTimeout(bumpTimer)
  bumpTimer = window.setTimeout(() => (bumped.value = false), 320)
}

// 数字变化时要有轻微反馈
watch(
  () => props.value,
  (next, prev) => {
    if (prev === undefined) return
    display.value = next
    if (next > prev) bump()
  },
)

onMounted(() => {
  if (!props.animated || reduceMotion()) return

  if (!root.value || typeof IntersectionObserver === 'undefined') {
    runCountUp(props.value)
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp(props.value)
          io?.disconnect()
        }
      })
    },
    { threshold: 0.2 },
  )
  io.observe(root.value)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  window.clearTimeout(bumpTimer)
  io?.disconnect()
})

const text = computed(() => formatCount(display.value))
const title = computed(() => `累计下载 ${formatCount(props.value)} 次`)

defineExpose({ bump })
</script>

<template>
  <span
    ref="root"
    class="dl"
    :class="[`dl--${props.size}`, { 'is-bumped': bumped }]"
    :title="title"
    :aria-label="title"
  >
    <svg class="dl__icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 2.2v7.2M5.1 6.8 8 9.7l2.9-2.9M3.4 12.6h9.2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="dl__num">{{ text }}</span>
  </span>
</template>

<style scoped>
.dl {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  transition: color var(--dur-hover) var(--ease-in-out),
    transform var(--dur-hover) var(--ease-out);
  will-change: transform;
}

.dl--sm {
  font-size: 12px;
}

.dl--md {
  font-size: 14px;
  color: var(--color-text);
}

.dl__icon {
  width: 1em;
  height: 1em;
  flex: none;
}

.dl__num {
  /* 固定宽度 */
  display: inline-block;
  min-width: 3.6em;
  text-align: left;
}

.dl--md .dl__num {
  min-width: 4em;
}

/* 点击下载后的反馈 */
.dl.is-bumped {
  color: var(--color-primary);
  transform: translateY(-2px);
}
</style>
