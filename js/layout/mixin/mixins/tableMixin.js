/*
 * @Descripttion: 标准 tableMixin
 * @version: 1.0.0
 * @Author: Kenny
 * @Date: 2024-01-15 16:24:03
 * @LastEditors: ~
 * @LastEditTime: 2024-12-30 14:25:15
 */
/**
 * 代表：
 * tableMixinDome
 */
/**
 * 功能：tableMixin（增删改查等）
 * ⭐列表
 * ⭐滚动
 * ⭐搜索
 * ⭐保存、删除、更新、查询
 * ⭐发货
 * ⭐状态
 * ⭐导出
 * 默认ref:form
 */
/**
 * inspectionRecord
 * @returns 使用中组件
 */
import { getScroll } from "@/utils/mockData";
import utils from "@/utils";
const { tableMarqueeSeamless, resetForm, getCustomDate } = utils;
export default {
  data() {
    const userMsg = JSON.parse(localStorage.getItem("userMsg"));
    const userLevel = JSON.parse(localStorage.getItem("userLevel"));
    return {
      resetForm,
      userMsg,
      userLevel,
      /**
       * 初始化加载，使用默认加载init
       */
      initDefault: true,
      /**
       * emitLoadingExtension
       * Loading父及扩充，默认不扩充，扩充后与emitExtension()匹配
       */
      emitLoadingExtension: false,
      loading: true,
      //基本信息
      allDataTotal: 0,
      pageTotal: 0, //禁用
      allData: [],
      dataList: [], //数据
      ref: "queryForm", //默认
      //默认传入值
      currentPage: "currentPage",
      pageSize: "pageSize",
      pageSizeNum: 10,
      dealerId: "dealerId",
      companyId: "companyId",
      orgId: "orgId",
      endTime: "endTime",
      startTime: "startTime",
      queryInfo: {},
      /**
       * 弹框 默认ref:form
       * form组件必须定义formInit: () => formInit()
       */
      editText: "编辑",
      titleState: "",
      dialogVisible: false,
      reForm: "form",
      form: null,
      formTime: [],
      defaultFile: { name: null, type: "xlsx" }, //下载文件配置 默认xlsx
      invisibleName: "",
      /**
       * initExtension
       *  初始化扩充，默认不扩充，扩充后与extension()匹配
       */
      initExtension: false,
      /**
       * 初始加载列表配置
       * config
       *  resCode：默认成功状态为0
       *  funData：转换数据函数
       */
      config: {
        resCode: [0, 200],
        funData: false,
      },
      /**
       *  finishExtension
       *  加载完成扩充，默认不扩充，扩充后与finishWayExtension()匹配
       */
      finishExtension: false,
      MARQUEE: false, //滚动 默认不滚动
      defineScroll: getScroll(),
      refTable: "table_marquee",
      pageall: false, //所有分页 默认返回分页
    };
  },
  created() {
    this.initCompiler();
  },
  mounted() {},
  methods: {
    initCompiler() {
      //默认传入值
      this.queryInfo[this.currentPage] = 1;
      this.queryInfo[this.pageSize] = this.pageSizeNum;
      if (this.userMsg.company) {
        if (this.companyId) {
          this.queryInfo[this.companyId] = this.userMsg.company;
        }
        if (this.orgId) {
          this.queryInfo[this.orgId] = this.userMsg.company;
        }
      }
      if (this.dealerId && this.userLevel) {
        this.queryInfo[this.dealerId] = this.userLevel.orgId;
      }
      if (this.initDefault) {
        this.init();
      }
      if (!this.formInit) return;
      this.form = this.formInit();
    },
    submitAPI(API) {
      API(this.form).then((res) => {
        if (res.code === 0 || res.code === 200) {
          this.submitMsg(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submitMsg(res) {
      const { msg } = res;
      const infor = msg ? msg : "更新成功";
      this.$message.success(infor);
      this.handleClose();
      if (this.titleState === "添加") {
        this.iniDate();
      }
      this.init();
    },
    //提交
    submit() {
      this.$refs[this.reForm].validate((valid) => {
        if (!valid) return;
        if (this.submitForm) {
          this.submitForm(); //数据改造
        }
        if (this.titleState === this.editText) {
          this.submitAPI(this.upDateAPI);
        } else {
          this.submitAPI(this.saveAPI);
        }
      });
    },
    tableMarquee(allData) {
      setTimeout(() => {
        const { play, data } = tableMarqueeSeamless(
          this,
          this.refTable,
          allData
        );
        this.allData = data;
        if (!this.MARQUEE) return;
        this.defineScroll.autoPlay = play;
        this.defineScroll.hoverStop = play;
      });
    },
    /**
     * 初始加载列表
     * @param {Object} responseMethod 对象扩充
     * + 配合handleQuery查询请求后处理方法
     * @returns {ISNormal,responseWay}
     */
    async init(responseMethod) {
      this.switchLoading(true);
      const responseWay = Object.assign(
        {
          successMethod: false, //成功方法
          unusualMethod: false, //成功异常自定义方法
        },
        responseMethod
      );
      let objWay = { ISNormal: false, responseWay };
      let resData = null;
      await this.listAPI(this.queryInfo)
        .then((response) => {
          const { objWays, res } = this.forMath(response, objWay);
          objWay = objWays;
          resData = res;
        })
        .catch((err) => {
          resData = err;
          this.switchLoading(false);
        });
      //加载完成扩充方式
      if (this.finishExtension) {
        this.finishWayExtension(resData);
      }
      return objWay;
    },
    /**
     * 数据格式化
     * @param {*object} res 数据信息
     * @param {*object} objWay 对象扩充
     * + ISNormal：正常获取数据状态
     * + extension：配置项
     */
    forMath(res, objWays) {
      const { responseWay } = objWays;
      this.switchLoading(false);
      /**
       * config
       *  resCode：默认成功状态为0
       *  funData：转换数据函数
       */
      const { resCode, funData } = this.config;
      const resData = funData ? funData(res) : res;
      if (resCode.indexOf(resData.code) >= 0) {
        objWays.ISNormal = true;
        const { dataList, allDataTotal } = this.getDataList(resData);
        this.data_list = dataList;
        if (this.data_list.length > 0) {
          if (this.pageall) {
            this.pageallGetData();
            this.pageTotal = this.data_list.length;
            this.allDataTotal = this.data_list.length;
          } else {
            this.allData = this.data_list;
            this.allDataTotal = allDataTotal;
          }
          this.tableMarquee(this.allData);
          //成功方法
          if (responseWay.successMethod) {
            responseWay.successMethod(resData);
          }
        } else {
          this.allData = [];
        }
      } else {
        //异常方法
        if (!responseWay.unusualMethod) {
          this.iniDate();
        } else {
          responseWay.unusualMethod(res);
        }
      }
      return { objWays, res };
    },
    /**
     * Loading开关
     * @param {*loading开关} Boole 布尔
     */
    switchLoading(Boole) {
      if (this.emitLoadingExtension) {
        this.emitExtension(Boole);
      } else {
        this.loading = Boole;
      }
    },
    /**
     * @param {*object} res 数据信息
     * @returns 获取数据和页码数量
     */
    getDataList(res) {
      let dataList = [],
        allDataTotal = 0;
      const { data, rows, pageInfo, total } = res;
      if (Array.isArray(data) || Array.isArray(rows)) {
        if (Array.isArray(data)) {
          allDataTotal = pageInfo && pageInfo.total;
        }
        if (Array.isArray(rows)) {
          allDataTotal = total;
        }
        dataList = data;
      }
      if (data) {
        const { records, list } = data;
        if (Array.isArray(records) || Array.isArray(list)) {
          dataList = records || list;
          allDataTotal = data.total;
        }
      }
      return {
        dataList,
        allDataTotal,
      };
    },
    pageallGetData() {
      this.allData = this.data_list.slice(
        (this.queryInfo[this.currentPage] - 1) * this.queryInfo[this.pageSize],
        this.queryInfo[this.currentPage] * this.queryInfo[this.pageSize]
      );
    },
    //初始化数据
    iniDate() {
      this.queryInfo[this.currentPage] = 1;
      this.allDataTotal = 0;
      this.allData = [];
    },
    iniDateQuery() {
      this.iniDate();
      if (this.formTime && this.formTime.length > 0) {
        this.queryInfo[this.startTime] = this.formTime[0] + " 00:00:00";
        this.queryInfo[this.endTime] = this.formTime[1] + " 23:59:59";
      } else {
        this.queryInfo[this.startTime] = null;
        this.queryInfo[this.endTime] = null;
      }
    },
    // 点击查询-被handleQuery替换
    // async query(extension) {
    //   return await this.handleQuery(extension);
    // },
    /**
     * 点击查询
     * @param {Object} extension 对象扩充
     * {unusualMethod:异常函数，successMethod：成功函数}
     * @returns 对象扩充
     */
    async handleQuery(extension) {
      extension = extension?.isTrusted ? null : extension;
      if (this.initExtension && this.extension()) return;
      this.iniDateQuery();
      return await this.init(extension);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm({ that: this, refName: this.ref });
      //this.resetForm(this.ref);
      this.handleQuery();
    },
    /**
     * 操作分类：添加、编辑、查看
     * @param {*string} status 状态
     * @param {*string} row 数据
     */
    handleClass(status, row) {
      if (row) {
        this.form = JSON.parse(JSON.stringify(row));
        if (this.uploadList) {
          this.setUploadList(row);
        }
      }
      switch (status) {
        case "add":
          this.titleState = "添加";
          break;
        case "update":
          this.titleState = this.editText;
          break;
        case "check":
          this.titleState = "查看";
          break;
      }
      this.dialogVisible = true;
    },
    /**
     * 赋值上传文件资源
     * @param {*objcet} row资源
     */
    setUploadList(row) {
      this.uploadList.forEach((item) => {
        this.$nextTick(() => {
          this.$refs[item].setUploadList(item, row);
        });
      });
    },
    /**
     * 格式化数组
     * @param {*数据} data
     * @returns Array
     */
    formatArrray(data) {
      return typeof data === "string" ? data.split(",") : data;
    },
    /**
     * 动态api请求
     * @param {*String} API :接口
     * @param {*Object} config:msg params,loading：默认loading
     * @returns {...response,isOK}
     */
    handleApi(API, config) {
      //resCode 默认成功状态为0
      const {
        resCode = 0,
        msg,
        params,
        noMsg,
        loading = "loading",
        msgInfo = { success: "", error: "" },
      } = config;
      let isOK = false;
      const { success, error } = msgInfo;
      if (loading) this[loading] = true;
      let msgTxt = "";
      return new Promise((resolve, reject) => {
        API(params)
          .then((response) => {
            if (loading) this[loading] = false;
            if (response.code === resCode) {
              isOK = true;
              if (!noMsg) {
                msgTxt = success ? success : "处理成功！";
                this.$message.success(msg ? response.msg : msgTxt);
              }
            } else {
              if (!noMsg) {
                msgTxt = error ? error : "处理失败！";
                this.$message.error(msg ? response.msg : msgTxt);
              }
            }
            resolve({ ...response, isOK });
          })
          .catch((error) => {
            if (loading) this[loading] = false;
            reject(error);
          });
      });
    },
    /**
     * 操作导出：
     * @param {Object} param 参数
     * query：参数
     * file：文件
     */
    handleExport(param) {
      const defaultParam = { query: null, file: this.defaultFile };
      const { query = null, file } = param ? param : defaultParam;
      this.loading = true;
      this.exportAPI(query)
        .then((res) => {
          this.changeExcle(res, file);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 流文件转excel
     * @param {*file} data 数据流
     * @param {objcet} file 文件 {name,type默认xlsx}
     * @returns
     */
    changeExcle(data, file) {
      const { name = this.defaultFile.name, type = this.defaultFile.type } =
        file;
      if (!data) {
        this.loading = false;
        this.$message.info("暂无数据资源！");
        return;
      }
      // 创建一个新的url，此url指向新建的Blob对象
      const url = window.URL.createObjectURL(new Blob([data]));
      // 创建a标签，并隐藏改a标签
      const link = document.createElement("a");
      link.style.display = "none";
      // a标签的href属性指定下载链接
      link.href = url;
      // setAttribute() 方法添加指定的属性，并为其赋指定的值。
      const getDate = getCustomDate({ type: "yyyy-MM-dd HH:mm:ss" });
      const defaultFile = `${getDate}`;
      const catalog = `${name ? name : defaultFile}.${type}`;
      link.setAttribute("download", catalog);
      document.body.appendChild(link);
      link.click();
      this.loading = false;
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      if (this.uploadList) {
        this.setUploadList();
      }
      if (this.formInit) {
        this.form = this.formInit();
      }
      if (!this.$refs[this.reForm]) return;
      this.$nextTick(() => {
        this.$refs[this.reForm].clearValidate();
      });
    },
    //打开ref弹框
    handleRefOpen(ref, row) {
      this.$refs[ref].openDialog(row);
    },
    // 其他操作
    otherClass(status, params) {
      let API = null;
      switch (status) {
        case "delete":
          API = this.deleteAPI;
          break;
        case "deliver":
          API = this.deliverAPI;
          break;
        case "status":
          API = this.statusApi;
          break;
      }
      this.loading = true;
      API(params)
        .then((res) => {
          this.loading = false;
          if (res.code === 0 || res.code === 200) {
            this.$message.success("操作成功！");
            this.init();
          } else {
            this.$message.error("操作失败！");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
