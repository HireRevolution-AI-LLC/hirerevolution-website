module.exports = {
  apps: [
    {
      name: "hirerevolution-website",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
    },
  ],
};
