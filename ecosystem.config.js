module.exports = {
  apps: [
    {
      name: "demand10-dashboard",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3008
      }
    }
  ]
};
