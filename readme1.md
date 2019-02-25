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

AMD也是一种JavaScript模块化规范，与CommonJS最大的不同在于它采用异步的方式去加载依赖的模块。
AMD规范主要是为了解决针对浏览器环境的模块化问题，最具代表性质的实现是`requirejs`

AMD的优点：
- 可在不转换代码的情况下直接在浏览器中运行
- 可加载多个依赖
- 代码可运行在浏览器环境和`Node.js`环境下

AMD的缺点：
