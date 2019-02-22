const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const CssExtractTextWebpackPlugin = new ExtractTextWebpackPlugin('css/index.css')
const LessExtractTextWebpackPlugin = new ExtractTextWebpackPlugin('css/less.css')

module.exports = {
    entry: {  // 入口
        index: './src/index.js'
    },
    output: { // 出口
        filename: '[name].[hash:8].js', // 编译文件后加hash值
        // 出口路径必须是绝对路径
        path: path.resolve('dist')
    },
    devServer: {
        contentBase: './dist',
        port: 1229,
        compress: true,
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                // 从右往左边写, 解析的过程先处理成css,　再把css插入标签内
                // test: /\.css$/, use: [// 注意顺序
                //     { loader: 'style-loader' },
                //     { loader: 'css-loader' }
                // ]

                // 抽离样式
                test: /\.css$/, use: CssExtractTextWebpackPlugin.extract({
                    use: [
                        { loader: 'css-loader' }
                    ]
                })
            }, {
                test: /\.less$/, use: LessExtractTextWebpackPlugin.extract({
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'less-loader' }
                    ]
                })
            }
        ]
    },
    plugins: [
        // // 抽离样式
        // new ExtractTextWebpackPlugin({
        //     filename: 'css/index.css'
        // }),
        CssExtractTextWebpackPlugin,
        LessExtractTextWebpackPlugin,
        // 不强制刷新，更新需要更新的code
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            title: 'webpack plugin',
            hash: true, // 上线文件加hash，防止缓存
            chunks: ['index'] // 关联output文件
            // minify: {
            //     removeAttributeQuotes: true, // 双引号移除
            //     collapseWhitespace: true // 折叠空行，代码压缩成一行
            // }
        }),
        // 清除打包之前的文件
        new CleanWebpackPlugin(['./dist'])
    ], // 插件配置
    mode: 'development', // 更改开发模式
    resolve: {} // 配置解析
}
