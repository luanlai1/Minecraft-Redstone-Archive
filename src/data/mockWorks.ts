/*
 * 原型用Mock数据，后端就绪后把src/store/work.ts里的读取替换为真实接口即可
 */
export interface Work {
  id: number
  title: string
  image: string
  author: string
  description: string
  videoUrl: string
  downloadUrl: string
  category: string
  tags: string[]
  POhomepage: boolean
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
    id: 3,
    title: '不可堆叠分类打包套装',
    image: `${base}img/work-03.png`,
    author: 'Hluanlai',
    description:
      '不可堆叠分类来自我和梓幽，由于打包部分v1使用可访问打包储量太小，所以v2对可分类物品使用缓存打包替换可访问打包以增加储量；\n\n对不可分类物使用可访问打包的思路来自77，漏斗全锁，有整体解锁逻辑和只解锁打包区域逻辑；\n\n单片箱子满后输出到溢出区，溢出区满后从总溢出输出',
    videoUrl: 'https://novideoUrl',
    downloadUrl: 'https://downloadUrl',
    category: '全物品组件',
    tags: ['1.16+', '储电', '全物品相关'],
    POhomepage: true,
    downloadCount: 666,
    createdAt: '2026-10-01 12:00:00',
  },
  {
    id: 2,
    title: '二进制矩阵编码大厅',
    image: `${base}img/work-02.png`,
    author: 'Hluanlai',
    description:
      '比较器信号下传参考自Lukeem；\n\n盒子移位寄存器来自Obi；\n\n卸货模块二改自Crazychirs',
    videoUrl: 'https://www.bilibili.com/video/BV17WGA6qEk2/?spm_id_from=333.1387.list.card_archive.click',
    downloadUrl: 'https://downloadUrl',
    category: '编码相关',
    tags: ['1.16+', '储电', '编码科技', '全物品相关'],
    POhomepage: true,
    downloadCount: 666,
    createdAt: '2026-10-01 12:00:00',
  },
  {
    id: 1,
    title: '8倍速计数堆分打包机',
    image: `${base}img/work-01.png`,
    author: 'Hluanlai',
    description:
      '3wt单片体积10*13*3，采用64车头，单片与主控漏斗全锁，二分仪与车头矿车占位物回收漏斗没锁（共6个未锁漏斗），感觉没什么必要锁。\n\n输出有满盒非满盒分离，二分仪改自renzaifei；实装时请注意主控以及单片容器内的填充物。',
    videoUrl: 'https://www.bilibili.com/video/BV1Up2FB8Eae/?spm_id_from=333.1387.list.card_archive.click',
    downloadUrl: 'https://downloadUrl',
    category: '打包机',
    tags: ['1.16+', '储电', '打包机'],
    POhomepage: true,
    downloadCount: 666,
    createdAt: '2026-10-01 12:00:00',
  },
]
