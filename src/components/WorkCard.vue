<script setup lang="ts">
/* 作品卡片 */
import { ref } from 'vue'
import type { Work } from '@/data/mockWorks'
import DownloadCount from './DownloadCount.vue'

const props = withDefaults(
  defineProps<{
    work: Work
    index?: number
    showCategory?: boolean
    /* 首屏卡片立即加载图片，其余懒加载 */
    priority?: boolean
  }>(),
  { index: 0, showCategory: true, priority: false },
)

const imgLoaded = ref(false)
const imgFailed = ref(false)

</script>

<template>
  <RouterLink
    class="card"
    :to="`/works/${props.work.id}`"
    v-reveal="(props.index % 6) * 40"
  >
    <div class="card__media">
      <div v-if="!imgLoaded && !imgFailed" class="skeleton card__skeleton" />
      <img
        v-if="!imgFailed"
        class="card__img"
        :class="{ 'is-loaded': imgLoaded }"
        :src="props.work.image"
        :alt="props.work.title"
        :loading="props.priority ? 'eager' : 'lazy'"
        :fetchpriority="props.priority ? 'high' : 'auto'"
        decoding="async"
        @load="imgLoaded = true"
        @error="imgFailed = true"
      />
      <div v-else class="card__fallback">图片加载失败</div>
      <span v-if="props.showCategory" class="card__badge">{{ props.work.category }}</span>
    </div>

    <div class="card__body">
      <h3 class="card__title">{{ props.work.title }}</h3>
      <div class="card__meta">
        <div class="card__tags">
          <RouterLink
            v-for="tag in props.work.tags.slice(0, 2)"
            :key="tag"
            class="tag"
            :to="{ path: '/works', query: { tag } }"
            @click.stop
          >
            {{ tag }}
          </RouterLink>
        </div>
        <DownloadCount :value="props.work.downloadCount" size="sm" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: transform var(--dur-card) var(--ease-out),
    box-shadow var(--dur-card) var(--ease-out),
    border-color var(--dur-card) var(--ease-in-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: #343a45;
}

.card:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 3px;
}

.card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #191c23;
}

.card__skeleton {
  position: absolute;
  inset: 0;
  border-radius: 0;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  /* 加载完淡入 */
  transition: opacity var(--dur-list) var(--ease-out),
    transform var(--dur-card) var(--ease-out);
}

.card__img.is-loaded {
  opacity: 1;
}

.card:hover .card__img.is-loaded {
  transform: scale(1.03);
}

.card__fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--color-text-muted);
  font-size: 13px;
}

.card__badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(15, 17, 21, 0.72);
  backdrop-filter: blur(8px);
  color: var(--color-text);
  font-size: 12px;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px 18px;
}

.card__title {
  font-size: 16px;
  font-weight: 600;
  /* 标题最多两行，保证网格高度整齐 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 26px;
}

.card__tags {
  display: flex;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

.card__tags .tag {
  cursor: pointer;
  white-space: nowrap;
}
</style>
