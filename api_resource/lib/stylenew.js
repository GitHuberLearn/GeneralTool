/*
 * @Descripttion: 'WebUI模块化提供平台通用方法'
 * @version: 1.0.0
 * @Author: YangKe
 * @Date: 2019-12-19 19:48:44
 * @LastEditors: ~
 * @LastEditTime: 2026-04-01 18:03:02
 */
//外网使用
// document.write("<script type='text/javascript' src='https://www.layuicdn.com/layui/layui.all.js'></script>");//依赖layui,实践证明没有all，没法异步加载
// document.write("<script type='text/javascript' src='https://www.layuicdn.com/layui/layui.js'></script>");//依赖layui 可以初始化
// document.write(
//   '<script src="https://cdn.bootcdn.net/ajax/libs/layui/2.9.16/layui.min.js"></script>',
// ); //依赖layui 可以初始化
if (!CDNIS) {
  //CDN接入失败
  document.write(
    "<script type='text/javascript' src='" +
      gatewayURL +
      "/api_resource/plugins/lib/echarts.min.js'></script>",
  ); //依赖echarts请使用 如果项目有请忽略
} else {
  //CDN接入成功
  //   document.write(
  //     "<script type='text/javascript' src='https://cdn.bootcss.com/echarts/4.6.0/echarts.min.js'></script>",
  //   );
}

//内网使用-本地资源
// document.write("<script type='text/javascript' src='" + gatewayURL + "/api_resource/plugins/layui-v2.5.6/layui.js'></script>");
// document.write("<script type='text/javascript' src='" + gatewayURL + "/api_resource/plugins/layui-v2.5.6/layui.all.js'></script>");
//document.write("<script type='text/javascript' src='" + gatewayURL + "/api_resource/plugins/lib/echarts.min.js'></script>");

$(function () {
  //layui声明模块
  layui
    .config({
      base: gatewayURL + '/api_resource/plugins/lib/layuis/',
    })
    .extend({
      formSelects: 'formSelects',
    });
  layui.use(
    [
      'layer',
      'table',
      'form',
      'element',
      'laydate',
      'laypage',
      'laytpl',
      'layedit',
      'tree',
      'util',
      //'formSelects',
      'slider',
      'rate',
    ],
    function () {
      (($ = layui.$),
        (layer = layui.layer),
        (table = layui.table),
        (form = layui.form),
        // (formSelects = layui.formSelects),
        (element = layui.element),
        (laydate = layui.laydate),
        (laypage = layui.laypage),
        (laytpl = layui.laytpl),
        (layedit = layui.layedit),
        (tree = layui.tree),
        (util = layui.util),
        (slider = layui.slider),
        (rate = layui.rate));

      form.render(); //更新全部 表单
    },
  );

  // 文本输入框
  $(':input')
    .focus(function () {
      $(this).addClass('focus');
      if ($(this).val() == this.defaultValue) {
        $(this).val('');
      }
    })
    .blur(function () {
      $(this).removeClass('focus');
      if ($(this).val() == '') {
        $(this).val(this.defaultValue);
      }
    });
  //表单 样式
  //tableStle()
});

/***=========  layer组件性功能 520 =========***/

/*
 * layer组件性js
 */

/*
 * layui.code 代码修饰器
 * ec：是否代码显示，默认显示
 */
function layuiCode(ec) {
  layui.use('code', function () {
    layui.code({
      about: false,
      height: 'auto', //150px
      encode: ec == undefined ? true : ec, //默认true
      title: 'code', //JavaScript
    });
  });
}

/**
 * layui.table
 * 参数10+2个
 * @param {*模块id} elem
 * @param {*默认高度478} height:450-10个
 * @param {*列} cols
 * @param {*请求接口地址5} url
 * @param {*入参} where
 * @param {*分页入参} request
 * @param {*加载完成回调} done
 * @param {*table及tableIn获取（通过function(table,tableIns)获取）} tableEle
 * @param {*原始返回的数据的对应符号，默认null} dfParseData
 * @param {*(默认显示true) 显示分页} isPage
 * @param {*(默认显示get 非必须项)} method
 * @param {*(默认显示列表 非必须项)} skin 表格风格（line 行边框）、（row 列边框）、（nob 无边框风格）
 */
function safeLayerTable(
  elem,
  height,
  cols,
  url,
  where,
  request,
  done,
  tableEle,
  dfParseData,
  isPage,
  method,
  skin,
) {
  var h = height == '' ? 478 : height;
  layui.$.support.cors = true;
  var table = layui.table;
  var method = method == 'post' ? 'post' : 'get';
  if (method == 'post') {
    //post
    var contentType = 'application/json';
  } else {
    var contentType = 'application/x-www-form-urlencoded';
  }

  //展示已知数据
  var tableIns = table.render({
    elem: elem,
    //width: 222,
    height: h,
    cols: cols,
    url: url,
    //headers: { "X-CSRFToken": $.cookie('csrftoken') },//需要cookie，对安全级别高网站需要
    method: method,
    contentType: contentType,
    headers: {},
    skin: skin,
    where: where,
    request: request,
    parseData: function (res) {
      //res 即为原始返回的数据
      if ($.isFunction(dfParseData)) {
        return dfParseData(res);
      } else {
        return {
          code: res.successful == true ? 0 : 1, //解析接口状态 成功返回应该为0
          msg: res.resultHint, //解析提示文本
          count: res.resultValue.itemCount, //解析数据长度
          data: res.resultValue.items, //解析数据列表
        };
      }
    },
    done: done, //加载完成 你可以在下面的 js 代码中使用你熟悉的 $, jQuery
    even: false,
    page: isPage === undefined ? true : isPage, //是否显示分页
    limits: [5, 10, 20, 30],
    limit: 5, //每页默认显示的数量 完全根据后端判断返回获取数据 json死数据因为返回是31条就是31条了
  });
  tableEle(table, tableIns); //定义layui table方法
}
//适用layui官网规范
function safeLayerTable1(
  elem,
  height,
  cols,
  url,
  where,
  request,
  done,
  tableEle,
  dfParseData,
  isPage,
  method,
) {
  var h = height == '' ? 478 : height;
  layui.$.support.cors = true;
  var table = layui.table;
  var method = method == 'post' ? 'post' : 'get';
  if (method == 'post') {
    //post
    var contentType = 'application/json';
  } else {
    var contentType = 'application/x-www-form-urlencoded';
  }
  //展示已知数据
  var tableIns = table.render({
    elem: elem,
    //width: 222,
    height: h,
    cols: cols,
    url: url,
    method: method, //默认get
    contentType: contentType,
    headers: {},
    skin: 'nob', //表格风格line （行边框）row （列边框）nob （无边框风格）
    where: where,
    request: request,
    parseData: function (res) {
      //res 即为原始返回的数据
      if ($.isFunction(dfParseData)) {
        return dfParseData(res);
      } else {
        return {
          code: res.code, //解析接口状态 成功返回应该为0
          msg: res.msg, //解析提示文本
          count: res.count, //解析数据长度
          data: res.data, //解析数据列表
        };
      }
    },
    done: done,
    even: false,
    page: isPage === undefined ? true : isPage, //是否显示分页
    limits: [5, 10, 20, 30],
    limit: 5, //每页默认显示的数量 完全根据后端判断返回获取数据 json死数据因为返回是31条就是31条了
  });
  tableEle(table, tableIns);
}
//有cookie，对安全级别高网站需要,须要引入 jquery.cookie.js
function safeLayerTableCook(
  elem,
  height,
  cols,
  url,
  where,
  request,
  done,
  tableEle,
  dfParseData,
  isPage,
  method,
) {
  var h = height == '' ? 478 : height;
  layui.$.support.cors = true;
  var table = layui.table;
  var method = method == 'post' ? 'post' : 'get';
  if (method == 'post') {
    //post
    var contentType = 'application/json';
  } else {
    var contentType = 'application/x-www-form-urlencoded';
  }

  //展示已知数据
  var tableIns = table.render({
    elem: elem,
    //width: 222,
    height: h,
    cols: cols,
    url: url,
    headers: { 'X-CSRFToken': $.cookie('csrftoken') }, //需要cookie，对安全级别高网站需要
    method: method, //默认get
    //contentType: "application/x-www-form-urlencoded",//application/json
    contentType: contentType,
    //skin: 'nob', //表格风格line （行边框）row （列边框）nob （无边框风格）
    where: where,
    request: request,
    parseData: function (res) {
      //res 即为原始返回的数据

      if ($.isFunction(dfParseData)) {
        return dfParseData(res);
      } else {
        //成功请求
        return {
          code: res.code == 1 ? 0 : 1, //解析接口状态 成功返回应该为0
          msg: res.msg, //解析提示文本
          count: res.count, //解析数据长度
          data: res.data, //解析数据列表
        };
      }
    },
    done: done,
    even: false,
    page: isPage === undefined ? true : isPage, //是否显示分页
    limits: [5, 10, 20, 30],
    limit: 5, //每页默认显示的数量 完全根据后端判断返回获取数据 json死数据因为返回是31条就是31条了
  });
  tableEle(table, tableIns);
}
/**
 * layer 弹出层
 * 参数解释：
 * 参数:7个
 *      1.title   标题
 *      2.url     请求的url
 *      3.hw		尺寸标准 :hwMin(最小) hwMax(最大) define(自定义) /不设置为 黄金分割(默认)
 *      4.w       弹出层宽度（缺省调默认值）
 *      5.h       弹出层高度（缺省调默认值）
 *      6.deploy    是数组 [maxMin默认关闭,closeBtn默认没有按钮] //明确按钮颜色改变，按钮操作
 *      7.endCall 调用方法
 * 功能介绍：
 *      一般窗口     :          x_admin_show(title,url)//黄金分割
 *                             parentX_admin_show(title,url)//黄金分割
 *      一般窗口+函数:          x_admin_showCa(title,url,'define/hwMin/hwMax','num','num',deploy,endCall)//窗口尺寸（px）+函数
 *实例：x_admin_show('提醒', 'https://www.layui.com/', '', '', '', [true, ['确认', '取消']], '')
 *
 *
 */
//弹框
function x_admin_show(title, url, hw, w, h, deploy, endCall) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  //确定尺寸
  if (hw == 'hwMin') {
    //最小
    var h = $(window).height() * 0.35 + 'px',
      w = $(window).width() * 0.35 + 'px';
  } else if (hw == 'hwMax') {
    //最大
    var h = $(window).height() * 0.9 + 'px',
      w = $(window).width() * 0.9 + 'px';
  } else if (hw == 'define') {
    //自定义尺寸
    //判断执行添加单位 兼容IE
    var w = addUnit(w),
      h = addUnit(h);
  } else {
    //默认  黄金分割点
    var gold = $(window).height() * 0.66,
      h = gold + 'px',
      w = gold / 0.618 + 'px';
    console.log('黄金分割点');
  }
  if (!deploy) {
    var deploy = [false, []];
  } else {
    var deploy = [deploy[0] == true ? true : false, deploy[1]];
  }

  layer.open({
    type: 2,
    area: [w, h],
    fix: false, //不固定
    shadeClose: true,
    shade: 0.4,
    skin: 'layui-layer-prompt',
    title: title,
    content: url,
    maxmin: deploy[0],
    btn: deploy[1],
    end: function () {
      //yesscroll()
    },
    success: function () {
      //noscroll()
      if ($.isFunction(endCall)) {
        endCall(index);
      }
    },
    yes: function (index, lay) {
      if ($.isFunction(endCall)) {
        endCall(index);
      }
      //yesscroll()
    },
  });
}
//弹框-跳出层
function parentX_admin_show(title, url, hw, w, h, deploy, endCall) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  //确定尺寸
  if (hw == 'hwMin') {
    //最小
    var h = $(window).height() * 0.35 + 'px',
      w = $(window).width() * 0.35 + 'px';
  } else if (hw == 'hwMax') {
    //最大
    var h = $(window).height() * 0.9 + 'px',
      w = $(window).width() * 0.9 + 'px';
  } else if (hw == 'define') {
    //自定义尺寸
    //判断执行添加单位 兼容IE
    var w = addUnit(w),
      h = addUnit(h);
  } else {
    //默认  黄金分割点
    var gold = $(window).height() * 0.66,
      h = gold + 'px',
      w = gold / 0.618 + 'px';
    console.log('黄金分割点');
  }
  if (!deploy) {
    var deploy = [false, []];
  } else {
    var deploy = [deploy[0] == true ? true : false, deploy[1]];
  }

  parent.layer.open({
    type: 2,
    area: [w, h],
    fix: false, //不固定
    shadeClose: true,
    shade: 0.4,
    skin: 'layui-layer-prompt',
    title: title,
    content: url,
    maxmin: deploy[0],
    btn: deploy[1],
    end: function () {
      //yesscroll()
    },
    success: function () {
      //noscroll()
      if ($.isFunction(endCall)) {
        endCall(index);
      }
    },
    yes: function (index, lay) {
      if ($.isFunction(endCall)) {
        endCall(index);
      }
      //yesscroll()
    },
  });
}
//define 自定义作为 黄金分割点 来规定 待审核使用
function x_admin_showMH(title, url, hw, w, h, deploy, endCall) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  //确定尺寸
  if (hw == 'hwMin') {
    //最小
    var h = $(window).height() * 0.35 + 'px',
      w = $(window).width() * 0.35 + 'px';
  } else if (hw == 'hwMax') {
    //最大
    var h = $(window).height() * 0.9 + 'px',
      w = $(window).width() * 0.9 + 'px';
  } else if (hw == 'define') {
    //自定义尺寸
    //判断执行添加单位 兼容IE
    //弹出框屏幕最大与最小值
    var goldh = $(window).height() * 0.9,
      wmax = goldh / 0.618;
    //当传入参考宽度大于最大值,弹出框大小以系统最大值wmax为主
    if (w > wmax) {
      var w = wmax,
        h = wmax * 0.618;
    } else {
      //当传入参考宽度小于最小值或者居于最大值与最小值之间，以传入的宽度为主
      var w = w,
        h = w * 0.618;
    }
    var w = addUnit(w),
      h = addUnit(h);
  } else {
    //默认  黄金分割点
    var gold = $(window).height() * 0.66,
      h = gold + 'px',
      w = gold / 0.618 + 'px';
    console.log('黄金分割点');
  }
  if (!deploy) {
    var deploy = [false, []];
  } else {
    var deploy = [deploy[0] == true ? true : false, deploy[1]];
  }

  layer.open({
    type: 2,
    area: [w, h],
    fix: false, //不固定
    shadeClose: true,
    shade: 0.4,
    skin: 'layui-layer-prompt',
    title: title,
    content: url,
    maxmin: deploy[0],
    btn: deploy[1],
    end: function () {
      //yesscroll()
    },
    success: function () {
      //noscroll()
      if ($.isFunction(endCall)) {
        endCall(index);
      }
    },
    yes: function (index, lay) {
      if ($.isFunction(endCall)) {
        endCall(index);
      }
      //yesscroll()
    },
  });
}
//判断执行添加单位
function addUnit(i) {
  //isNaN() null按照0处理 字符串返回true
  if (!isNaN(i)) {
    var unit = i > 100 ? 'px' : '%';
    i += unit;
  }
  return i;
}

/*
 * 解决弹出页面弹出层时背景可滚动问题
 */
function bodyScroll(event) {
  event.preventDefault();
}

var top1 = 0;
function stopBodyScroll(isFixed) {
  var bodyEl = document.body;
  if (isFixed) {
    top1 = document.documentElement.scrollTop;
    bodyEl.style.position = 'fixed';
    bodyEl.style.top = -top1 + 'px';
  } else {
    bodyEl.style.position = '';
    bodyEl.style.top = '';
    window.scrollTo(0, top1); // 回到原先的top
  }
}
//禁止滚动
function noscroll() {
  stopBodyScroll(true);
  if (chkIE()) {
    document.body.attachEvent('touchmove', bodyScroll, { passive: false });
  } else {
    document.body.addEventListener('touchmove', bodyScroll, { passive: false });
  }
  $('body').css({ position: 'fixed', width: '100%' });
}
//可滚动
function yesscroll() {
  stopBodyScroll(false);
  if (chkIE()) {
    document.body.detachEvent('touchmove', bodyScroll, { passive: false });
  } else {
    document.body.removeEventListener('touchmove', bodyScroll, {
      passive: false,
    });
  }
  $('body').css({ position: 'initial', height: '100%' });
}

function x_admin_show1(title, url, w, h, endCall) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  if (w == null || w == '') {
    w = $(window).width() * 0.9;
  }
  if (h == null || h == '') {
    h = $(window).height() - 50;
  }
  //判断执行添加单位 兼容IE
  w = addUnit(w, 'px');
  h = addUnit(h, 'px');

  layer.open({
    type: 2,
    area: [w, h],
    fix: false, //不固定
    maxmin: false,
    shadeClose: true,
    shade: 0.4,
    title: title,
    content: url,
    end: function () {
      if ($.isFunction(endCall)) {
        endCall();
      }
      yesscroll();
    },
    success: function () {
      noscroll();
    },
    yes: function () {
      yesscroll();
    },
  });
}
function x_admin_show_auto1(title, url, w, h, maxH, endCall) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  if (w == null || w == '') {
    w = $(window).width() * 0.9;
  }
  if (h == null || h == '') {
    h = $(window).height() - 50;
  }
  var clientHeight = getClientHeight();
  if (clientHeight > maxH) {
    //如果窗口固定高度足够,按照固定高度设置窗口高度
    h = maxH;
  }

  //判断执行添加单位 兼容IE
  w = addUnit(w, 'px');
  h = addUnit(h, 'px');

  layer.open({
    type: 2,
    area: [w, h],
    fix: false, //不固定
    maxmin: false,
    shadeClose: true,
    shade: 0.4,
    title: title,
    content: url,
    end: function () {
      if ($.isFunction(endCall)) {
        endCall();
      }
      yesscroll();
    },
    success: function () {
      noscroll();
    },
    yes: function () {
      yesscroll();
    },
  });
}
function x_admin_show_open1(title, url, w, h) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  if (w == null || w == '') {
    w = $(window).width() * 0.9;
  }
  if (h == null || h == '') {
    h = $(window).height() - 50;
  }
  //判断执行添加单位 兼容IE
  w = addUnit(w, 'px');
  h = addUnit(h, 'px');

  layer.open({
    type: 2,
    //area: [w+'%', h +'%'],
    area: [w, h],
    fix: false, //不固定
    maxmin: false,
    shadeClose: true,
    shade: 0.4,
    title: title,
    content: url,
    end: function () {
      yesscroll();
    },
    success: function () {
      noscroll();
    },
    yes: function () {
      yesscroll();
    },
  });
}
function x_admin_show_open_maxmin1(title, url, w, h) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  if (w == null || w == '') {
    w = $(window).width() * 0.9;
  }
  if (h == null || h == '') {
    h = $(window).height() - 50;
  }
  //判断执行添加单位 兼容IE
  w = addUnit(w, 'px');
  h = addUnit(h, 'px');

  layer.open({
    type: 2,
    //area: [w+'%', h +'%'],
    area: [w, h],
    fix: false, //不固定
    maxmin: true,
    shadeClose: true,
    shade: 0.4,
    title: title,
    content: url,
    end: function () {
      yesscroll();
    },
    success: function () {
      noscroll();
    },
    yes: function () {
      yesscroll();
    },
  });
}
function x_admin_show_open_maxmin_auto1(title, url, w, h, maxH) {
  if (title == null || title == '') {
    title = false;
  }
  if (url == null || url == '') {
    url = '404.html';
  }
  if (w == null || w == '') {
    w = $(window).width() * 0.9;
  }
  if (h == null || h == '') {
    h = $(window).height() - 50;
  }
  var clientHeight = getClientHeight();
  if (clientHeight > maxH) {
    //如果窗口固定高度足够,按照固定高度设置窗口高度
    h = maxH;
  }
  //判断执行添加单位 兼容IE
  w = addUnit(w, 'px');
  h = addUnit(h, 'px');

  layer.open({
    type: 2,
    //area: [w+'%', h +'%'],
    area: [w, h],
    fix: false, //不固定
    maxmin: true,
    shadeClose: true,
    shade: 0.4,
    title: title,
    content: url,
    end: function () {
      yesscroll();
    },
    success: function () {
      noscroll();
    },
    yes: function () {
      yesscroll();
    },
  });
}
//判断执行添加单位
function addUnit1(i, unit) {
  //isNaN() null按照0处理 字符串返回true
  if (!isNaN(i)) {
    i += unit;
  }
  return i;
}

/*
 * 取窗口可视范围的高度
 */
function getClientHeight() {
  var clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    var clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  } else {
    var clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  }
  return clientHeight;
}

/***=========  开发组件性功能 521 =========***/

/**
 * 根据结束日期与开始日期计算完整工作日工期
 * @param {开始时间} s
 * @param {结束时间} e
 * @param {是否双休计入} isAllDayoff   (可选 Boolean：默认false 双休非工作日)
 *
 *  实例：var  s = '1991-01-02 23:45:00',
               e = '1991-01-08 23:45:00';
          或者
          var s = '1991-01-02',
              e = '1991-01-08';
 */
function compute_period(s, e, isAllDayoff) {
  if (e < s) return;
  if (e == s) return 1;
  var endDate = new Date(e);
  var beginDate = new Date(s);

  var real_day = 0;
  if (endDate.getDay() == 0 || endDate.getDay() == 6) real_day++; //结束日期为周六日，则加一天
  if (beginDate.getDay() == 0 || beginDate.getDay() == 6) real_day++; //开始日期为周六日，则加一天
  while (endDate >= beginDate) {
    try {
      if (isAllDayoff) {
        if (endDate != beginDate) {
          real_day++;
        }
      } else {
        if (
          endDate != beginDate &&
          endDate.getDay() != 0 &&
          endDate.getDay() != 6
        ) {
          real_day++;
        }
      }
    } catch (e) {
      console.log(e);
    }
    endDate = new Date(endDate - 3600000 * 24);
  }
  return real_day;
}
/**
 * 判断元素在数组是否存在，存在删除，不存在添加
 * @param {元素} arr
 * @param {数组} array
 * 说明：另一种 $.inArray(arr, array) 对array数组中指定arr元素的索引值 没有返回-1
 *       兼容IE9+
 *
 */
function isaddArr(sarr, sarray) {
  var index = sarray.indexOf(sarr);
  if (index == -1) {
    // if (typeof (sarray) == 'string') {
    //     sarray.concat(sarr);//数组和字符串通用，不改变原数组的
    // } else {
    //     sarray.push(sarr);//改变原数组的
    // }
    var sarray = sarray.concat(sarr);
  } else {
    if (typeof sarray == 'string') {
      var sarray = sarray.replace(eval('/' + sarr + '/g'), ''); // 不改变原数组
    } else {
      //先删除相同的 在删除此元素
      var sarray = unique(sarray);
      sarray.splice(index, 1); //改变原数组的
    }
  }
  return sarray;
}

/**
 * 判断元素在数组或者字符串是否存在，存在返回：true
 * @param {元素} arr
 * @param {数组} array
 *
 */
function isExistArr(sarr, sarray) {
  var index = sarray.indexOf(sarr);
  if (index == -1) {
    return false;
  } else {
    return true;
  }
}

/**
 *
 * @param {去重 数组} arr
 *  说明：兼容IE9+
 */
//方式1；
function unique(arr) {
  //判断是否类型
  if (!Array.isArray(arr)) {
    console.log('type error!');
    return;
  } else {
    var barr = [];
    for (var i = 0; i < arr.length; i++) {
      if (barr.indexOf(arr[i]) == -1) {
        barr.push(arr[i]);
      }
    }
    return barr;
  }
}
//方式2；
function unique_Filt(arr) {
  //判断是否类型
  if (!Array.isArray(arr)) {
    console.log('type error!');
    return;
  }
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item) === index;
  });
}

/**
 * @param {{去重数 多重数组} arr
 * @param {指定对象元素键值} key
 * 说明：兼容IE9+ 确定
 */
function uniqueObj(arrObj, key) {
  arrObj.splice(0, 1);
  var new_arr = []; //中间变量：判断
  var json_arr = []; //去重变量
  for (var i = 0; i < arrObj.length; i++) {
    if (new_arr.indexOf(arrObj[i][key]) == -1) {
      new_arr.push(arrObj[i][key]);
      json_arr.push(arrObj[i]);
    }
  }
  return json_arr;
}

//待研究
function uniqueObj_1(arr) {
  var arrs = [];
  arr.filter(function (item, index, arr) {
    if (index == 0) {
      //先添加第一个 保证有数据 以及结构
      return arrs.push(item); //改变原数组的
    } else {
      arrs.filter(function (items, i, arrs) {
        var le = arrs.length - 1;
        if (item.category != items.category) {
          flg++;
          if (flg == 1) {
            return arrs.push(item); //改变原数组的
          }
          if (i == le) {
            return flg == 0;
          }
        }
      });
    }
  });

  console.log('d2:', arrs);
}

/**
 *
 * @param {去重数组} arr
 * 类似：Array.from(new Set(arr))
 * 说明：ES6语法 不兼容IE
 */
function uniqueES6(arr) {
  return [...new Set(arr)];
}

/**
 * 开关
 */
//开关
function disturb(el) {
  var left = parseFloat($(el).css('left'));
  var self = el;
  if (left > 0) {
    setInterval(function () {
      if (left >= 0) {
        $(self).css('left', left-- + 'px');
      }
    }, 5);
    $(el).parent().removeClass('active');
  } else {
    setInterval(function () {
      if (left <= 32) {
        $(self).css('left', left++ + 'px');
      }
    }, 5);
    $(el).parent().addClass('active');
  }
}
//开关+文字
function disturbs(el) {
  var left = parseFloat($(el).css('left'));
  var self = el;
  var txtfl = $(el).prev().text(),
    txtfr = $(el).text();
  if (left > 0) {
    setInterval(function () {
      if (left >= 0) {
        $(self).css('left', left-- + 'px');
      }
    }, 5);
    $(el).parent().removeClass('active');
  } else {
    setInterval(function () {
      if (left <= 56) {
        $(self).css('left', left++ + 'px');
      }
    }, 5);
    $(el).parent().addClass('active');
  }
  $(el).prev().toggleClass('txtfr10');
  $(el).prev().text(txtfr);
  $(el).text(txtfl);
}
//判断字符是否为空的方法 空返回值：true
function isEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || (obj == '' && obj != 0)) {
    return true;
  } else {
    return false;
  }
}
//使用input 框 清除 功能
function formControl() {
  // ie10以上执行
  if (IEVersion() >= 10) {
    //使用input 框 清除 功能
    $('.has-feedback input').on('input propertychange', function () {
      //监听IE也适用
      if ($(this).val().length > 0) {
        $(this).next().show();
      } else {
        $(this).next().hide();
      }
    });
    $('.layui-icon-close').on('click', function () {
      $(this).prev().val('').next().hide();
    });
  } else {
    $('.has-feedback input').css('padding-right', '0');
  }
}

/*
 * 表单 样式
 */
function tableStle() {
  //表单	操作样式
  $('table').each(function (index, e) {
    var iptCk = $(e).find('input[type="checkbox"]').length,
      le = $(e).find('tbody .operation').find('button'),
      len = le.length;
    //配置样式
    //操作
    //td
    if (len > 0) {
      //有按钮
      var w = 0;
      $(le).each(function (indexs, es) {
        var esw = $(es).outerWidth(true);
        w += (esw > 30 ? esw : 64) + 11; //td padding差值
        //console.log(w)
      });
      //解决浮框等牵扯问题
      $(e)
        .find('tbody .operation')
        .css('width', w + 'px');
      $(e)
        .find('tbody .operation')
        .css('min-width', w + 'px');
      $(e)
        .find('tbody .operation')
        .css('max-width', w + 'px');
    } else {
      $(e).find('tbody .operation').css('width', '108px');
      $(e).find('tbody .operation').css('min-width', '108px');
      $(e).find('tbody .operation').css('max-width', '108px');
    }

    //th
    $(e)
      .find('thead th')
      .each(function (index, e) {
        var txt = $(e).text(),
          ope = $(e).attr('operation'),
          i = $(e).index();
        //序号 下载量
        if (txt == '序号' || txt == '下载量' || txt == '排名') {
          //考虑首页
          //头部样式
          $(e).css(whobj(63));
          //tbody每个列表样式
          $(e)
            .parent()
            .parent()
            .parent()
            .find('tbody tr')
            .each(function (index, e) {
              $(e)
                .find('td')
                .each(function (index, e) {
                  if (index == i) {
                    $(this).eq(i).css(whobj(63));
                  }
                });
            });
        }

        //操作
        if (txt == '操作') {
          if (!ope) {
            if (len > 0) {
              $(e).css(whobj(w));
            } else {
              $(e).css(whobj(108));
            }
          }
        }
      });
  });
}
//多级样式
function whobj(w) {
  return {
    width: w + 'px',
    'min-width': w + 'px',
    'max-width': w + 'px',
  };
}

/*
 * 当前动态添加active
 * el:点击元素
 */
function dynamicThisAdd(el) {
  $(el).on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    return (index = $(this).index());
  });
  //console.log(index)
}

/*
 * 选项卡
 * el:点击元素，carryEls:执行元素
 */
function optionShow(el, carryEls) {
  $(el).on('click', function () {
    var i = $(this).index(); //当前操作的元素索引值
    $(carryEls).eq(i).show().siblings().hide(); //当前显示，其他的隐藏。
  });
}

/*
 * 动态联动选项卡
 * el:点击元素，carryEls:执行元素
 */
function dynamicOption(el, carryEls) {
  dynamicThisAdd(el);
  optionShow(el, carryEls);
}

/**
 * URL 获取传过来指定参数的值
 */
function getParams(key) {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf('?') != -1) {
    var str = url.substr(1);
    strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
    }
  }
  return theRequest;
}

/**
 * 鼠标悬浮title提示
 * @type {null}
 */
var oldTitle = null;
$(document).bind('mouseover mouseout mousemove', function (event) {
  var left = event.pageX,
    top = event.pageY;
  var ele = event.target;
  var title = ele.title;
  var type = event.originalEvent.type;
  if (type == 'mouseover') {
    oldTitle = title;
    ele.title = '';
    //if(title && title.length > 0){
    if (title != null && title != '') {
      var showEle = $('<div></div>', {
        text: title,
        class: 'showTitleBox',
      }).css({
        position: 'absolute',
        top: top + 15,
        left: left + 15,
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '3px',
        paddingBottom: '3px',
        border: '1px solid #D2DDE6',
        borderRadius: '2px',
        backgroundColor: '#DEEBF0',
        fontSize: '12px',
        fontColor: '#2C2C2C',
        fontFamily: 'MicrosoftYaHeiUI',
        zIndex: '999999',
      });
      showEle.appendTo('body');
    }
  } else if (type == 'mouseout') {
    ele.title = oldTitle;
    $('.showTitleBox').remove();
  } else if (type == 'mousemove') {
    $('.showTitleBox').css({
      top: top + 15,
      left: left + 15,
    });
  }
});

/*
 *  js判断是否是ie浏览器且给出ie版本
 */
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return 100; //不是ie浏览器
  }
}

/***=========  待处理组件性功能  =========***/

/*
 * 判断是否为IE8
 */
function chkIE() {
  return window.ActiveXObject;
}
/*
 * 获取地址传值中的参数
 */
function getQueryStringArgs(url) {
  var qs = url.length > 0 ? url.substring(1) : '',
    args = {},
    items = qs.length ? qs.split('&') : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;
  for (i = 0; i < len; i++) {
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
}

/*
 * 动态添加active
 */
function taskList(el) {
  $('.J_tasklist').on('click', 'li', function () {
    $(this).parent().find(el).removeClass('active');
    $(this).find(el).addClass('active');
  });
}
function taskList2(el) {
  $('.J_tasklist2').on('click', 'li', function () {
    $(this).parent().find(el).removeClass('active');
    $(this).find(el).addClass('active');
  });
}

/*
 * 控制色块个数
 */
function num(id) {
  id.css('width', parseFloat(100 / id.length) + '%');
}

/*
 * 处理下载不全
 */
function showBigEcharts(title, data, module) {
  var dataStr = JSON.stringify(data);
  x_admin_show_open(
    title,
    encodeURI(
      '../../../ds/home/view/product/layerlist/grabbledata/dataCumulativeMax.html?data=' +
        dataStr +
        '&module=' +
        module,
    ),
    '100%',
    '500px',
  );
}
