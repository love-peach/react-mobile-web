const { localStorage, sessionStorage } = window;

// 组合使用构造函数模式和原型模式
function Storage(type) {
  this.staorageType = type;
}
Storage.prototype = {
  constructor: Storage,
  setItem(key, value) {
    this.staorageType.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    const value = this.staorageType.getItem(key);
    return JSON.parse(value);
  },
  clear() {
    this.staorageType.clear();
  },
  removeItem(key) {
    this.staorageType.removeItem(key);
  },
  multiGet(keys) {
    const values = {};
    keys.forEach(key => {
      values[key] = this.getItem(key);
    });
    return values;
  },
  multiRemove(keys) {
    keys.forEach(key => this.removeItem(key));
  },
};

const local = new Storage(localStorage);
const session = new Storage(sessionStorage);

export default {
  local,
  session,
};
