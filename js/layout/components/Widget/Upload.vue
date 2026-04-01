<!-- 
  el-upload封装:上传(图、视频)多选，单选
-->
<template>
  <div>
    <template v-if="titleState === '查看'">
      <template v-if="isVideo">
        <video
          class="mr5"
          v-for="(item, index) in fileList"
          :key="index"
          :src="item.url"
          controls
        ></video>
      </template>
      <template v-else>
        <el-image
          class="mr5"
          v-for="(item, index) in fileList"
          :key="index"
          :src="item.url"
          :preview-src-list="[item.url]"
        />
      </template>
    </template>
    <template v-else>
      <el-input v-model="form[uploadVariate]" v-show="false"></el-input>
      <!-- :file-list：上传成功会自动添加status，uid -->
      <el-upload
        :headers="headers"
        :action="uploadFileAPI(isVideo, FOXMOCKAPI)"
        :file-list="fileList"
        :list-type="lisType"
        :on-preview="handlePreview"
        :before-upload="handleUploadClosure(uploadMaxSize)"
        :on-remove="
          (file) => {
            handleRemove(file, uploadVariate);
          }
        "
        :on-change="
          (file, fileList) => {
            handleChange(file, fileList, uploadVariate);
          }
        "
        :limit="limit"
        :multiple="multiple"
        :on-exceed="
          () => {
            exceed(limit);
          }
        "
      >
        <!--multiple:必须配合:on-exceed="exceed"，否则报错 -->
        <el-button
          v-if="isVideo"
          slot="trigger"
          size="small"
          type="primary"
          @click="
            ($envent) => {
              onUpload($envent, limit);
            }
          "
        >
          <i class="el-icon-plus" />
          选取文件
        </el-button>
        <i
          v-else
          slot="trigger"
          class="el-icon-plus"
          @click="
            ($envent) => {
              onUpload($envent, limit);
            }
          "
        />
        <div slot="tip" class="el-upload__tip">
          只能上传{{ limit }}个{{ isVideo ? "mp4" : "图片" }}文件，且不超过{{
            uploadMaxSize
          }}MB
        </div>
      </el-upload>
      <!-- 非查看会有 -->
      <el-dialog
        title="大图阅览"
        :visible.sync="dialogVisibleImg"
        append-to-body
      >
        <img class="w100" :src="dialogImageUrl" />
      </el-dialog>
    </template>
  </div>
</template>

<script>
import utils from "@/utils";
const { uploadFileAPI } = utils;
export default {
  name: "Upload",
  props: {
    //表单
    form: {
      type: Object,
      default: {},
      required: true,
    },
    //查了，编辑，添加  默认_查看
    titleState: {
      type: String,
      default: "查看",
    },
    //组建类型
    lisType: {
      type: String,
      default: "",
    },
    //是否多选 默认否
    multiple: {
      type: Boolean,
      default: false,
    },
    //是否视频 默认是
    isVideo: {
      type: Boolean,
      default: true,
    },
    //是否FOXMOCK api 默认是不是
    FOXMOCKAPI: {
      type: Boolean,
      default: false,
    },
    //限制数量 默认_1
    limit: {
      type: Number,
      default: 1,
    },
    //最大上传 默认_10MB
    uploadMaxSize: {
      type: Number,
      default: 10,
    },
    //参数值
    uploadVariate: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      headers: { auth: localStorage.getItem("tokenMall") },
      uploadFileAPI,
      dialogImageUrl: "",
      dialogVisibleImg: false,
      fileList: [],
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 赋值上传文件资源
     * @param {*String} url 赋值
     */
    setUploadList(item, row) {
      this.fileList = [];
      if (!row) return;
      const uploadVariate = row[item];
      if (uploadVariate) {
        /**
         * 注意form表单应该用fileList渲染，防止直接渲染不符合格式
         * 适用范围：string(包含，) and Array
         * 其他：为了响应校验可以添加隐藏的input标签
         */
        const urlist = this.formatArrray(uploadVariate);
        urlist.forEach((url) => {
          if (!url) return;
          //赋值上传文件资源
          this.fileList.push({ url });
        });
      }
    },
    /**
     * 格式化数组
     * @param {*数据} data
     * @returns Array
     */
    formatArrray(data) {
      return typeof data === "string" ? data.split(",") : data;
    },
    // 图片预览
    handlePreview(file) {
      if (this.isVideo) return;
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    /**
     * 闭包上传效验：change>upload>change
     * @param {File} file 上传的File
     * @param {*} video 是否视频
     * @param {*} max 自大值
     * @returns boole:true允许上传 false阻止上传
     * 注意：
     *  传参函数无法阻止上传，使用闭包（推荐）或者bind
     */
    handleUploadClosure(max) {
      return (file) => {
        const type = this.isVideo
          ? /^video\/(mp4)$/
          : /^image\/(jpeg|png|jpg)$/;
        const isType = type.test(file.type);
        const isMaxSize = file.size / 1024 / 1024 < max;
        const text = this.isVideo ? "视频" : "图片";
        const typeText = this.isVideo ? "MP4" : "JPG/PNG";
        if (!isType) {
          this.$message.error(`上传${text}只能是${typeText}格式`);
          //如果是false(推荐)或被Promise.reject()（会有上传状态）则停止上传
          return false;
        }
        if (!isMaxSize) {
          this.$message.error(`上传${text}大小不能超过${max}MB`);
          return false;
        }
      };
    },
    /**
     * 赋值form表单上传的文件
     * @param {*String} variate 当前组件参数命名
     * @param {*String} formVariate form表单的参数
     * obj.response?：防止multiple报错
     */
    setFormUrlVariate(variate) {
      const urls = this.fileList
        .map((obj) => obj.response?.data || obj.url)
        .toString();
      //.sync修饰符同步父组件值
      this.form[variate] = urls;
      this.$emit("update:form", this.form);
    },
    /**
     * 删除图片
     * @param {*Object} row 删除的对象
     * @param {*String} variate 当前组件参数命名
     */
    handleRemove(row, variate) {
      this.dialogImageUrl = "";
      this.fileList = this.fileList.filter((obj) => obj.uid !== row.uid);
      this.setFormUrlVariate(variate);
    },
    /**
     * 改变的函数：change>upload>change
     * @param {*objcet} file 最新数据
     * @param {*Array} fileList 所有数据
     * @param {*String} variate 当前组件参数命名
     */
    handleChange(file, fileList, variate) {
      if (file.status === "success") {
        this.fileList = this.handleFile(fileList);
        this.setFormUrlVariate(variate);
      }
    },
    /**
     * 处理返回显示数据：默认不显示名称
     * 如果显示需要给后端添加名称可移除此方式
     * @param {*Array} fileList
     * @returns Array
     */
    handleFile(fileList) {
      return fileList.map((obj) => {
        const newObj = { ...obj };
        // 删除指定的key
        delete newObj.name;
        return newObj;
      });
    },
    /**
     * 文件超出个数限制时的钩子
     * @param {*$envent} event
     * @returns 阻止事件冒泡
     */
    exceed(limit) {
      const text = this.isVideo ? "个视频" : "张图片";
      this.$message.info({
        duration: 5000,
        message: `最多上传${limit + text}，删除多余文件后再上传!`,
      });
    },
    /**
     * 预处理判定是否超过限制
     * @param {*Object} event 当前dom
     * @param {*Array} fileList 上传数据
     * @param {*Number} video 是否视频
     * @param {*Number} limit 限制数量
     * @returns
     */
    onUpload(event, limit) {
      if (this.fileList.length + 1 > limit) {
        this.exceed(limit);
        //阻止input上传组件弹出
        return event.stopPropagation();
      }
    },
  },
};
</script>