const proxy = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        proxy("/flv", {
            //`api`是需要转发的请求 http://127.0.0.1:7001
            target: "http://demo.easynvr.com:10800", // 这里是接口服务器地址
            changeOrigin: true,
            pathRewrite: {
                "^/flv": "/flv"
            }
        }),
    );
};
