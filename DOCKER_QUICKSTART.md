# Docker 快速开始 🚀

只需 3 步，即可使用 Docker 部署"起点跳动"导航站！

## ⚡ 快速部署

### 1️⃣ 配置环境变量
```bash
# 复制环境变量模板
cp .env.docker .env.docker.local

# 编辑配置（必须修改密码！）
nano .env.docker.local
```

**重要**：请修改以下密码：
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_db_password  
ADMIN_PASSWORD=your_secure_admin_password
```

### 2️⃣ 一键部署
```bash
# 构建并启动
./scripts/docker-build.sh build
./scripts/docker-build.sh start prod
```

### 3️⃣ 访问应用
🎉 打开浏览器访问：http://localhost:3000

## 🛠 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
./scripts/docker-build.sh restart prod

# 停止服务
./scripts/docker-build.sh stop

# 清理资源
./scripts/docker-build.sh cleanup
```

## 📋 服务说明

部署后将启动以下服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| 导航站应用 | 3000 | 主应用服务 |
| MySQL 数据库 | 3306 | 数据存储 |
| Nginx (可选) | 80/443 | 反向代理 |

## 🔧 高级选项

### 自定义端口
编辑 `docker-compose.yml`：
```yaml
services:
  app:
    ports:
      - "8080:3000"  # 改为 8080 端口
```

### 启用 HTTPS
1. 将证书文件放入 `docker/ssl/` 目录
2. 取消注释 `docker-compose.yml` 中的 nginx 服务
3. 重启：`./scripts/docker-build.sh restart prod`

### 数据备份
```bash
# 备份数据库
docker-compose exec mysql mysqldump -u root -p navigation > backup.sql

# 备份上传文件  
docker cp navigation-app:/app/public/uploads ./uploads-backup
```

## 🚨 故障排除

**端口冲突**：
```bash
sudo netstat -tlnp | grep :3000
# 停止占用端口的进程或修改端口配置
```

**权限问题**：
```bash
sudo chown -R $USER:$USER .
chmod +x scripts/docker-build.sh
```

**容器无法启动**：
```bash
docker-compose logs app
# 查看具体错误信息
```

---

📖 **详细文档**：查看 [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) 获取完整部署指南

🆘 **需要帮助**：检查日志 `docker-compose logs -f` 或重新构建 `docker-compose build --no-cache`
