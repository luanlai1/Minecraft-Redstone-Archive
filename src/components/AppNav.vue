<script setup lang="ts">
/* 导航栏 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SITE } from '@/config/profile'
import { currentAdmin, isAuthed, logout } from '@/store/auth'
import { toast } from '@/utils/ui'

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll(): void {
  scrolled.value = window.scrollY > 12
}

function onLogout(): void {
  logout()
  toast('已退出管理档案馆')
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled || menuOpen }">
    <div class="nav__inner">
      <RouterLink class="brand" to="/" @click="menuOpen = false">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M5 5h14v6H5zM5 13h14v6H5z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <path d="M9 5v6M15 13v6" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </span>
        <span class="brand__text">
          {{ SITE.name }}
          <em>{{ SITE.nameEn }}</em>
        </span>
      </RouterLink>

      <nav class="nav__links" :class="{ 'is-open': menuOpen }">
        <RouterLink to="/" @click="menuOpen = false">首页</RouterLink>
        <RouterLink to="/works" @click="menuOpen = false">更多投影</RouterLink>
        <RouterLink to="/about" @click="menuOpen = false">关于</RouterLink>
        <RouterLink class="nav__admin" to="/admin" @click="menuOpen = false">
          管理档案馆
          <span v-if="isAuthed" class="nav__dot" :title="`已登录：${currentAdmin?.username}`" />
        </RouterLink>
        <button
          v-if="isAuthed"
          type="button"
          class="nav__logout"
          @click="((menuOpen = false), onLogout())"
        >
          退出
        </button>
      </nav>

      <button
        type="button"
        class="nav__toggle"
        :aria-expanded="menuOpen"
        aria-label="切换菜单"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid transparent;
  background: transparent;
  transition: background-color var(--dur-card) var(--ease-in-out),
    border-color var(--dur-card) var(--ease-in-out),
    backdrop-filter var(--dur-card) var(--ease-in-out);
}

.nav.is-scrolled {
  border-bottom-color: var(--color-border);
  background: rgba(15, 17, 21, 0.72);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-nav);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 14px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 75, 75, 0.35);
  border-radius: 9px;
  background: rgba(255, 75, 75, 0.1);
  color: var(--color-primary);
  flex: none;
}

.brand__mark svg {
  width: 20px;
  height: 20px;
}

.brand__text {
  display: flex;
  flex-direction: column;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
}

.brand__text em {
  color: var(--color-text-muted);
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav__links a {
  padding: 7px 14px;
  border-radius: var(--radius-btn);
  color: var(--color-text-muted);
  font-size: 14px;
  transition: color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.nav__links a:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

.nav__links a.router-link-active {
  color: var(--color-primary);
  background: rgba(255, 75, 75, 0.1);
}

.nav__admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nav__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}

.nav__logout {
  padding: 7px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    border-color var(--dur-hover) var(--ease-in-out);
}

.nav__logout:hover {
  color: var(--color-primary);
  border-color: rgba(255, 75, 75, 0.5);
}

.nav__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 38px;
  height: 34px;
  padding: 0 9px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: transparent;
  cursor: pointer;
}

.nav__toggle span {
  display: block;
  height: 1.5px;
  border-radius: 2px;
  background: var(--color-text-muted);
}

@media (max-width: 900px) {
  .nav__inner {
    padding: 12px 18px;
    flex-wrap: wrap;
  }

  .nav__toggle {
    display: flex;
  }

  .nav__links {
    order: 3;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height var(--dur-page) var(--ease-out),
      opacity var(--dur-page) var(--ease-out);
  }

  .nav__links.is-open {
    max-height: 280px;
    padding-top: 8px;
    opacity: 1;
  }

  .nav__links a,
  .nav__logout {
    text-align: left;
  }
}
</style>
