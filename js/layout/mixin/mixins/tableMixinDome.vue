<!-- 
    tableMixin Dome
    添加上传组件UploadMixin
    -->
<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryInfo"
        ref="queryForm"
        :inline="true">
        <el-form-item label="用户"
          prop="userName">
          <el-input v-model="queryInfo.userName"
            clearable
            placeholder="搜索用户" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleQuery()"> 搜索 </el-button>
          <el-button type="primary"
            plain
            @click="resetQuery">重置</el-button>
          <el-button type="primary"
            @click="handleClass('add')"
            icon="el-icon-circle-plus-outline">
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading"
        :data="allData"
        row-key="id"
        border
        tooltip-effect="light">
        <el-table-column label="序号"
          type="index"
          width="60"
          align="center">
          <template slot-scope="scope">
            {{
            (queryInfo[currentPage] - 1) * queryInfo[pageSize] +
            scope.$index +
            1
            }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间"
          prop="createTime" />
        <el-table-column v-for="(item, index) in el_table"
          v-if="item.name"
          :key="index"
          :prop="item.prop"
          align="center"
          :width="item.width ? item.width : null">
          <template slot="header">
            <span v-if="item.name instanceof Array ? false : true">{{
              item.name
              }}</span>
            <span v-else>
              <div v-for="(item, index) in item.name"
                :key="index">
                {{ item }}
              </div>
            </span>
          </template>
          <template slot-scope="scope">
            <span v-if="item.fun">
              {{ item.fun(scope.row) }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <!-- 图片/文件是一个没必要用 v-for：table-auto-->
        <el-table-column width="210"
          label="图片"
          :prop="uploadVariate_picUrl">
          <template slot-scope="scope">
            <template v-if="true">
              <el-image :src="scope.row[uploadVariate_picUrl]"
                :preview-src-list="[scope.row[uploadVariate_picUrl]]"
                fit="contain"
                lazy>
                <template slot="placeholder">
                  <i class="el-icon-loading" />
                </template>
              </el-image>
            </template>
            <template v-else>
              <div class="table-auto">
                <div class="table-list"
                  v-for="(item,index)  in formatArrray(scope.row[uploadVariate_picUrl])"
                  :key="index">
                  <el-image :src="item"
                    :preview-src-list="[item]"
                    fit="contain"
                    lazy>
                    <template slot="placeholder">
                      <i class="el-icon-loading" />
                    </template>
                  </el-image>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="200"
          label="文件"
          :prop="uploadVariate_videoUrl">
          <template slot-scope="scope">
            <template v-if="true">
              <div class="table-auto">
                <div class="table-list"
                  v-for="(item,index)  in formatArrray(scope.row[uploadVariate_videoUrl])"
                  :key="index">
                  <video :id="`${index}${scope.row.id}`"
                    poster="@/assets/logo2.png"
                    controls>
                    Your browser does not support the video tag.
                  </video>
                  <el-button type="primary"
                    size="mini"
                    @click="toggleVideo(item,`${index}${scope.row.id}`)">播放</el-button>
                </div>
              </div>
            </template>
            <template v-else>
              <video :id="scope.row.id"
                poster="@/assets/logo2.png"
                controls>
                Your browser does not support the video tag.
              </video>
              <el-button type="primary"
                size="mini"
                @click="toggleVideo(scope.row[uploadVariate_videoUrl],scope.row.id)">播放</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="备注"
          prop="remark" />
        <el-table-column label="地址"
          prop="address"
          show-overflow-tooltip />
        <el-table-column label="操作"
          width="300">
          <template slot-scope="scope">
            <div class="cell-block">
              <el-button type="primary"
                size="mini"
                @click="handleClass('update', scope.row)">编辑</el-button>
              <el-button type="success"
                size="mini"
                @click="handleClass('check', scope.row)">查看</el-button>
              <el-popconfirm title="确定发货吗？"
                @confirm="otherClass('deliver', { id: scope.row.id })">
                <el-button slot="reference"
                  type="primary"
                  size="mini">发货</el-button>
              </el-popconfirm>
              <el-popconfirm title="确定删除当前数据吗？"
                @confirm="otherClass('delete', { id: scope.row.id })">
                <el-button slot="reference"
                  type="danger"
                  size="mini">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页部分-->
      <el-pagination :current-page.sync="queryInfo[currentPage]"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo[pageSize]"
        layout="prev, pager, next"
        :total="allDataTotal"
        background
        @size-change="init"
        @current-change="init" />
    </el-card>
    <el-dialog :title="`订单${titleState}`"
      :visible.sync="dialogVisible"
      width="40%"
      @close="handleClose">
      <el-form ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        :disabled="titleState === '查看'"
        :class="titleState === '查看' ? 'el-form-disabled' : ''">
        <el-form-item label="上传头像"
          :prop="uploadVariate_picUrl">
          <upload :titleState="titleState"
            :ref="uploadVariate_picUrl"
            :isVideo="false"
            :uploadVariate="uploadVariate_picUrl"
            lisType="picture-card"
            :form.sync="form"
            :FOXMOCKAPI="true"></upload>
        </el-form-item>
        <el-form-item label="上传视频"
          :prop="uploadVariate_videoUrl">
          <upload :FOXMOCKAPI="true"
            :titleState="titleState"
            :ref="uploadVariate_videoUrl"
            :uploadVariate="uploadVariate_videoUrl"
            :form.sync="form"
            :limit="2"
            :multiple="true"></upload>
        </el-form-item>
        <el-form-item label="用户"
          prop="userName">
          <el-input v-model="form.userName"
            clearable
            placeholder="请输入用户"
            maxlength="20"
            show-word-limit />
        </el-form-item>
        <el-form-item label="地址"
          prop="address">
          <el-input v-model="form.address"
            clearable
            placeholder="请输入诊断"
            maxlength="20"
            show-word-limit />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"
            clearable
            placeholder="请输入备注"
            maxlength="20"
            show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button @click="handleClose">
          {{ titleState != "查看" ? "取 消" : "确 定" }}
        </el-button>
        <el-button v-if="titleState != '查看'"
          type="primary"
          @click="submit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Upload from '@/layout/components/Widget/Upload.vue'
  import APIData from "@/api/apiTemplate";
  const {
    listAPI_TMD,
    updateAPI_TMD,
    saveAPI_TMD,
    deleteAPI_TMD,
    deliverAPI_TMD,
  } = APIData;
  import mixin from "@/layout/mixin";
  const { tableMixin } = mixin;
  //涉及上传参数
  const uploadVariate_videoUrl = 'videoUrl';
  const uploadVariate_picUrl = 'picUrl';
  const formInit = () => {
    return {
      userName: null,
      address: null,
      remark: null,
      [uploadVariate_videoUrl]: null,
      [uploadVariate_picUrl]: null,
    };
  };
  export default {
    name: "tableMixinDome",
    components: { Upload },
    mixins: [tableMixin],
    data() {
      return {
        listAPI: listAPI_TMD,
        upDateAPI: updateAPI_TMD,
        saveAPI: saveAPI_TMD,
        deleteAPI: deleteAPI_TMD,
        deliverAPI: deliverAPI_TMD,
        queryInfo: {
          userName: null,
        },
        //dialog
        //form表单赋值
        formInit: () => formInit(),
        form: formInit(),
        //涉及上传参数
        uploadList: [uploadVariate_videoUrl, uploadVariate_picUrl],
        uploadVariate_videoUrl,
        uploadVariate_picUrl,
        rules: {
          userName: [
            { required: true, message: "请输入用户", trigger: "blur" },
          ],
          address: [
            { required: true, message: "请输入地址", trigger: "blur" },
          ],
          [uploadVariate_videoUrl]: [
            { required: true, message: `请上传视频`, trigger: "change" },
          ],
          [uploadVariate_picUrl]: [
            { required: true, message: `请上传照片`, trigger: "change" },
          ],
        },
        el_table: [
          {
            name: "用户",
            prop: "userName",
            width: 150,
          },
          {
            name: ["市区", "（地方）"],
            prop: "city",
            width: 150,
          },
        ],
      };
    },
    created() { },
    mounted() { },
    methods: {
      /**
       * 视频点击播放
       * 防止初次加载
       * @param {*String} url 链接
       * @param {*String} id 资源
      */
      toggleVideo(url, id) {
        const video = document.getElementById(id);
        var source = document.createElement('source');
        source.src = url;
        video.appendChild(source);
        // 加载并播放新的视频
        video.load();
        video.play()
      },
    },
  };
</script>