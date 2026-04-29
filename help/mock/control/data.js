/*
 * @Descripttion: Sustainable
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2023-01-05 14:18:41
 * @LastEditors: ~
 * @LastEditTime: 2026-04-07 10:00:28
 */

/**
 * 天气
 */
const require = (path) => {
  const weather = 'www.baidu.com/'; //"@/assets/weather/"
  return weather + path;
};

const weatherList = [
  { id: 1, name: '晴', url: require('@/assets/weather/weather01.png') },
  { id: 2, name: '少云', url: require('@/assets/weather/weather02.png') },
  { id: 3, name: '晴间多云', url: require('@/assets/weather/weather03.png') },
  { id: 4, name: '多云', url: require('@/assets/weather/weather04.png') },
  { id: 5, name: '阴', url: require('@/assets/weather/weather05.png') },
  { id: 6, name: '有风', url: require('@/assets/weather/weather06.png') },
  { id: 7, name: '平静', url: require('@/assets/weather/weather07.png') },
  { id: 8, name: '微风', url: require('@/assets/weather/weather08.png') },
  { id: 9, name: '和风', url: require('@/assets/weather/weather09.png') },
  { id: 10, name: '清风', url: require('@/assets/weather/weather10.png') },
  { id: 11, name: '强风/劲风', url: require('@/assets/weather/weather11.png') },
  { id: 12, name: '疾风', url: require('@/assets/weather/weather12.png') },
  { id: 13, name: '大风', url: require('@/assets/weather/weather13.png') },
  { id: 14, name: '烈风', url: require('@/assets/weather/weather14.png') },
  { id: 15, name: '风暴', url: require('@/assets/weather/weather15.png') },
  { id: 16, name: '狂爆风', url: require('@/assets/weather/weather16.png') },
  { id: 17, name: '飓风', url: require('@/assets/weather/weather17.png') },
  { id: 18, name: '热带风暴', url: require('@/assets/weather/weather18.png') },
  { id: 19, name: '霾', url: require('@/assets/weather/weather19.png') },
  { id: 20, name: '中度霾', url: require('@/assets/weather/weather20.png') },
  { id: 21, name: '重度霾', url: require('@/assets/weather/weather21.png') },
  { id: 22, name: '严重霾', url: require('@/assets/weather/weather22.png') },
  { id: 23, name: '阵雨', url: require('@/assets/weather/weather23.png') },
  { id: 24, name: '雷阵雨', url: require('@/assets/weather/weather24.png') },
  {
    id: 25,
    name: '雷阵雨并伴有冰雹',
    url: require('@/assets/weather/weather25.png'),
  },
  { id: 26, name: '小雨', url: require('@/assets/weather/weather26.png') },
  { id: 27, name: '中雨', url: require('@/assets/weather/weather27.png') },
  { id: 28, name: '大雨', url: require('@/assets/weather/weather28.png') },
  { id: 29, name: '暴雨', url: require('@/assets/weather/weather29.png') },
  { id: 30, name: '大暴雨', url: require('@/assets/weather/weather30.png') },
  { id: 31, name: '特大暴雨', url: require('@/assets/weather/weather31.png') },
  { id: 32, name: '强阵雨', url: require('@/assets/weather/weather32.png') },
  { id: 33, name: '强雷阵雨', url: require('@/assets/weather/weather33.png') },
  { id: 34, name: '极端降雨', url: require('@/assets/weather/weather34.png') },
  {
    id: 35,
    name: '毛毛雨/细雨',
    url: require('@/assets/weather/weather35.png'),
  },
  { id: 36, name: '雨', url: require('@/assets/weather/weather36.png') },
  { id: 37, name: '小雨-中雨', url: require('@/assets/weather/weather37.png') },
  { id: 38, name: '中雨-大雨', url: require('@/assets/weather/weather38.png') },
  { id: 39, name: '大雨-暴雨', url: require('@/assets/weather/weather39.png') },
  {
    id: 40,
    name: '暴雨-大暴雨',
    url: require('@/assets/weather/weather40.png'),
  },
  {
    id: 41,
    name: '大暴雨-特大暴雨',
    url: require('@/assets/weather/weather41.png'),
  },
  { id: 42, name: '雨雪天气', url: require('@/assets/weather/weather42.png') },
  { id: 43, name: '雨夹雪', url: require('@/assets/weather/weather43.png') },
  { id: 44, name: '阵雨夹雪', url: require('@/assets/weather/weather44.png') },
  { id: 45, name: '冻雨', url: require('@/assets/weather/weather45.png') },
  { id: 46, name: '雪', url: require('@/assets/weather/weather46.png') },
  { id: 47, name: '阵雪', url: require('@/assets/weather/weather47.png') },
  { id: 48, name: '小雪', url: require('@/assets/weather/weather48.png') },
  { id: 49, name: '中雪', url: require('@/assets/weather/weather49.png') },
  { id: 50, name: '大雪', url: require('@/assets/weather/weather50.png') },
  { id: 51, name: '暴雪', url: require('@/assets/weather/weather51.png') },
  { id: 52, name: '小雪-中雪', url: require('@/assets/weather/weather52.png') },
  { id: 53, name: '中雪-大雪', url: require('@/assets/weather/weather53.png') },
  { id: 54, name: '大雪-暴雪', url: require('@/assets/weather/weather54.png') },
  { id: 55, name: '浮尘', url: require('@/assets/weather/weather55.png') },
  { id: 56, name: '扬沙', url: require('@/assets/weather/weather56.png') },
  { id: 57, name: '沙尘暴', url: require('@/assets/weather/weather57.png') },
  { id: 58, name: '强沙尘暴', url: require('@/assets/weather/weather58.png') },
  { id: 59, name: '龙卷风', url: require('@/assets/weather/weather59.png') },
  { id: 60, name: '雾', url: require('@/assets/weather/weather60.png') },
  { id: 61, name: '浓雾', url: require('@/assets/weather/weather61.png') },
  { id: 62, name: '强浓雾', url: require('@/assets/weather/weather62.png') },
  { id: 63, name: '轻雾', url: require('@/assets/weather/weather63.png') },
  { id: 64, name: '大雾', url: require('@/assets/weather/weather64.png') },
  { id: 65, name: '特强浓雾', url: require('@/assets/weather/weather65.png') },
  { id: 66, name: '热', url: require('@/assets/weather/weather66.png') },
  { id: 67, name: '冷', url: require('@/assets/weather/weather67.png') },
  { id: 68, name: '未知', url: require('@/assets/weather/weather68.png') },
];

/**
 * 随机数
 * @param {*个数} n
 * @param {*进位值} k 默认10
 * @returns
 */
export function getNumber(n, k) {
  let num = [];
  for (let index = 0; index < n; index++) {
    num.push(Math.ceil(Math.random() * (k ? k : 10)));
  }
  return num;
}

/**
 * 补0
 * @param {*0数} n
 * @returns
 */
export function getDataInit(n) {
  let arr = [];
  for (let index = n; index > 0; index--) {
    arr.push(0);
  }
  return arr;
}

const numinit = [0, 0, 0, 0, 0, 0, 0, 0];
export const datas = numinit;
export const dataInit = numinit.slice(0, 7);

const dataNull = ['', '', '', '', '', '', '', ''];
export const dataNulls = dataNull;
export const dataNullInit = dataNull.slice(0, 7);

const dataDefault = () => {
  return {
    // 一次填入实际利率：circulation=4
    text: 'text',
  };
};

/**
 * 应用使用情况数据
 * @returns
 */
const usageApplicationData = () => {
  return [
    {
      title: '活跃用户',
      data: [
        { name: '日活', value: '-', unit: '人' },
        { name: '月活', value: '-', unit: '人' },
      ],
    },
    {
      title: '留存率',
      data: [
        { name: '次日', value: '-', loginValue: 0, unit: '人' },
        { name: '7日', value: '-', loginValue: 0, unit: '人' },
        { name: '14日', value: '-', loginValue: 0, unit: '人' },
      ],
    },
    {
      title: '在线时长',
      data: [
        {
          name: '日均',
          value: '- m - s',
        },
        {
          name: '月均',
          value: '- m - s',
        },
        {
          name: '年均',
          value: '- m - s',
        },
      ],
    },
    {
      title: '会员常看',
      data: [
        { name: '血糖分析', value: '- 次/ - s' },
        { name: '健康周报', value: '- 次/ - s' },
        { name: '饮食分析', value: '- 次/ - s' },
      ],
    },
  ];
};

/**
 * 色值颜色
 * 近十天指标趋势色值
 * @param {*number} k 色值透明度
 * @returns
 */
const color_tone = (k) => {
  let op = k ? k : 1;
  return [
    `rgba(235,151,113,${op})`,
    `rgba(112,178,242,${op})`,
    `rgba(109,195,102,${op})`,
    `rgba(108,126,240,${op})`,
    `rgba(247,194,54,${op})`,
    `rgba(190,69,226,${op})`,
  ];
};

/**
 * 开屏天气
 * @returns
 */
const openWeather = () => {
  return [
    {
      value: 'wea',
      label: '天气',
      children: [
        {
          value: 'xue',
          label: '雪',
        },
        {
          value: 'lei',
          label: '雷',
        },
        {
          value: 'shachen',
          label: '沙尘',
        },
        {
          value: 'bingbao',
          label: '冰雹',
        },
        {
          value: 'wu',
          label: '雾',
        },
        {
          value: 'yun',
          label: '云',
        },
        {
          value: 'yu',
          label: '雨',
        },
        {
          value: 'yin',
          label: '阴',
        },
        {
          value: 'qing',
          label: '晴',
        },
      ],
    },
    {
      value: 'festival',
      label: '节日',
      children: [
        {
          value: 'newYear',
          label: '元旦',
        },
        {
          value: 'springFestival',
          label: '春节',
        },
        {
          value: 'pureBrightness',
          label: '清明',
        },
        {
          value: 'labour',
          label: '劳动',
        },
        {
          value: 'dragonBoatFestival',
          label: '端午',
        },
        {
          value: 'midAutumn',
          label: '中秋',
        },
        {
          value: 'national',
          label: '国庆',
        },
        {
          value: 'sweetDumplings',
          label: '元宵',
        },
        {
          value: 'qixiFestival',
          label: '七夕',
        },
        {
          value: 'doubleNinthFestival',
          label: '重阳',
        },
      ],
    },
    {
      value: 'solar_terms',
      label: '节气',
      children: [
        {
          value: 'springBegins',
          label: '立春',
        },
        {
          value: 'rainwater',
          label: '雨水',
        },
      ],
    },
    {
      value: 'emotion',
      label: '情绪',
      children: [
        {
          value: 'positive',
          label: '积极情绪',
        },
        {
          value: 'anxiety',
          label: '焦虑倾向',
        },
      ],
    },
  ];
};

/**
 * 根据数组获取 色值
 * @param {*数组} indicator
 * @returns
 */
const marke_tone = (indicator) => {
  let marke = {};
  let cs = color_tone();
  let cs1 = color_tone(0.3);
  return indicator_cs(indicator, marke, cs, cs1);
};

/**
 * @param {*数组或数值} indicator
 * @param {*返回Html} marke
 * @param {*色值1} arrcs
 * @param {*色值2} arrcs1
 * @returns
 */
const indicator_cs = (indicator, marke, arrcs, arrcs1) => {
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
 * 性别类型
 */
const sexType = [
  { value: '1', label: '男' },
  { value: '0', label: '女' },
];

/**
 * 订单信息
 * @returns
 */
const orderInfor = () => {
  return {
    orderNum: 0,
    total: 0,
    subsidy: 0,
    blance: 0,
    discount: 0,
    actual: 0,
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
  const { uri, IsWeb } = obj;
  const URL = `${PORT}`;
  if (uri) {
    return `${uri}/${PORT}`;
  }
  const ISDEV =
    window.location.host.indexOf('localhost') > -1 ||
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1;
  let weburi = IsWeb ? 'app/v3/' : '';
  if (ISDEV) {
    return `https://dev.seer-health.com/${weburi}${URL}`;
  } else {
    const web = IsWeb ? 'www' : 'api';
    weburi = IsWeb ? 'web/' : '';
    return `https://${web}.seer-health.com/${weburi}${URL}`;
  }
};

/**
 * 返回上传api
 * type：VIDEO视频 VIDEO_IMG图片
 * @param {*boole} VIDEO true视频 false图片
 * @param {*boole} FOXMOCK 是否FOXMOCK api
 * @returns
 * 不管是什么类型都可以上传,但是类型仅仅两个VIDEO/VIDEO_IMG
 */
const uploadFileAPI = ({
  API = 'portal/nAdv/uploadFile',
  VIDEO = false,
  FOXMOCKAPI = false,
  resourcesType,
} = {}) => {
  const env = import.meta.env.VITE_APP_BASE_API;
  let type = VIDEO ? 'VIDEO' : 'VIDEO_IMG';
  if (resourcesType) {
    type = resourcesType;
  }
  let url = API;
  if (FOXMOCKAPI) {
    url = 'https://apifoxmock.com/m1/2830432-1213733-default/post';
  } else {
    url = `${env}${API}`;
  }
  return `${url}?type=${type}`;
};

const uploadFileAPI1 = ({
  API = 'portal/nAdv/uploadFile',
  VIDEO = false,
  FOXMOCKAPI = false,
  resourcesType,
} = {}) => {
  console.log(import.meta.env.VITE_APP_BASE_API);

  let type = VIDEO ? 'VIDEO' : 'VIDEO_IMG';
  if (resourcesType) {
    type = resourcesType;
  }
  let url = API;
  if (FOXMOCKAPI) {
    url = 'https://apifoxmock.com/m1/2830432-1213733-default/post';
  } else if (
    window.location.host.indexOf('localhost') > -1 ||
    window.location.host.indexOf('dev.seer-health') > -1 ||
    window.location.host.indexOf('192.168.10.') > -1
  ) {
    //dev
    url = `https://dev.seer-health.com/v1/${API}`;
  } else {
    //api
    url = `https://api.seer-health.com/v1/${API}`;
  }
  return `${url}?type=${type}`;
};

/**
 * @description: 成功数据状态
 */
const SUCCESS_STATUSES = new Set([200, 0, true]);

/**
 * 模块控制：显示模块
 */
const ModuleControl = {
  Dome1: ['key'],
  Dome2: ['key1', 'key2'],
};

export default {
  ModuleControl,
  SUCCESS_STATUSES,
  //业务数据
  uploadFileAPI,
  actionPort,
  orderInfor,
  sexType,
  marke_tone,
  usageApplicationData,
  color_tone,
  openWeather,
  dataDefault,
  dataNullInit,
  weatherList,
  getNumber,
};
