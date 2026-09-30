<script setup lang="ts">
/* 回到顶部 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(false)

function onScroll(): void {
  visible.value = window.scrollY > 520
}

function toTop(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="visible"
      type="button"
      class="to-top"
      aria-label="回到顶部"
      @click="toTop"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 12.6V3.6M4.4 7.2 8 3.6l3.6 3.6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.to-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 40;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: rgba(26, 29, 36, 0.85);
  backdrop-filter: blur(12px);
  color: var(--color-text-muted);
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: color var(--dur-hover) var(--ease-in-out),
    border-color var(--dur-hover) var(--ease-in-out),
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.to-top:hover {
  color: var(--color-primary);
  border-color: rgba(255, 75, 75, 0.5);
  background: rgba(32, 36, 45, 0.95);
}

.to-top:active {
  transform: scale(0.94);
}

.to-top svg {
  width: 18px;
  height: 18px;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity var(--dur-page) var(--ease-out),
    transform var(--dur-page) var(--ease-out);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 480px) {
  .to-top {
    right: 16px;
    bottom: 18px;
  }
}
</style>
