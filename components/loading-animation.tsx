export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border-2 border-chart-2/20 border-r-chart-2 rounded-full animate-spin animate-reverse" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
        </div>

        <div className="absolute -inset-4 border border-primary/10 rounded-full animate-ping" />
        <div className="absolute -inset-6 border border-chart-2/10 rounded-full animate-ping animation-delay-300" />

        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-sm bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent animate-pulse">
          起点跳动 · 加载中...
        </div>
      </div>
    </div>
  )
}
