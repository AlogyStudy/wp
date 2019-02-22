const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const glob = require('glob')
const PurifycssWebpack = require('purifycss-webpack')


const CssExtractTextWebpackPlugin = new ExtractTextWebpackPlugin({
    filename: 'css/index.css',
    // disable: true,
    allChunks: true // 配置压缩
})
const LessExtractTextWebpackPlugin = new ExtractTextWebpackPlugin({
    filename: 'css/less.css',
    // disable: true
})

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
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' }
                    ]
                })
            }, {
                test: /\.less$/, use: LessExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
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
        // 拷贝文件
        new CopyWebpackPlugin([
            {
                from: './src/doc',
                to: 'public'
            }
        ]),
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
        // 移除不需要的样式
        new PurifycssWebpack({
            paths: glob.sync(path.resolve('src/*.html'))
        }),
        // 清除打包之前的文件
        new CleanWebpackPlugin(['./dist'])
    ], // 插件配置
    mode: 'development', // 更改开发模式
    resolve: {} // 配置解析
}
