<template>
  <div id="OneBonusImport" class="app-container calendar-list-container">
    <div class="filter-container">
      <span>当前月份：</span>
      <el-date-picker
        size="mini"
        v-model="importMonth"
        style="width:120px;"
        readonly
        type="month"
        placeholder="选择月"
      ></el-date-picker>
      <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleImport">导入</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-document"
        v-if="this.$store.state.user.orgCode!='100'"
        @click="deleteBonus"
      >清空</el-button>
      <span>模板下载：</span>
      <a class="astyle" :href="urldownload">奖金样表</a>&nbsp;&nbsp;
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
        <el-table-column fixed="left" align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="95px" fixed="left" align="center" label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>-->
        <el-table-column width="180px" align="center" label="导入月份">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|parseTime1}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="奖金">
          <template slot-scope="scope">
            <span>{{scope.row.OneTimeBonus |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="预扣税">
          <template slot-scope="scope">
            <span>{{scope.row.DeductibleTax |NumFormat}}</span>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getOneBonusList,
  uploadTaxBonus,
  delTaxBonus
} from "@/frame_src/api/taxBonus";
import { getReportStatus } from "@/frame_src/api/taxSalary";
export default {
  name: "BonusImport",
  directives: {
    waves
  },
  data() {
    return {
      importMonth: this.$store.state.user.sysTime,
      showTemplateUpload: false,
      showUpload: false,
      tableKey: 0,
      validateCondition: "",
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        S_OrgName: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime
      },
      deldate: {
        dateMonth: this.$store.state.user.sysTime,
        orgCode: this.$store.state.user.orgCode,
        userId: this.$store.state.user.userId
      },
      limitNum: 1,
      urldownload: process.env.BASE_API + "/ExcelModel/奖金样表.xls",
      urlUpload: process.env.BASE_API + "/TaxBonus/validateTaxBonus",
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
    NumFormat
  },
  methods: {
    getList() {
      this.listLoading = true;
      getOneBonusList(this.listQuery).then(response => {
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
        // uploadTaxBonus(fd).then(function(res){
        //      message = res.message;
        //      if(res.data.code===2000){
        //             title = "成功";
        //             type = "success";
        //         }
        //     })

        return new Promise((resolve, reject) => {
          uploadTaxBonus(fd)
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
      }
      this.$notify({
        position: "bottom-right",
        title: title,
        message: message,
        type: type,
        duration: 2000
      });
      this.showUpload = false;
      this.getList();
    },
    handleRemove(file, fileList) {},
    handleImport() {
      const data = {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime
      };
      getReportStatus(data).then(response => {
        if (response.data.items.length === 1) {
          if (response.data.items[0].IsComputeTax == 1) {
            if (response.data.items[0].ReportStatus == 2) {
              this.$notify({
                position: "bottom-right",
                title: "警告",
                message: "已经上报，不能导入，如有需要请联系上级单位进行解锁！",
                type: "warning",
                duration: 5000
              });
            } else {
              this.fileList = [];
              this.showUpload = true;
            }
          } else {
            //没有导入权限
            this.$notify({
              position: "bottom-right",
              title: "警告",
              message: "您没有导入权限！",
              type: "warning",
              duration: 5000
            });
          }
        } else {
          this.fileList = [];
          this.showUpload = true;
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitNum}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    deleteBonus() {
      const data = {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime
      };
      getReportStatus(data).then(response => {
        this.validateCondition = Object.assign({}, response.data.items[0]);
        if (this.validateCondition.ReportStatus === 2) {
          this.$notify({
            position: "bottom-right",
            title: "操作失败",
            message:
              "本部门已上报,不可清空奖金数据,若需要重新导入,请联系上级部门解锁",
            type: "error",
            duration: 3000
          });
        } else {
          this.$confirm("是否清空本月奖金数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              delTaxBonus(this.deldate).then(response => {
                var message = response.data.message;
                var title = "失败";
                var type = "error";
                if (response.data.code === 2000) {
                  title = "成功";
                  type = "success";
                }
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
      });

      //this.getList();
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

