#!/bin/bash

# Docker 独立部署脚本（使用宿主机 MySQL）
# 使用方法: ./scripts/docker-standalone.sh [command] [options]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置文件
COMPOSE_FILE="docker-compose.standalone.yml"
ENV_FILE=".env.standalone"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
}

# 检查环境变量文件
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "$ENV_FILE 文件不存在，正在创建..."
        if [ -f ".env.standalone" ]; then
            cp .env.standalone "$ENV_FILE"
        else
            log_error "请先创建 $ENV_FILE 文件"
            log_info "示例配置："
            cat << 'EOF'
# 宿主机 MySQL 配置
MYSQL_HOST=host.docker.internal
MYSQL_PORT=3306
MYSQL_DATABASE=navigation
MYSQL_USER=navigation_user
MYSQL_PASSWORD=your_mysql_password

# 应用配置
ADMIN_PASSWORD=your_secure_admin_password
NODE_ENV=production
EOF
            exit 1
        fi
        log_warning "请编辑 $ENV_FILE 文件并配置您的 MySQL 连接信息"
        exit 1
    fi
}

# 检查 MySQL 连接
check_mysql_connection() {
    log_info "检查 MySQL 连接..."
    
    # 从环境变量文件读取配置
    source "$ENV_FILE"
    
    # 如果是 host.docker.internal，转换为 localhost 进行测试
    TEST_HOST="$MYSQL_HOST"
    if [ "$MYSQL_HOST" = "host.docker.internal" ]; then
        TEST_HOST="localhost"
    fi
    
    # 检查 MySQL 是否可访问
    if command -v mysql &> /dev/null; then
        if mysql -h "$TEST_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE;" 2>/dev/null; then
            log_success "MySQL 连接测试成功"
        else
            log_error "MySQL 连接失败，请检查配置"
            log_info "请确保："
            log_info "1. MySQL 服务正在运行"
            log_info "2. 数据库 '$MYSQL_DATABASE' 存在"
            log_info "3. 用户 '$MYSQL_USER' 有访问权限"
            log_info "4. 密码正确"
            exit 1
        fi
    else
        log_warning "未安装 mysql 客户端，跳过连接测试"
        log_info "请确保 MySQL 服务正在运行并且配置正确"
    fi
}

# 构建镜像
build_image() {
    log_info "开始构建 Docker 镜像..."
    
    # 使用 buildkit 加速构建
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    # 构建镜像
    docker build \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        --cache-from navigation-app:latest \
        -t navigation-app:latest \
        -t navigation-app:$(date +%Y%m%d-%H%M%S) \
        .
    
    log_success "Docker 镜像构建完成"
}

# 启动服务
start_services() {
    local with_nginx=""
    
    if [ "$1" = "nginx" ]; then
        with_nginx="--profile nginx"
        log_info "启动应用服务（包含 Nginx）..."
    else
        log_info "启动应用服务（仅应用容器）..."
    fi
    
    # 启动服务
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d $with_nginx
    
    # 等待服务启动
    log_info "等待应用启动..."
    sleep 15
    
    # 检查服务状态
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_success "服务启动成功！"
        local app_port=$(grep "APP_PORT" "$ENV_FILE" | cut -d'=' -f2 | tr -d ' ' || echo "3000")
        log_info "应用地址: http://localhost:${app_port}"
        if [ "$1" = "nginx" ]; then
            local nginx_port=$(grep "NGINX_HTTP_PORT" "$ENV_FILE" | cut -d'=' -f2 | tr -d ' ' || echo "80")
            log_info "Nginx 地址: http://localhost:${nginx_port}"
        fi
        log_info "查看日志: docker-compose -f $COMPOSE_FILE logs -f"
    else
        log_error "服务启动失败，请检查日志"
        docker-compose -f "$COMPOSE_FILE" logs
        exit 1
    fi
}

# 数据库迁移
migrate_database() {
    log_info "执行数据库迁移..."
    
    # 等待应用完全启动
    log_info "等待应用启动..."
    sleep 10
    
    # 执行 Prisma 迁移
    if docker-compose -f "$COMPOSE_FILE" exec app npx prisma db push; then
        log_success "数据库迁移完成"
    else
        log_error "数据库迁移失败"
        log_info "请检查："
        log_info "1. MySQL 服务是否正在运行"
        log_info "2. 数据库连接配置是否正确"
        log_info "3. 数据库用户权限是否足够"
        exit 1
    fi
}

# 停止服务
stop_services() {
    log_info "停止服务..."
    docker-compose -f "$COMPOSE_FILE" down
    log_success "服务已停止"
}

# 重启服务
restart_services() {
    log_info "重启服务..."
    docker-compose -f "$COMPOSE_FILE" down
    start_services "$1"
}

# 查看日志
show_logs() {
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# 清理资源
cleanup() {
    log_info "清理 Docker 资源..."
    
    # 停止并删除容器
    docker-compose -f "$COMPOSE_FILE" down
    
    # 清理未使用的镜像
    docker image prune -f
    
    log_success "清理完成"
}

# 显示状态
show_status() {
    log_info "服务状态："
    docker-compose -f "$COMPOSE_FILE" ps
    
    log_info "容器资源使用："
    docker stats --no-stream navigation-app 2>/dev/null || log_warning "应用容器未运行"
}

# 显示帮助信息
show_help() {
    echo "Docker 独立部署脚本（使用宿主机 MySQL）"
    echo ""
    echo "用法:"
    echo "  $0 setup                设置环境（检查配置）"
    echo "  $0 build                构建 Docker 镜像"
    echo "  $0 start [nginx]        启动服务（可选启用 nginx）"
    echo "  $0 stop                 停止服务"
    echo "  $0 restart [nginx]      重启服务"
    echo "  $0 migrate              执行数据库迁移"
    echo "  $0 logs                 查看日志"
    echo "  $0 status               查看状态"
    echo "  $0 cleanup              清理资源"
    echo "  $0 help                 显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 setup                # 检查环境配置"
    echo "  $0 build                # 构建镜像"
    echo "  $0 start                # 仅启动应用"
    echo "  $0 start nginx          # 启动应用 + Nginx"
    echo "  $0 restart nginx        # 重启服务（包含 Nginx）"
    echo ""
    echo "注意:"
    echo "  - 请先配置 $ENV_FILE 文件"
    echo "  - 确保宿主机 MySQL 服务正在运行"
    echo "  - 确保数据库和用户已创建"
}

# 主函数
main() {
    check_docker
    
    case "$1" in
        "setup")
            check_env_file
            check_mysql_connection
            log_success "环境检查完成，可以开始部署"
            ;;
        "build")
            build_image
            ;;
        "start")
            check_env_file
            check_mysql_connection
            start_services "$2"
            migrate_database
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            check_env_file
            restart_services "$2"
            ;;
        "migrate")
            migrate_database
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
