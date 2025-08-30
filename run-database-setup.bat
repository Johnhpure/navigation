@echo off
chcp 65001 >nul

REM =====================================================
REM 导航项目数据库自动建表脚本 (Windows 版本)
REM 使用方式: run-database-setup.bat
REM =====================================================

echo.
echo ==================================================
echo 🚀 导航项目数据库自动建表脚本
echo ==================================================
echo.

REM 检查 MySQL 客户端是否安装
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL 客户端未安装，请先安装 MySQL 客户端
    echo [INFO] 下载地址: https://dev.mysql.com/downloads/mysql/
    echo [INFO] 或使用 Docker: docker run -it --rm mysql:8.0 mysql
    pause
    exit /b 1
)

echo [SUCCESS] MySQL 客户端已安装

REM 设置默认值
set DEFAULT_HOST=localhost
set DEFAULT_PORT=3306
set DEFAULT_USER=root
set DEFAULT_DATABASE=navigation

echo.
echo [INFO] 请输入数据库连接信息（按回车使用默认值）：

REM 获取数据库连接信息
set /p "DB_HOST=数据库主机 [%DEFAULT_HOST%]: "
if "%DB_HOST%"=="" set DB_HOST=%DEFAULT_HOST%

set /p "DB_PORT=数据库端口 [%DEFAULT_PORT%]: "
if "%DB_PORT%"=="" set DB_PORT=%DEFAULT_PORT%

set /p "DB_USER=数据库用户名 [%DEFAULT_USER%]: "
if "%DB_USER%"=="" set DB_USER=%DEFAULT_USER%

set /p "DB_PASSWORD=数据库密码: "

set /p "DB_NAME=数据库名称 [%DEFAULT_DATABASE%]: "
if "%DB_NAME%"=="" set DB_NAME=%DEFAULT_DATABASE%

echo.
echo [INFO] 连接信息确认：
echo [INFO] 主机: %DB_HOST%
echo [INFO] 端口: %DB_PORT%
echo [INFO] 用户: %DB_USER%
echo [INFO] 数据库: %DB_NAME%

REM 确认执行
echo.
set /p "CONFIRM=确认执行建表脚本？(y/N): "
if /i not "%CONFIRM%"=="y" (
    echo [WARNING] 操作已取消
    pause
    exit /b 0
)

REM 检查 SQL 脚本文件是否存在
set SQL_FILE=setup-database-tables.sql
if not exist "%SQL_FILE%" (
    echo [ERROR] SQL 脚本文件 '%SQL_FILE%' 不存在
    pause
    exit /b 1
)

echo [INFO] 开始执行数据库建表脚本...

REM 构建 MySQL 连接命令
set MYSQL_CMD=mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER%
if not "%DB_PASSWORD%"=="" (
    set MYSQL_CMD=%MYSQL_CMD% -p%DB_PASSWORD%
)

REM 执行建表脚本
%MYSQL_CMD% < "%SQL_FILE%"
if %errorlevel% equ 0 (
    echo [SUCCESS] 数据库建表脚本执行成功！
    echo.
    echo [INFO] 创建的表：
    echo [INFO]   • websites - 网站导航数据表
    echo [INFO]   • admin_sessions - 管理员会话表
    echo.
    echo [INFO] 插入的示例数据：
    echo [INFO]   • 5个示例网站（Google, GitHub, Stack Overflow 等）
    echo.
    echo [SUCCESS] 🎉 数据库初始化完成，可以启动应用程序了！
) else (
    echo [ERROR] 数据库建表脚本执行失败
    echo [WARNING] 请检查：
    echo [WARNING]   1. 数据库连接信息是否正确
    echo [WARNING]   2. 用户是否有足够的权限
    echo [WARNING]   3. 数据库服务是否正在运行
    pause
    exit /b 1
)

REM 可选：测试数据库连接
echo.
set /p "TEST_CONN=是否测试数据库连接和查看表结构？(y/N): "
if /i "%TEST_CONN%"=="y" (
    echo [INFO] 测试数据库连接...
    echo SHOW TABLES; | %MYSQL_CMD% %DB_NAME%
    if %errorlevel% equ 0 (
        echo [SUCCESS] 数据库连接测试成功！
    ) else (
        echo [ERROR] 数据库连接测试失败
    )
)

echo.
echo [INFO] 脚本执行完成
echo ==================================================
echo ✅ 建表操作完成，祝您使用愉快！
echo ==================================================
pause
