/*
 * @Descripttion: Sustainable
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2024-07-08 09:27:27
 * @LastEditors: ~
 * @LastEditTime: 2024-12-11 10:35:52
 */
import requestWebUI from './request.js';

const API = process.env.VUE_APP_BASE_API;
const BUSINESS = process.env.VUE_APP_WEBUI_API_BUSINESS;
const SEERREPORT = process.env.VUE_APP_BASE_API_SEER_REPORT;
const PORTA = process.env.VUE_APP_BASE_API_PORTAL;
const HEALTH = process.env.VUE_APP_BASE_API_HEALTH;
const COM = process.env.VUE_APP_BASE_API_COM;
const FOXMOCK = process.env.VUE_APP_WEBUI_API_FOXMOCK;
const REPORT = process.env.VUE_APP_BASE_API_REPORT;

export default {
  //请求源
  REPORT,
  FOXMOCK,
  COM,
  API,
  HEALTH,
  PORTA,
  BUSINESS,
  SEERREPORT,
  //请求axios逻辑
  requestWebUI,
};
