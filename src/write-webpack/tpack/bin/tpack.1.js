#! /usr/bin/env node

/**
 * tpack 打包工具 - 单个文件
 */
let fs = require('fs')
let ejs = require('ejs')

let entry = './src/index.js' // 入口文件
let output =  './dist/main.js' // 出口文件

let script = fs.readFileSync(entry, 'utf8')

let tmp = `
(function(modules) {
	function require(moduleId) {
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, require);
		return module.exports;
	}
	return require(require.s = "<%-entry%>");
})
({
  "<%-entry%>":
    (function(module, exports) {
      eval(\`<%-script%>\`);
    })
});
`

let result = ejs.render(tmp, {
    entry,
    script
})

fs.writeFileSync(output, result)
console.log('ok')
