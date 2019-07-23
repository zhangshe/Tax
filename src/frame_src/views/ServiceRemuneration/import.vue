<template>
  <div id="import" class="app-container calendar-list-container">
    <div class="filter-container">
      <span>工作月份：</span>
      <el-date-picker
        size="mini"
        v-model="listQuery.S_WorkDate"
        style="width:120px;"
        type="month"
        placeholder="选择月"
      ></el-date-picker>
      <el-select size="mini" v-model="listQuery.flag">
        <el-option
          v-for="(item,key) in queryOption"
          :key="key"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        placeholder="请输入查询工号"
        size="mini"
        v-model="listQuery.workNumber"
        style="width:120px;"
      ></el-input>
      <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleImport">导入</el-button>
      <el-button size="mini" type="primary" icon="el-icon-document" @click="deleteSalary">清空</el-button>
      <span>模板下载：</span>
      <a class="astyle" :href="urldownload1">样表</a>&nbsp;&nbsp;
      <!-- <el-button size="mini" type="primary" icon="el-icon-document" @click="showTemplateUpload=true">模板下载</el-button> -->
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="list"
        :header-cell-class-name="tableRowClassName"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="姓名" fixed="left" prop="WorkerName" width="100px"></el-table-column>
        <el-table-column label="工号" fixed="left" prop="WorkerCode" width="100px"></el-table-column>
        
        <el-table-column label="工作月份" fixed="left">
          <template slot-scope="scope">{{scope.row.WorkDate|parseTime1}}</template>
        </el-table-column>
        <el-table-column label="单位名称" prop="ORG_NAME" width="150px"></el-table-column>
        <el-table-column label="证照类型" prop="IDtype" width="100px"></el-table-column>
        <el-table-column label="证照号码" prop="IDNumber" width="150px"></el-table-column>
        <el-table-column label="所得项目" prop="IncomeItem" width="120px"></el-table-column>
        <el-table-column label="本期收入" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.Income|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="本期免税收入" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.Tax|NumFormat}}</template>
        </el-table-column>

        <el-table-column label="商业健康险" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.CommercialHealthinsurance|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="税延养老保险" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.EndowmentInsurance|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="准予扣除的捐赠额" width="130px" align="right">
          <template slot-scope="scope">{{scope.row.Donation|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="其他" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.other|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="减免税额" width="110px" align="right">
          <template slot-scope="scope">{{scope.row.TaxSavings|NumFormat}}</template>
        </el-table-column>
        <el-table-column label="备注" width="110px" align="right" prop="Remark"></el-table-column>
      </el-table>
      <div class="page">
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

    <el-dialog :visible.sync="showUpload">
      <el-card class="box-card">
        <div class="filter-container">
          <span>当前工作月份：{{this.$store.state.user.sysTime|parseTime1}}</span>
          <el-upload
            accept=".xls, .xlsx"
            :limit="limitNum"
            :action="urlUpload"
            :data="filedata"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            :on-exceed="handleExceed"
            class="upload-demo"
            ref="upload"
            :auto-upload="false"
            :file-list="fileList"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >确认导入</el-button>
          </el-upload>
        </div>
      </el-card>
    </el-dialog>

    <!-- <el-dialog :visible.sync="showTemplateUpload" title="模板下载">
            <el-card class="box-card">
                <div class="filter-container">
                    <div style="margin-bottom:5px;">
                        <a :href="urldownload">样表一下载</a>&nbsp;&nbsp;
                        <a :href="urldownload">样表二下载</a>
                    </div>
                </div>
            </el-card>
    </el-dialog>-->
  </div>
</template>

<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
// import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getlist,
  getcount,
  importdata,
  delData,
  getReportState
} from "@/frame_src/api/ServiceImport";
export default {
  name: "import",
  directives: {
    waves
  },
  data() {
    return {
      importMonth: this.$store.state.user.sysTime,
      //showTemplateUpload:false,
      showUpload: false,
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      deldate: {
        dateMonth: this.$store.state.user.sysTime,
        orgCode: this.$store.state.user.orgCode,
        id: this.$store.state.user.userId
      },
      listQuery: {
        page: 1,
        limit: 10,
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        id: this.$store.state.user.userId,
        flag: 1,
        workerNumber: ""
      },
      queryOption: [
        { label: "当前单位", value: 1 },
        { label: "当前及以下单位", value: 2 }
      ],
      limitNum: 1,
      urldownload1: process.env.BASE_API + "/ExcelModel/劳务报酬明细表.xls",
      urlUpload: process.env.BASE_API + "/ServiceRemunerationImport/validate",
      filedata: {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime,
        userId: this.$store.state.user.userId,
        orgName: this.$store.state.user.orgName
      },
      fileList: []
    };
  },
  filters: {
    parseTime1,
    NumFormat,
    dataformat(val) {
      if (val != null && val != "") {
        return val.substring(0, 10);
      } else {
        return val;
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getlist(this.listQuery).then(response => {
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

    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
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
    submitUpload() {
      this.$refs.upload.submit();
    },

    handleSuccess(res, file, fileList) {
      var message = res.message;
      var title = "失败";
      var type = "error";
      if (res.code === 2000) {
        let fd = new FormData();
        fd.append("filePath", res.item); //传文件
        fd.append("orgCode", this.$store.state.user.orgCode); //传其他参数
        fd.append("orgName", this.$store.state.user.orgName); //传其他参数
        fd.append("dateMonth", this.$store.state.user.sysTime); //传其他参数
        fd.append("userId", this.$store.state.user.userId); //传其他参数
        return new Promise((resolve, reject) => {
          importdata(fd)
            .then(response => {
              if (response.data.code === 2000) {
                message = "导入成功！";
                title = "成功";
                type = "success";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });

                this.showUpload = false;
                this.getList();
              } else {
                message = response.data.message;
                title = "失败";
                type = "error";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });
                this.showUpload = false;
                this.getList();
              }
            })
            .catch(error => {});
        });
      } else if (res.code === 2001) {
        this.$confirm(message + "确认导入数据吗？", "导入确认", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "放弃"
        })
          .then(() => {
            let fd = new FormData();
            fd.append("filePath", res.item); //传文件
            fd.append("orgCode", this.$store.state.user.orgCode); //传其他参数
            fd.append("orgName", this.$store.state.user.orgName); //传其他参数
            fd.append("dateMonth", this.$store.state.user.sysTime); //传其他参数
            fd.append("userId", this.$store.state.user.userId); //传其他参数
            return new Promise((resolve, reject) => {
              UploadTaxBusiness(fd)
                .then(response => {
                  if (response.data.code === 2000) {
                    message = "导入成功！";
                    title = "成功";
                    type = "success";
                    this.$notify({
                      position: "bottom-right",
                      title: title,
                      message: message,
                      type: type,
                      duration: 5000
                    });
                    this.showUpload = false;
                    this.getList();
                  } else {
                    message = response.data.message;
                    title = "失败";
                    type = "error";
                    this.$notify({
                      position: "bottom-right",
                      title: title,
                      message: message,
                      type: type,
                      duration: 5000
                    });
                    this.showUpload = false;
                    this.getList();
                  }
                })
                .catch(error => {});
            });
          })
          .catch(() => {});
      } else {
        this.$notify({
          position: "bottom-right",
          title: title,
          message: message,
          type: type,
          duration: 5000
        });
      }

      this.showUpload = false;
      this.getList();
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitNum}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleImport() {
      const temp = {
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        id: this.$store.state.user.userId
      };
      const temp1 = {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime
      };
      getReportState(temp1).then(response => {
        if (response.data.code === 2000) {
          let state = response.data.state;
          if (state === 0) {
            this.$notify({
              position: "bottom-right",
              title: "警告",
              message: "当前单位已经上报,不能导入！",
              type: "warning",
              duration: 5000
            });
          } else if (state != 0) {
            getcount(temp).then(response => {
              if (response.data.code === 2000) {
                let num = response.data.items[0].num;
                if (num > 0) {
                  this.$confirm(
                    "系统检测到本用户当月已经导入过劳务信息,是否清空上次导入的数据？",
                    "提示",
                    {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }
                  )
                    .then(() => {
                      delData(this.deldate).then(response => {
                        var message = response.data.message;
                        var title = "失败";
                        var type = "error";
                        if (response.data.code === 2000) {
                          title = "成功";
                          type = "success";
                        }
                        this.getList();
                        this.$notify({
                          position: "bottom-right",
                          title: title,
                          message: message,
                          type: type,
                          duration: 2000
                        });
                      });
                    })
                    .catch(() => {});
                } else if (num === 0) {
                  this.showUpload = true;
                  this.fileList = [];
                }
              }
            });
          }
        }
      });
    },
    deleteSalary() {
      this.$confirm("是否清空本月已导入的劳务报酬数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delData(this.deldate).then(response => {
            var message = response.data.message;
            var title = "失败";
            var type = "error";
            if (response.data.code === 2000) {
              title = "成功";
              type = "success";
            }
            this.getList();
            this.$notify({
              position: "bottom-right",
              title: title,
              message: message,
              type: type,
              duration: 2000
            });
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getList();
  },
  activated() {
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
.page {
  text-align: center;
}
a.astyle {
  color: #333;
  text-decoration: none;
}
a.astyle:hover {
  color: #cc3300;
  text-decoration: underline;
}
</style>                                                                                                   

