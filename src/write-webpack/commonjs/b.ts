let fs = require('fs')

function req (moduleName: string): Function {
    let content = fs.readFileSync(moduleName, 'utf8')
    // 最后一个参数是函数体
    let fn = new Function('exports', 'module', 'require', '__dirname', '__filename', content + '\n return module.exports')
    let module = {
        exports: {}
    }
    return fn(module.exports, module, req, __dirname, __filename)
    // function (module.exports, module, req, __dirname, __filename) {
    //     module.exports = 'commonjs'
    //     return module.exports
    // }
}

// let str = require('./a')
let str = req('./a.js')

console.log(str, 'str')
