<script setup lang="ts">
/* 作品列表，筛选切换时列表淡出淡出，搜索300ms防抖 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import WorkCard from '@/components/WorkCard.vue'
import { fetchWorks, workState } from '@/store/work'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const debouncedKeyword = ref('')
const activeCategory = ref('全部')
const activeTag = ref('')
const switching = ref(false)

let debounceTimer = 0
let switchTimer = 0

// 从URL读取筛选条件，分享链接可还原状态
function syncFromQuery(): void {
  const q = route.query
  keyword.value = typeof q.keyword === 'string' ? q.keyword : ''
  debouncedKeyword.value = keyword.value
  activeCategory.value = typeof q.category === 'string' ? q.category : '全部'
  activeTag.value = typeof q.tag === 'string' ? q.tag : ''
}

watch(
  () => route.query,
  () => {
    syncFromQuery()
    triggerSwitch()
  },
)

/* 筛选切换时列表淡出淡入 */
function triggerSwitch(): void {
  switching.value = true
  window.clearTimeout(switchTimer)
  switchTimer = window.setTimeout(() => (switching.value = false), 30)
}

watch(keyword, (value) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedKeyword.value = value
    triggerSwitch()
    router.replace({
      query: {
        ...(value ? { keyword: value } : {}),
        ...(activeCategory.value !== '全部' ? { category: activeCategory.value } : {}),
        ...(activeTag.value ? { tag: activeTag.value } : {}),
      },
    })
  }, 300)
})

function pickCategory(name: string): void {
  activeCategory.value = name
  triggerSwitch()
  router.replace({
    query: {
      ...(debouncedKeyword.value ? { keyword: debouncedKeyword.value } : {}),
      ...(name !== '全部' ? { category: name } : {}),
      ...(activeTag.value ? { tag: activeTag.value } : {}),
    },
  })
}

function clearTag(): void {
  activeTag.value = ''
  router.replace({
    query: {
      ...(debouncedKeyword.value ? { keyword: debouncedKeyword.value } : {}),
      ...(activeCategory.value !== '全部' ? { category: activeCategory.value } : {}),
    },
  })
  triggerSwitch()
}

function resetAll(): void {
  keyword.value = ''
  debouncedKeyword.value = ''
  activeCategory.value = '全部'
  activeTag.value = ''
  router.replace({ query: {} })
  triggerSwitch()
}

/* 筛选后的列表仍然固定时间倒序 */
const filtered = computed(() => {
  const kw = debouncedKeyword.value.trim().toLowerCase()
  return workState.works.value.filter((w) => {
    if (activeCategory.value !== '全部' && w.category !== activeCategory.value) return false
    if (activeTag.value && !w.tags.includes(activeTag.value)) return false
    if (!kw) return true
    return (
      w.title.toLowerCase().includes(kw) ||
      w.description.toLowerCase().includes(kw) ||
      w.tags.some((t) => t.toLowerCase().includes(kw))
    )
  })
})

const hasFilter = computed(
  () =>
    debouncedKeyword.value.trim() !== '' ||
    activeCategory.value !== '全部' ||
    activeTag.value !== '',
)

onMounted(() => {
  syncFromQuery()
  void fetchWorks()
})

onBeforeUnmount(() => {
  window.clearTimeout(debounceTimer)
  window.clearTimeout(switchTimer)
})
</script>

<template>
  <div class="page">
    <header class="head" v-reveal="0">
      <h1 class="head__title">全部作品</h1>
      <p class="head__desc">
        共 {{ workState.works.value.length }} 个作品，按上传时间倒序 ——
        <strong>后上传的在上面</strong>，往下划才是更早的作品。
      </p>
    </header>

    <div class="filters" v-reveal="60">
      <label class="search">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7.2" cy="7.2" r="4.4" fill="none" stroke="currentColor" stroke-width="1.5" />
          <path d="m10.6 10.6 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索标题、描述或标签…"
          aria-label="搜索作品"
        />
      </label>

      <div class="chips">
        <button
          type="button"
          class="chip"
          :class="{ 'is-active': activeCategory === '全部' }"
          @click="pickCategory('全部')"
        >
          全部
        </button>
        <button
          v-for="name in workState.categories.value"
          :key="name"
          type="button"
          class="chip"
          :class="{ 'is-active': activeCategory === name }"
          @click="pickCategory(name)"
        >
          {{ name }}
        </button>
      </div>

      <button v-if="hasFilter" type="button" class="reset" @click="resetAll">清除筛选</button>
    </div>

    <div v-if="activeTag" class="tagbar" v-reveal="90">
      <span class="tagbar__label">标签筛选</span>
      <button type="button" class="tag tagbar__tag" @click="clearTag">
        {{ activeTag }} ✕
      </button>
    </div>

    <!-- 筛选切换淡出淡入 -->
    <Transition name="fade" mode="out-in">
      <div v-if="workState.loading.value" key="loading" class="grid">
        <SkeletonCard :count="6" />
      </div>

      <div v-else-if="filtered.length" :key="`list-${filtered.length}-${activeCategory}-${activeTag}-${debouncedKeyword}`" class="grid">
        <WorkCard
          v-for="(work, i) in filtered"
          :key="work.id"
          :work="work"
          :index="i"
          :priority="i < 3"
        />
      </div>

      <EmptyState
        v-else
        key="empty"
        title="没有找到匹配的作品"
        desc="试着换个关键词，或选择「全部」分类重新看看。"
        action-text="清除筛选"
        @action="resetAll"
      />
    </Transition>

    <p class="order-note">列表顺序固定为上传时间倒序，暂不提供排序功能。</p>
  </div>
</template>

<style scoped>
.head {
  padding: 56px 0 0;
}

.head__title {
  font-size: clamp(24px, 3.4vw, 34px);
}

.head__desc {
  margin: 12px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.head__desc strong {
  color: var(--color-text);
  font-weight: 600;
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 26px 0 0;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 240px;
  max-width: 320px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: var(--color-surface);
  transition: border-color var(--dur-hover) var(--ease-in-out),
    box-shadow var(--dur-hover) var(--ease-in-out);
}

/* 聚焦时边框渐变为强调色 */
.search:focus-within {
  border-color: rgba(255, 75, 75, 0.55);
  box-shadow: 0 0 0 3px rgba(255, 75, 75, 0.12);
}

.search svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  flex: none;
}

.search input {
  width: 100%;
  padding: 10px 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 14px;
  outline: none;
}

.search input::placeholder {
  color: #6b7280;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reset {
  margin-left: auto;
  padding: 7px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    border-color var(--dur-hover) var(--ease-in-out);
}

.reset:hover {
  color: var(--color-primary);
  border-color: rgba(255, 75, 75, 0.5);
}

.tagbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}

.tagbar__label {
  color: var(--color-text-muted);
  font-size: 12px;
}

.tagbar__tag {
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-card);
  margin-top: 24px;
}

.order-note {
  margin: 28px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .filters {
    align-items: stretch;
  }

  .search {
    max-width: none;
  }

  .reset {
    margin-left: 0;
  }
}
</style>
