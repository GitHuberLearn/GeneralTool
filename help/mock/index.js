import control from './control';
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
  ...control,
  successHaveData,
  openWeather,
  usageApplicationData,
  color_tone,
};
