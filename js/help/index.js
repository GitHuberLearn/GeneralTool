/*
 * @Descripttion: Sustainable
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2023-01-05 14:18:41
 * @LastEditors: ~
 * @LastEditTime: 2024-12-05 15:28:52
 */
import mock from "./mock";
import requestApi from "./webApi/index";
/**
 * 性别类型
 */
const sexType = [
  { value: "1", label: "男" },
  { value: "0", label: "女" },
];
const orderInfor = () => {
  return {
    orderNum: 0,
    total: 0,
    subsidy: 0,
    blance: 0,
    discount: 0,
    actual: 0
  };
};

/**
 * 环境地址
 * @param {路由地址} PORT
 * @returns  返回当前环境地址
 */
/**
 * 
 * @param {*string} PORT 
 * @param {*object} obj 
 * @returns 
 */
const actionPort = (PORT, obj) => {
  /**
   * uri:其他路径
   * IsWeb:是否web，默认api
   */
  const { uri, IsWeb } = obj
  const URL = `${PORT}`
  if (uri) {
    return `${uri}/${PORT}`;
  }
  const ISDEV = window.location.host.indexOf("localhost") > -1 || window.location.host.indexOf("dev.seer-health") > -1 ||
    window.location.host.indexOf("192.168.10.") > -1
  let weburi = IsWeb ? 'app/v3/' : ''
  if (ISDEV) {
    return `https://dev.seer-health.com/${weburi}${URL}`;
  } else {
    const web = IsWeb ? 'www' : 'api'
    weburi = IsWeb ? 'web/' : ''
    return `https://${web}.seer-health.com/${weburi}${URL}`;
  }
}

/**
 * 数据库
 * @param {*Object} data 
 */
const dbKey = () => {
  return {
    item: "SeerDB",
    list: "userList",
    permission: "readonly",
  }
}

export default {
  ...requestApi,

  dbKey,
  ...mock,
  orderInfor,
  sexType,
  actionPort,
};
