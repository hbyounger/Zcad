import './prototype'

if (process.env.__CLIENT__ !== true) {
  global.URLSearchParams = require('./URLSearchParams')
}
