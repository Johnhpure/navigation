-- MySQL 初始化脚本
-- 设置字符集和排序规则

-- 确保数据库使用正确的字符集
ALTER DATABASE navigation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建索引以提高查询性能
-- 注意：Prisma 会自动创建表，这里只是预先优化

-- 设置 MySQL 配置
SET GLOBAL innodb_file_per_table = 1;
SET GLOBAL innodb_flush_log_at_trx_commit = 2;

-- 创建全文搜索索引（如果需要）
-- 这些索引会在 Prisma 创建表后自动应用
