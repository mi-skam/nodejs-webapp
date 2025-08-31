module.exports = {
  apps: [
    {
      name: 'nodejs-webapp',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_file: 'logs/pm2-combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=512',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'tests'],
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      kill_timeout: 5000,
    },
  ],
};