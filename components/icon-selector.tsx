"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ICON_LIBRARY, 
  ICON_CATEGORIES, 
  searchIcons, 
  recommendIconByDomain,
  getIconsByCategory,
  getPopularIcons,
  IconLibraryItem 
} from "@/lib/icon-library"
import { Search, Sparkles, TrendingUp, Grid3X3, Check } from "lucide-react"

interface IconSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectIcon: (icon: IconLibraryItem) => void
  currentUrl?: string
  selectedIconId?: string
}

export function IconSelector({ 
  open, 
  onOpenChange, 
  onSelectIcon, 
  currentUrl,
  selectedIconId 
}: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<'recommended' | 'popular' | 'categories' | 'search'>('recommended')

  // 智能推荐图标
  const recommendedIcon = useMemo(() => {
    if (!currentUrl) return null
    return recommendIconByDomain(currentUrl)
  }, [currentUrl])

  // 热门图标
  const popularIcons = useMemo(() => getPopularIcons(), [])

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchIcons(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory)
  }, [searchQuery, selectedCategory])

  // 分类图标
  const categoryIcons = useMemo(() => {
    if (selectedCategory === 'all') return ICON_LIBRARY
    return getIconsByCategory(selectedCategory)
  }, [selectedCategory])

  // 当前显示的图标列表
  const displayIcons = useMemo(() => {
    switch (activeTab) {
      case 'recommended':
        return recommendedIcon ? [recommendedIcon] : []
      case 'popular':
        return popularIcons
      case 'search':
        return searchResults
      case 'categories':
      default:
        return categoryIcons
    }
  }, [activeTab, recommendedIcon, popularIcons, searchResults, categoryIcons])

  const handleSelectIcon = (icon: IconLibraryItem) => {
    onSelectIcon(icon)
    onOpenChange(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setActiveTab('search')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>选择图标</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* 搜索栏 */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索图标..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* 侧边栏 */}
            <div className="w-64 border-r bg-muted/20">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {/* 智能推荐 */}
                  {recommendedIcon && (
                    <Button
                      variant={activeTab === 'recommended' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('recommended')}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      智能推荐
                      <Badge variant="secondary" className="ml-auto">
                        1
                      </Badge>
                    </Button>
                  )}

                  {/* 热门图标 */}
                  <Button
                    variant={activeTab === 'popular' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('popular')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    热门图标
                    <Badge variant="secondary" className="ml-auto">
                      {popularIcons.length}
                    </Badge>
                  </Button>

                  {/* 分类浏览 */}
                  <Button
                    variant={activeTab === 'categories' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('categories')}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    分类浏览
                  </Button>

                  {/* 分类列表 */}
                  {activeTab === 'categories' && (
                    <div className="ml-4 space-y-1">
                      <Button
                        variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setSelectedCategory('all')}
                      >
                        全部分类
                        <Badge variant="outline" className="ml-auto text-xs">
                          {ICON_LIBRARY.length}
                        </Badge>
                      </Button>
                      {ICON_CATEGORIES.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {category.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* 标题栏 */}
              <div className="px-6 py-4 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {activeTab === 'recommended' && '智能推荐'}
                      {activeTab === 'popular' && '热门图标'}
                      {activeTab === 'search' && `搜索结果 "${searchQuery}"`}
                      {activeTab === 'categories' && (
                        selectedCategory === 'all' 
                          ? '全部图标' 
                          : ICON_CATEGORIES.find(c => c.id === selectedCategory)?.name
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'recommended' && recommendedIcon && `基于域名 "${currentUrl}" 的智能推荐`}
                      {activeTab === 'popular' && '最受欢迎的图标'}
                      {activeTab === 'search' && `找到 ${displayIcons.length} 个匹配图标`}
                      {activeTab === 'categories' && (
                        selectedCategory === 'all' 
                          ? `共 ${displayIcons.length} 个图标` 
                          : ICON_CATEGORIES.find(c => c.id === selectedCategory)?.description
                      )}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {displayIcons.length} 个图标
                  </Badge>
                </div>
              </div>

              {/* 图标网格 */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {displayIcons.length > 0 ? (
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                      {displayIcons.map((icon) => (
                        <div
                          key={icon.id}
                          className={`
                            relative group cursor-pointer rounded-lg border-2 p-3 transition-all duration-200
                            hover:border-primary hover:shadow-md hover:scale-105
                            ${selectedIconId === icon.id 
                              ? 'border-primary bg-primary/10 shadow-md' 
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                          onClick={() => handleSelectIcon(icon)}
                          title={`${icon.name} - ${icon.keywords.join(', ')}`}
                        >
                          {/* 图标 */}
                          <div 
                            className="w-8 h-8 mx-auto flex items-center justify-center"
                            style={{ color: icon.color }}
                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                          />
                          
                          {/* 选中状态 */}
                          {selectedIconId === icon.id && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}

                          {/* 悬停显示名称 */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                              {icon.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">没有找到图标</h3>
                      <p className="text-muted-foreground mb-4">
                        {activeTab === 'search' 
                          ? '尝试使用不同的关键词搜索'
                          : '当前分类下没有图标'
                        }
                      </p>
                      {activeTab === 'search' && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery('')
                            setActiveTab('popular')
                          }}
                        >
                          查看热门图标
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 图标选择器触发按钮组件
interface IconSelectorTriggerProps {
  onSelectIcon: (icon: IconLibraryItem) => void
  currentUrl?: string
  selectedIconId?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function IconSelectorTrigger({ 
  onSelectIcon, 
  currentUrl, 
  selectedIconId, 
  disabled,
  children 
}: IconSelectorTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => !disabled && setOpen(true)}>
        {children || (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            选择图标
          </Button>
        )}
      </div>
      
      <IconSelector
        open={open}
        onOpenChange={setOpen}
        onSelectIcon={onSelectIcon}
        currentUrl={currentUrl}
        selectedIconId={selectedIconId}
      />
    </>
  )
}
