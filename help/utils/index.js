/*
 * @Descripttion: 业务方法配置
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2024-05-13 20:33:24
 * @LastEditors: ~
 * @LastEditTime: 2026-04-07 09:59:54
 */
//import atlas from './control/atlas.js';
/**
 * 数据库
 * @param {*Object} data
 */
const dbKey = () => {
  return {
    item: 'SeerDB',
    list: 'userList',
    permission: 'readonly',
  };
};

/**
 * 滚动配置
 * @param {string} key
 * @returns
 */
const getScroll = () => {
  return {
    autoPlay: false,
    hoverStop: false, // 是否开启鼠标悬停stop
    step: 1, // 数值越大速度滚动越快,=<0.3却小存在闪动情况
    limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
    direction: 1, // 0向下 1向上 2向左 3向右
    openWatch: true, // 开启数据实时监控刷新dom
    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
    waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
  };
};

export default {
  //...atlas,
  //配置
  dbKey,
  getScroll,
};
