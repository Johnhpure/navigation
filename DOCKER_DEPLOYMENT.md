# Docker 部署指南

本指南将帮助您使用 Docker 和 Docker Compose 部署"起点跳动"导航站。

## 🚀 快速开始

### 1. 前置要求

确保您的系统已安装：
- **Docker** 20.10+
- **Docker Compose** 2.0+

```bash
# 检查 Docker 版本
docker --version
docker-compose --version
```

### 2. 克隆项目

```bash
git clone <your-repo-url>
cd navigation
```

### 3. 配置环境变量

```bash
# 复制 Docker 环境变量模板
cp .env.docker .env.docker.local

# 编辑环境变量（重要！）
nano .env.docker.local
```

**必须修改的配置项：**
```env
# 数据库密码（请使用强密码）
MYSQL_ROOT_PASSWORD=your_very_secure_root_password
MYSQL_PASSWORD=your_secure_db_password

# 管理员密码（请使用强密码）
ADMIN_PASSWORD=your_secure_admin_password
```

### 4. 一键部署

```bash
# 使用部署脚本
./scripts/docker-build.sh build
./scripts/docker-build.sh start prod
```

或者手动部署：

```bash
# 构建镜像
docker build -t navigation-app .

# 启动服务
docker-compose --env-file .env.docker.local up -d

# 等待数据库启动后执行迁移
sleep 30
docker-compose exec app npx prisma db push
```

### 5. 访问应用

- **应用地址**: http://localhost:3000
- **管理员登录**: 使用您在 `.env.docker.local` 中设置的 `ADMIN_PASSWORD`

## 📋 详细配置

### 环境变量说明

| 变量名 | 描述 | 默认值 | 必须修改 |
|--------|------|--------|----------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | - | ✅ |
| `MYSQL_DATABASE` | 数据库名称 | `navigation` | ❌ |
| `MYSQL_USER` | 数据库用户名 | `navigation_user` | ❌ |
| `MYSQL_PASSWORD` | 数据库用户密码 | - | ✅ |
| `ADMIN_PASSWORD` | 管理员密码 | - | ✅ |
| `NODE_ENV` | 运行环境 | `production` | ❌ |

### 端口配置

默认端口映射：
- **应用**: 3000 → 3000
- **MySQL**: 3306 → 3306
- **Nginx**: 80 → 80, 443 → 443

如需修改端口，编辑 `docker-compose.yml` 文件：

```yaml
services:
  app:
    ports:
      - "8080:3000"  # 修改为 8080 端口
```

### 存储卷说明

项目使用以下 Docker 卷持久化数据：

| 卷名 | 用途 | 宿主机路径 |
|------|------|------------|
| `mysql_data` | MySQL 数据库文件 | Docker 管理 |
| `uploads_data` | 用户上传的图标 | Docker 管理 |
| `logs_data` | 应用日志文件 | Docker 管理 |

## 🛠 管理命令

### 使用部署脚本

```bash
# 构建镜像
./scripts/docker-build.sh build

# 启动生产环境
./scripts/docker-build.sh start prod

# 启动开发环境
./scripts/docker-build.sh start dev

# 重启服务
./scripts/docker-build.sh restart prod

# 查看日志
./scripts/docker-build.sh logs

# 停止服务
./scripts/docker-build.sh stop

# 数据库迁移
./scripts/docker-build.sh migrate

# 清理资源
./scripts/docker-build.sh cleanup
```

### 手动管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 重启特定服务
docker-compose restart app

# 进入应用容器
docker-compose exec app sh

# 进入数据库容器
docker-compose exec mysql mysql -u root -p

# 备份数据库
docker-compose exec mysql mysqldump -u root -p navigation > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u root -p navigation < backup.sql
```

## 🔧 高级配置

### 1. 使用 Nginx 反向代理

启用 Nginx 服务（默认已包含在 docker-compose.yml 中）：

```bash
# 取消注释 nginx 服务
docker-compose up -d nginx
```

Nginx 配置文件位于 `docker/nginx/` 目录。

### 2. SSL/HTTPS 配置

创建 SSL 证书目录：

```bash
mkdir -p docker/ssl
```

将您的证书文件放入该目录：
- `docker/ssl/cert.pem`
- `docker/ssl/key.pem`

更新 `docker/nginx/default.conf` 添加 HTTPS 配置：

```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... 其他配置
}
```

### 3. 自定义域名

修改 `docker/nginx/default.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名
    # ... 其他配置
}
```

### 4. 数据库优化

对于生产环境，可以调整 MySQL 配置。创建 `docker/mysql/my.cnf`：

```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
```

在 docker-compose.yml 中挂载配置：

```yaml
mysql:
  volumes:
    - ./docker/mysql/my.cnf:/etc/mysql/conf.d/custom.cnf
```

## 📊 监控和日志

### 1. 健康检查

应用包含内置健康检查：

```bash
# 检查应用健康状态
curl http://localhost:3000/api/health

# 查看 Docker 健康状态
docker-compose ps
```

### 2. 日志管理

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs app
docker-compose logs mysql

# 实时跟踪日志
docker-compose logs -f app

# 限制日志行数
docker-compose logs --tail=100 app
```

### 3. 性能监控

可以使用以下工具监控容器性能：

```bash
# 查看资源使用情况
docker stats

# 查看特定容器资源使用
docker stats navigation-app navigation-mysql
```

## 🔒 安全建议

### 1. 密码安全

- 使用强密码（至少 16 位，包含大小写字母、数字和特殊字符）
- 定期更换密码
- 不要在代码中硬编码密码

### 2. 网络安全

```bash
# 只暴露必要的端口
# 生产环境建议只暴露 80 和 443 端口
```

### 3. 文件权限

```bash
# 确保敏感文件权限正确
chmod 600 .env.docker.local
chmod 600 docker/ssl/*
```

### 4. 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## 🚨 故障排除

### 常见问题

1. **容器无法启动**
   ```bash
   # 检查日志
   docker-compose logs app
   
   # 检查端口占用
   sudo netstat -tlnp | grep :3000
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose logs mysql
   
   # 验证数据库连接
   docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
   ```

3. **权限问题**
   ```bash
   # 修复上传目录权限
   docker-compose exec app chown -R nextjs:nodejs /app/public/uploads
   ```

4. **内存不足**
   ```bash
   # 增加 Docker 内存限制
   # 在 docker-compose.yml 中添加：
   services:
     app:
       mem_limit: 1g
   ```

### 调试模式

启用详细日志：

```bash
# 设置环境变量
export COMPOSE_LOG_LEVEL=DEBUG
export DOCKER_BUILDKIT_PROGRESS=plain

# 重新构建
docker-compose build --no-cache
```

## 📈 性能优化

### 1. 构建优化

```bash
# 使用多阶段构建
docker build -f Dockerfile.optimized -t navigation-app .

# 使用构建缓存
docker build --cache-from navigation-app:latest -t navigation-app .
```

### 2. 运行时优化

在 docker-compose.yml 中添加资源限制：

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 3. 网络优化

```yaml
services:
  app:
    networks:
      - navigation-network
networks:
  navigation-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: br-navigation
```

## 🔄 更新和维护

### 应用更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建镜像
./scripts/docker-build.sh build

# 3. 重启服务
./scripts/docker-build.sh restart prod
```

### 数据备份

```bash
# 定期备份脚本
#!/bin/bash
BACKUP_DIR="/backup/navigation"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
docker-compose exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD navigation > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件
docker cp navigation-app:/app/public/uploads $BACKUP_DIR/uploads_$DATE

# 清理旧备份（保留 7 天）
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*" -mtime +7 -exec rm -rf {} \;
```

### 定期维护

```bash
# 清理未使用的 Docker 资源
docker system prune -f

# 清理未使用的镜像
docker image prune -f

# 清理未使用的卷
docker volume prune -f
```

## 📞 技术支持

如果遇到问题，请按以下步骤排查：

1. 查看服务状态：`docker-compose ps`
2. 检查日志：`docker-compose logs -f`
3. 验证配置：检查 `.env.docker.local` 文件
4. 重启服务：`docker-compose restart`
5. 重新构建：`docker-compose build --no-cache`

---

**注意**: 这是生产就绪的 Docker 部署方案，包含了安全性、性能和可维护性的最佳实践。
