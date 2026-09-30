<script setup lang="ts">
/* 作品详情 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DownloadCount from '@/components/DownloadCount.vue'
import { countDownload, fetchWork, fetchRelated, workState } from '@/store/work'
import type { Work } from '@/data/mockWorks'
import { toast } from '@/utils/ui'

const route = useRoute()
const router = useRouter()

const work = ref<Work | undefined>()
const loading = ref(true)
const imgLoaded = ref(false)
const imgFailed = ref(false)
const downloading = ref(false)

const workId = computed(() => Number(route.params.id))

const related = computed(() =>
  work.value ? fetchRelated(work.value.id, 4) : [],
)

async function load(): Promise<void> {
  loading.value = true
  imgLoaded.value = false
  imgFailed.value = false
  work.value = await fetchWork(workId.value)
  loading.value = false
}

// 计数时机：先上报，再跳转，失败不阻塞
async function onDownload(): Promise<void> {
  const current = work.value
  if (!current || downloading.value) return

  if (!current.downloadUrl) {
    toast('该作品未提供存档')
    return
  }

  downloading.value = true
  let counted = false
  try {
    const res = await countDownload(current.id)
    counted = res.counted
  } catch {
    // 统计失败不阻塞下载
    counted = false
  } finally {
    downloading.value = false
  }

  toast(counted ? '开始下载存档，感谢支持' : '开始下载存档')
  window.open(current.downloadUrl, '_blank', 'noopener')
}

function onVideo(): void {
  if (!work.value?.videoUrl) {
    toast('该作品没有视频链接')
    return
  }
  window.open(work.value.videoUrl, '_blank', 'noopener')
}

onMounted(load)
watch(workId, load)

const apiHint = computed(
  () => `GET /api/works/${workId.value}　·　POST /api/works/${workId.value}/download`,
)
</script>

<template>
  <div class="page detail">
    <!-- 返回 -->
    <button type="button" class="back" @click="router.back()">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M10 3.5 5.5 8l4.5 4.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      返回
    </button>

    <div v-if="loading" class="detail__loading">
      <div class="skeleton detail__skeleton-img" />
      <div class="skeleton detail__skeleton-line" style="width: 42%" />
      <div class="skeleton detail__skeleton-line" style="width: 68%" />
      <div class="skeleton detail__skeleton-line" style="width: 88%" />
    </div>

    <template v-else-if="work">
      <!-- 顶部大图：进入时轻微放大回正 -->
      <figure class="hero-img" v-reveal="0">
        <div v-if="!imgLoaded && !imgFailed" class="skeleton hero-img__skeleton" />
        <img
          v-if="!imgFailed"
          :src="work.image"
          :alt="work.title"
          class="hero-img__img"
          :class="{ 'is-loaded': imgLoaded }"
          @load="imgLoaded = true"
          @error="imgFailed = true"
        />
        <div v-else class="hero-img__fallback">图片加载失败</div>
      </figure>

      <header class="detail__head" v-reveal="60">
        <h1 class="detail__title">{{ work.title }}</h1>

        <!-- 信息条：分类-标签-下载量-发布时间 -->
        <div class="infobar">
          <RouterLink
            class="tag"
            :to="{ path: '/works', query: { category: work.category } }"
          >
            {{ work.category }}
          </RouterLink>
          <span class="infobar__sep" aria-hidden="true">·</span>
          <div class="infobar__tags">
            <RouterLink
              v-for="tag in work.tags"
              :key="tag"
              class="tag"
              :to="{ path: '/works', query: { tag } }"
            >
              {{ tag }}
            </RouterLink>
          </div>
          <span class="infobar__sep" aria-hidden="true">·</span>
          <DownloadCount :value="work.downloadCount" size="md" />
          <span class="infobar__sep" aria-hidden="true">·</span>
          <time class="infobar__time">{{ work.createdAt.slice(0, 10) }} 上传</time>
        </div>

        <div class="actions">
          <button
            type="button"
            class="btn btn--primary"
            :disabled="downloading || !work.downloadUrl"
            @click="onDownload"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" class="actions__icon">
              <path
                d="M8 2.4v7.2M5.1 6.9 8 9.8l2.9-2.9M3.4 12.8h9.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ downloading ? '正在计数…' : '下载存档' }}
          </button>
          <button
            type="button"
            class="btn btn--ghost"
            :disabled="!work.videoUrl"
            @click="onVideo"
          >
            观看演示视频
          </button>
        </div>
        <p class="hint">原型说明：点击下载会调用 {{ apiHint }}，数字随即平滑 +1</p>
      </header>

      <section class="detail__section" v-reveal="120">
        <h2 class="block-title">作品说明</h2>
        <p v-for="(para, i) in work.description.split('\n\n')" :key="i" class="paragraph">
          {{ para }}
        </p>
      </section>

      <section v-if="related.length" class="detail__section" v-reveal="180">
        <h2 class="block-title">相关作品</h2>
        <div class="rail">
          <RouterLink
            v-for="item in related"
            :key="item.id"
            class="rail__item"
            :to="`/works/${item.id}`"
          >
            <div class="rail__media">
              <img :src="item.image" :alt="item.title" loading="lazy" />
            </div>
            <div class="rail__body">
              <span class="rail__title">{{ item.title }}</span>
              <DownloadCount :value="item.downloadCount" size="sm" :animated="false" />
            </div>
          </RouterLink>
        </div>
      </section>
    </template>

    <div v-else class="missing">
      <h2>没有找到这个作品</h2>
      <p>它可能已经被删除了，或者链接不太对。</p>
      <RouterLink class="btn btn--primary" to="/works">回到作品列表</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.detail {
  padding-top: 32px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px 6px 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.back:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

.back svg {
  width: 16px;
  height: 16px;
}

.hero-img {
  position: relative;
  margin: 18px 0 0;
  aspect-ratio: 16 / 8;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: #191c23;
}

.hero-img__skeleton {
  position: absolute;
  inset: 0;
  border-radius: 0;
}

.hero-img__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity var(--dur-list) var(--ease-out),
    transform 520ms var(--ease-out);
}

/* 进入时轻微放大回正 */
.hero-img__img.is-loaded {
  opacity: 1;
  transform: scale(1);
}

.hero-img__fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--color-text-muted);
}

.detail__head {
  padding-top: 28px;
}

.detail__title {
  font-size: clamp(22px, 3.2vw, 32px);
  letter-spacing: -0.01em;
}

.infobar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.infobar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.infobar__sep {
  color: #3a3f4a;
}

.infobar__time {
  font-size: 12px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.actions__icon {
  width: 16px;
  height: 16px;
}

.hint {
  margin: 14px 0 0;
  color: #6b7280;
  font-size: 12px;
  font-family: var(--font-mono);
}

.detail__section {
  margin-top: 48px;
}

.block-title {
  margin-bottom: 14px;
  font-size: 17px;
}

.paragraph {
  margin: 0 0 12px;
  max-width: 760px;
  color: #c8ccd2;
  font-size: 15px;
}

.rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 240px);
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x proximity;
}

.rail__item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  scroll-snap-align: start;
  transition: transform var(--dur-card) var(--ease-out),
    box-shadow var(--dur-card) var(--ease-out),
    border-color var(--dur-card) var(--ease-in-out);
}

.rail__item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: #343a45;
}

.rail__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #191c23;
}

.rail__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rail__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
}

.rail__title {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail__loading {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 18px;
}

.detail__skeleton-img {
  aspect-ratio: 16 / 8;
  border-radius: var(--radius-card);
}

.detail__skeleton-line {
  height: 16px;
}

.missing {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 72px 0;
}

.missing p {
  margin: 0;
  color: var(--color-text-muted);
}

.missing .btn {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .hero-img {
    aspect-ratio: 16 / 10;
  }
}
</style>
