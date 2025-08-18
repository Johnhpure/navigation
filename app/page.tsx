"use client"

import { useState, useEffect } from "react"
import { AuroraBackground } from "@/components/aurora-background"
import { WebsiteCard } from "@/components/website-card"
import { AddWebsiteDialog } from "@/components/add-website-dialog"
import { AdminLogin } from "@/components/admin-login"
import { Input } from "@/components/ui/input"
import { Search, Globe } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  description?: string
}

const defaultWebsites: Website[] = [
  {
    id: "1",
    name: "Google",
    url: "https://google.com",
    description: "全球最大的搜索引擎",
  },
  {
    id: "2",
    name: "GitHub",
    url: "https://github.com",
    description: "代码托管和协作平台",
  },
  {
    id: "3",
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "程序员问答社区",
  },
  {
    id: "4",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Web 开发文档和教程",
  },
]

export default function HomePage() {
  const [websites, setWebsites] = useState<Website[]>(defaultWebsites)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingWebsite, setEditingWebsite] = useState<Website | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  // Load websites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("navigation-websites")
    if (saved) {
      try {
        setWebsites(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load websites:", error)
      }
    }
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleLogin = (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      setIsAdmin(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAdmin(false)
  }

  const handleAddWebsite = (newWebsite: Omit<Website, "id">) => {
    const website: Website = {
      ...newWebsite,
      id: Date.now().toString(),
    }
    setWebsites((prev) => [...prev, website])
  }

  const handleEditWebsite = (updatedWebsite: Website) => {
    setWebsites((prev) => prev.map((site) => (site.id === updatedWebsite.id ? updatedWebsite : site)))
    setEditingWebsite(undefined)
  }

  const handleDeleteWebsite = (id: string) => {
    if (confirm("确定要删除这个网站吗？")) {
      setWebsites((prev) => prev.filter((site) => site.id !== id))
    }
  }

  const filteredWebsites = websites.filter(
    (website) =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (website.description && website.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent animate-pulse">
              起点跳动 · 加载中...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent mb-2 animate-pulse">
              起点跳动
            </h2>
            <p className="text-sm text-muted-foreground">团队内部导航站</p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <Globe className="w-12 h-12 text-primary mr-4 animate-spin-slow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              导航站
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            您的个人网站导航中心，快速访问常用网站，支持自定义添加和管理
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索网站..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="flex gap-2">
            <AddWebsiteDialog onAdd={handleAddWebsite} editWebsite={editingWebsite} onEdit={handleEditWebsite} />
            <AdminLogin isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />
          </div>
        </div>

        {/* Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWebsites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              isAdmin={isAdmin}
              onEdit={setEditingWebsite}
              onDelete={handleDeleteWebsite}
            />
          ))}
        </div>

        {filteredWebsites.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">没有找到网站</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "尝试调整搜索关键词" : "开始添加您的第一个网站吧"}
            </p>
            {!searchQuery && <AddWebsiteDialog onAdd={handleAddWebsite} />}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/50">
          <p className="text-muted-foreground">
            <span className="text-primary font-semibold">起点跳动</span> 团队内部导航站 · 使用{" "}
            <span className="text-primary">v0</span> 构建
          </p>
        </footer>
      </div>
    </div>
  )
}
