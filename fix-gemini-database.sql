-- 修复 gemini 数据库中 custom_icon_path 字段长度问题
-- 将 VARCHAR(500) 改为 TEXT 类型，以支持更长的图标路径

USE `gemini`;

-- 检查表是否存在
SHOW TABLES LIKE 'websites';

-- 如果表存在，修改 custom_icon_path 字段类型
ALTER TABLE `websites` MODIFY COLUMN `custom_icon_path` TEXT NULL COMMENT '自定义图标路径';

-- 验证修改结果
DESCRIBE `websites`;

SELECT '✅ gemini 数据库中 custom_icon_path 字段修复完成' as status;
