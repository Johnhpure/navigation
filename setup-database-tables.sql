-- =====================================================
-- 导航项目 MySQL 数据库自动建表脚本
-- 执行方式: mysql -u用户名 -p密码 数据库名 < setup-database-tables.sql
-- 或在 MySQL 客户端中: source setup-database-tables.sql
-- =====================================================

-- 设置执行环境
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- 设置字符集
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- 开始事务
START TRANSACTION;

-- =====================================================
-- 检查并创建数据库
-- =====================================================
CREATE DATABASE IF NOT EXISTS `navigation` 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `navigation`;

SELECT '🚀 开始创建数据库表...' as status;

-- =====================================================
-- 1. 删除已存在的表（如果存在）
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `admin_sessions`;
DROP TABLE IF EXISTS `websites`;

SELECT '🗑️  清理旧表完成' as status;

-- =====================================================
-- 2. 创建 websites 表 (网站导航数据)
-- =====================================================
CREATE TABLE `websites` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(255) NOT NULL COMMENT '网站名称',
  `url` TEXT NOT NULL COMMENT '网站URL',
  `description` TEXT NULL COMMENT '网站描述',
  `custom_icon_path` VARCHAR(500) NULL COMMENT '自定义图标路径',
  `icon_type` ENUM('FAVICON', 'CUSTOM', 'DEFAULT', 'AUTO_FETCHED', 'LIBRARY') 
              NOT NULL DEFAULT 'FAVICON' COMMENT '图标类型：FAVICON-网站图标, CUSTOM-自定义上传, DEFAULT-默认图标, AUTO_FETCHED-自动获取, LIBRARY-图标库',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序，数字越小越靠前',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活显示',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`),
  INDEX `idx_websites_is_active` (`is_active`),
  INDEX `idx_websites_sort_order` (`sort_order`),
  INDEX `idx_websites_icon_type` (`icon_type`),
  INDEX `idx_websites_active_sort` (`is_active`, `sort_order`),
  INDEX `idx_websites_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网站导航信息表';

SELECT '✅ websites 表创建完成' as status;

-- =====================================================
-- 3. 创建 admin_sessions 表 (管理员会话)
-- =====================================================
CREATE TABLE `admin_sessions` (
  `id` VARCHAR(255) NOT NULL COMMENT '会话唯一标识符',
  `token` VARCHAR(255) NOT NULL COMMENT '会话访问令牌',
  `expires_at` TIMESTAMP NOT NULL COMMENT '会话过期时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '会话创建时间',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admin_sessions_token` (`token`),
  INDEX `idx_admin_sessions_expires_at` (`expires_at`),
  INDEX `idx_admin_sessions_token_expires` (`token`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员会话管理表';

SELECT '✅ admin_sessions 表创建完成' as status;

-- =====================================================
-- 4. 插入初始示例数据
-- =====================================================
INSERT INTO `websites` (`name`, `url`, `description`, `icon_type`, `sort_order`, `is_active`) VALUES
('Google', 'https://www.google.com', '全球最大的搜索引擎，提供网页搜索、图片搜索等服务', 'FAVICON', 1, TRUE),
('GitHub', 'https://github.com', '全球最大的代码托管平台，程序员必备工具', 'FAVICON', 2, TRUE),
('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区，解决编程问题的好去处', 'FAVICON', 3, TRUE),
('MDN Web Docs', 'https://developer.mozilla.org', 'Web 开发者文档，前端开发必备参考', 'FAVICON', 4, TRUE),
('npm', 'https://www.npmjs.com', 'Node.js 包管理器，JavaScript 生态系统', 'FAVICON', 5, TRUE);

SELECT '📝 示例数据插入完成' as status;

-- =====================================================
-- 5. 数据库性能优化设置
-- =====================================================
-- 设置 InnoDB 配置（需要相应权限）
-- SET GLOBAL innodb_file_per_table = 1;
-- SET GLOBAL innodb_flush_log_at_trx_commit = 2;

-- =====================================================
-- 6. 验证表创建结果
-- =====================================================
SELECT '📊 验证数据库表结构...' as status;

-- 显示所有表
SHOW TABLES;

-- 显示表结构
SELECT '--- websites 表结构 ---' as info;
DESCRIBE websites;

SELECT '--- admin_sessions 表结构 ---' as info;
DESCRIBE admin_sessions;

-- 验证数据
SELECT '--- 示例数据验证 ---' as info;
SELECT COUNT(*) as website_count FROM websites;
SELECT name, url, icon_type FROM websites ORDER BY sort_order LIMIT 3;

-- =====================================================
-- 7. 提交事务
-- =====================================================
COMMIT;

-- 恢复原始设置
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- =====================================================
-- 完成提示
-- =====================================================
SELECT '🎉 数据库建表脚本执行完成！' as status;
SELECT '✅ 所有表创建成功，可以开始使用导航系统' as message;
SELECT '📋 创建的表：websites, admin_sessions' as tables_created;
SELECT '🔧 建议：请根据实际需要调整管理员密码和数据库连接配置' as suggestion;

-- 显示执行摘要
SELECT 
    '数据库建表完成' as operation,
    NOW() as completed_at,
    '2张表，5条示例数据' as summary;
