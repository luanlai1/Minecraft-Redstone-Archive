/**
 * 原型用Mock数据
 * 后端就绪后，只需把src/store/work.ts里的读取替换为真实接口即可
 */
export interface Work {
  id: number
  title: string
  image: string
  description: string
  videoUrl: string
  downloadUrl: string
  category: string
  tags: string[]
  featured: boolean
  downloadCount: number
  createdAt: string
}

const base = import.meta.env.BASE_URL

/**
 * 数组按 createdAt 倒序排列，
 * 上传时间越晚（id 越大）越靠前，先上传的在下面，往下划才看到。
 */
export const MOCK_WORKS: Work[] = [
  {
    id: 6,
    title: '红石灯阵批量点亮装置',
    image: `${base}img/work-06.svg`,
    description:
      '一次拉杆点亮 12×12 红石灯阵列，采用中继器分级延迟，点亮顺序从中心向外扩散，视觉上像波纹一样铺开。适合做大厅装饰与灯光演出。\n\n装置整体高 3 格，可整体下沉到地板以下，配合投影模组一次成型。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0006',
    downloadUrl: 'https://pan.example.com/s/redstone-lamp-array',
    category: '灯光装置',
    tags: ['1.21', '装饰', '可下沉'],
    featured: false,
    downloadCount: 12,
    createdAt: '2025-02-02 20:15:00',
  },
  {
    id: 5,
    title: '双向高速铁路换乘站',
    image: `${base}img/work-05.svg`,
    description:
      '主站台双向 8 车道，进出站用活塞+冰道做减速与加速，换乘通道零碰撞。实测稳定运行 20 分钟无卡顿、无脱轨。\n\n存档内含完整站台、信号灯与红石时钟，可直接接入现有铁路网。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0005',
    downloadUrl: 'https://pan.example.com/s/highway-station',
    category: '交通设施',
    tags: ['1.20.4', '高速', '零碰撞'],
    featured: false,
    downloadCount: 96,
    createdAt: '2025-01-28 11:02:00',
  },
  {
    id: 4,
    title: '16×16 全自动农田',
    image: `${base}img/work-04.svg`,
    description:
      '一格水覆盖全田，收割、补种、收集三合一。村民分配器与漏斗矿车组成收集链，一小时产量约 2200 个小麦。\n\n占地面积 16×16×5，兼容 1.20 以上版本，可用骨粉加速模式。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0004',
    downloadUrl: 'https://pan.example.com/s/auto-farm-16',
    category: '红石机械',
    tags: ['1.20', '全自动', '高效率'],
    featured: true,
    downloadCount: 342,
    createdAt: '2025-01-20 19:40:00',
  },
  {
    id: 3,
    title: '静音 TNT 复制机',
    image: `${base}img/work-03.svg`,
    description:
      '利用活塞推动 TNT 复制的经典结构，重新布置了触发顺序，做到复制过程中完全没有爆鸣声，适合放在基地内部。\n\n配套了漏斗计时器，可设定每 5 秒 / 10 秒 / 30 秒复制一次。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0003',
    downloadUrl: 'https://pan.example.com/s/silent-tnt-duper',
    category: '刷怪与资源',
    tags: ['1.20', '静音', '可调速率'],
    featured: false,
    downloadCount: 12840,
    createdAt: '2025-01-12 15:26:00',
  },
  {
    id: 2,
    title: '3×3 无痕活塞门',
    image: `${base}img/work-02.svg`,
    description:
      '关闭后地面完全看不出痕迹，门体收起时与地板纹理对齐。使用双层活塞与隐藏布线，正面无任何可见红石。\n\n开合耗时 0.6 秒，支持两侧同时触发，也支持远程拉杆控制。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0002',
    downloadUrl: 'https://pan.example.com/s/piston-door-3x3',
    category: '活塞门',
    tags: ['1.20', '隐藏布线', '双向'],
    featured: true,
    downloadCount: 186,
    createdAt: '2025-01-05 09:12:00',
  },
  {
    id: 1,
    title: '静音可堆叠活塞门',
    image: `${base}img/work-01.svg`,
    description:
      '基于 0-tick 复位的静音活塞门，关闭时几乎没有声音。整个门体可以垂直堆叠，最高支持 8 层组合，用来做隐藏楼梯或书架入口都不违和。\n\n投影存档里已包含对齐好的 8 层结构，放下即可用。',
    videoUrl: 'https://www.bilibili.com/video/BV1mock0001',
    downloadUrl: 'https://pan.example.com/s/silent-stackable-door',
    category: '活塞门',
    tags: ['1.20', '静音', '可堆叠'],
    featured: true,
    downloadCount: 87,
    createdAt: '2025-01-01 12:00:00',
  },
]
