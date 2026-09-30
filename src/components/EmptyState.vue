<script setup lang="ts">
/* 每个列表都有空状态插画/文案，不要出现空白页面 */
withDefaults(
  defineProps<{
    title?: string
    desc?: string
    actionText?: string
  }>(),
  {
    title: '这里还空着',
    desc: '换个筛选条件试试，或者先去上传第一个作品。',
    actionText: '',
  },
)

const emit = defineEmits<{ (e: 'action'): void }>()
</script>

<template>
  <div class="empty">
    <svg class="empty__art" viewBox="0 0 120 96" aria-hidden="true">
      <g fill="none" stroke="var(--color-border)" stroke-width="2">
        <rect x="16" y="26" width="88" height="56" rx="8" />
        <path d="M16 44h88" />
      </g>
      <g fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round">
        <path d="M38 62h20M46 54v16" opacity="0.85" />
        <path d="M70 54l14 16M84 54L70 70" opacity="0.45" />
      </g>
      <g fill="var(--color-border)">
        <circle cx="26" cy="35" r="2.4" />
        <circle cx="34" cy="35" r="2.4" />
        <circle cx="42" cy="35" r="2.4" />
      </g>
    </svg>
    <h3 class="empty__title">{{ title }}</h3>
    <p class="empty__desc">{{ desc }}</p>
    <button v-if="actionText" type="button" class="btn btn--ghost" @click="emit('action')">
      {{ actionText }}
    </button>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 72px 24px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card);
  background: rgba(26, 29, 36, 0.5);
  text-align: center;
}

.empty__art {
  width: 120px;
  height: 96px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.empty__title {
  font-size: 16px;
}

.empty__desc {
  margin: 0 0 8px;
  max-width: 320px;
  color: var(--color-text-muted);
  font-size: 13px;
}
</style>
