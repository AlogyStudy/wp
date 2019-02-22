let a = require('./a')
import './index.css'
import './index.less'

console.log(a, 'aaa')
document.querySelector('#app').innerHTML = a

if (module.hot) {
    module.hot.accept()
} 
