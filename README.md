
## 什么是webpack

`webpack`可以看作是模块打包机，它做的事情是，分析项目结构，找到`JavaScript`模块以及其它一些浏览器不能直接运行的拓展语言(`Scss`， `TypeScript`)，并将其打包为合适的格式供浏览器使用。


构建就是把源代码转换成发布到线上的可执行`JavaScript`， `CSS`， `HTML`代码。

- 代码转换: `TypeScript`编译成`JavaScript`， `SCSS`编译成`CSS`等。
- 文件优化: 压缩行`JavaScript`， `CSS`， `HTML`代码，压缩合并图片等。
- 代码分割: 提取多个页面的公用代码，提取首屏不需要执行部分的代码让其异步加载。
- 模块合并: 在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新: 监听本地源代码的变化，自动重新构建，刷新浏览器。
- 代码校验: 在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布: 更新完代码后，自动构建出线上发布代码并传输给发布系统。

构建其实是工程化，自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化执行这一系列复杂的流程。

## 初始化项目

```
mkdir webpack-start
cd webpack-start
npm init // yarn // npm init -y
```

> 0配置 

`webpack`版本4.0+
```
yarn add webpack webpack-cli -D
```

`webpack`中所有文件都是模块：`js`模块化，`AMD(RequireJS)`, `CMD(sea.js)`, `es6Module(import)`, `commonjs(node)`, `UMD(通用定义模块)`

> 直接运行webpack

会执行`node_modules`对应的`bin`下的`webpack.cmd`
```
npx webpack
```

## webpack配置

`webpack`配置核心:

- plugins: 配置项`plugins`
- loader: 配置项`module`,　对于需要通过`.xxx`后缀处理的功能使用`loader`,比如`.vue -> vue-loader`, `.js -> babel-loader`, `.png|.jpg|.git -> url-loader`, `.mp4 -> url-loader`, `.woff2 -> url-loader`, 其它基本使用`plugins`。

> 在webpack中配置开发服务器

```
yarn add webpack-dev-server -D
```

基本配置项:
```
// 基于node开发，　遵循commonjs规范

module.exports = {
    entry: '', // 入口
    output: {}, // 出口
    devServer: {}, // 服务器开发
    module: {}, // 模块配置
    plugins: [], // 插件配置
    mode: 'development', // 更改开发模式
    resolve: {} // 配置解析
}
```

> webpack插件

将`html`打包到`dist`下，可以自动引入生产的`js`

```
yarn add html-webpack-plugin -D　// 针对webpack处理html的插件,　模板使用ejs
yarn add clean-webpack-plugin -D
```

多入口，多出口:
```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// 单页　一个index.html　引用多个js
// 多页 a.html -> a.js, b.html -> b.js

module.exports = {
    entry: {  // 入口
        index: './src/index.js',
        a: './src/a.js'
    },
    output: { // 出口
        filename: '[name].[hash:8].js', // 编译文件后加hash值
        // 出口路径必须是绝对路径
        path: path.resolve('dist')
    },
    devServer: {  // 服务器开发
        contentBase: './dist',
        port: 1229,
        compress: true, // 服务器压缩 gzip
        open: true, // 自动打开浏览器
        // hot: true // 自动更新
    },
    module: {}, // 模块配置
    plugins: [ // 多个html产生，需要配置多个HtmlWebpackPlugin
        // 打包html插件
        new HtmlWebpackPlugin({
            filename: 'idx.html',
            template: './src/index.html',
            title: 'webpack plugin',
            hash: true, // 上线文件加hash，防止缓存
            chunks: ['index'], // 关联output文件
            minify: {
                removeAttributeQuotes: true, // 双引号移除
                collapseWhitespace: true // 折叠空行，代码压缩成一行
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/index.html',
            title: 'webpack plugin',
            hash: true,
            chunks: ['b'],
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        // 清除打包之前的文件
        new CleanWebpackPlugin(['./dist'])
    ], // 插件配置
    mode: 'development', // 更改开发模式
    resolve: {} // 配置解析
}
```

一个入口，多个出口：

```
```

> 更新需要更新的内容

热更新，不强制刷新，更新需要更新的code：
```
// 1. devServer　配置true
devServer: {
    hot: true
}

// 2. 需要引入webpack内置的`HotModuleReplacementPlugin`插件
plugin: [
    new webpack.HotModuleReplacementPlugin()
]

// 3.　在需要的文件中加上
if (module.hot) {
    module.hot.accept()
} 
```

> 处理css

`webpack`默认只支持js模块，并不支持，引入css。
通过`loader`来处理对应情况

```
yarn add style-loader css-loader -D
```
`style-loader`: css解析完，变成`style`标签，插入到html中.
`css-loader`: 把css代码变成模块，变成完模块再插入到`style`标签内 (`css-loader`也具有热更新的功能)

less:
```
yarn add less less-loader -D
```
scss/sass:
```
yarn add sass-loader node-sass -D
```
stylus:
```
yarn add stylus stylus-loader
```
-----

没有抽离样式，全部放在各个`style`标签中：
```
module: {
    rules: [ // 从右往左边写, 解析的过程先处理成css,　再把css插入标签内
        {
            test: /\.css$/, use: [// 注意顺序
                { loader: 'style-loader' },
                { loader: 'css-loader' }
            ]
        }, {
            test: /\.less$/, use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'less-loader' }
            ]
        }
    ]
}
```
抽离样式，抽离到一个`css`文件，通过`css`文件的方式来引用：
```
yarn add extract-text-webpack-plugin@next mini-css-extract-plugin -D
// @next 表示是 webpack4使用的版本
```
`extract-text-webpack-plugin@next`插件以后会被`mimi-css-extract-plugin`替代.
`extract-text-webpack-plugin@next`可以分开抽离
`mimi-css-extract-plugin`只能抽离一个

```
// 1. loader重新配置
// 抽离样式
test: /\.css$/, use: ExtractTextWebpackPlugin.extract({
    use: [
        { loader: 'css-lodaer' }
    ]
})

// 2. 在plugins配置项中，实例化插件，并且指定生成文件名
new ExtractTextWebpackPlugin({
    filename: 'css/index.css'
})
// 多个文件输出的话，需要多次实例化`ExtractTextWebpackPlugin`
```

多个`css`文件输出：
```
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

// 实例化多次
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
```

问题：
使用`ExtractTextWebpackPlugin`抽离出来之后，修改`css`没有热更新的功能。
所以，在开发解决，不开启`ExtractTextWebpackPlugin`分离，而是使用`style-loader`.
开发使用`style`标签，上线使用抽离出对应`.css`文件。

主要配置:
```
const CssExtractTextWebpackPlugin = new ExtractTextWebpackPlugin({
    filename: 'css/index.css',
    disable: true
})
const LessExtractTextWebpackPlugin = new ExtractTextWebpackPlugin({
    filename: 'css/less.css',
    disable: true
})


// 配置项
module: {
    rules: [
        {
            // 抽离样式
            test: /\.css$/, use: CssExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: [
                    { loader: 'css-loader' }
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
}
```

> 移除无用css

```
yarn add purifycss-webpack purify-css glob -D
```
`purifycss-webpack`，需要在`HtmlWebpackPlugin`后使用。

```
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
```

> css前缀

```
yarn add postcss-loader autoprefixer -D
```

添加`loader`:
```
test: /\.css$/, use: CssExtractTextWebpackPlugin.extract({
    fallback: 'style-loader',
    use: [
        { loader: 'css-loader' },
        { loader: 'postcss-loader' }
    ]
})
```
在根目录增加配置`postcss.config.js`文件
```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

> 拷贝文件

```
yarn add copy-webpack-plugin -D
```
-----
`plugins`配置项中使用方法：
```
// 拷贝文件
new CopyWebpackPlugin([
    {
        from: './src/doc',
        to: 'public'
    }
]),
```

> 主要配置思路

- 主要配置项，简单配置
- 服务器开发
- `html`的处理
- 热更新，更新需要更新的代码
- `css`变成模块，抽离`css`样式作为单独文件和部分样式可以通过`style`标签加载
- 移除没用的`css`代码
- `css`样式属性前缀

> 使用到的npm包

```
{

    "devDependencies": {
        "autoprefixer": "^9.4.8",
        "clean-webpack-plugin": "^1.0.1",
        "copy-webpack-plugin": "^5.0.0",
        "css-loader": "^2.1.0",
        "extract-text-webpack-plugin": "^4.0.0-beta.0",
        "glob": "^7.1.3",
        "html-webpack-plugin": "^3.2.0",
        "less": "^3.9.0",
        "less-loader": "^4.1.0",
        "mini-css-extract-plugin": "^0.5.0",
        "postcss-loader": "^3.0.0",
        "purify-css": "^1.2.5",
        "purifycss-webpack": "^0.7.0",
        "style-loader": "^0.23.1",
        "webpack": "^4.29.5",
        "webpack-cli": "^3.2.3",
        "webpack-dev-server": "^3.2.0"
    }
}
```
