
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/ark", {
            //`api`是需要转发的请求 http://127.0.0.1:7001
            target: "https://www.diopoo.com", // 这里是接口服务器地址
            changeOrigin: true,
            pathRewrite: {
                "^/ark": "/ark"
            }
        }),
    );
};
