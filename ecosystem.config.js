module.exports = {
  apps: [
    {
      name: 'navigation',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/navigation',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // 自动重启配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 其他配置
      kill_timeout: 5000,
      listen_timeout: 8000,
      
      // 环境变量
      env_file: './.env'
    }
  ]
}
