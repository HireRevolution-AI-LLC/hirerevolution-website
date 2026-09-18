module.exports = {
  apps: [
    {
      name: "hirerevolution-website",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
