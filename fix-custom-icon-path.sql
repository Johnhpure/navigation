-- 修复 custom_icon_path 字段长度问题
-- 将 VARCHAR(500) 改为 TEXT 类型，以支持更长的图标路径

USE `navigation`;

-- 修改 custom_icon_path 字段类型
ALTER TABLE `websites` MODIFY COLUMN `custom_icon_path` TEXT NULL COMMENT '自定义图标路径';

-- 验证修改结果
DESCRIBE `websites`;

SELECT '✅ custom_icon_path 字段修复完成' as status;
