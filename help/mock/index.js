import data from './control/data.js';
import area from './control/area/index.js';

/**
 * 是否请求成功
 * @param {*String} key 成功返回值
 * @returns booleanValue
 */
const successStatus = (key) => {
  let suc = false;
  switch (key) {
    case 200:
      suc = true;
      break;
    case 0:
      suc = true;
      break;
  }
  return suc;
};
/**
 * 值存在
 * @param {*any} value 返回数据
 * @returns booleanValue
 */
const hasValue = (value) => {
  if (value === true) return true; // 直接处理 true
  if (!value) return false; // 处理 null/undefined/false/0/""/NaN 对于此种字符串可以根据实际情况直接传值false
  // 处理数字（包括字符串数字）
  if (typeof value === 'number' || /^\d+$/.test(value)) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num > 0;
  }
  if (typeof value === 'string' || Array.isArray(value))
    return value.length > 0; // 字符串/数组非空
  return typeof value === 'object' && Object.keys(value).length > 0; // 对象非空
};
/**
 * 成功请求且有数据验证
 * @param {*String} key  成功返回值
 * @param {*Object} data 返回数据
 * @returns {boolean}
 */
const successHaveData = (key, data) => {
  if (!data) return false;
  return successStatus(key) && hasValue(data);
};

export default {
  ...area,
  ...data,
  successHaveData,
};
