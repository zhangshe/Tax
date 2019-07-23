<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入公告编号"
        v-model="listQuery.NOTICE_CODE"
        size="mini"
      ></el-input>
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入公告标题"
        v-model="listQuery.NOTICE_TITLE"
        size="mini"
      ></el-input>

      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
        size="mini"
      >查询</el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="el-icon-edit"
        size="mini"
      >新增</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        :data="list"
        :header-cell-class-name="tableRowClassName"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        size="mini"
      >
        <el-table-column
          width="220"
          align="center"
          :show-overflow-tooltip="true"
          prop="NOTICE_CODE"
          label="公告编号"
        >
          <!-- <template slot-scope="scope">
                        <span>{{scope.row.NOTICE_CODE}}</span>
          </template>-->
        </el-table-column>

        <el-table-column
          header-align="center"
          style="text-align:left;"
          :show-overflow-tooltip="true"
          prop="NOTICE_TITLE"
          label="公告标题"
        >
          <!-- <template slot-scope="scope" >
                        <span>{{scope.row.NOTICE_TITLE}}</span>
          </template>-->
        </el-table-column>

        <el-table-column
          width="200"
          align="center"
          :show-overflow-tooltip="true"
          prop="CREATER"
          label="创建人"
        >
          <!-- <template slot-scope="scope">
                        <span>{{scope.row.CREATER}}</span>
          </template>-->
        </el-table-column>

        <el-table-column
          width="300"
          align="center"
          :show-overflow-tooltip="true"
          prop="NOTICE_ORGNAME"
          label="单位名称"
        >
          <!-- <template slot-scope="scope">
                        <span>{{scope.row.NOTICE_ORGNAME}}</span>
          </template>-->
        </el-table-column>
        <el-table-column
          width="260"
          align="center"
          :show-overflow-tooltip="true"
          label="创建日期"
          prop="NOTICE_DATETIME"
          :formatter="dateFormat"
        >
          <!-- <template slot-scope="scope">
                        <span>{{scope.row.NOTICE_DATETIME}}</span>
          </template>-->
        </el-table-column>
        <el-table-column align="center" label="操作" width="390">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="handleUpload(scope.row)">上传</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--详情-->
    <el-dialog :visible.sync="detailVisible" title="详情" width="800px">
      <el-card>
        <el-form :rules="rules" ref="dataForm" :model="temp">
          <el-row type="flex">
            <el-col :span="2"></el-col>
            <el-col :span="20">
              <div class="noticecontent">
                <div slot="header" class="header" style="text-align:center;">
                  {{temp.NOTICE_TITLE}}
                </div>
                <div class="content">
                  <el-row>
                    <el-col :span="24">
                      <p v-html="temp.NOTICE_CONTENT"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row v-if="detailList.length>0">
                  <el-col :span="24">附件：
                    <div style="margin-left:25px;" v-for="(item,key) in detailList" :key="key">
                      <el-button
                        @click="downLoad(item)"
                        type="primary"
                        size="text"
                      >{{item.FILE_NAME}}</el-button>
                    </div>
                    <!-- <a target="blank" :href="baseurl+item.FILE_URL" v-for="(item,key) in detailList" :key="key">{{item.FILE_NAME}}</a> -->
                  </el-col>
                </el-row>
                <div class="foot">
                  <el-row>
                    <el-col :span="24">作者：{{temp.CREATER}} 发布时间：{{temp.CREATE_DATE | parseTime}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
    <!--修改-->
    <el-dialog :visible.sync="editVisible" :title="textMap[dialogStatus]" width="800px">
      <el-card>
        <el-form
          :rules="rules"
          ref="dataFormInfo"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 99%;"
        >
          <!-- <el-form-item :label="$t('noticeTable.notice_code')+':'" prop="NOTICE_CODE">
                        <el-input v-model="temp.NOTICE_CODE"></el-input>
          </el-form-item>-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="公告编码" prop="NOTICE_CODE">
                <el-input
                  v-model="temp.NOTICE_CODE"
                  style="width:240px;"
                  :disabled="true"
                  placeholder="系统自动生成"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="NOTICE_DATETIME">
                <!-- <el-date-picker type="date" placeholder="发布时间" v-model="temp.NOTICE_DATETIME" style="width: 100%;"></el-date-picker> -->
                <el-date-picker
                  v-model="temp.NOTICE_DATETIME"
                  style="width:100%;"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="12:00:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="标题" prop="NOTICE_TITLE">
            <el-input v-model="temp.NOTICE_TITLE" width="400px"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('noticeTable.notice_content')+':'" prop="NOTICE_CONTENT">
                        <quillEditor @listenToEditorChange="EditorChange" v-bind:content="temp.NOTICE_CONTENT" v-bind:apiUrl="urlPicUpload">
                        </quillEditor>
          </el-form-item>-->
          <div class="editor-container">
            <UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
          </div>
        </el-form>
        <div style="text-align:center;margin-top:15px;">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button v-else type="primary" @click="updateData">保存</el-button>
        </div>
      </el-card>
    </el-dialog>
    <!--上传-->
    <el-dialog :visible.sync="uploadVisible" title="上传">
      <!-- <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 94%; margin-left:6%;'> -->
      <el-card>
        <!-- <el-upload class="upload-demo" ref="upload" :action="urlUpload" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-success="handleSuccess" :before-remove="beforeRemove" :headers="headers" :file-list="fileList">
                        <el-button class="filter-item" type="primary" icon="el-icon-edit">点击上传</el-button>
        </el-upload>-->
        <el-upload
          class="upload-demo"
          multiple
          :action="urlUpload"
          :data="filedata"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :headers="headers"
          :file-list="fileList"
        >
          <el-button class="filter-item" type="primary" icon="el-icon-edit">点击上传</el-button>
        </el-upload>
      </el-card>

      <!-- </el-form>-->
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchNoticeList,
  createNoticeArticle,
  updateNoticeData,
  updateNoticeArticle,
  fetchNoticeDetailList,
  createNoticeDetailArticle,
  updateNoticeDetailArticle
} from "@/frame_src/api/notice";
import waves from "@/frame_src/directive/waves"; // 水波纹指令
//import quillEditor from "@/frame_src/components/QuillEditor";
import { parseTime } from "@/frame_src/utils/index.js";
import Moment from "moment";
import { getToken } from "@/frame_src/utils/auth";
//import Quill from "quill";
import UE from "../../components/ue.vue";
var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif"
];
// var Font = Quill.import("formats/font");
// Font.whitelist = fonts; //将字体加入到白名单
// Quill.register(Font, true);
export default {
  name: "noticeManager",
  directives: {
    waves
  },
  data() {
    return {
      defaultMsg: "&nbsp;",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      baseurl: process.env.BASE_API,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        NOTICE_CODE: "",
        NOTICE_TITLE: ""
      },
      temp: {
        NOTICE_ID: "",
        NOTICE_CODE: "",
        NOTICE_TITLE: "",
        NOTICE_CONTENT: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: "",
        NOTICE_DATETIME: "",
        CREATER: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: ""
      },
      filedata: {
        noticeId: "",
        creater: ""
      },
      textMap: {
        update: "修改公告",
        create: "添加公告"
      },
      detailVisible: false,
      editVisible: false,
      uploadVisible: false,
      downloadLoading: false,
      rules: {
        NOTICE_TITLE: [
          {
            required: true,
            message: "公告标题不能为空",
            trigger: "change"
          }
        ],
        NOTICE_DATETIME: [
          {
            required: true,
            message: "发布时间不能为空",
            trigger: "change"
          }
        ]
      },
      dialogStatus: "",
      urlUpload: process.env.BASE_API + "/noticedetail/uploadNoticeFile",
      urlPicUpload: process.env.BASE_API + "Values/uploadNoticePic",
      fileList: [],
      detailList: [],
      listQuery: {
        page: 1,
        limit: 20,
        NOTICE_CODE: "",
        NOTICE_TITLE: "",
        NOTICE_CONTENT: "",
        NOTICE_DATETIME: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: "",
        CREATER: "",
        BEGIN_NOTICE_DATETIME: "",
        END_NOTICE_DATETIME: ""
      }
      //content:''
    };
  },
  components: {
    //quillEditor,
    UE
  },
  filters: {
    parseTime
  },
  methods: {
    downLoad(data) {
      window.open(this.baseurl + data.FILE_URL);
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return Moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getList() {
      this.listLoading = true;
      fetchNoticeList(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$notify({
            position: "bottom-right",
            title: "失败",
            message: response.data.message,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    resetTemp() {
      if (this.temp.NOTICE_CONTENT != null || this.temp.NOTICE_CONTENT != "") {
        setTimeout(() => {
          this.$refs.ue.setUEContent("&nbsp;");
        }, 500);
      }
      this.temp = {
        NOTICE_ID: "",
        NOTICE_CODE: "",
        NOTICE_TITLE: "",
        NOTICE_CONTENT: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: "",
        CREATER: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: ""
      };
    },
    EditorChange(data) {
      this.temp.NOTICE_CONTENT = data.editorContent;
    },
    handleDetail(row) {
      this.detailList = [];
      const query = { NOTICE_ID: row.NOTICE_ID };
      fetchNoticeDetailList(query).then(response => {
        if (response.data.code === 2000) {
          this.detailList = response.data.items;
        } else {
          this.detailList = [];
        }
      });
      this.detailVisible = true;
      this.temp = Object.assign({}, row); // copy obj
    },
    handleCreate() {
      this.resetTemp();
      this.editVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataFormInfo"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      //this.temp.NOTICE_CONTENT=this.$refs.ue.setUEContent();
      this.editVisible = true;
      this.dialogStatus = "update";
      //this.content=row.NOTICE_CONTENT
      //this.$refs.ue.setUEContent(this.temp.PLAT_RUNREQUIRE);
      // let first=document.getElementsByClassName('view');
      // first.innerHTML=this.temp.NOTICE_CONTENT
      setTimeout(() => {
        this.$refs.ue.setUEContent(this.temp.NOTICE_CONTENT);
      }, 2000);

      this.$nextTick(() => {
        this.$refs["dataFormInfo"].clearValidate();
      });
    },
    handleUpload(row) {
      this.uploadVisible = true;
      this.filedata.noticeId = row.NOTICE_ID;
      this.filedata.creater = this.$store.state.user.name;
      this.load();
    },
    handleDelete(row) {
      this.$confirm("确认删除记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const query = { NOTICE_ID: row.NOTICE_ID };
          updateNoticeArticle(query).then(response => {
            this.message = response.data.message;
            this.title = "失败";
            this.type = "error";
            if (response.data.code === 2000) {
              // const index = this.list.indexOf(row)
              // this.list.splice(index, 1)
              this.getList();
              this.title = "成功";
              this.type = "success";
            }
            this.$notify({
              position: "bottom-right",
              title: this.title,
              message: this.message,
              type: this.type,
              duration: 2000
            });
          });
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });
        });
    },
    createData() {
      // 创建
      this.$refs["dataFormInfo"].validate(valid => {
        if (valid) {
          // this.temp.userId = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = "ppp" //当前登陆人
          this.temp.NOTICE_ORGID = this.$store.state.user.orgCode;
          this.temp.NOTICE_ORGNAME = this.$store.state.user.departName;
          this.temp.CREATER = this.$store.state.user.name;
          this.temp.NOTICE_CONTENT = this.$refs.ue.getUEContent();
          if (
            this.temp.NOTICE_CONTENT === null ||
            this.temp.NOTICE_CONTENT === ""
          ) {
            this.temp.NOTICE_CONTENT = "&nbsp;";
          }
          createNoticeArticle(this.temp).then(response => {
            var message = response.data.message;
            var title = "失败";
            var type = "error";
            if (response.data.code === 2000) {
              this.getList();
              title = "成功";
              type = "success";
              // this.list.unshift(this.temp)
            }
            this.editVisible = false;
            this.$notify({
              position: "bottom-right",
              title: title,
              message: message,
              type: type,
              duration: 2000
            });
          });
        }
      });
    },
    updateData() {
      this.$refs["dataFormInfo"].validate(valid => {
        if (valid) {
          this.temp.NOTICE_CONTENT = this.$refs.ue.getUEContent();
          if (
            this.temp.NOTICE_CONTENT === null ||
            this.temp.NOTICE_CONTENT === ""
          ) {
            this.temp.NOTICE_CONTENT = "&nbsp;";
          }
          const tempData = Object.assign({}, this.temp); // 这样就不会共用同一个对象
          updateNoticeData(tempData).then(response => {
            var message = response.data.message;
            var title = "失败";
            var type = "error";
            if (response.data.code === 2000) {
              this.getList();
              title = "成功";
              type = "success";
              // for (const v of this.list) {
              //   if (v.CONF_CODE === this.temp.CONF_CODE) {
              //     const index = this.list.indexOf(v)
              //     this.list.splice(index, 1, this.temp)
              //     break
              //   }
              // }
            }
            this.editVisible = false;
            this.$notify({
              position: "bottom-right",
              title: title,
              message: message,
              type: type,
              duration: 2000
            });
          });
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    //upload
    load() {
      // 查询数据
      this.fileList = [];
      const query = { NOTICE_ID: this.filedata.noticeId };
      fetchNoticeDetailList(query).then(response => {
        response.data.items.forEach(element => {
          var obj = {};
          var fileobj = {
              id: "",
              name: "",
              url: ""
            },
            obj = JSON.parse(JSON.stringify(element));
          fileobj.id = obj.NOTICE_DETAIL_ID;
          fileobj.name = obj.FILE_NAME;
          fileobj.url = obj.FILE_URL;
          this.fileList.push(fileobj);
        });
      });
    },
    handleRemove(file, fileList) {
      const query = { NOTICE_DETAIL_ID: file.id };
      updateNoticeDetailArticle(query).then(response => {
        this.message = response.data.message;
        this.title = "失败";
        this.type = "error";
        if (response.data.code === 2000) {
          this.load();
          this.title = "成功";
          this.type = "success";
        }
        this.$notify({
          position: "bottom-right",
          title: this.title,
          message: this.message,
          type: this.type,
          duration: 2000
        });
      });
    },
    handlePreview(file) {},
    handleSuccess(res, file, fileList) {
      var message = res.message;
      var title = "失败";
      var type = "error";
      if (res.code === 2000) {
        //this.getList();
        this.load();
        title = "成功";
        type = "success";
        this.showUpload = false;
      }
      this.$notify({
        position: "bottom-right",
        title: title,
        message: message,
        type: type,
        duration: 2000
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {}
  },
  created() {
    this.listLoading = false;
    this.getList();
  },
  computed: {
    getRoleLevel() {
      if (this.$store.state.user.roleLevel === "admin") {
        return true;
      } else {
        return false;
      }
    },
    headers() {
      return {
        "X-Token": getToken()
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.quilldiv {
  height: 200px;
}
.noticecontent {
  margin-top: 20px;
  min-height: 500px;
  .header {
    font-size: 25px;
    font-weight: bold;
  }
  .content {
    font-size: 18px;
  }
  .foot {
    float: right;
    font-size: 12px;
    color: gray;
  }
  .back {
    float: right;
  }
  .el-card {
    font-family: "微软雅黑";
  }
}
</style>