"use client"

import { useState, useEffect } from "react"
import { ParticlesBackground } from "@/components/particles-background"
import { WebsiteCard } from "@/components/website-card"
import { AddWebsiteDialog } from "@/components/add-website-dialog"
import { AdminLogin } from "@/components/admin-login"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWebsites, useMigrateWebsites } from "@/lib/hooks/useWebsites"
import { useAuth } from "@/lib/hooks/useAuth"
import { Search, Globe, Database, AlertCircle } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showMigration, setShowMigration] = useState(false)

  const { data: websites = [], isLoading: isLoadingWebsites, error } = useWebsites()
  const { data: isAdmin = false } = useAuth()
  const migrateMutation = useMigrateWebsites()

  // 检查是否需要从 localStorage 迁移数据
  useEffect(() => {
    const checkMigration = () => {
      const savedWebsites = localStorage.getItem("navigation-websites")
      if (savedWebsites && websites.length === 0 && !isLoadingWebsites) {
        setShowMigration(true)
      }
      setIsLoading(false)
    }

    const timer = setTimeout(checkMigration, 2000)
    return () => clearTimeout(timer)
  }, [websites.length, isLoadingWebsites])

  // 保持兼容性的空函数，实际认证由 AdminLogin 组件处理
  const handleLogin = (password: string) => true
  const handleLogout = () => {}

  const handleMigration = async () => {
    const savedWebsites = localStorage.getItem("navigation-websites")
    if (!savedWebsites) return

    try {
      const websites = JSON.parse(savedWebsites)
      await migrateMutation.mutateAsync({
        websites,
        adminPassword: "admin123" // 在生产环境中应该从用户输入获取
      })
      
      // 迁移成功后清理 localStorage
      localStorage.removeItem("navigation-websites")
      setShowMigration(false)
    } catch (error) {
      console.error('Migration failed:', error)
      alert('数据迁移失败，请稍后重试')
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
        <ParticlesBackground />
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

  if (error) {
    return (
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <div className="text-lg text-destructive mb-2">连接失败</div>
            <div className="text-sm text-muted-foreground mb-4">
              无法连接到数据库，请检查数据库配置
            </div>
            <Button onClick={() => window.location.reload()}>
              重试
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 数据迁移提示 */}
        {showMigration && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-400">检测到本地数据</h3>
                <p className="text-sm text-muted-foreground">
                  发现本地存储的网站数据，是否迁移到数据库？
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowMigration(false)}
                >
                  忽略
                </Button>
                <Button
                  size="sm"
                  onClick={handleMigration}
                  disabled={migrateMutation.isPending}
                >
                  {migrateMutation.isPending ? "迁移中..." : "迁移"}
                </Button>
              </div>
            </div>
          </div>
        )}

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
            <AddWebsiteDialog />
            <AdminLogin isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />
          </div>
        </div>

        {/* Loading State */}
        {isLoadingWebsites && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载网站中...</p>
          </div>
        )}

        {/* Website Grid */}
        {!isLoadingWebsites && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingWebsites && filteredWebsites.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">没有找到网站</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "尝试调整搜索关键词" : "开始添加您的第一个网站吧"}
            </p>
            {!searchQuery && <AddWebsiteDialog />}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/50">
          <p className="text-muted-foreground">
            <span className="text-primary font-semibold">起点跳动</span> 团队内部导航站 · 使用{" "}
            <span className="text-primary">MySQL + Prisma</span> 构建
          </p>
        </footer>
      </div>
    </div>
  )
}