<script setup lang="ts">
/* 管理档案馆 -> 登录---前端用Mock校验（为挡住游客），真实实现换成POST /api/admin/login */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DEMO_ADMIN, SITE } from '@/config/profile'
import { login, safeRedirect } from '@/store/auth'
import { toast } from '@/utils/ui'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const usernameInput = ref<HTMLInputElement | null>(null)

const redirect = computed(() => safeRedirect(route.query.redirect))

const canSubmit = computed(
  () => username.value.trim() !== '' && password.value !== '' && !loading.value,
)

async function submit(): Promise<void> {
  if (loading.value) return
  error.value = ''
  loading.value = true
  const res = await login(username.value.trim(), password.value)
  loading.value = false

  if (!res.ok) {
    // 错误提示淡入，不跳变
    error.value = res.message
    password.value = ''
    return
  }
  toast('欢迎回来，馆长')
  await router.replace(redirect.value)
}

function fillDemo(): void {
  username.value = DEMO_ADMIN.username
  password.value = DEMO_ADMIN.password
  error.value = ''
}

onMounted(() => {
  usernameInput.value?.focus()
})
</script>

<template>
  <div class="login">
    <div class="login__card" v-reveal="0">
      <div class="login__brand">
        <span class="login__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 5h14v6H5zM5 13h14v6H5z" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path d="M9 5v6M15 13v6" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </span>
        <div>
          <h1 class="login__title">管理档案馆</h1>
          <p class="login__sub">{{ SITE.name }}</p>
        </div>
      </div>

      <p class="login__desc">
        这里是馆长的后台入口，需要管理员账户与密码。游客可以直接去
        <RouterLink class="login__link" to="/works">更多投影</RouterLink>
        逛逛。
      </p>

      <form class="form" @submit.prevent="submit">
        <label class="field">
          <span class="field__label">管理员账户</span>
          <input
            ref="usernameInput"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="请输入账户"
            :class="{ 'is-error': error }"
          />
        </label>

        <label class="field">
          <span class="field__label">密码</span>
          <div class="pw">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="请输入密码"
              :class="{ 'is-error': error }"
            />
            <button
              type="button"
              class="pw__toggle"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </label>

        <p v-if="error" class="form__error" role="alert">{{ error }}</p>

        <button type="submit" class="btn btn--primary form__submit" :disabled="!canSubmit">
          {{ loading ? '正在验证…' : '进入管理档案馆' }}
        </button>
      </form>

      <div class="demo">
        <span class="demo__tag">原型演示凭据</span>
        <code>{{ DEMO_ADMIN.username }} / {{ DEMO_ADMIN.password }}</code>
        <button type="button" class="demo__fill" @click="fillDemo">一键填入</button>
      </div>

      <RouterLink class="login__back" to="/">← 回到首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 180px);
  padding: 56px 24px 80px;
}

.login__card {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.login__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login__mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 75, 75, 0.35);
  border-radius: 11px;
  background: rgba(255, 75, 75, 0.1);
  color: var(--color-primary);
  flex: none;
}

.login__mark svg {
  width: 22px;
  height: 22px;
}

.login__title {
  font-size: 19px;
}

.login__sub {
  margin: 2px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.login__desc {
  margin: 18px 0 22px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.login__link {
  color: var(--color-secondary);
}

.login__link:hover {
  color: #7db6ff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  color: var(--color-text);
  font-size: 13px;
  font-weight: 500;
}

.field input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: #15181f;
  color: var(--color-text);
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color var(--dur-hover) var(--ease-in-out),
    box-shadow var(--dur-hover) var(--ease-in-out);
}

.field input:focus {
  border-color: rgba(255, 75, 75, 0.55);
  box-shadow: 0 0 0 3px rgba(255, 75, 75, 0.12);
}

.field input.is-error {
  border-color: var(--color-error);
}

.pw {
  position: relative;
}

.pw input {
  padding-right: 62px;
}

.pw__toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.pw__toggle:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
}

/* 错误提示淡入，不跳变 */
.form__error {
  margin: 0;
  padding: 9px 12px;
  border: 1px solid rgba(230, 57, 70, 0.4);
  border-radius: var(--radius-btn);
  background: rgba(230, 57, 70, 0.1);
  color: #ff8a90;
  font-size: 13px;
  animation: error-in var(--dur-page) var(--ease-out);
}

@keyframes error-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
}

.form__submit {
  width: 100%;
  margin-top: 4px;
}

.demo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding: 12px 14px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-btn);
  background: rgba(255, 176, 32, 0.05);
}

.demo__tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 176, 32, 0.14);
  color: var(--color-warning);
  font-size: 11px;
}

.demo code {
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 12px;
}

.demo__fill {
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    border-color var(--dur-hover) var(--ease-in-out);
}

.demo__fill:hover {
  color: var(--color-primary);
  border-color: rgba(255, 75, 75, 0.5);
}

.login__back {
  display: inline-block;
  margin-top: 20px;
  color: var(--color-text-muted);
  font-size: 13px;
  transition: color var(--dur-hover) var(--ease-in-out);
}

.login__back:hover {
  color: var(--color-text);
}
</style>
