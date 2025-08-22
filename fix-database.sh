#!/bin/bash

echo "=== 数据库修复脚本 ==="
echo "正在修复 navigation 项目的数据库表..."

# 创建 Node.js 脚本来初始化数据库
docker exec -i navigation-app node -e "
const { PrismaClient } = require('@prisma/client');

async function createTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('正在创建 websites 表...');
    await prisma.\$executeRaw\`
      CREATE TABLE IF NOT EXISTS \\\`websites\\\` (
        \\\`id\\\` BIGINT NOT NULL AUTO_INCREMENT,
        \\\`name\\\` VARCHAR(255) NOT NULL,
        \\\`url\\\` TEXT NOT NULL,
        \\\`description\\\` TEXT NULL,
        \\\`custom_icon_path\\\` VARCHAR(500) NULL,
        \\\`icon_type\\\` ENUM('FAVICON', 'CUSTOM', 'DEFAULT') NOT NULL DEFAULT 'FAVICON',
        \\\`sort_order\\\` INT NOT NULL DEFAULT 0,
        \\\`is_active\\\` BOOLEAN NOT NULL DEFAULT 1,
        \\\`created_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \\\`updated_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\\\`id\\\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`;
    
    console.log('正在创建 admin_sessions 表...');
    await prisma.\$executeRaw\`
      CREATE TABLE IF NOT EXISTS \\\`admin_sessions\\\` (
        \\\`id\\\` VARCHAR(191) NOT NULL,
        \\\`token\\\` VARCHAR(255) NOT NULL,
        \\\`expires_at\\\` TIMESTAMP NOT NULL,
        \\\`created_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\\\`id\\\`),
        UNIQUE INDEX \\\`admin_sessions_token_key\\\` (\\\`token\\\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`;
    
    console.log('✅ 数据库表创建成功！');
    
    // 验证表是否存在
    const tables = await prisma.\$queryRaw\`SHOW TABLES\`;
    console.log('数据库中的表:', tables);
    
  } catch (error) {
    console.error('❌ 创建表时出错:', error);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

createTables();
"

if [ $? -eq 0 ]; then
    echo "✅ 数据库表创建成功，正在重启应用..."
    docker restart navigation-app
    
    echo "等待应用启动..."
    sleep 5
    
    echo "测试 API 连接..."
    curl -s http://localhost:3000/api/websites > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ 应用启动成功！可以访问 http://localhost:3000"
    else
        echo "⚠️  应用可能还在启动中，请稍后访问"
    fi
else
    echo "❌ 数据库初始化失败，请检查错误信息"
fi

echo "=== 修复完成 ==="
