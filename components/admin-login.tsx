"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, useLogin, useLogout } from "@/lib/hooks/useAuth"
import { Settings, LogOut } from "lucide-react"

interface AdminLoginProps {
  // 保持接口兼容性，但实际使用 hooks
  isAdmin?: boolean
  onLogin?: (password: string) => boolean
  onLogout?: () => void
}

export function AdminLogin({ isAdmin: legacyIsAdmin, onLogin: legacyOnLogin, onLogout: legacyOnLogout }: AdminLoginProps) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { data: isAuthenticated, isLoading } = useAuth()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  // 使用新的认证状态，如果不可用则回退到传入的 props
  const isAdmin = isAuthenticated ?? legacyIsAdmin ?? false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await loginMutation.mutateAsync({ password })
      setPassword("")
      setOpen(false)
      
      // 调用传入的回调函数以保持兼容性
      legacyOnLogin?.(password)
    } catch (error) {
      setError(error instanceof Error ? error.message : "密码错误")
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setOpen(false)
      
      // 调用传入的回调函数以保持兼容性
      legacyOnLogout?.()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="border-primary/50 bg-transparent">
        <div className="w-4 h-4 mr-2 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        检查中...
      </Button>
    )
  }

  if (isAdmin) {
    return (
      <Button 
        variant="outline" 
        onClick={handleLogout} 
        disabled={logoutMutation.isPending}
        className="border-primary/50 hover:bg-primary/10 bg-transparent"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {logoutMutation.isPending ? "退出中..." : "退出管理"}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50 hover:bg-primary/10 bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          管理员登录
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>管理员登录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">管理员密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="请输入管理员密码"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loginMutation.isPending}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={loginMutation.isPending || !password.trim()}
            >
              {loginMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>登录中...</span>
                </div>
              ) : (
                "登录"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
