# Docker 独立部署指南

使用现有的 MySQL 数据库，只部署应用容器。

## 🎯 适用场景

- 服务器上已有 MySQL 数据库
- 不想额外运行 MySQL 容器
- 需要与现有数据库系统集成
- 资源有限的服务器环境

## 🚀 快速部署

### 1. 准备 MySQL 数据库

在您的物理服务器上创建数据库和用户：

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE navigation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（请使用强密码）
CREATE USER 'navigation_user'@'localhost' IDENTIFIED BY 'your_secure_password';
CREATE USER 'navigation_user'@'%' IDENTIFIED BY 'your_secure_password';

-- 授权
GRANT ALL PRIVILEGES ON navigation.* TO 'navigation_user'@'localhost';
GRANT ALL PRIVILEGES ON navigation.* TO 'navigation_user'@'%';
FLUSH PRIVILEGES;

EXIT;
```

### 2. 配置环境变量

```bash
# 复制配置模板
cp .env.standalone .env.standalone.local

# 编辑配置
nano .env.standalone.local
```

配置示例：
```env
# 宿主机 MySQL 配置
MYSQL_HOST=host.docker.internal  # Docker 访问宿主机的特殊地址
MYSQL_PORT=3306
MYSQL_DATABASE=navigation
MYSQL_USER=navigation_user
MYSQL_PASSWORD=your_secure_password

# 应用配置
ADMIN_PASSWORD=your_admin_password
NODE_ENV=production

# 端口配置
APP_PORT=3000
```

### 3. 部署应用

**方法一：使用脚本（推荐）**
```bash
# 检查环境配置
./scripts/docker-standalone.sh setup

# 构建镜像
./scripts/docker-standalone.sh build

# 启动应用
./scripts/docker-standalone.sh start

# 如果需要 Nginx 反向代理
./scripts/docker-standalone.sh start nginx
```

**方法二：使用 npm 脚本**
```bash
npm run docker:standalone:setup
npm run docker:build
npm run docker:standalone:start
```

**方法三：手动部署**
```bash
# 构建镜像
docker build -t navigation-app .

# 启动服务
docker-compose -f docker-compose.standalone.yml --env-file .env.standalone.local up -d

# 执行数据库迁移
docker-compose -f docker-compose.standalone.yml exec app npx prisma db push
```

## 📋 配置说明

### MySQL 连接方式

Docker 容器连接宿主机 MySQL 有几种方式：

1. **host.docker.internal**（推荐）
   ```env
   MYSQL_HOST=host.docker.internal
   ```

2. **宿主机 IP 地址**
   ```env
   MYSQL_HOST=192.168.1.100  # 替换为实际 IP
   ```

3. **localhost（需要特殊配置）**
   ```env
   MYSQL_HOST=localhost
   ```
   需要在 docker-compose.yml 中添加：
   ```yaml
   network_mode: host
   ```

### 端口配置

| 服务 | 默认端口 | 环境变量 |
|------|----------|----------|
| 应用 | 3000 | `APP_PORT` |
| Nginx | 80 | `NGINX_HTTP_PORT` |
| Nginx SSL | 443 | `NGINX_HTTPS_PORT` |

## 🛠 管理命令

### 基本操作
```bash
# 查看服务状态
./scripts/docker-standalone.sh status

# 查看日志
./scripts/docker-standalone.sh logs

# 重启服务
./scripts/docker-standalone.sh restart

# 停止服务
./scripts/docker-standalone.sh stop

# 清理资源
./scripts/docker-standalone.sh cleanup
```

### 数据库操作
```bash
# 执行数据库迁移
./scripts/docker-standalone.sh migrate

# 进入应用容器
docker-compose -f docker-compose.standalone.yml exec app sh

# 在容器中执行 Prisma 命令
docker-compose -f docker-compose.standalone.yml exec app npx prisma studio
```

## 🔧 高级配置

### 1. 使用自定义 IP 地址

如果 `host.docker.internal` 不工作，使用服务器的实际 IP：

```bash
# 查看服务器 IP
ip addr show | grep inet

# 在 .env.standalone.local 中设置
MYSQL_HOST=192.168.1.100  # 替换为实际 IP
```

### 2. 配置 MySQL 远程访问

确保 MySQL 允许远程连接：

```sql
-- 检查当前绑定地址
SHOW VARIABLES LIKE 'bind_address';

-- 如果是 127.0.0.1，需要修改配置文件
-- 编辑 /etc/mysql/mysql.conf.d/mysqld.cnf
-- bind-address = 0.0.0.0

-- 重启 MySQL 服务
-- sudo systemctl restart mysql
```

### 3. 启用 Nginx 反向代理

```bash
# 启动时包含 Nginx
./scripts/docker-standalone.sh start nginx

# 配置域名（编辑 docker/nginx/standalone.conf）
server_name your-domain.com;
```

### 4. SSL/HTTPS 配置

```bash
# 将证书放入 docker/ssl/ 目录
cp your-cert.pem docker/ssl/cert.pem
cp your-key.pem docker/ssl/key.pem

# 编辑 docker/nginx/standalone.conf 启用 HTTPS 部分
```

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查 MySQL 服务状态
   sudo systemctl status mysql
   
   # 测试连接
   mysql -h localhost -u navigation_user -p navigation
   
   # 检查防火墙
   sudo ufw status
   ```

2. **容器无法访问宿主机**
   ```bash
   # 在容器内测试连接
   docker-compose -f docker-compose.standalone.yml exec app ping host.docker.internal
   
   # 或使用 IP 地址
   docker-compose -f docker-compose.standalone.yml exec app ping 192.168.1.100
   ```

3. **权限问题**
   ```bash
   # 检查 MySQL 用户权限
   mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='navigation_user';"
   
   # 重新授权
   mysql -u root -p -e "GRANT ALL PRIVILEGES ON navigation.* TO 'navigation_user'@'%';"
   ```

### 调试技巧

```bash
# 查看详细日志
docker-compose -f docker-compose.standalone.yml logs -f app

# 进入容器调试
docker-compose -f docker-compose.standalone.yml exec app sh

# 在容器内测试数据库连接
docker-compose -f docker-compose.standalone.yml exec app npx prisma db pull
```

## 📊 性能优化

### 1. MySQL 连接优化

在 `.env.standalone.local` 中添加连接参数：
```env
DATABASE_URL="mysql://navigation_user:password@host.docker.internal:3306/navigation?connection_limit=10&pool_timeout=60000"
```

### 2. 容器资源限制

编辑 `docker-compose.standalone.yml`：
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
```

## 🔄 数据备份

### 备份脚本示例

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/navigation"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -h localhost -u navigation_user -p navigation > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件
docker cp navigation-app:/app/public/uploads $BACKUP_DIR/uploads_$DATE

echo "备份完成: $BACKUP_DIR"
```

## 📈 监控建议

1. **应用监控**
   ```bash
   # 查看容器资源使用
   docker stats navigation-app
   
   # 健康检查
   curl http://localhost:3000/api/health
   ```

2. **数据库监控**
   ```sql
   -- 查看连接数
   SHOW STATUS LIKE 'Threads_connected';
   
   -- 查看慢查询
   SHOW STATUS LIKE 'Slow_queries';
   ```

---

**优势对比**：

| 特性 | 独立部署 | 完整 Docker 栈 |
|------|----------|----------------|
| 资源占用 | 低 | 高 |
| 部署复杂度 | 中 | 低 |
| 数据库管理 | 手动 | 自动化 |
| 备份恢复 | 需要额外配置 | 简单 |
| 适用场景 | 现有 MySQL 环境 | 全新部署 |

这种方式特别适合您已有 MySQL 服务器的情况，避免了资源浪费和数据迁移的复杂性。
