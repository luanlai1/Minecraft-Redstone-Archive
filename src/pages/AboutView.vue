<script setup lang="ts">
/**
 * 关于
 * 所有文案与链接集中在src/config/profile.ts
 */
import { AUTHOR, LINKS, SITE } from '@/config/profile'
</script>

<template>
  <div class="page about">
    <header class="hero" v-reveal="0">
      <p class="hero__eyebrow">About</p>
      <h1 class="hero__title">关于这个档案馆</h1>
      <p class="hero__desc">{{ SITE.tagline }}</p>
    </header>

    <div class="about__grid">
      <!-- 作者卡片 -->
      <aside class="author" v-reveal="60">
        <img class="author__avatar" :src="AUTHOR.avatar" :alt="AUTHOR.name" width="80" height="80" />
        <h2 class="author__name">{{ AUTHOR.name }}</h2>
        <p class="author__handle">{{ AUTHOR.handle }}</p>
        <p class="author__bio">{{ AUTHOR.bio }}</p>

        <div class="author__links">
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
            <span class="pill__handle">{{ link.handle }}</span>
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

      <!-- 说明 -->
      <section class="story" v-reveal="120">
        <h2 class="block-title">这个档案馆是什么</h2>
        <p v-for="(para, i) in SITE.about" :key="i" class="paragraph">{{ para }}</p>

        <div class="facts">
          <div class="fact">
            <span class="fact__k">投影等轴渲染</span>
            <span class="fact__v">直观了解机器大至结构</span>
          </div>
          <div class="fact">
            <span class="fact__k">上传时间倒序</span>
            <span class="fact__v">后上传的在最上面</span>
          </div>
          <div class="fact">
            <span class="fact__k">下载量公开</span>
            <span class="fact__v">每个机器投影被下载了多少次都能看到</span>
          </div>
        </div>

        <RouterLink class="btn btn--primary" to="/works">去逛更多投影</RouterLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding-top: 56px;
}

.hero {
  max-width: 640px;
}

.hero__eyebrow {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero__title {
  font-size: clamp(26px, 3.8vw, 38px);
}

.hero__desc {
  margin: 14px 0 0;
  color: var(--color-text-muted);
  font-size: 15px;
}

.about__grid {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 40px;
  margin-top: 44px;
}

/* 作者卡片 */
.author {
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.author__avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: #12151b;
}

.author__name {
  margin-top: 10px;
  font-size: 18px;
}

.author__handle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.author__bio {
  margin: 10px 0 18px;
  color: #c8ccd2;
  font-size: 13px;
}

.author__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 三个链接按钮：与档案馆整体风格一致，悬停平滑过渡 */
.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: rgba(255, 255, 255, 0.02);
  font-size: 13px;
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

.pill__handle {
  color: var(--color-text-muted);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* 站点说明 */
.block-title {
  margin-bottom: 14px;
  font-size: 17px;
}

.paragraph {
  margin: 0 0 14px;
  max-width: 680px;
  color: #c8ccd2;
  font-size: 15px;
}

.facts {
  display: grid;
  gap: 10px;
  margin: 26px 0 30px;
}

.fact {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: rgba(26, 29, 36, 0.6);
}

.fact__k {
  flex: none;
  min-width: 150px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
}

.fact__v {
  color: var(--color-text-muted);
  font-size: 13px;
}

@media (max-width: 992px) {
  .about__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .about {
    padding-top: 40px;
  }

  .fact {
    flex-direction: column;
    gap: 4px;
  }

  .fact__k {
    min-width: 0;
  }
}
</style>
