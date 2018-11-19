// 本地存储
import storage from './storage';

const store = {};

// 本地local存储 方法名与key值对应表
const storeListLocal = {
  IsMillionType: 'isMillionType', // 是否是万元版 用于 小额 提额到 大额
  SmallOperator: 'smallOperator', // 小额运营商
  EntranceType: 'flagType', // TODO: 暂时没有用到 区分千元版 跟 体验版
  IsUpgrade: 'isUpgrade', // 是否提额
};

// 本地session存储 方法名与key值对应表
const storeListSession = {
  UserInfo: 'userInfo', // 用户信息
};

// 本地存储工厂函数，生成 set get remove 方法
const storeFactory = (funcName, key, storeType = 'local') => {
  store[`set${funcName}`] = data => {
    storage[storeType].setItem(key, data);
  };
  store[`get${funcName}`] = () => storage[storeType].getItem(key);
  store[`remove${funcName}`] = () => storage[storeType].removeItem(key);
};

// 循环添加 local 存储方法
Object.keys(storeListLocal).forEach(funName => {
  storeFactory(funName, storeListLocal[funName], 'local');
});

// 循环添加 session 存储方法
Object.keys(storeListSession).forEach(funName => {
  storeFactory(funName, storeListSession[funName], 'session');
});

export default store;
