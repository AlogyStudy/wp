// 基于node开发，　遵循commonjs规范

// module.exports = {
//     entry: '', // 入口
//     output: {}, // 出口
//     devServer: {}, // 服务器开发
//     module: {}, // 模块配置
//     plugins: [], // 插件配置
//     mode: 'development', // 更改开发模式
//     resolve: {} // 配置解析
// }

/**
 * 多页面，多出口
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// 单页　一个index.html　引用多个js
// 多页 a.html -> a.js, b.html -> b.js

module.exports = {
    // entry: './src/index.js',
    // entry: ['./src/index.js', './src/a.js'],
    entry: {  // 入口
        index: './src/index.js',
        a: './src/a.js'
    }, // value is string, array, object, boolean, number
    output: { // 出口
        // filename: 'app.[hash:8].js', // 编译文件后加hash值
        filename: '[name].[hash:8].js', // 编译文件后加hash值
        // 出口路径必须是绝对路径
        path: path.resolve('dist')
    },
    devServer: { // 服务器开发
        contentBase: './dist',
        port: 1229,
        compress: true, // 服务器压缩 gzip
        open: true, // 自动打开浏览器
        // hot: true // 自动更新
    },
    module: {}, // 模块配置
    plugins: [
        // 打包html插件
        new HtmlWebpackPlugin({
            filename: 'idx.html',
            template: './src/index.html',
            title: 'webpack plugin',
            hash: true, // 上线文件加hash，防止缓存
            chunks: ['index'] // 关联output文件
            // minify: {
            //     removeAttributeQuotes: true, // 双引号移除
            //     collapseWhitespace: true // 折叠空行，代码压缩成一行
            // }
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/index.html',
            title: 'webpack plugin',
            hash: true, // 上线文件加hash，防止缓存
            chunks: ['b']
        }),
        // 清除打包之前的文件
        new CleanWebpackPlugin(['./dist'])
    ], // 插件配置
    mode: 'development', // 更改开发模式
    resolve: {} // 配置解析
}
