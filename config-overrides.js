/*
 * @Author: liangyt
 * @Date: 2020-02-05 17:01:44
 * @LastEditors: liangyt
 * @LastEditTime: 2020-02-06 09:45:47
 * @Description: 说明用处
 * @FilePath: /unicom-business/config-overrides.js
 */
const { override, fixBabelImports, addLessLoader, addWebpackPlugin, addWebpackAlias ,addWebpackExternals} = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Visualizer = require('webpack-visualizer-plugin');
const isEnvProduction = process.env.NODE_ENV === "production";
const myPlugin = [
    new UglifyJsPlugin(
        {
            uglifyOptions: {
                warnings: false,
                compress: {
                    drop_debugger: true,
                    drop_console: false
                }
            }
        }
    ),
    new Visualizer({ filename: '../dist/stats.html' }),
    isEnvProduction && new BundleAnalyzerPlugin(),
];

module.exports = override(
    fixBabelImports('import', { //配置按需加载
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({ // 自定义antd主题
        lessOptions:{
            javascriptEnabled: true,
            modifyVars: {   '@error-color': '#D71920' },
        }
    }),
    addWebpackAlias({ //路径别名
        '@': path.resolve(__dirname||'', 'src'),
    }),
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    addWebpackExternals({ //不做打包处理配置，如直接以cdn引入的
        // 'TMap':'TMap'
        // highcharts:"window.highcharts"
    }),
    (config) => { //暴露webpack的配置 config ,evn
        // 去掉打包生产map 文件
        // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
        if (process.env.NODE_ENV === "production") config.devtool = false;
        if (process.env.NODE_ENV !== "development") config.plugins = [...config.plugins, ...myPlugin]
        //1.修改、添加loader 配置 :
        // 所有的loaders规则是在config.module.rules(数组)的第二项
        // 即：config.module.rules[2].oneof  (如果不是，具体可以打印 一下是第几项目)
        // 修改 sass 配置 ，规则 loader 在第五项(具体看配置)
        const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
        loaders[5].use.push({
            loader: 'sass-resources-loader',
            options: {
                resources: path.resolve(__dirname, 'src/assets/styles/base.scss')//全局引入公共的scss 文件
            }
        })
        config.optimization.splitChunks = {
            chunks: 'all',
            name: false,
            maxInitialRequests: 20, // for HTTP2
            maxAsyncRequests: 20, // for HTTP2
            minSize: 40
        }
        return config
    }
);
