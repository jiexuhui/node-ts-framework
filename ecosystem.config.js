module.exports = {
    apps: [
        {
            name: "wzrytest",
            script: "dist/index.js",
            watch: true,
            instances: "1", // 启用4个实例，如果设置为0或者'max'，则根据CPU数量启动最大进程
            exec_mode: "fork", // 使用集群方式
            env: {
            NODE_ENV: "development"
            },
            env_production: {
            NODE_ENV: "production"
            }
        }
    ]
};