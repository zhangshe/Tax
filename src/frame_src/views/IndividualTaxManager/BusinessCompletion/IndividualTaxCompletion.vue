<template>
  <div id="IndividualTaxCompletion" class="app-container calendar-list-container">
    <div class="filter-container">
      <span>所得月份：</span>
      <el-date-picker
        size="mini"
        v-model="temp.S_WorkDate"
        style="width:120px;"
        type="month"
        placeholder="选择月"
        disabled
      ></el-date-picker>
      <span>状态：</span>
      <el-select
        v-model="temp.ReportStatus"
        size="mini"
        style="width:120px;"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="list"
        :header-cell-class-name="tableRowClassName"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column fixed="left" align="center" label="单位">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column idth="100px" fixed="left" align="center" label="所得月份">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|changeMonth}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.ReportStatus|formatStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态操作"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.ReportStatus===2"
              @click="unlock(scope.row)"
              plain
              style="width:80px;"
            >点击解锁</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.ReportStatus===1"
              @click="locking(scope.row)"
              style="width:80px;"
              plain
            >点击锁定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="header">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="temp.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="temp.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import {
  getDepartmentStatus,
  unlock,
  locking
} from "@/frame_src/api/BusinessCompelete";
import { parseTime } from "@/frame_src/utils";
export default {
  name: "IndividualTaxCompletion",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      temp: {
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        ReportStatus: "",
        limit: 10,
        page: 1
      },
      options: [
        {
          value: -1,
          label: "待导入"
        },
        // {
        //   value: 0,
        //   label: "待计算"
        // },
        {
          value: 1,
          label: "待上报"
        },
        {
          value: 2,
          label: "已上报"
        }
      ]
    };
  },

  methods: {
    resetTemp() {
      this.temp = {
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        ReportStatus: "",
        limit: 10,
        page: 1
      };
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.listUpdate.CONF_NAME = "";
    },
    handleSizeChange(val) {
      this.temp.limit = val;
      this.getDepartmentStatus();
    },
    handleCurrentChange(val) {
      this.temp.page = val;
      this.getDepartmentStatus();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    handleFilter() {
      this.getDepartmentStatus();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    exportExcel() {},
    Lock(row) {},
    unlock(data) {
      this.$confirm("您确定要解锁" + data.S_OrgName + "的上报功能吗?", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "继续执行",
        cancelButtonText: "放弃操作",
        type: "warning"
      })
        .then(() => {
          data.P_OrgCode=this.$store.state.user.orgCode;
          unlock(data).then(response => {
            if (response.data.code === 2000) {
              this.getDepartmentStatus();
              this.$notify({
                position: "bottom-right",
                //title: "操作提示",
                message: "操作成功！",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                position: "bottom-right",
                title: "失败",
                message: response.data.message,
                type: "error",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "操作已取消"
          // });
        });
    },
    locking(data) {
      this.$confirm("您确定要锁定" + data.S_OrgName + "的上报功能吗?", "提示", {
        confirmButtonText: "继续执行",
        cancelButtonText: "放弃操作",
        type: "warning"
      })
        .then(() => {
          (data.S_UpdateBy = this.$store.state.user.userId),
            locking(data).then(response => {
              if (response.data.code === 2000) {
                this.getDepartmentStatus();
                this.$notify({
                  position: "bottom-right",
                  //title: "操作提示",
                  message: "操作成功！",
                  type: "success",
                  duration: 2000
                });
              } else {
                this.$notify({
                  position: "bottom-right",
                  title: "失败",
                  message: response.data.message,
                  type: "error",
                  duration: 2000
                });
              }
            });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "操作已取消"
          // });
        });
    },
    getDepartmentStatus() {
      getDepartmentStatus(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
        }
      });
    }
  },
  mounted() {
    this.getDepartmentStatus();
  },
        activated() {
  this.getDepartmentStatus();
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
  },
  filters: {
    parseTime,
    formatStatus(val) {
      switch (val) {
        case -1:
          return "待导入";
          break;
        case 0:
          return "待计算";
          break;
        case 1:
          return "待上报";
          break;
        case 2:
          return "已上报";
          break;
      }
    },
    changeMonth(val) {
      if (val != null) {
        return val.substring(0, 7);
      }
    },
    formatMes(val) {
      if (val === 1) {
        return "解锁";
      } else if (val === 2) {
        return "锁定";
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.header {
  text-align: center;
}
</style>

