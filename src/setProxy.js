
// 此文件必须用comme js的规范  因为是给webpack看的
// 新版本先下载 因为脚手架已经没有配置 这个包了
// npm install --save-dev http-proxy-middleware


const { createProxyMiddleware } = require("http-proxy-middleware")
module.exports = function (app) {

    app.use(
        // 有api1的都换成 代理
        createProxyMiddleware('/api1', {
            target: 'http://localhost:5000',
            // 改变源头
            changeOrigin: true,
            // 换字符串  讲 api1的换成空串
            pathRewrite: { '^/api1': '' }
        })
    )
};
