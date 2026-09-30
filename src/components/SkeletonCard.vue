<script setup lang="ts">
/* 卡片用骨架屏，不要转圈 */
const props = withDefaults(defineProps<{ count?: number }>(), { count: 6 })
const items = Array.from({ length: props.count }, (_, i) => i)
</script>

<template>
  <div class="skeleton-card" v-for="i in items" :key="i">
    <div class="skeleton skeleton-card__media" />
    <div class="skeleton-card__body">
      <div class="skeleton skeleton-card__line skeleton-card__line--title" />
      <div class="skeleton skeleton-card__line skeleton-card__line--meta" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.skeleton-card__media {
  aspect-ratio: 16 / 10;
  border-radius: 0;
}

.skeleton-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px 18px;
}

.skeleton-card__line {
  height: 14px;
}

.skeleton-card__line--title {
  width: 72%;
}

.skeleton-card__line--meta {
  width: 46%;
  height: 12px;
}
</style>
