/*
 * @Descripttion: Sustainable
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2025-07-02 15:37:17
 * @LastEditors: ~
 * @LastEditTime: 2025-09-03 11:28:54
 */
import citymini from './area/cityPM.js';
import mapDataChina from './area/mapDataChina.js';

const dataDefault = () => {
  return {
    // 一次填入实际利率：circulation=4
    text: 'text',
  };
};

export default {
  dataDefault,
  ...mapDataChina,
  ...citymini,
};
