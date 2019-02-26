
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
