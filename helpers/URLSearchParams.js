export default class URLSearchParams {
  constructor() {
    this._map = {}
  }

  append(key, value) {
    if (key === undefined || value === undefined) {
      throw new TypeError("append：参数不正确");
    }
    if (this.has(key)) {
      this._map[key].push(value)
    } else {
      this._map[key] = []
      this.append(key, value)
    }
  }

  delete(key) {
    if (key === undefined) {
      throw new TypeError("delete：参数不正确");
    }
    if (this.has(key)) {
      delete this._map[key]
    }
  }

  entries() {
    return this._map.entries()
  }

  get(key) {
    if (key === undefined) {
      throw new TypeError("get：参数不正确");
    }
    if (this.has(key) && this._map[key].length) {
      return this._map[key][0]
    }
    return null
  }

  getAll(key) {
    if (this.has(key)) {
      return this._map[key]
    }
    return []
  }

  has(key) {
    if (key === undefined) {
      throw new TypeError("has：参数不正确");
    }
    return key in this._map
  }

  toString() {
    const list = []
    for (let key in this._map) {
      const values = this._map[key]
      for (let i = 0, len = values.length; i < len; i++) {
        list.push(encodeURIComponent(key) + '=' + encodeURIComponent(values[i]))
      }
    }
  }
}
