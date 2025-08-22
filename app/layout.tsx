import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import { QueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "起点跳动 - 团队导航站",
  description: "起点跳动团队内部使用的暗黑主题导航页面，支持快速添加和管理常用网站链接",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${manrope.variable} dark`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
