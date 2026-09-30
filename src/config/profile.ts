/* 作者信息 */
import avatar from '@/assets/luanlai.png'
export interface ProfileLink {
  // 平台名
  label: string
  // 用户名（展示用）
  handle: string
  url: string
  // 品牌色，用于图标与悬停配色
  color: string
}

export const SITE = {
  name: '乱来的投影档案馆',
  nameEn: 'Redstone Archive',
  tagline: ' Redstone-Archive——这里是->乱来的炒鸡小屋',
  intro:
    '在这里公开我做的一些红石机器，主要和储电或械电有关，还有一些好玩有意思的机器也会公开在这里',
  about: [
    '这个档案馆用来放我自己的红石作品。以前这些玩意儿散不同地方太难找了，所以干脆直接给它们弄个专门的地方存着。',
    '机器投影都可以直接下载，想用或者拿来研究下就完事了xdm'
  ],
}

export const AUTHOR = {
  name: 'Hluanlaio_O',
  handle: '@your-handle',
  bio: 'Minecraft 红石玩家，擅长储电及械电，赤石科技也喜欢。',
  avatar: avatar,
}

export const LINKS: ProfileLink[] = [
  {
    label: 'GitHub',
    handle: '@your-github',
    url: 'https://yourgithub.com',
    color: '#E8EAED',
  },
  {
    label: 'Bilibili',
    handle: '@your-bilibili',
    url: 'https://yourbilibili.com',
    color: '#4B9FFF',
  },
  {
    label: 'KooK',
    handle: '@your-kook',
    url: 'https://yourkook.com',
    color: '#9cffab'
  },
]

/**
 * 管理员账户（仅前端Mock校验，用于挡住游客）
 * 后续替换为POST /api/admin/login + JWT，账号密码只留在后端。
 */
export const DEMO_ADMIN = {
  username: 'admin',
  password: 'admin123',
}
