# 数据库建表脚本使用指南

## 📋 脚本说明

本项目提供了多种方式来自动创建数据库表，适用于不同的操作系统和使用场景。

## 🗂️ 文件说明

| 文件名 | 用途 | 适用系统 |
|--------|------|----------|
| `setup-database-tables.sql` | 纯 SQL 建表脚本 | 所有系统 |
| `run-database-setup.sh` | Linux/macOS 自动化脚本 | Linux/macOS |
| `run-database-setup.bat` | Windows 自动化脚本 | Windows |

## 🚀 使用方式

### 方式一：直接执行 SQL 脚本

```bash
# 方法1：使用 mysql 命令行
mysql -u用户名 -p密码 -h主机 -P端口 < setup-database-tables.sql

# 方法2：在 MySQL 客户端中执行
mysql> source setup-database-tables.sql;

# 方法3：使用 Docker MySQL
docker exec -i mysql容器名 mysql -u用户名 -p密码 < setup-database-tables.sql
```

### 方式二：使用自动化脚本

#### Linux/macOS 系统
```bash
# 添加执行权限
chmod +x run-database-setup.sh

# 运行脚本
./run-database-setup.sh
```

#### Windows 系统
```cmd
# 直接双击运行或命令行执行
run-database-setup.bat
```

## 📊 创建的表结构

### 1. websites 表（网站导航数据）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键ID，自增 |
| name | VARCHAR(255) | 网站名称 |
| url | TEXT | 网站URL |
| description | TEXT | 网站描述（可选） |
| custom_icon_path | VARCHAR(500) | 自定义图标路径（可选） |
| icon_type | ENUM | 图标类型：FAVICON/CUSTOM/DEFAULT/AUTO_FETCHED/LIBRARY |
| sort_order | INT | 排序顺序，默认0 |
| is_active | BOOLEAN | 是否激活，默认TRUE |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 2. admin_sessions 表（管理员会话）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(255) | 会话ID，主键 |
| token | VARCHAR(255) | 会话令牌，唯一 |
| expires_at | TIMESTAMP | 过期时间 |
| created_at | TIMESTAMP | 创建时间 |

## 🎯 创建的索引

- `websites` 表索引：
  - 主键索引：`id`
  - 单列索引：`is_active`, `sort_order`, `icon_type`, `created_at`
  - 复合索引：`(is_active, sort_order)`

- `admin_sessions` 表索引：
  - 主键索引：`id`
  - 唯一索引：`token`
  - 单列索引：`expires_at`
  - 复合索引：`(token, expires_at)`

## 📝 示例数据

脚本会自动插入5条示例网站数据：
1. Google - 搜索引擎
2. GitHub - 代码托管平台
3. Stack Overflow - 程序员问答社区
4. MDN Web Docs - Web 开发文档
5. npm - Node.js 包管理器

## ⚙️ 环境要求

### 必需组件
- MySQL 8.0+ 数据库服务
- MySQL 客户端工具

### 权限要求
数据库用户需要以下权限：
- `CREATE` - 创建数据库和表
- `INSERT` - 插入示例数据
- `SELECT` - 查询验证
- `DROP` - 删除旧表（如果存在）

## 🔧 配置说明

### 默认配置
- 数据库主机：`localhost`
- 数据库端口：`3306`
- 数据库用户：`root`
- 数据库名称：`navigation`
- 字符集：`utf8mb4_unicode_ci`

### Docker 环境
如果使用 Docker 部署，确保：
1. MySQL 容器正在运行
2. 端口映射正确（默认3306）
3. 环境变量配置正确

```bash
# 检查 Docker 容器状态
docker ps | grep mysql

# 进入容器执行脚本
docker exec -i 容器名 mysql -uroot -p密码 < setup-database-tables.sql
```

## ❗ 注意事项

1. **数据备份**：脚本会删除已存在的同名表，执行前请备份重要数据
2. **权限检查**：确保数据库用户有足够的权限
3. **连接测试**：建议先测试数据库连接再执行脚本
4. **字符编码**：确保客户端和服务端字符编码一致
5. **防火墙**：检查数据库端口是否被防火墙阻止

## 🐛 故障排除

### 常见错误

1. **连接失败**
   ```
   ERROR 2003 (HY000): Can't connect to MySQL server
   ```
   - 检查 MySQL 服务是否启动
   - 验证主机名和端口
   - 检查防火墙设置

2. **权限不足**
   ```
   ERROR 1044 (42000): Access denied for user
   ```
   - 确认用户权限
   - 使用管理员账户执行

3. **字符编码问题**
   ```
   ERROR 1366 (HY000): Incorrect string value
   ```
   - 检查客户端字符编码设置
   - 确认数据库字符集配置

### 验证安装

执行以下 SQL 验证表创建成功：

```sql
-- 检查表是否存在
SHOW TABLES;

-- 检查表结构
DESCRIBE websites;
DESCRIBE admin_sessions;

-- 检查示例数据
SELECT COUNT(*) FROM websites;
SELECT name, url FROM websites ORDER BY sort_order;
```

## 📞 技术支持

如果遇到问题，请检查：
1. MySQL 服务状态
2. 网络连接
3. 用户权限
4. 日志文件

建议在测试环境先验证脚本，确认无误后再在生产环境执行。
