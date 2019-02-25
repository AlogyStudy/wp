"use strict";
var fs = require('fs');
function req(moduleName) {
    var content = fs.readFileSync(moduleName, 'utf8');
    // 最后一个参数是函数体
    var fn = new Function('exports', 'module', 'require', '__dirname', '__filename', content + '\n return module.exports');
    var module = {
        exports: {}
    };
    return fn(module.exports, module, req, __dirname, __filename);
    // function (module.exports, module, req, __dirname, __filename) {
    //     module.exports = 'commonjs'
    //     return module.exports
    // }
}
// let str = require('./a')
var str = req('./a.js');
console.log(str, 'str');
