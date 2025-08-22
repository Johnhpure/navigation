#!/bin/bash

# Docker 构建和部署脚本
# 使用方法: ./scripts/docker-build.sh [dev|prod]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    if [ ! -f ".env.docker" ]; then
        log_warning ".env.docker 文件不存在，正在创建..."
        cp .env.docker .env.docker.example 2>/dev/null || {
            log_error "请先创建 .env.docker 文件"
            exit 1
        }
        log_warning "请编辑 .env.docker 文件并配置您的环境变量"
        exit 1
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
    local env_flag=""
    
    if [ "$1" = "prod" ]; then
        env_flag="--env-file .env.docker"
        log_info "启动生产环境服务..."
    else
        log_info "启动开发环境服务..."
    fi
    
    # 启动服务
    docker-compose $env_flag up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        log_success "服务启动成功！"
        log_info "应用地址: http://localhost:3000"
        log_info "数据库地址: localhost:3306"
        log_info "查看日志: docker-compose logs -f"
    else
        log_error "服务启动失败，请检查日志"
        docker-compose logs
        exit 1
    fi
}

# 数据库迁移
migrate_database() {
    log_info "执行数据库迁移..."
    
    # 等待数据库完全启动
    log_info "等待数据库启动..."
    sleep 20
    
    # 执行 Prisma 迁移
    docker-compose exec app npx prisma db push
    
    log_success "数据库迁移完成"
}

# 清理资源
cleanup() {
    log_info "清理 Docker 资源..."
    
    # 停止并删除容器
    docker-compose down
    
    # 清理未使用的镜像
    docker image prune -f
    
    log_success "清理完成"
}

# 显示帮助信息
show_help() {
    echo "Docker 构建和部署脚本"
    echo ""
    echo "用法:"
    echo "  $0 build              构建 Docker 镜像"
    echo "  $0 start [dev|prod]   启动服务"
    echo "  $0 stop               停止服务"
    echo "  $0 restart [dev|prod] 重启服务"
    echo "  $0 migrate            执行数据库迁移"
    echo "  $0 logs               查看日志"
    echo "  $0 cleanup            清理资源"
    echo "  $0 help               显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 build              # 构建镜像"
    echo "  $0 start prod         # 启动生产环境"
    echo "  $0 restart dev        # 重启开发环境"
}

# 主函数
main() {
    check_docker
    
    case "$1" in
        "build")
            build_image
            ;;
        "start")
            check_env_file
            start_services "$2"
            migrate_database
            ;;
        "stop")
            log_info "停止服务..."
            docker-compose down
            log_success "服务已停止"
            ;;
        "restart")
            log_info "重启服务..."
            docker-compose down
            start_services "$2"
            ;;
        "migrate")
            migrate_database
            ;;
        "logs")
            docker-compose logs -f
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
