#! /usr/bin/env node

/**
 * tpack 打包工具 - 处理依赖 和 添加loader
 */
let fs = require('fs')
let path = require('path')
let ejs = require('ejs')

let entry = './src/index.js' // 入口文件
let output =  './dist/main.js' // 出口文件

let script = fs.readFileSync(entry, 'utf8')

let modules = []
let styleLoader = function (source) { // 将结果进行更改，更改后继续编译
    // source 样式文件中的内容
    return `
        let style = document.createElement('style')
        style.innerHTML = ${JSON.stringify(source).replace(/\\r\\n/g, '')}
        document.head.appendChild(style)
    `
}

// 处理依赖关系
script = script.replace(/require\(['"](.+?)['"]\)/g, function ($0, $1) {
    let name = path.join('./src', $1)
    let content = fs.readFileSync(name, 'utf8')
    if (/\.css$/g.test(name)) {
        content = styleLoader(content)
    }
    modules.push({name, content})
    return `require('${name}')`
})

let tmp = `
(function(modules) {
	function require(moduleId) {
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, require);
		return module.exports;
	}
	return require("<%-entry%>");
})
({
  "<%-entry%>":
    (function(module, exports, require) {
      eval(\`<%-script%>\`);
    })

    <%for (let i = 0; i < modules.length; i++){
        let module = modules[i]%>,
        "<%-module.name%>":
            (function(module, exports, require) {
                eval(\`<%-module.content%>\`);
            })
    <%}%>
});
`

let result = ejs.render(tmp, {
    entry,
    script,
    modules
})

fs.writeFileSync(output, result)
console.log('ok')
