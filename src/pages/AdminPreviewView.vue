<script setup lang="ts">
/* 管理档案馆 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DownloadCount from '@/components/DownloadCount.vue'
import { SITE } from '@/config/profile'
import { currentAdmin, logout } from '@/store/auth'
import { addWork, fetchWorks, workState } from '@/store/work'
import { toast } from '@/utils/ui'

type Panel = 'list' | 'new'

const route = useRoute()
const router = useRouter()

// 面板状态与URL同步（?panel=new可直接打开新增表单，也方便分享）
const panel = ref<Panel>(route.query.panel === 'new' ? 'new' : 'list')
const sidebarOpen = ref(false)

watch(panel, (next) => {
  router.replace({ query: next === 'new' ? { panel: 'new' } : {} })
})

function onLogout(): void {
  logout()
  toast('已退出管理档案馆')
  void router.replace('/')
}

/* ------------------------- 新增机器投影表单 ------------------------- */
const form = ref({
  title: '',
  image: '',
  description: '',
  videoUrl: '',
  downloadUrl: '',
  category: '',
  tagsText: '',
  featured: false,
})

const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragOver = ref(false)
const fileName = ref('')
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

// 上传约定jpg/jpeg/png/webp/gif ≤ 5MB
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

const canSubmit = computed(
  () => form.value.title.trim() !== '' && form.value.image !== '' && !submitting.value,
)

function pickFile(): void {
  imageInput.value?.click()
}

// 拖拽上传
function onDrop(event: DragEvent): void {
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) void handleFile(file)
}

function onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) void handleFile(file)
}

async function handleFile(file: File): Promise<void> {
  errors.value = { ...errors.value, image: '' }
  if (!ACCEPT.includes(file.type)) {
    errors.value = { ...errors.value, image: '只支持 jpg / png / webp / gif' }
    toast('图片格式不支持')
    return
  }
  if (file.size > MAX_SIZE) {
    errors.value = { ...errors.value, image: '图片不能超过 5MB' }
    toast('图片太大了（上限 5MB）')
    return
  }

  uploading.value = true
  fileName.value = file.name
  // 模拟POST /api/admin/upload，真实环境回传{ url: "/files/2025/01/xxx.png" }
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
  window.setTimeout(() => {
    form.value.image = dataUrl
    uploading.value = false
    toast('图片已上传')
  }, 420)
}

function removeImage(): void {
  form.value.image = ''
  fileName.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

function validate(): boolean {
  const next: Record<string, string> = {}
  if (!form.value.title.trim()) next.title = '请填写机器投影标题'
  if (form.value.title.length > 200) next.title = '标题不能超过 200 字'
  if (!form.value.image) next.image = '请上传一张机器投影图片'
  for (const key of ['videoUrl', 'downloadUrl'] as const) {
    const value = form.value[key].trim()
    if (value && !/^https?:\/\//i.test(value)) next[key] = '请填写 http(s) 开头的链接'
  }
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit(): Promise<void> {
  if (!validate()) {
    toast('还有几处需要修改')
    return
  }
  submitting.value = true
  await new Promise((r) => window.setTimeout(r, 420))
  addWork({
    title: form.value.title.trim(),
    image: form.value.image,
    description: form.value.description.trim(),
    videoUrl: form.value.videoUrl.trim(),
    downloadUrl: form.value.downloadUrl.trim(),
    category: form.value.category.trim() || '未分类',
    tags: form.value.tagsText
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean),
    featured: form.value.featured,
  })
  submitting.value = false
  toast('发布成功，已置顶显示')
  resetForm()
  panel.value = 'list'
}

function resetForm(): void {
  form.value = {
    title: '',
    image: '',
    description: '',
    videoUrl: '',
    downloadUrl: '',
    category: '',
    tagsText: '',
    featured: false,
  }
  errors.value = {}
  fileName.value = ''
}

function switchPanel(next: Panel): void {
  panel.value = next
  sidebarOpen.value = false
}

onMounted(() => {
  void fetchWorks()
})
</script>

<template>
  <div class="page admin">
    <header class="admin__head" v-reveal="0">
      <div>
        <h1 class="admin__title">管理档案馆</h1>
        <p class="admin__desc">
          {{ SITE.name }}的后台：机器投影列表、单图上传、发布后的排序效果都在这里，
          数据为本地 Mock（后端接上后换成真实接口即可）。
        </p>
      </div>
      <div class="admin__who">
        <span class="admin__badge">MVP 原型 · 未接后端</span>
        <span class="admin__user">当前登录：{{ currentAdmin?.username ?? '—' }}</span>
        <button type="button" class="btn btn--ghost admin__logout" @click="onLogout">
          退出登录
        </button>
      </div>
    </header>

    <div class="admin__grid">
      <!-- 左侧固定菜单 -->
      <aside class="side" :class="{ 'is-open': sidebarOpen }">
        <button
          type="button"
          class="side__item"
          :class="{ 'is-active': panel === 'list' }"
          @click="switchPanel('list')"
        >
          机器投影管理
          <span class="side__count">{{ workState.works.value.length }}</span>
        </button>
        <button
          type="button"
          class="side__item"
          :class="{ 'is-active': panel === 'new' }"
          @click="switchPanel('new')"
        >
          新增机器投影
        </button>
        <span class="side__hint">MVP 只有这两个面板</span>
      </aside>

      <button type="button" class="side-toggle" @click="sidebarOpen = !sidebarOpen">
        {{ sidebarOpen ? '收起菜单' : '展开菜单' }}
      </button>

      <!-- 右侧内容：菜单切换淡入 -->
      <section class="panel">
        <Transition name="fade" mode="out-in">
          <!-- 机器投影列表 -->
          <div v-if="panel === 'list'" key="list">
            <div class="panel__head">
              <h2 class="panel__title">机器投影管理</h2>
              <button type="button" class="btn btn--primary" @click="switchPanel('new')">
                + 新增机器投影
              </button>
            </div>

            <div v-if="workState.loading.value" class="table-skeleton">
              <div v-for="i in 4" :key="i" class="skeleton table-skeleton__row" />
            </div>

            <div v-else class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th class="table__thumb-col">图片</th>
                    <th>标题</th>
                    <th>分类</th>
                    <th>标签</th>
                    <th class="table__num">下载量</th>
                    <th>上传时间</th>
                    <th class="table__op">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="work in workState.works.value" :key="work.id">
                    <td>
                      <img class="table__thumb" :src="work.image" :alt="work.title" loading="lazy" />
                    </td>
                    <td>
                      <RouterLink class="table__link" :to="`/works/${work.id}`">
                        {{ work.title }}
                      </RouterLink>
                      <span v-if="work.featured" class="table__star">精选</span>
                    </td>
                    <td class="table__muted">{{ work.category }}</td>
                    <td class="table__muted">{{ work.tags.join(' / ') }}</td>
                    <td class="table__num">
                      <DownloadCount :value="work.downloadCount" size="sm" :animated="false" />
                    </td>
                    <td class="table__muted">{{ work.createdAt.slice(0, 16) }}</td>
                    <td class="table__op">
                      <button type="button" class="link-btn" @click="toast('编辑（原型未实现）')">
                        编辑
                      </button>
                      <button
                        type="button"
                        class="link-btn link-btn--danger"
                        @click="toast('删除需二次确认（原型未实现）')"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="panel__note">
              表格按上传时间倒序（与前台一致）
            </p>
          </div>

          <!-- 新增机器投影 -->
          <form v-else key="new" class="form" @submit.prevent="submit">
            <div class="panel__head">
              <h2 class="panel__title">新增机器投影</h2>
              <button type="button" class="btn btn--ghost" @click="switchPanel('list')">
                返回列表
              </button>
            </div>

            <div class="form__block" v-reveal="0">
              <label class="field">
                <span class="field__label">机器投影标题 <em>*</em></span>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="例如：静音可堆叠活塞门"
                  :class="{ 'is-error': errors.title }"
                />
                <span v-if="errors.title" class="field__error">{{ errors.title }}</span>
              </label>
            </div>

            <!-- 图片上传，只有一个上传框 -->
            <div class="form__block" v-reveal="40">
              <span class="field__label">机器投影图片 <em>*</em></span>
              <p class="field__tip">
                一个机器投影只上传一张图（jpg / png / webp / gif，≤ 5MB）。上传后可随时替换。
              </p>

              <div
                class="uploader"
                :class="{ 'is-dragover': dragOver, 'is-error': errors.image }"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="onDrop"
              >
                <input
                  ref="imageInput"
                  class="uploader__input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  @change="onFileChange"
                />

                <div v-if="uploading" class="uploader__loading">
                  <div class="skeleton uploader__preview-skeleton" />
                  <span>正在上传…</span>
                </div>

                <div v-else-if="form.image" class="uploader__preview">
                  <img :src="form.image" alt="预览图" />
                  <div class="uploader__overlay">
                    <button type="button" class="btn btn--primary" @click="pickFile">
                      替换图片
                    </button>
                    <button type="button" class="btn btn--ghost" @click="removeImage">
                      移除
                    </button>
                  </div>
                  <span class="uploader__filename">{{ fileName || '当前图片' }}</span>
                </div>

                <button v-else type="button" class="uploader__empty" @click="pickFile">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 16.5V5.8M8 9.4 12 5.4l4 4M5 18.5h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <strong>点击上传，或把图片拖进来</strong>
                  <span>建议 16:10 横图，宽度 1600px 以上</span>
                </button>
              </div>
              <span v-if="errors.image" class="field__error">{{ errors.image }}</span>
            </div>

            <div class="form__block" v-reveal="80">
              <label class="field">
                <span class="field__label">机器投影描述</span>
                <textarea
                  v-model="form.description"
                  rows="5"
                  placeholder="讲清楚这个装置做什么、怎么用、有哪些注意点…"
                />
              </label>
            </div>

            <div class="form__row" v-reveal="120">
              <label class="field">
                <span class="field__label">视频链接</span>
                <input
                  v-model="form.videoUrl"
                  type="url"
                  placeholder="https://www.bilibili.com/video/…"
                  :class="{ 'is-error': errors.videoUrl }"
                />
                <span v-if="errors.videoUrl" class="field__error">{{ errors.videoUrl }}</span>
              </label>

              <label class="field">
                <span class="field__label">存档下载链接</span>
                <input
                  v-model="form.downloadUrl"
                  type="url"
                  placeholder="https://pan.example.com/s/…"
                  :class="{ 'is-error': errors.downloadUrl }"
                />
                <span v-if="errors.downloadUrl" class="field__error">
                  {{ errors.downloadUrl }}
                </span>
              </label>
            </div>

            <div class="form__row" v-reveal="160">
              <label class="field">
                <span class="field__label">分类</span>
                <input
                  v-model="form.category"
                  type="text"
                  list="category-options"
                  placeholder="例如：活塞门"
                />
                <datalist id="category-options">
                  <option v-for="name in workState.categories.value" :key="name" :value="name" />
                </datalist>
              </label>

              <label class="field">
                <span class="field__label">标签</span>
                <input v-model="form.tagsText" type="text" placeholder="用逗号分隔：1.20, 静音, 可堆叠" />
              </label>
            </div>

            <div class="form__block" v-reveal="200">
              <label class="switch">
                <input v-model="form.featured" type="checkbox" />
                <span class="switch__track" aria-hidden="true"><span class="switch__dot" /></span>
                <span class="switch__text">
                  放到首页
                  <em>会出现在首页「好玩的小机器」区域</em>
                </span>
              </label>
            </div>

            <div class="form__actions" v-reveal="240">
              <button type="submit" class="btn btn--primary" :disabled="!canSubmit">
                {{ submitting ? '发布中…' : '发布机器投影' }}
              </button>
              <button type="button" class="btn btn--ghost" @click="resetForm">重置</button>
              <span class="form__hint">下载量由系统维护，不需要在这里填写。</span>
            </div>
          </form>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin {
  padding-top: 48px;
}

.admin__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.admin__title {
  font-size: clamp(22px, 3vw, 30px);
}

.admin__desc {
  margin: 10px 0 0;
  max-width: 620px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.admin__badge {
  padding: 6px 12px;
  border: 1px solid rgba(255, 176, 32, 0.4);
  border-radius: 999px;
  background: rgba(255, 176, 32, 0.1);
  color: var(--color-warning);
  font-size: 12px;
  white-space: nowrap;
}

.admin__who {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.admin__user {
  color: var(--color-text-muted);
  font-size: 12px;
}

.admin__logout {
  padding: 7px 14px;
  font-size: 13px;
}

.admin__grid {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 28px;
  margin-top: 28px;
}

/* 左侧固定菜单 */
.side {
  position: sticky;
  top: 88px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.side__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.side__item:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

.side__item.is-active {
  color: var(--color-primary);
  background: rgba(255, 75, 75, 0.1);
}

.side__count {
  color: var(--color-text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.side__hint {
  margin-top: 6px;
  padding: 0 12px;
  color: #6b7280;
  font-size: 11px;
}

.side-toggle {
  display: none;
}

.panel {
  min-width: 0;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.panel__title {
  font-size: 18px;
}

.panel__note {
  margin: 16px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

/* 表格 */
.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 720px;
}

.table th,
.table td {
  padding: 12px 14px;
  text-align: left;
  white-space: nowrap;
}

.table thead th {
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.table tbody tr {
  border-bottom: 1px solid rgba(42, 46, 55, 0.6);
  /* 表格行悬停高亮 */
  transition: background-color var(--dur-hover) var(--ease-in-out);
}

.table tbody tr:last-child {
  border-bottom: 0;
}

.table tbody tr:hover {
  background: rgba(255, 255, 255, 0.035);
}

.table__thumb-col {
  width: 92px;
}

.table__thumb {
  width: 68px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  background: #191c23;
}

.table__link {
  color: var(--color-text);
  transition: color var(--dur-hover) var(--ease-in-out);
}

.table__link:hover {
  color: var(--color-primary);
}

.table__star {
  margin-left: 8px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(255, 75, 75, 0.12);
  color: var(--color-primary);
  font-size: 11px;
}

.table__muted {
  color: var(--color-text-muted);
}

.table__num {
  text-align: right;
}

.table__op {
  text-align: right;
}

.link-btn {
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: background-color var(--dur-hover) var(--ease-in-out),
    color var(--dur-hover) var(--ease-in-out);
}

.link-btn:hover {
  background: rgba(75, 159, 255, 0.12);
}

.link-btn--danger {
  color: var(--color-error);
}

.link-btn--danger:hover {
  background: rgba(230, 57, 70, 0.12);
}

.table-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.table-skeleton__row {
  height: 44px;
}

/* 表单 */
.form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form__block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
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

.field__label em {
  color: var(--color-primary);
  font-style: normal;
}

.field__tip {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.field input,
.field textarea {
  padding: 11px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color var(--dur-hover) var(--ease-in-out),
    box-shadow var(--dur-hover) var(--ease-in-out);
}

.field textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

/* 4.3 表单：聚焦时边框渐变为强调色 */
.field input:focus,
.field textarea:focus {
  border-color: rgba(255, 75, 75, 0.55);
  box-shadow: 0 0 0 3px rgba(255, 75, 75, 0.12);
}

.field input.is-error,
.field textarea.is-error {
  border-color: var(--color-error);
}

/* 4.3 错误提示淡入，不跳变 */
.field__error {
  color: var(--color-error);
  font-size: 12px;
  animation: error-in var(--dur-page) var(--ease-out);
}

@keyframes error-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
}

/* 单图上传器 */
.uploader {
  position: relative;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card);
  background: rgba(26, 29, 36, 0.6);
  transition: border-color var(--dur-hover) var(--ease-in-out),
    background-color var(--dur-hover) var(--ease-in-out);
}

.uploader.is-dragover {
  border-color: rgba(255, 75, 75, 0.6);
  background: rgba(255, 75, 75, 0.06);
}

.uploader.is-error {
  border-color: var(--color-error);
}

.uploader__input {
  display: none;
}

.uploader__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 40px 20px;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.uploader__empty strong {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.uploader__empty span {
  font-size: 12px;
}

.uploader__empty svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.uploader__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 26px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.uploader__preview-skeleton {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-img);
}

.uploader__preview {
  position: relative;
  padding: 14px;
}

.uploader__preview img {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-img);
  object-fit: cover;
  background: #191c23;
}

.uploader__overlay {
  position: absolute;
  left: 14px;
  bottom: 34px;
  display: flex;
  gap: 8px;
  padding: 10px;
  border-radius: var(--radius-btn);
  background: rgba(15, 17, 21, 0.7);
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity var(--dur-card) var(--ease-out),
    transform var(--dur-card) var(--ease-out);
}

.uploader__preview:hover .uploader__overlay,
.uploader__preview:focus-within .uploader__overlay {
  opacity: 1;
  transform: none;
}

.uploader__filename {
  display: block;
  margin-top: 10px;
  color: var(--color-text-muted);
  font-size: 12px;
}

/* 开关 */
.switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch__track {
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #2c313b;
  transition: background-color var(--dur-card) var(--ease-in-out);
  flex: none;
}

.switch__dot {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #8b929c;
  transition: transform var(--dur-card) var(--ease-out),
    background-color var(--dur-card) var(--ease-in-out);
}

.switch input:checked + .switch__track {
  background: rgba(255, 75, 75, 0.35);
}

.switch input:checked + .switch__track .switch__dot {
  transform: translateX(18px);
  background: var(--color-primary);
}

.switch input:focus-visible + .switch__track {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

.switch__text {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.switch__text em {
  color: var(--color-text-muted);
  font-size: 12px;
  font-style: normal;
}

.form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 6px;
  border-top: 1px solid var(--color-border);
}

.form__hint {
  color: var(--color-text-muted);
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-page) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .admin__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .side {
    position: static;
    flex-direction: row;
    overflow-x: auto;
  }

  .side__hint {
    display: none;
  }
}

@media (max-width: 768px) {
  .form__row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
