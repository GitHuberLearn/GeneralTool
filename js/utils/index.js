/**
 * Created by PanJiaChen on 16/11/18.
 * 来源bus-utils
 * updateNewRemove：新项目移除此方式
 * 实时更新方法
 */
// import moment from 'moment';
// import 'echarts-gl';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import Highcharts3D from 'highcharts/highcharts-3d';
// import HighchartsNoData from 'highcharts/modules/no-data-to-display';
// import HighStock from 'highcharts/highstock';
// import solidGauge from 'highcharts/modules/solid-gauge';
// import variable from 'highcharts/modules/variable-pie';
// import cylinder from 'highcharts/modules/cylinder';
// import XEUtils from 'xe-utils';
// HighchartsMore(Highcharts);
// Highcharts3D(Highcharts);
// HighchartsNoData(Highcharts);
// solidGauge(Highcharts);
// variable(Highcharts);
// cylinder(Highcharts);
// import help from '@/help';
// const help = import(`${cube.gatewayURL_module}/help/index.js`);

// console.log(help);

/**
 *
 * @param {*Object} param 对象参数
 * 默认：
 * db项目：item = "item",
 * 项目子项目list = "list",
 * 限权permission = "readonly"取readwrite、readonly
 * @returns
 */
const initIndexDB = async ({
  item = 'item',
  list = 'list',
  permission = 'readonly',
}) => {
  const openDB = async (item, list) => {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB is not supported by this browser.');
      return;
    }
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(item, 2);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(list, {
          keyPath: 'id',
          autoIncrement: true,
        });
      };
    });
  };
  const db = await openDB(item, list);
  const tx = db.transaction([list], permission);
  const store = tx.objectStore(list);
  return store;
};
/**
 * 数字转汉字
 * @param {*Number} num
 * @returns 汉字
 */
export function numToChinese(num) {
  const transNum = Number(num);
  // 检查是否为非负整数
  if (Number.isInteger(transNum) && transNum >= 0) {
    // 定义数字和单位的汉字表示
    const chineseNum = [
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
    ];
    const chineseUnit = ['', '十', '百', '千'];

    // 辅助函数：将小于1000的数转换为汉字
    function convertToChineseBelowThousand(num) {
      if (num === 0) return '零';
      let str = '';
      const parts = num.toString().split('');
      for (let i = 0; i < parts.length; i++) {
        const digit = parseInt(parts[i], 10);
        const unit = chineseUnit[parts.length - i - 1];
        if (digit !== 0) {
          str += chineseNum[digit] + unit;
        } else if (str && str !== '零' && unit) {
          // 只在非零数字后面且存在单位时添加'零'
          str += chineseNum[0];
        }
      }
      // 去掉末尾可能多余的'零'
      if (str.endsWith(chineseNum[0])) {
        str = str.slice(0, -1);
      }
      return str;
    }

    // 将万以上的数字分割为万和以下的数字部分
    const wanPart = Math.floor(num / 10000);
    const lessThanWanPart = num % 10000;

    let result = '';
    if (wanPart > 0) {
      result += convertToChineseBelowThousand(wanPart) + '万';
    }
    if (lessThanWanPart > 0) {
      result += convertToChineseBelowThousand(lessThanWanPart);
    }

    return result;
  } else {
    return '输入的数字必须是非负整数';
  }
}

/**
 * 一般查询重置
 * @param {object} param：*that：this,refName:queryForm(默认)
 */
export function resetForm({ that, refName = 'queryForm' }) {
  if (that.$refs[refName]) {
    that.$refs[refName].resetFields();
  }
}

/**
 * 3D柱状XYZ数据处理
 * @param {*坐标数据} data = {*value,*data,color}
 *                      *value[String]:作为X轴 category
 *                      *data [Arry]：{*name,*value,color}
 *                              *name作为Y轴 category
 *                              *value[Number]:作为Z值
 * @returns
 */
//数据结构参考 help -> mock -> data -> echart3DBar
export function XYZ(data) {
  const Ydata = (data) => {
    let maxArr = data.reduce((pre, next) => {
      return pre.data.length > next.data.length ? pre : next;
    });
    let arr = [];
    maxArr.data.forEach((item) => {
      arr.push({
        value: item.name,
        color: item.color ? item.color : null, //设置y轴颜色
      });
    });
    return arr;
  };
  // 5x 5y（category = 5*5）z值（vule）
  const Zdata = (XY) => {
    const { x, y } = XY;
    let z = [],
      max = 0;
    x.forEach((item, i) => {
      y.forEach((items, j) => {
        const number = item.data.filter((i) => i.name === items.value)[0];
        const value = number && number.value ? number.value : 0;
        z.push([i, j, value]);
        max += value;
      });
    });

    return { z, max };
  };
  const XY = {
    x: data,
    y: Ydata(data),
  };
  const { z, max } = Zdata(XY);
  return {
    ...XY,
    z,
    max,
  };
}

/**
 * 数组对象排列
 * @param {*数组} arrObj Array
 * @param {*Key} prop String 按照对象Key排序
 * @param {*是否反向} falg Blooleans 默认正向（从小到大）
 * @returns Array 默认从小到大的排序
 */
export function compare(arrObj, key, falg) {
  let list = JSON.parse(JSON.stringify(arrObj));
  const sort_fun = function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      const max = falg ? -1 : 1;
      if (val1 < val2) {
        return -max;
      } else if (val1 > val2) {
        return max;
      } else {
        return 0;
      }
    };
  };
  return list.sort(sort_fun(key));
}

/**
 * 定时器
 * @param {*} fn
 * @param {*} time 默认5分钟
 * @returns
 */
export function setInter_time(fn, time) {
  fn();
  time = 1000 * (time ? time : 5 * 60);
  return setInterval(() => {
    fn();
  }, time);
}
export function setClear_time(TIMECLEAR) {
  clearInterval(TIMECLEAR);
}

/**
 * @param {*数值} cellValue
 * @param {*小数位数} n (默认2位)
 * @returns 保留小数点，符合四舍五入（有就保留，没有就不保留）
 */
export function formatterFloat(cellValue, n) {
  const d = n ? n : 2;
  return parseFloat(parseFloat(cellValue).toFixed(d));
}

/**
 * 精确四舍五入到指定位数
 * @param {number} num - 需要处理的数字
 * @param {number} decimals - 保留的小数位数（默认2位）
 * @returns {number} 返回四舍五入后的数字
 */
export const roundToDecimal = (num, decimals = 2) => {
  if (isNaN(num) || isNaN(decimals)) {
    throw new Error('参数必须是数字');
  }
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

/**
 * @param {*年数} n/num 正数后几年，负数前几个月 默认本年
 *                obj{time,num} time:时间
 * @param {*时间类型} type 默认yyyy
 * @returns n个月月份
 */
export function getRecentYear(news, type) {
  const time = XEUtils.isObject(news) ? news.time : new Date();
  const num = XEUtils.isObject(news) ? news.num : news;
  let month = XEUtils.getWhatYear(time, num);
  type = type ? type : 'yyyy';
  return XEUtils.toDateString(month, type);
}

/**
 * 获取月份
 * @param {Object} news 月数{time:时间,num：正数后几个月，负数前几个月 默认本月}
 * @param {String} type 默认yyyy-MM
 * @returns n个月月份
 * updateNewRemove
 */
export function getRecentMonth(news, type) {
  const time = XEUtils.isObject(news) ? news.time : new Date();
  const num = XEUtils.isObject(news) ? news.num : news;
  let month = XEUtils.getWhatMonth(time, num);
  type = type ? type : 'yyyy-MM';
  return XEUtils.toDateString(month, type);
}
/**
 * 获取自定义月份
 * @param {Object} param
 * news 月数{time:时间,num：正数后几个月，负数前几个月 默认本月}
 * type 默认yyyy-MM
 * @returns n个月月份
 */
export function getCustomMonth(param) {
  const { news = null, type = 'yyyy-MM' } = param
    ? param
    : { news: null, type: 'yyyy-MM' };
  const time = news?.time ? news.time : new Date();
  const num = news?.num ? news.num : news;
  let month = XEUtils.getWhatMonth(time, num);
  return XEUtils.toDateString(month, type);
}

/**
 * @param {*天数} n 正数后几个天，负数前几个天 默认本天
 * @param {*时间类型} type 默认yyyy-MM-dd
 * @returns n天数
 * updateNewRemove
 */
// js 模拟
const XEUtils = {
  getWhatDay: function (time, n) {
    const date = new Date(time);
    date.setDate(date.getDate() + n);
    return date;
  },
  toDateString: function (date, type) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (type === 'yyyy') {
      return `${year}`;
    } else if (type === 'yyyy-MM') {
      return `${year}-${month}`;
    } else if (type === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    } else {
      return date.toString();
    }
  },
};
export function getRecentDate(n, type) {
  let day = XEUtils.getWhatDay(new Date(), n);
  type = type ? type : 'yyyy-MM-dd';
  return XEUtils.toDateString(day, type);
}
/**
 * 获取自定义时间
 * @param {*Object} param
 * n 正数后几个天，负数前几个天 默认本天
 * type 默认yyyy-MM-dd
 * @returns n天数
 */
export function getCustomDate(param) {
  const { n = 0, type = 'yyyy-MM-dd' } = param
    ? param
    : { n: 0, type: 'yyyy-MM-dd' };
  let day = XEUtils.getWhatDay(new Date(), n);
  return XEUtils.toDateString(day, type);
}

/**
 * @param {出生年月} birthday
 * @returns 年龄
 */
export function age_cofig(birthday) {
  let age = '--';
  if (birthday) {
    const date = new Date().getFullYear();
    age = date - birthday.split('-')[0];
  }
  return age;
}

/**
 * @param {*Date} startTime 开始时间
 * @param {*Date} endTime 结束时间
 * @returns 时间区间min
 */
export function timeSection(startTime, endTime) {
  if (!startTime || !endTime) return;
  const section = (new Date(endTime) - new Date(startTime)) / (1000 * 60);
  return section;
}

/**
 * 格式化时间
 * @param {Date|number|string} time - Date对象、时间戳或可解析的时间字符串
 * @param {string} [cFormat='{y}-{m}-{d} {h}:{i}:{s} {a}'] - 自定义格式，如 '{y}-{m}-{d}'
 * @returns {string|null} 格式化后的时间字符串，无效输入返回 null
 */
export function parseTime(time, cFormat) {
  // 1. 处理无效输入
  if (!time) return null;

  // 2. 统一转换为 Date 对象
  let date;
  if (time instanceof Date) {
    date = time;
  } else if (typeof time === 'number' || typeof time === 'string') {
    date = new Date(time);
    // 处理无效日期（如非法时间戳或字符串）
    if (isNaN(date.getTime())) return null;
  } else {
    return null;
  }

  // 3. 预定义格式化对象（避免每次调用重复创建）
  const formatObj = {
    y: date.getFullYear(),
    m: String(date.getMonth() + 1).padStart(2, '0'),
    d: String(date.getDate()).padStart(2, '0'),
    h: String(date.getHours()).padStart(2, '0'),
    i: String(date.getMinutes()).padStart(2, '0'),
    s: String(date.getSeconds()).padStart(2, '0'),
    a: date.getDay(), // 星期几（0-6）
  };

  // 4. 替换格式占位符
  return cFormat.replace(/\{([ymdhisa])\}/g, (match, key) => {
    if (key === 'a') {
      return `星期${['日', '一', '二', '三', '四', '五', '六'][formatObj.a]}`;
    }
    return formatObj[key];
  });
}

/**
 * 对uniapp不兼容
 */
export function parseTime1(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * 时间状态
 * @param  {new Date|*string|number} time
 * @param {string} option
 *  大于一天情况，存在优先返回时间格式
 * @returns {string} 距离当下时间状态
 */
export const formatTime = (time, option) => {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;
  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
};

/**
 * 时间戳处理
 * @param {string|number} time  时间戳 默认当前
 * @returns new Date
 */
export function timestampProcessing(time) {
  //转换Number
  if (typeof time === 'string') {
    if (/^[0-9]+$/.test(time)) {
      // support "1548221490638"
      time = parseInt(time);
    } else {
      // support safari
      // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
      time = time.replace(new RegExp(/-/gm), '/');
    }
  }
  //时间戳可能是10位数的秒级需要乘以1000
  if (typeof time === 'number' && time.toString().length === 10) {
    time = time * 1000;
  }
  return time ? new Date(time) : new Date();
}

/**
 * @param {string} url
 * @returns {Object}
 */
export const param2Obj = (url) => {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
};

/**
 * 环境地址
 * @param {路由地址} PORT
 * @returns  返回当前环境地址
 */
export function actionPort(PORT, uri) {
  const URL = `${PORT}`;
  if (uri) {
    return `${uri}/${PORT}`;
  }
  const ISDEV =
    window.location.host.indexOf('localhost') > -1 ||
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1;
  if (ISDEV) {
    return `https://dev.seer-health.com/${URL}`;
  } else {
    return `https://api.seer-health.com/${URL}`;
  }
}

/**
 * 图片上传地址
 * 本地无法测试-可以用actionUrl2避免
 * @returns {string}
 */
export const actionUrl = () => {
  if (window.location.host.indexOf('localhost') > -1) {
    // return '/dev-api/api/common/v1/uploadAttachment/'
    return 'https://dev.seer-health.com/v1/mall/api/common/v1/uploadAttachment/';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    return 'https://dev.seer-health.com/v1/mall/api/common/v1/uploadAttachment/';
  } else {
    return 'https://api.seer-health.com/v1/mall/api/common/v1/uploadAttachment/';
  }
};

/**
 * 被uploadAPI替换
 */
export const actionUrl2 = () => {
  if (window.location.host.indexOf('localhost') > -1) {
    return '/portal-api/nAdv/uploadFile';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    return 'https://dev.seer-health.com/v1/portal/nAdv/uploadFile';
  } else {
    return 'https://api.seer-health.com/v1/portal/nAdv/uploadFile';
  }
};

/**
 * 返回上传api
 * type：VIDEO视频 VIDEO_IMG图片
 * @param {*boole} VIDEO true视频 false图片
 * @param {*boole} FOXMOCK 是否FOXMOCK api
 * @returns
 */
const uploadFileAPI = (VIDEO, FOXMOCKAPI) => {
  const type = VIDEO ? 'VIDEO' : 'VIDEO_IMG';
  let url = null;
  if (FOXMOCKAPI) {
    url = '/webui-apifoxmock-api/post';
  } else if (window.location.host.indexOf('localhost') > -1) {
    url = '/portal-api/nAdv/uploadFile';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    url = 'https://dev.seer-health.com/v1/portal/nAdv/uploadFile';
  } else {
    url = 'https://api.seer-health.com/v1/portal/nAdv/uploadFile';
  }
  return `${url}?type=${type}`;
};

export const actionUrl3 = () => {
  if (window.location.host.indexOf('localhost') > -1) {
    return 'https://dev.seer-health.com/v1/dealer/amusingFood/uploadFoodConfigUrl';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    return 'https://dev.seer-health.com/v1/dealer/amusingFood/uploadFoodConfigUrl';
  } else {
    return 'https://api.seer-health.com/v1/dealer/amusingFood/uploadFoodConfigUrl';
  }
};

export const actionUrl4 = () => {
  if (window.location.host.indexOf('localhost') > -1) {
    return 'https://dev.seer-health.com/v1/seer-consultation/file/uploadImg';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    return 'https://dev.seer-health.com/v1/seer-consultation/file/uploadImg';
  } else {
    return 'https://api.seer-health.com/v1/seer-consultation/file/uploadImg';
  }
};

export const bgFunUrl = () => {
  if (window.location.host.indexOf('localhost') > -1) {
    return 'https://dev.seer-health.com/v1/platform/personalReportForm/reportForm?userId=';
  } else if (
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    return 'https://dev.seer-health.com/v1/platform/personalReportForm/reportForm?userId=';
  } else {
    return 'https://api.seer-health.com/v1/platform/personalReportForm/reportForm?userId=';
  }
};

/**
 * 深拷贝
 * @returns {}
 */
export function deepCopy(obj, hash = new WeakMap()) {
  if (hash.has(obj)) return hash.get(obj);
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);
  for (const key in obj) {
    cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
  }
  return cloneObj;
}
export function isObj(obj) {
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
}

/**
 * 睡眠函数
 * @param {延迟时间} ms
 * @returns
 */
export function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * 对象判空
 * empty：false非空，true空
 */
export const emptyObj = (obj) => {
  for (const key in obj) {
    return false;
  }
  return true;
};

/**
 * 判定是否对象
 * empty：false不是，true是
 */
export const isObject = (obj) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

/**
 * 数值千分位分隔符、保留小数点，符合四舍五入（有就保留，没有就不保留）
 * @param {*数值} cellValue
 * @param {*小数位数} n (默认三位)
 * @returns
 */
export function formatterNum(cellValue, n) {
  const fs = cellValue.toString().split('.')[1];
  const len = fs ? fs.length : 0;
  const d = n ? n : 3;
  const digits = len > d ? d : len;
  return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits });
}

/**
 * Echarts 初始化
 */
export const initEchart = (echart, config, bg, color) => {
  if (!config) {
    config = echartsNoData(bg, color);
  }
  echart.setOption(config);
  return false;
};

/**
 * echarts 无数据
 */
export const echartsNoData = (bg, color) => {
  let text = bg ? '' : '暂无数据';
  return {
    title: {
      text,
      x: 'center',
      y: 'center',
      textStyle: NoDataStyle(color),
    },
  };
};

/**
 * Hchart 初始化
 */
export const initHchart = (el, config, bgs, flag) => {
  if (!config) {
    if (el) {
      config = highchartsNoData(bgs);
    } else {
      let { bg, el } = bgs;
      config = highchartsNoData(bg, el);
    }
  }
  if (el) {
    if (flag) {
      HighStock.chart(el, config);
    } else {
      Highcharts.chart(el, config);
    }
  } else {
    //多个类
    if (flag) {
      HighStock.chart(config);
    } else {
      Highcharts.chart(config);
    }
  }
  // else {
  //     document.getElementById(el).innerHTML = "";
  //     document.getElementById(el).backgroundImage = 'none'
  // }
  return false;
};
/**
 * highchart 无数据
 */
export const highchartsNoData = (bg, el) => {
  let text = bg ? '' : '暂无数据';
  let chart = { backgroundColor: 'none' };
  if (el) {
    chart.renderTo = el;
  }
  return {
    chart,
    credits: {
      enabled: false,
    },
    lang: {
      noData: '',
    },
    title: {
      text,
      y: 100,
      style: NoDataStyle(),
    },
  };
};

/**
 * @returns 无数据样式
 */
export const NoDataStyle = (c) => {
  let color = c === 'admin' ? '#6D6D6D' : '#3DF4F5';
  return {
    color,
    fontWeight: 'bold',
    fontSize: '1.2rem',
  };
};

/**
 * vue-seamless-scroll 无缝滚动
 * @param {*this} that
 * @param {*ref} dom
 * @param {*data} list
 * @returns
 * const { play, data } = tableMarqueeSeamless(this,'ref',res.data);
 * this.allData = data;
 * this.defineScroll.autoPlay = play;
 * this.defineScroll.hoverStop = play;
 * 使用此组件事件需要通过事件委托绑定到el-table-marquee-seamless,防止浅拷贝事件不生效问题
 */
export const tableMarqueeSeamless = (that, dom, list) => {
  let config = {
    play: false,
    data: list,
  };
  let tablexy = that.$refs[dom];
  if (!tablexy) return config;
  const divDataH = tablexy.$el.clientHeight;
  let table = that.$refs[`${dom}s`];
  const h =
    table.bodyWrapper.childNodes[0].childNodes[1].childNodes[0].clientHeight;
  const len = list.length * h;
  if (len > divDataH) {
    config.play = true;
    config.data = list;
    return config;
  } else {
    let n = 1,
      arr = [];
    while (divDataH - len > h * n) {
      arr.push({});
      n += 1;
    }
    config.data = [...list, ...arr];
    return config;
  }
};

/**
 * table 无缝滚动
 * @param {el} table
 * @param {data} list
 * @returns
 * @use this.allData = tableMarquee(this.$refs.table,res.data);
 */
export const tableMarquee = (table, list) => {
  if (!table) return;
  const divDataH = table.bodyWrapper.clientHeight;
  const h =
    table.bodyWrapper.childNodes[0].childNodes[1].childNodes[0].clientHeight;
  const len = list.length * h;
  if (len > divDataH) {
    marqueeInterval(table.bodyWrapper, len);
    return [...list, ...list];
  } else {
    let n = 1,
      arr = [];
    while (divDataH - len > h * n) {
      arr.push({});
      n += 1;
    }
    return [...list, ...arr];
  }
};
const marqueeInterval = (bodyWrapper, len) => {
  let tbTop = 0;
  const speedhq = 100;
  const marquehq = () => {
    if (tbTop <= -len) {
      tbTop = 0;
    } else {
      tbTop -= 1;
    }
    const dome = bodyWrapper.childNodes[0];
    // dome.style.transform = `translateY(${tbTop}px)`;//`translate(0,${tbTop}px)`
    // dome.style.transition = "all 1s";//all 0ms ease-in 0s
    dome.style.top = tbTop + 'px';
  };
  let timer = 0;
  timer = setInterval(marquehq, speedhq);
  const clearElement = (element) => {
    element.onmouseleave = function () {
      clearInterval(timer);
      timer = setInterval(marquehq, speedhq);
    };
    element.onmouseenter = function () {
      clearInterval(timer);
    };
  };
  clearElement(bodyWrapper);
  const this_dom = document.querySelectorAll('.popperBoxs .content');
  this_dom.forEach((element) => {
    clearElement(element);
  });
  return timer;
};

export const tableMarquees = (table, list) => {
  if (!table) return;
  const divDataH = table.bodyWrapper.clientHeight;
  const h =
    table.bodyWrapper.childNodes[0].childNodes[1].childNodes[0].clientHeight;
  const len = list.length * h;
  if (len > divDataH) {
    marqueeIntervals(table.bodyWrapper, len);
    return [...list, ...list];
  } else {
    let n = 1;
    while (divDataH > h * n) {
      list.push({});
      n += 1;
    }
    return list;
  }
};
const marqueeIntervals = (bodyWrapper, len) => {
  let tbTop = 0;
  const speedhq = 1;
  const marquehq = () => {
    if (tbTop <= -len) {
      tbTop = 0;
    } else {
      tbTop -= 0.36;
    }
    bodyWrapper.childNodes[0].style.top = tbTop + 'px';
  };
  let timers = 0;
  timers = setInterval(marquehq, speedhq);
  const clearElement = (element) => {
    element.onmouseleave = function () {
      clearInterval(timers);
      timers = setInterval(marquehq, speedhq);
    };
    element.onmouseenter = function () {
      clearInterval(timers);
    };
  };
  clearElement(bodyWrapper);
  const this_dom = document.querySelectorAll('.popperBoxs .content');
  this_dom.forEach((element) => {
    clearElement(element);
  });
  return timers;
};
/**
 * 姓名隐藏关键字
 * @param {*姓名} name
 * @returns
 */
export const toStartName = (name) => {
  if (!name) {
    return;
  }
  if (name.length > 2) {
    return name.substring(0, 1) + '*' + name.substring(1 + 1);
  } else if (name.length === 2) {
    return name.substring(0, 1) + '*';
  } else {
    return name;
  }
};

/**
 * @param {*数组或数值} indicator
 * @param {*返回Html} marke
 * @param {*色值1} arrcs
 * @param {*色值2} arrcs1
 * @returns
 */
export const indicator_cs = (indicator, marke, arrcs, arrcs1) => {
  let s = 0;
  let num = indicator instanceof Array ? indicator.length : indicator;
  let cs = [];
  let cs1 = [];
  for (let index = 0; index < num; index++) {
    s = s < arrcs.length ? s : 0;
    let key = `marke_${index}`;
    Object.assign(marke, {
      [key]: {
        width: 7,
        height: 7,
        borderRadius: 50,
        borderColor: cs1[s],
        borderWidth: 3,
        backgroundColor: cs[s],
      },
    });
    cs.push(arrcs[s]);
    cs1.push(arrcs1[s]);
    s++;
  }
  return { marke, cs, cs1 };
};

/**
 * 输入框只能输入正数、浮点数
 * @param {值} num
 * @returns
 */
export function oninput(num) {
  var str = num;
  var len1 = str.substr(0, 1);
  var len2 = str.substr(1, 1);
  // 如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 == 0 && len2 != '.') {
    str = str.substr(1, 1);
  }
  // 第一位不能是.
  if (len1 == '.') {
    str = '';
  }
  // 限制只能输入一个小数点
  if (str.indexOf('.') != -1) {
    var str_ = str.substr(str.indexOf('.') + 1);
    if (str_.indexOf('.') != -1) {
      str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
    }
  }
  // 正则替换
  str = str.replace(/[^\d^\.]+/g, ''); // 保留数字和小数点
  str = str.replace(/\.\d\d\d$/, ''); // 小数点后只能输两位
  return str;
}

/**
 * 移除00:00:00
 * @param {*} num
 * @returns
 */
export function toTimeString(val) {
  const t = val.split(' ');
  return t[1] === '00:00:00' ? t[0] : val;
}

//前8天的日期
const date = [
  parseTime(new Date() - 7 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 6 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 5 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 4 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 3 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 2 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 1 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
  parseTime(new Date() - 0 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
];
//前七天
export const dateFs = date.slice(0, 7);
//前七天含今天
export const dateNs = date.slice(1, 8);

//前5个月的月份
const months = [
  //   moment(new Date()).subtract(4, 'months').format('YYYY-MM'),
  //   moment(new Date()).subtract(3, 'months').format('YYYY-MM'),
  //   moment(new Date()).subtract(2, 'months').format('YYYY-MM'),
  //   moment(new Date()).subtract(1, 'months').format('YYYY-MM'),
  //   moment(new Date()).subtract(0, 'months').format('YYYY-MM'),
];
//前三个月含本月
export const monthNs = months.slice(2, 5);

//后台图片存放地址
export const imgBaseUrl = window.location.origin;

/**
 * 获取特定item
 * @param {*objct} param0 :list:数组, key：键, value：值
 * @returns
 */
const getKeyItem = ({ list, keyID, ID, key }) => {
  const item = list.filter((i) => i[keyID] === ID);
  if (item.length === 0) {
    list.forEach((item) => {
      if (item.child?.length > 0) {
        getKeyItem({ list: item.child, keyID, ID, key });
      }
    });
  }
  return item.length > 0 ? item[0][key] : '-';
};

/**
 * 循环获取下一个数组
 * @param {*object}
 * - arr：数组
 * - type：类型
 * @returns
 */
export function getNextArray({ arr, type }) {
  if (!arr) return;
  const next = arr.indexOf(type) + 1;
  const nextList = arr[next];
  return nextList ? nextList : arr[0];
}

/**
 * 判断手机号
 */
export const isValidPhoneNumber = (phone) => {
  // 中国大陆手机号正则：11位，以1开头，第二位通常是3-9
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * 手机号格式化
 * @param {String} phone 手机号
 * @returns {string} 格式化为 3-4-4 分组
 * @throws {TypeError} 如果参数无法转换为字符串
 */
const formatPhoneNumber = (phone) => {
  if (phone == null) {
    throw new TypeError('参数不能为 null 或 undefined');
  }
  if (typeof phone === 'object') {
    throw new TypeError('参数不能是对象');
  }
  const cleaned = String(phone).replace(/\D/g, '');
  const formatted = cleaned.replace(
    /^(\d{3})(\d{4})(\d{0,4})$/,
    (_, p1, p2, p3) => `${p1} ${p2}${p3 ? ` ${p3}` : ''}`,
  );
  return formatted;
};

/**
 * 手机号隐藏关键号
 * @param {*手机号} phone
 * @returns
 */
export const toStartCellphone = (phone) => {
  if (!phone) {
    return;
  }
  return `${phone.substring(0, 3)}****${phone.substring(7)}`;
};

/**
 * 复制文本到剪贴板
 * @param {String} context 复制的内容
 */
const copyToClipboard = (context) => {
  // 创建输入框元素
  const input = document.createElement('input');
  // 将想要复制的值
  input.value = context;
  // 页面底部追加输入框
  document.body.appendChild(input);
  // 选中输入框
  input.select();
  // 执行浏览器复制命令
  document.execCommand('Copy');
  // 复制后移除输入框
  input.remove();
};

export default {
  copyToClipboard,
  formatPhoneNumber,
  tableMarqueeSeamless,
  actionUrl,
  uploadFileAPI, //视频图片api
  getNextArray,
  getKeyItem,
  //...help,
  initIndexDB,
  compare,
  getRecentDate, //updateNewRemove
  getCustomDate,
  getRecentMonth, //updateNewRemove
  getCustomMonth,
  getRecentDate,
  getRecentYear,
  parseTime,
  bgFunUrl,
  age_cofig,
  resetForm,
};
