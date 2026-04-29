/*
 * @Descripttion: Sustainable
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2026-04-01 16:54:48
 * @LastEditors: ~
 * @LastEditTime: 2026-04-29 11:18:30
 */
import data from './control/data.js';
import area from './control/area/index.js';

/**
 * @description: 判断 key 是否为成功状态（200、0 或 true）
 * @param {any} key - 待检查的值
 * @returns {boolean} 如果是 则返回 true，否则返回 false
 */
const SUCCESS_STATUSES = new Set([200, 0, true]);
const successStatus = (key) => SUCCESS_STATUSES.has(key); // 或 includes(key)
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
