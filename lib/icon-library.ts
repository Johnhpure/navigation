// 内置图标库系统
export interface IconLibraryItem {
  id: string
  name: string
  category: string
  keywords: string[]
  svg: string
  color?: string
  size?: number
}

export interface IconCategory {
  id: string
  name: string
  description: string
  count: number
}

// 图标分类定义
export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'social',
    name: '社交媒体',
    description: '社交平台和通讯工具',
    count: 0
  },
  {
    id: 'tech',
    name: '科技开发',
    description: '开发工具和技术平台',
    count: 0
  },
  {
    id: 'business',
    name: '商业办公',
    description: '办公软件和商业工具',
    count: 0
  },
  {
    id: 'entertainment',
    name: '娱乐媒体',
    description: '视频音乐和娱乐平台',
    count: 0
  },
  {
    id: 'shopping',
    name: '购物电商',
    description: '电商平台和购物网站',
    count: 0
  },
  {
    id: 'education',
    name: '教育学习',
    description: '在线教育和学习资源',
    count: 0
  },
  {
    id: 'news',
    name: '新闻资讯',
    description: '新闻网站和信息平台',
    count: 0
  },
  {
    id: 'tools',
    name: '实用工具',
    description: '在线工具和实用网站',
    count: 0
  },
  {
    id: 'design',
    name: '设计创意',
    description: '设计工具和创意平台',
    count: 0
  },
  {
    id: 'finance',
    name: '金融理财',
    description: '金融服务和理财工具',
    count: 0
  }
]

// 内置图标库数据
export const ICON_LIBRARY: IconLibraryItem[] = [
  // 社交媒体类
  {
    id: 'wechat',
    name: '微信',
    category: 'social',
    keywords: ['微信', 'wechat', '聊天', '社交'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.5 6.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM12 16c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`,
    color: '#07C160'
  },
  {
    id: 'qq',
    name: 'QQ',
    category: 'social',
    keywords: ['qq', '腾讯', '聊天', '社交'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>`,
    color: '#12B7F5'
  },
  {
    id: 'weibo',
    name: '微博',
    category: 'social',
    keywords: ['微博', 'weibo', '社交', '新浪'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.35 16.88c-2.66 0-4.82-1.77-4.82-3.95 0-2.18 2.16-3.95 4.82-3.95s4.82 1.77 4.82 3.95c0 2.18-2.16 3.95-4.82 3.95zm0-6.5c-1.79 0-3.24 1.15-3.24 2.55s1.45 2.55 3.24 2.55 3.24-1.15 3.24-2.55-1.45-2.55-3.24-2.55z"/>
      <path d="M16.5 11.5c-.28 0-.5-.22-.5-.5 0-1.93-1.57-3.5-3.5-3.5-.28 0-.5-.22-.5-.5s.22-.5.5-.5c2.48 0 4.5 2.02 4.5 4.5 0 .28-.22.5-.5.5z"/>
      <path d="M19 9.5c-.28 0-.5-.22-.5-.5 0-3.31-2.69-6-6-6-.28 0-.5-.22-.5-.5s.22-.5.5-.5c3.86 0 7 3.14 7 7 0 .28-.22.5-.5.5z"/>
    </svg>`,
    color: '#E6162D'
  },

  // 科技开发类
  {
    id: 'github',
    name: 'GitHub',
    category: 'tech',
    keywords: ['github', 'git', '代码', '开发', '程序员'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`,
    color: '#181717'
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'tech',
    keywords: ['gitlab', 'git', '代码', '开发', 'ci/cd'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.42l3.684-11.333h-7.368L12 21.42z"/>
      <path d="M3.16 10.087L12 21.42l-8.84-11.333-.737 2.263c-.1.3-.1.633.04.925l.697.722z"/>
      <path d="M3.16 10.087h5.157L6.84 3.45c-.15-.46-.73-.46-.88 0l-1.477 6.637z"/>
      <path d="M20.84 10.087L12 21.42l8.84-11.333.737 2.263c.1.3.1.633-.04.925l-.697.722z"/>
      <path d="M20.84 10.087h-5.157L17.16 3.45c.15-.46.73-.46.88 0l1.477 6.637z"/>
    </svg>`,
    color: '#FC6D26'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'tech',
    keywords: ['vscode', 'visual studio code', '编辑器', '开发', 'ide'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
    </svg>`,
    color: '#007ACC'
  },

  // 商业办公类
  {
    id: 'office365',
    name: 'Office 365',
    category: 'business',
    keywords: ['office', 'microsoft', '办公', 'word', 'excel', 'ppt'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.53 4.306v15.363l-9.49-7.615L21.53 4.306zm-10.79 7.952L2.47 20.69V3.309l8.27 8.949z"/>
      <path d="M21.53 4.306L12.04 12.054 2.47 3.31h19.06v.996z"/>
    </svg>`,
    color: '#D83B01'
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'business',
    keywords: ['google', 'workspace', 'gmail', 'docs', 'drive', '办公'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>`,
    color: '#4285F4'
  },

  // 娱乐媒体类
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'entertainment',
    keywords: ['youtube', '视频', '娱乐', '播放'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>`,
    color: '#FF0000'
  },
  {
    id: 'bilibili',
    name: 'bilibili',
    category: 'entertainment',
    keywords: ['bilibili', 'b站', '视频', '弹幕', '二次元'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM6.720 15.96a.96.96 0 0 1-.96-.96v-4.32c0-.53.43-.96.96-.96s.96.43.96.96v4.32c0 .53-.43.96-.96.96zm5.280 0a.96.96 0 0 1-.96-.96v-4.32c0-.53.43-.96.96-.96s.96.43.96.96v4.32c0 .53-.43.96-.96.96zm5.280 0a.96.96 0 0 1-.96-.96v-4.32c0-.53.43-.96.96-.96s.96.43.96.96v4.32c0 .53-.43.96-.96.96z"/>
    </svg>`,
    color: '#FB7299'
  },

  // 购物电商类
  {
    id: 'taobao',
    name: '淘宝',
    category: 'shopping',
    keywords: ['淘宝', 'taobao', '购物', '电商', '阿里巴巴'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.234-.488-.281-.715-.281-.234 0-.554.047-.722.281-.169.234-.047.554.047.722.047.075.113.169.169.234.328.328.722.609 1.172.609.469 0 .863-.281 1.191-.609.047-.075.122-.159.169-.234.094-.168.216-.488.047-.722-.169-.234-.49-.281-.724-.281-.234 0-.553.047-.722.281z"/>
      <circle cx="7.2" cy="14.4" r="1.8"/>
      <circle cx="16.8" cy="14.4" r="1.8"/>
      <path d="M19.2 9.6H4.8c-.66 0-1.2.54-1.2 1.2v.6c0 .66.54 1.2 1.2 1.2h14.4c.66 0 1.2-.54 1.2-1.2v-.6c0-.66-.54-1.2-1.2-1.2z"/>
    </svg>`,
    color: '#FF4400'
  },
  {
    id: 'jd',
    name: '京东',
    category: 'shopping',
    keywords: ['京东', 'jd', '购物', '电商'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.5h-9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm0-4h-9c-.83 0-1.5-.67-1.5-1.5S6.67 9.5 7.5 9.5h9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
    </svg>`,
    color: '#E3101E'
  },

  // 教育学习类
  {
    id: 'zhihu',
    name: '知乎',
    category: 'education',
    keywords: ['知乎', 'zhihu', '问答', '学习', '知识'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.721 0C4.48 0 3.482.998 3.482 2.24v19.52c0 1.241.998 2.24 2.239 2.24h12.558c1.24 0 2.239-.999 2.239-2.24V2.24C20.518.998 19.52 0 18.279 0H5.72zM8.48 6.24c0-.62.5-1.12 1.12-1.12h4.8c.62 0 1.12.5 1.12 1.12s-.5 1.12-1.12 1.12h-4.8c-.62 0-1.12-.5-1.12-1.12zm0 3.36c0-.62.5-1.12 1.12-1.12h4.8c.62 0 1.12.5 1.12 1.12s-.5 1.12-1.12 1.12h-4.8c-.62 0-1.12-.5-1.12-1.12zm0 3.36c0-.62.5-1.12 1.12-1.12h4.8c.62 0 1.12.5 1.12 1.12s-.5 1.12-1.12 1.12h-4.8c-.62 0-1.12-.5-1.12-1.12z"/>
    </svg>`,
    color: '#0084FF'
  },

  // 新闻资讯类
  {
    id: 'toutiao',
    name: '今日头条',
    category: 'news',
    keywords: ['今日头条', 'toutiao', '新闻', '资讯'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13H6v-2h12v2zm0-4H6V7h12v2z"/>
    </svg>`,
    color: '#FF6B35'
  },

  // 实用工具类
  {
    id: 'baidu',
    name: '百度',
    category: 'tools',
    keywords: ['百度', 'baidu', '搜索', '工具'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.217 12.486c1.964-.422 1.693-2.772 1.693-2.772s-.15-2.728-1.846-2.728c-1.697 0-1.927 2.728-1.927 2.728s-.27 2.35 2.08 2.772zm5.544-5.457c1.657 0 1.657-2.035 1.657-2.035s.084-1.966-1.657-1.966-1.657 1.966-1.657 1.966-.084 2.035 1.657 2.035zm5.746 1.437c1.328 0 1.328-1.594 1.328-1.594s.066-1.539-1.328-1.539c-1.394 0-1.328 1.539-1.328 1.539s0 1.594 1.328 1.594zM3.473 9.696c1.079 0 1.079-1.295 1.079-1.295s.054-1.25-1.079-1.25S2.394 8.4 2.394 8.4s0 1.295 1.079 1.295zm15.055 3.852c-2.868 0-2.868 3.434-2.868 3.434s-.27 3.434 2.868 3.434c3.139 0 2.868-3.434 2.868-3.434s0-3.434-2.868-3.434zm-8.788.54c-2.015 0-2.015 2.411-2.015 2.411s-.19 2.411 2.015 2.411c2.204 0 2.015-2.411 2.015-2.411s0-2.411-2.015-2.411z"/>
    </svg>`,
    color: '#2932E1'
  },

  // 设计创意类
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    keywords: ['figma', '设计', 'ui', 'ux', '原型'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148z"/>
    </svg>`,
    color: '#F24E1E'
  },

  // 金融理财类
  {
    id: 'alipay',
    name: '支付宝',
    category: 'finance',
    keywords: ['支付宝', 'alipay', '支付', '金融', '理财'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6-.64-.36-1.23-.8-1.74-1.31C12.47 21.36 11.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.5 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S14 10.33 14 9.5 14.67 8 15.5 8zm-7 0C9.33 8 10 8.67 10 9.5S9.33 11 8.5 11 7 10.33 7 9.5 7.67 8 8.5 8zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>`,
    color: '#1677FF'
  }
]

// 更新分类计数
ICON_CATEGORIES.forEach(category => {
  category.count = ICON_LIBRARY.filter(icon => icon.category === category.id).length
})

// 域名到图标的智能映射
export const DOMAIN_ICON_MAPPING: Record<string, string> = {
  // 社交媒体
  'weixin.qq.com': 'wechat',
  'web.wechat.com': 'wechat',
  'qq.com': 'qq',
  'weibo.com': 'weibo',
  'weibo.cn': 'weibo',
  
  // 科技开发
  'github.com': 'github',
  'github.io': 'github',
  'gitlab.com': 'gitlab',
  'code.visualstudio.com': 'vscode',
  
  // 商业办公
  'office.com': 'office365',
  'office365.com': 'office365',
  'outlook.com': 'office365',
  'google.com': 'google-workspace',
  'gmail.com': 'google-workspace',
  'drive.google.com': 'google-workspace',
  'docs.google.com': 'google-workspace',
  
  // 娱乐媒体
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'bilibili.com': 'bilibili',
  'b23.tv': 'bilibili',
  
  // 购物电商
  'taobao.com': 'taobao',
  'tmall.com': 'taobao',
  'jd.com': 'jd',
  'jd.hk': 'jd',
  
  // 教育学习
  'zhihu.com': 'zhihu',
  
  // 新闻资讯
  'toutiao.com': 'toutiao',
  'jinritoutiao.com': 'toutiao',
  
  // 实用工具
  'baidu.com': 'baidu',
  
  // 设计创意
  'figma.com': 'figma',
  
  // 金融理财
  'alipay.com': 'alipay',
  'ant.design': 'alipay'
}

// 搜索图标库
export function searchIcons(query: string, category?: string): IconLibraryItem[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  let filteredIcons = ICON_LIBRARY
  
  // 按分类过滤
  if (category && category !== 'all') {
    filteredIcons = filteredIcons.filter(icon => icon.category === category)
  }
  
  // 按关键词搜索
  if (normalizedQuery) {
    filteredIcons = filteredIcons.filter(icon => 
      icon.name.toLowerCase().includes(normalizedQuery) ||
      icon.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
    )
  }
  
  return filteredIcons
}

// 根据域名推荐图标
export function recommendIconByDomain(url: string): IconLibraryItem | null {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    const iconId = DOMAIN_ICON_MAPPING[domain] || DOMAIN_ICON_MAPPING[domain.replace('www.', '')]
    
    if (iconId) {
      return ICON_LIBRARY.find(icon => icon.id === iconId) || null
    }
    
    // 尝试部分匹配
    for (const [mappedDomain, iconId] of Object.entries(DOMAIN_ICON_MAPPING)) {
      if (domain.includes(mappedDomain) || mappedDomain.includes(domain.replace('www.', ''))) {
        return ICON_LIBRARY.find(icon => icon.id === iconId) || null
      }
    }
    
  } catch (error) {
    console.warn('Failed to parse URL for icon recommendation:', url)
  }
  
  return null
}

// 获取分类图标
export function getIconsByCategory(categoryId: string): IconLibraryItem[] {
  return ICON_LIBRARY.filter(icon => icon.category === categoryId)
}

// 获取热门图标（基于使用频率，这里简化为前20个）
export function getPopularIcons(): IconLibraryItem[] {
  return ICON_LIBRARY.slice(0, 20)
}
