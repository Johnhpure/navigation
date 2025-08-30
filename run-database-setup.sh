#!/bin/bash

# =====================================================
# 导航项目数据库自动建表脚本
# 使用方式: ./run-database-setup.sh
# 或: bash run-database-setup.sh
# =====================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 脚本开始
echo -e "${BLUE}"
echo "=================================================="
echo "🚀 导航项目数据库自动建表脚本"
echo "=================================================="
echo -e "${NC}"

# 检查 MySQL 客户端是否安装
if ! command -v mysql &> /dev/null; then
    print_error "MySQL 客户端未安装，请先安装 MySQL 客户端"
    print_info "Ubuntu/Debian: sudo apt-get install mysql-client"
    print_info "CentOS/RHEL: sudo yum install mysql"
    print_info "macOS: brew install mysql-client"
    exit 1
fi

print_success "MySQL 客户端已安装"

# 设置默认值
DEFAULT_HOST="localhost"
DEFAULT_PORT="3306"
DEFAULT_USER="root"
DEFAULT_DATABASE="navigation"

# 获取数据库连接信息
print_info "请输入数据库连接信息（按回车使用默认值）："

read -p "数据库主机 [$DEFAULT_HOST]: " DB_HOST
DB_HOST=${DB_HOST:-$DEFAULT_HOST}

read -p "数据库端口 [$DEFAULT_PORT]: " DB_PORT
DB_PORT=${DB_PORT:-$DEFAULT_PORT}

read -p "数据库用户名 [$DEFAULT_USER]: " DB_USER
DB_USER=${DB_USER:-$DEFAULT_USER}

read -s -p "数据库密码: " DB_PASSWORD
echo

read -p "数据库名称 [$DEFAULT_DATABASE]: " DB_NAME
DB_NAME=${DB_NAME:-$DEFAULT_DATABASE}

print_info "连接信息确认："
print_info "主机: $DB_HOST"
print_info "端口: $DB_PORT"
print_info "用户: $DB_USER"
print_info "数据库: $DB_NAME"

# 确认执行
echo
read -p "确认执行建表脚本？(y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    print_warning "操作已取消"
    exit 0
fi

# 检查 SQL 脚本文件是否存在
SQL_FILE="setup-database-tables.sql"
if [[ ! -f "$SQL_FILE" ]]; then
    print_error "SQL 脚本文件 '$SQL_FILE' 不存在"
    exit 1
fi

print_info "开始执行数据库建表脚本..."

# 构建 MySQL 连接字符串
MYSQL_CMD="mysql -h$DB_HOST -P$DB_PORT -u$DB_USER"
if [[ -n "$DB_PASSWORD" ]]; then
    MYSQL_CMD="$MYSQL_CMD -p$DB_PASSWORD"
fi

# 执行建表脚本
if $MYSQL_CMD < "$SQL_FILE"; then
    print_success "数据库建表脚本执行成功！"
    echo
    print_info "创建的表："
    print_info "  • websites - 网站导航数据表"
    print_info "  • admin_sessions - 管理员会话表"
    echo
    print_info "插入的示例数据："
    print_info "  • 5个示例网站（Google, GitHub, Stack Overflow 等）"
    echo
    print_success "🎉 数据库初始化完成，可以启动应用程序了！"
else
    print_error "数据库建表脚本执行失败"
    print_warning "请检查："
    print_warning "  1. 数据库连接信息是否正确"
    print_warning "  2. 用户是否有足够的权限"
    print_warning "  3. 数据库服务是否正在运行"
    exit 1
fi

# 可选：测试数据库连接
echo
read -p "是否测试数据库连接和查看表结构？(y/N): " TEST_CONN
if [[ $TEST_CONN =~ ^[Yy]$ ]]; then
    print_info "测试数据库连接..."
    
    echo "SHOW TABLES;" | $MYSQL_CMD $DB_NAME
    
    if [[ $? -eq 0 ]]; then
        print_success "数据库连接测试成功！"
    else
        print_error "数据库连接测试失败"
    fi
fi

echo
print_info "脚本执行完成"
echo -e "${BLUE}=================================================="
echo "✅ 建表操作完成，祝您使用愉快！"
echo -e "==================================================${NC}"
