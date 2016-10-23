String.prototype.format = function (...args) {
  return this.replace(/\{(\d+)\}/g, function (m, i) {
    return args[i]
  })
}
