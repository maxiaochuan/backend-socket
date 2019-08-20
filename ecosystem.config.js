module.exports = {
  apps : [{
    name: 'mxcins.socket',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '47.94.145.118',
      ref  : 'origin/master',
      repo : 'git@github.com:maxiaochuan/backend-socket.git',
      path : '/var/mxcins.com/backend-socket',
      'post-deploy' : 'source ~/.zshrc && yarn install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
