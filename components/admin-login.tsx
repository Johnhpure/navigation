"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, LogOut } from "lucide-react"

interface AdminLoginProps {
  isAdmin: boolean
  onLogin: (password: string) => boolean
  onLogout: () => void
}

export function AdminLogin({ isAdmin, onLogin, onLogout }: AdminLoginProps) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onLogin(password)
    if (success) {
      setPassword("")
      setError("")
      setOpen(false)
    } else {
      setError("密码错误")
    }
  }

  const handleLogout = () => {
    onLogout()
    setOpen(false)
  }

  if (isAdmin) {
    return (
      <Button variant="outline" onClick={handleLogout} className="border-primary/50 hover:bg-primary/10 bg-transparent">
        <LogOut className="w-4 h-4 mr-2" />
        退出管理
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">登录</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
