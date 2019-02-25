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
    factories[moduleName] = factory;
}
function _require(mods, callback) {
    var ret = mods.map(function (mod) { return factories[mod](); });
    callback.apply(null, ret);
}
define('name', [], function () {
    return 'amd';
});
define('age', [], function () {
    return 10;
});
_require(['name', 'age'], function (name, age) {
    console.log(name, 'name');
    console.log(age, 'age');
});
