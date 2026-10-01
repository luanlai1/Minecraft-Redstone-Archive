/**
 * 作品数据仓库 -> 现在用 Mock 数据模拟接口延迟
 * 后端接入点：
 *   GET  /api/works                       → fetchWorks()
 *   GET  /api/works/{id}                  → fetchWork()
 *   POST /api/works/{id}/download         → countDownload()
 *   GET  /api/categories                  → fetchCategories()
 * 列表固定按 reatedAt倒序，不接收sort参数
 */
import { computed, reactive, ref } from 'vue'
import { MOCK_WORKS, type Work } from '@/data/mockWorks'

// 下载量的本地覆盖值，模拟后端download_count字段
const downloadCounts = reactive<Record<number, number>>(
  Object.fromEntries(MOCK_WORKS.map((w) => [w.id, w.downloadCount])),
)

const loading = ref(false)
const loaded = ref(false)
const clientCountedAt = new Map<number, number>()

// 固定时间倒序：createdAt DESC
// 同秒用id DESC兜底
function sortedByTimeDesc(list: Work[]): Work[] {
  return [...list].sort((a, b) => {
    if (a.createdAt === b.createdAt) return b.id - a.id
    return a.createdAt < b.createdAt ? 1 : -1
  })
}

const works = computed<Work[]>(() =>
  sortedByTimeDesc(
    MOCK_WORKS.map((w) => ({ ...w, downloadCount: downloadCounts[w.id] ?? 0 })),
  ),
)

const categories = computed<string[]>(() => {
  const set = new Set(MOCK_WORKS.map((w) => w.category))
  return Array.from(set)
})

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

// 模拟接口延迟，正常进入会看到骨架屏
// 自动化渲染验证时用#/xxx?mock=fast关掉延迟，避免依赖定时器时序
let mockDelay = 420

export function setMockSpeed(fast: boolean): void {
  mockDelay = fast ? 0 : 420
}

function mockWait(ms: number): Promise<void> {
  return delay(Math.min(ms, mockDelay))
}

// 首次进入展示骨架屏
export async function fetchWorks(): Promise<Work[]> {
  if (!loaded.value) {
    loading.value = true
    await mockWait(420)
    loading.value = false
    loaded.value = true
  }
  return works.value
}

export async function fetchWork(id: number): Promise<Work | undefined> {
  await mockWait(180)
  return works.value.find((w) => w.id === id)
}

export async function fetchFeatured(limit = 3): Promise<Work[]> {
  return works.value.filter((w) => w.POhomepage).slice(0, limit)
}

export function fetchRelated(id: number, limit = 4): Work[] {
  const current = works.value.find((w) => w.id === id)
  if (!current) return []
  return works.value
    .filter((w) => w.id !== id && w.category === current.category)
    .slice(0, limit)
}

export function findWork(id: number): Work | undefined {
  return works.value.find((w) => w.id === id)
}

// 下载计数
export async function countDownload(
  id: number,
): Promise<{ downloadCount: number; counted: boolean }> {
  const last = clientCountedAt.get(id) ?? 0
  const now = Date.now()
  // 这里前端节流 -> 同一作品 60 秒内不重复上报
  if (now - last < 60_000) {
    return { downloadCount: downloadCounts[id] ?? 0, counted: false }
  }
  clientCountedAt.set(id, now)
  await mockWait(220) // 模拟POST /api/works/{id}/download
  downloadCounts[id] = (downloadCounts[id] ?? 0) + 1
  return { downloadCount: downloadCounts[id], counted: true }
}

// 新增作品 -> 写入后自然排在列表最前面
export function addWork(input: Omit<Work, 'id' | 'downloadCount' | 'createdAt'>): Work {
  const id = Math.max(0, ...MOCK_WORKS.map((w) => w.id)) + 1
  const work: Work = {
    ...input,
    id,
    downloadCount: 0,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }
  MOCK_WORKS.push(work)
  downloadCounts[id] = 0
  return work
}

export const workState = {
  works,
  categories,
  loading,
  loaded,
}
