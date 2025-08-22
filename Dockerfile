# 使用官方 Node.js 18 Alpine 镜像作为基础镜像
FROM node:18-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm
RUN npm install -g pnpm

# ===== 依赖安装阶段 =====
FROM base AS deps

# 复制 Prisma schema 文件（postinstall 需要）
COPY prisma ./prisma

# 安装生产依赖
RUN pnpm install --frozen-lockfile

# ===== 构建阶段 =====
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建应用
RUN pnpm build

# ===== 生产运行阶段 =====
FROM node:18-alpine AS runner

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 设置工作目录
WORKDIR /app

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# 创建上传目录并设置权限
RUN mkdir -p ./public/uploads/icons
RUN mkdir -p ./logs
RUN chown -R nextjs:nodejs ./public/uploads
RUN chown -R nextjs:nodejs ./logs

# 复制构建产物和依赖
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# 生成 Prisma Client（生产环境）
RUN npx prisma generate

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
