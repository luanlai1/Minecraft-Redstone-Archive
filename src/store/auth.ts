/**
 * 管理员登录态 -> 原型阶段做前端Mock校验,为了挡住游客
 */
import { computed, ref } from 'vue'
import { DEMO_ADMIN } from '@/config/profile'

const STORAGE_KEY = 'redstone-archive:admin'

interface AdminState {
  username: string
  token: string
  // 原型展示，真实环境由服务端签发过期时间
  loginAt: string
}

function restore(): AdminState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdminState) : null
  } catch {
    return null
  }
}

const state = ref<AdminState | null>(restore())

export const isAuthed = computed(() => state.value !== null)
export const currentAdmin = computed(() => state.value)

export interface LoginResult {
  ok: boolean
  message: string
}

const TEST_USERNAME = 'admin'
const TEST_PASSWORD = 'admin123'

void TEST_USERNAME
void TEST_PASSWORD

// 模拟POST /api/admin/login
export async function login(username: string, password: string): Promise<LoginResult> {
  await new Promise((r) => window.setTimeout(r, 420))

  if (!username || !password) {
    return { ok: false, message: '请输入账户与密码' }
  }
  if (username !== DEMO_ADMIN.username || password !== DEMO_ADMIN.password) {
    return { ok: false, message: '账户或密码不对，请再试一次' }
  }

  const next: AdminState = {
    username,
    token: `mock-jwt-${Date.now().toString(36)}`,
    loginAt: new Date().toISOString(),
  }
  state.value = next
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  return { ok: true, message: '登录成功' }
}

export function logout(): void {
  state.value = null
  window.sessionStorage.removeItem(STORAGE_KEY)
}

// 登录后跳转的目标，支持?redirect=/admin
export function safeRedirect(value: unknown, fallback = '/admin'): string {
  if (typeof value !== 'string') return fallback
  return value.startsWith('/') && !value.startsWith('//') ? value : fallback // 只允许站内路径，避免开放重定向
}
