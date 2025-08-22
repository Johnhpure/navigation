# 部署指南

本指南将帮助您将导航站部署到本地 Dell 服务器上。

## 前置要求

### 系统要求
- Node.js 18+ 
- MySQL 8.0+
- PM2 (用于进程管理)
- Nginx (可选，用于反向代理)

### 环境准备
```bash
# 安装 Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 MySQL (如果未安装)
sudo apt update
sudo apt install mysql-server
```

## 部署步骤

### 1. 克隆项目
```bash
cd /var/www
sudo git clone <your-repo-url> navigation
sudo chown -R $USER:$USER navigation
cd navigation
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

配置示例：
```env
# 数据库配置 - 替换为您的实际 MySQL 连接字符串
DATABASE_URL="mysql://navigation_user:secure_password@localhost:3306/navigation"

# 管理员密码 - 生产环境请使用强密码
ADMIN_PASSWORD="your-very-secure-admin-password-here"

# 文件上传目录
UPLOAD_DIR="uploads"

# 环境
NODE_ENV="production"
```

### 4. 设置数据库
```bash
# 创建数据库用户和数据库
sudo mysql -u root -p
```

MySQL 命令：
```sql
-- 创建数据库
CREATE DATABASE navigation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'navigation_user'@'localhost' IDENTIFIED BY 'secure_password';

-- 授权
GRANT ALL PRIVILEGES ON navigation.* TO 'navigation_user'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 5. 初始化数据库
```bash
# 运行数据库设置脚本
npm run setup
```

### 6. 构建项目
```bash
# 构建生产版本
npm run build
```

### 7. 启动应用
```bash
# 使用 PM2 启动
pm2 start npm --name "navigation" -- start

# 设置开机自启
pm2 startup
pm2 save
```

## Nginx 配置 (可选)

如果您想使用域名访问，可以配置 Nginx：

```bash
sudo nano /etc/nginx/sites-available/navigation
```

Nginx 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /uploads/ {
        alias /var/www/navigation/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/navigation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 常用管理命令

### PM2 管理
```bash
# 查看状态
pm2 status

# 重启应用
pm2 restart navigation

# 查看日志
pm2 logs navigation

# 停止应用
pm2 stop navigation
```

### 数据库管理
```bash
# 查看数据库状态
npm run db:studio

# 重置数据库 (谨慎使用)
npm run db:reset

# 备份数据库
mysqldump -u navigation_user -p navigation > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 应用更新
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 重启应用
pm2 restart navigation
```

## 安全建议

1. **防火墙配置**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **定期备份**
   - 设置定时任务备份数据库
   - 备份上传的图标文件

3. **SSL 证书**
   - 使用 Let's Encrypt 为域名配置 HTTPS
   - 更新 Nginx 配置支持 SSL

4. **监控**
   - 使用 PM2 监控应用状态
   - 设置日志轮转避免磁盘空间不足

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 MySQL 服务状态：`sudo systemctl status mysql`
   - 验证数据库连接字符串
   - 确认用户权限

2. **端口占用**
   - 检查端口使用：`sudo netstat -tlnp | grep :3000`
   - 修改 Next.js 端口：`PORT=3001 npm start`

3. **权限问题**
   - 确保上传目录权限：`chmod 755 public/uploads`
   - 检查文件所有者：`chown -R www-data:www-data public/uploads`

4. **内存不足**
   - 增加 Node.js 内存限制：`NODE_OPTIONS="--max-old-space-size=2048"`
   - 监控系统资源：`htop`

### 日志查看
```bash
# PM2 日志
pm2 logs navigation

# Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 系统日志
sudo journalctl -u mysql
```

## 维护

### 定期任务
1. 每周备份数据库
2. 每月检查系统更新
3. 清理旧的日志文件
4. 监控磁盘空间使用

### 性能优化
1. 启用 Nginx gzip 压缩
2. 配置静态文件缓存
3. 使用 CDN (如果需要)
4. 定期清理数据库

---

如有问题，请查看应用日志或联系技术支持。
