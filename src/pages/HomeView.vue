<script setup lang="ts">
/* 首页 */
import { computed, onMounted } from 'vue'
// import WorkCard from '@/components/WorkCard.vue'
import { AUTHOR, LINKS, SITE } from '@/config/profile'
import { fetchWorks, workState } from '@/store/work'

/* 好玩的投影，最多 3 个 */
const funWorks = computed(() => workState.works.value.filter((w) => w.featured).slice(0, 3))
const total = computed(() => workState.works.value.length)
const totalDownloads = computed(() =>
  workState.works.value.reduce((sum, w) => sum + w.downloadCount, 0),
)

onMounted(() => {
  void fetchWorks()
})
</script>

<template>
  <div class="page">
    <section class="top">
      <div class="hero">
        <p class="hero__eyebrow" v-reveal="0">Minecraft · Redstone · Archive</p>
        <h1 class="hero__title" v-reveal="60">
          Redstone-Archive<br />
          这里是-><span>乱来的炒鸡小屋</span>
        </h1>
        <p class="hero__desc" v-reveal="120">{{ SITE.intro }}</p>
        <div class="hero__actions" v-reveal="180">
          <RouterLink class="btn btn--primary" to="/works">更多投影</RouterLink>
          <RouterLink class="btn btn--ghost" to="/about">关于这个档案馆</RouterLink>
        </div>

        <dl class="hero__stats" v-reveal="240">
          <div>
            <dt>作品</dt>
            <dd>{{ total }}</dd>
          </div>
          <div>
            <dt>累计下载</dt>
            <dd>{{ totalDownloads.toLocaleString('en-US') }}</dd>
          </div>
          <div>
            <dt>分类</dt>
            <dd>{{ workState.categories.value.length }}</dd>
          </div>
        </dl>
      </div>

      <!-- 作者卡片 -->
      <aside class="maker" v-reveal="120">
        <img
          class="maker__avatar"
          :src="AUTHOR.avatar"
          :alt="AUTHOR.name"
          width="72"
          height="72"
        />
        <h2 class="maker__name">{{ AUTHOR.name }}</h2>
        <p class="maker__handle">{{ AUTHOR.handle }}</p>
        <div class="maker__links">
          <a
            v-for="link in LINKS"
            :key="link.label"
            class="pill"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :style="{ '--brand': link.color }"
          >
            <span class="pill__dot" aria-hidden="true" />
            <span class="pill__label">{{ link.label }}</span>
            <svg class="pill__arrow" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M5.2 10.8 10.8 5.2M6.4 5.2h4.4v4.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      </aside>
    </section>

    <!-- 好玩的投影：最多 3 个 -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">一些好玩的小机器</h2>
        <RouterLink class="section-more" to="/works">更多投影 →</RouterLink>
      </div>

      <div class="grid">
        <!-- <WorkCard
          v-for="(work, i) in funWorks"
          :key="work.id"
          :work="work"
          :index="i"
          :priority="true"
        /> -->
      </div>

      <p class="order-note">
        作品按上传时间倒序排列
      </p>
    </section>
  </div>
</template>

<style scoped>
.top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 268px;
  gap: 48px;
  align-items: start;
  padding-top: 72px;
}

.hero {
  max-width: 700px;
}

.hero__eyebrow {
  margin: 0 0 14px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero__title {
  font-size: clamp(28px, 4.2vw, 44px);
  line-height: 1.22;
  letter-spacing: -0.01em;
}

.hero__title span {
  color: var(--color-primary);
}

.hero__desc {
  margin: 18px 0 0;
  max-width: 560px;
  color: var(--color-text-muted);
  font-size: 15px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin: 44px 0 0;
  padding-top: 26px;
  border-top: 1px solid var(--color-border);
}

.hero__stats div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero__stats dt {
  color: var(--color-text-muted);
  font-size: 12px;
}

.hero__stats dd {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* 作者卡片 */
.maker {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 22px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: transform var(--dur-card) var(--ease-out),
    box-shadow var(--dur-card) var(--ease-out),
    border-color var(--dur-card) var(--ease-in-out);
}

.maker:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: #343a45;
}

.maker__avatar {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: #12151b;
}

.maker__name {
  margin-top: 12px;
  font-size: 16px;
}

.maker__handle {
  margin: 2px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.maker__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
}

/* 三个链接按钮：与档案馆整体风格一致，悬停平滑过渡 */
.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: rgba(255, 255, 255, 0.02);
  font-size: 13px;
  text-align: left;
  transition: border-color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out),
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-card) var(--ease-out);
}

.pill:hover {
  border-color: color-mix(in srgb, var(--brand) 55%, transparent);
  background: color-mix(in srgb, var(--brand) 10%, transparent);
  box-shadow: var(--shadow-card);
}

.pill:active {
  transform: scale(0.985);
}

.pill__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 10px color-mix(in srgb, var(--brand) 60%, transparent);
  flex: none;
}

.pill__label {
  color: var(--color-text);
  font-weight: 500;
}

.pill__arrow {
  width: 14px;
  height: 14px;
  margin-left: auto;
  color: var(--color-text-muted);
  transition: transform var(--dur-card) var(--ease-out),
    color var(--dur-hover) var(--ease-in-out);
}

.pill:hover .pill__arrow {
  transform: translate(2px, -2px);
  color: var(--brand);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-card);
}

.section-more {
  color: var(--color-secondary);
  font-size: 13px;
  transition: color var(--dur-hover) var(--ease-in-out);
}

.section-more:hover {
  color: #7db6ff;
}

.order-note {
  margin: 20px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

@media (max-width: 992px) {
  .top {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding-top: 48px;
  }

  .maker {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    gap: 14px;
  }

  .maker__avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
  }

  .maker__name {
    margin-top: 0;
  }

  .maker__links {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 4px;
    width: auto;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .maker__links {
    width: 100%;
  }

  .pill {
    flex: 1 1 130px;
  }
}
</style>
