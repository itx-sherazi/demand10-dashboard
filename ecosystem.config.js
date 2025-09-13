module.exports = {
  apps: [
    {
      name: "intentfrontend",
      cwd: "/var/www/itx_api/intent/intentfrontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
