## 模块化

模块化是指把一个复杂的系统分解到多个模块以方便编码。

> 命名空间

开发网页要通过命名空间的方式来组织代码。

- 命名空间冲突，两个库可能会使用同一个名称。
- 无法合理的管理项目的依赖和版本。
- 无法方便地控制依赖的加载顺序。

> CommonJS

`CommonJS`是一种广泛的`JavaScript`模块化规范，核心思想是通过`require`方法来同步的加载依赖的其它模块，通过`module.exports`导出需要暴露的接口。

采用`CommonJS`导入及其导出的代码：
```
// 导入
const moduleA = require('./moduleA') // 拿到导出后的结果

// 导出
module.exports = 'CommonJS'
```

`commonjs`原理：
```javascript
let fs = require('fs')
let path = require('path')
let b = require('./b.js')
function req (mod) {
    let filename = path.join(__dirname, mod)
    let content = fs.readFileSync(filename, 'utf8')
    let fn = new Function('exports', 'require', 'module', '__dirname', '__filename', content + '\n return module.exports')
    let module = { exports: {} }
    return fn(moduls.exports, req, module, __dirname, __filename)
}
```

> AMD

`AMD`也是一种`JavaScript`模块化规范，与`CommonJS`最大的不同在于它采用异步的方式去加载依赖的模块。
`AMD`规范主要是为了解决针对浏览器环境的模块化问题，最具代表性质的实现是`requirejs`

`AMD`的优点：
- 可在不转换代码的情况下直接在浏览器中运行
- 可加载多个依赖
- 代码可运行在浏览器环境和`Node.js`环境下

`AMD`的缺点：
- `JavaScript`运行环境没有原生支持`AMD`，需要先导入实现了`AMD`的库后才能正常使用。

`AMD`原理：
```javascript
// amd --> requirejs
// define 声明模块，通过require使用一个模块

let factories: any = {}
/**
 * 定义模块
 * @param moduleName 模块名字
 * @param dependencies 模块依赖
 * @param factory 工厂函数
 */
function define (moduleName: string, dependencies: Array<any>, factory: Function) {
    (<any>factory).dependencies = dependencies // 将依赖记录到factory函数上
    factories[moduleName] = factory
}
function _require (mods: Array<any>, callback: Function) {
    let ret = mods.map(mod => {
        let factory = factories[mod]
        // 处理依赖，重新require一次，执行工厂函数返回参数值
        let dependencies = factory.dependencies // ['name']
        _require(dependencies, function (...args: Array<any>) {
            // exports = factory(...args)
            exports = factory.apply(null, arguments)
        })
        return exports
    })
    callback.apply(null, ret)
}

define('name', [], function () {
    return 'amd'
})

define('age', ['name'], function (name: string) {
    return 10 + name
})

_require(['age'], function (age: number) {
    console.log(age, 'age')
})
```

> ES6模块化

`ES6`模块化是`ECMA`提出的`JavaScript`模块化规范，它在语言的层面上实现了模块化。浏览器厂商和`Node.js`都宣布要原生支持该规范。它将逐渐取代`CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案。

`ES6` 模块的设计思想: 尽量静态化，是的编译时就能够确定模块的依赖关系，以及输入和输出的变量。

采用`ES6`模块化导入及导出时：
```javascript
// 导入
import { name } from 'a.js'

// 导出
export const name = 'es6'
```

`ES6`模块虽然是终极模块化方案，但它缺点在于目前无法直接运行在大部分`JavaScript`环境中，必须通过编译工具转换成标准的`ES5`后才能正常运行。

与 `CommonJS` 区别:
* `CommonJS export` 是一个值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值，而 `ES6` 模块 `export` 的是值的引用。
* `CommonJS` 是一个单对象输出，单对象加载的模型，`ES6` 是一个多对象输出，多对象加载的模型。

## 自动化构建

构建：把源代码转换成发布到线上的可执行`JavaScript`, `CSS`, `HTML`代码。

- 代码转换: `ECMASCRIPT6`编译成`ECMASCRIPT5`, `LESS/SCSS/SASS/STYLES`编译成`CSS`等
- 文件优化：压缩`JavaScript`, `HTML`, `CSS`代码，压缩合并图片等。
- 代码分割：提取多个页面的公用代码，提取首屏不需要执行部分的代码让其异步加载。
- 模块合并: 在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建，刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

## Webpack

`Webpack`是一个打包模块化`JavaScript`的工具，在`Webpack`里**一切文件皆模块**,通过**Loader转换文件（加载一些东西）**，通过**Plugin注入钩子（处理一些东西）**，最后输出由多个模块组合成的文件。
`Webpack`专注于构建模块化项目。

一切皆文件：`JavaScript`, `CSS`, `HTML`, `图片`, `模板`, `视频`, `字体`等，在`Webpack`眼中都是一个个模块，好处是能够清晰的描述出各个模块之前的依赖关系，以方便`Webpack`对模块进行组合打包。经过`Webpack`的处理，最终会输出浏览器能使用的静态资源。

> 安装Webpack

在用`Webpack`执行构建任务时，需要通过`Webpack`可执行文件去启动构建任务。

> Webpack核心方法

```javascript
(function(modules) {
	function require(moduleId) { // moduleId 就是文件名
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, require);
		return module.exports;
	}
	return require(require.s = "./src/index.js");
})
({
  "./src/index.js":
    (function(module, exports) {
      eval("console.log('a')\n\n\n//# sourceURL=webpack:///./src/index.js?");
    })
});
```

> 创建命令

一个包需要必备`package.json`文件和`bin`目录

- 需要`package.json`文件
- 需要`bin`目录，底下创建文件（该文件文件名就是命令名）
- 文件首行指定环境运行`!# /usr/bin/dev node`
- 软链接`npm link`

```shell
npm init -y
mkidr bin
touch tpack # 运行命令
npm link
```

> webpack编译

- 模板
- `ejs`
- 依赖关系`require()`
- `fs`, `path`模块
- `loader`就是一个函数
