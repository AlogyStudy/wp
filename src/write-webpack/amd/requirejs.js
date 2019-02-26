"use strict";
// amd --> requirejs
// define 声明模块，通过require使用一个模块
var factories = {};
/**
 * 定义模块
 * @param moduleName 模块名字
 * @param dependencies 模块依赖
 * @param factory 工厂函数
 */
function define(moduleName, dependencies, factory) {
    factory.dependencies = dependencies; // 将依赖记录到factory函数上
    factories[moduleName] = factory;
}
function _require(mods, callback) {
    var ret = mods.map(function (mod) {
        var factory = factories[mod];
        // 处理依赖，重新require一次，执行工厂函数返回参数值
        var dependencies = factory.dependencies; // ['name']
        _require(dependencies, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // exports = factory(...args)
            exports = factory.apply(null, arguments);
        });
        return exports;
    });
    callback.apply(null, ret);
}
define('name', [], function () {
    return 'amd';
});
define('age', ['name'], function (name) {
    return 10 + name;
});
_require(['age'], function (age) {
    console.log(age, 'age');
});
