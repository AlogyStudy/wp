
(function(modules) {
	function require(moduleId) {
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, require);
		return module.exports;
	}
	return require("./src/index.js");
})
({
  "./src/index.js":
    (function(module, exports, require) {
      eval(`"use strict";
var str = require('src\a.js');
require('src\index.css');
console.log(123);
`);
    })

    ,
        "src\a.js":
            (function(module, exports, require) {
                eval(`"use strict";
module.exports = 10;
`);
            })
    ,
        "src\index.css":
            (function(module, exports, require) {
                eval(`
        let style = document.createElement('style')
        style.innerHTML = "body {    background: tan;}"
        document.head.appendChild(style)
    `);
            })
    
});
