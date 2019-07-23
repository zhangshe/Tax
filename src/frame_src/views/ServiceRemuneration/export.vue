<template>
  <div id="Serviceexport" class="app-container calendar-list-container">
    <div class="filter-container">
      <span>所得月份：</span>
      <el-date-picker
        size="mini"
        v-model="temp.WorkDate"
        style="width:120px;"
        type="month"
        :clearable="false"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <span>请选择税号：</span>
      <el-select v-model="temp.TaxNumber" size="mini" style="width:200px;">
        <el-option
          v-for="(item,key) in TaxNumberOptions"
          :key="key"
          :label="item.Name"
          :value="item.Code"
        >
          <span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
        </el-option>
      </el-select>
      <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" type="primary" v-waves @click="Excel">导出劳务明细</el-button>
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
        <el-table-column width="220px" fixed="left" align="center" label="单位编码">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgCode}}</span>
          </template>
        </el-table-column>
        <el-table-column width="400px" fixed="left" align="center" label="单位">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" fixed="left" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.ReportStatus }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div>
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
import { getTaxNumberOptions } from "@/frame_src/api/Export";
import { getOrgStatus,ExportServiceTaxDetail } from "@/frame_src/api/ServiceExport";
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
export default {
  name: "Serviceexport",
  directives: {
    waves
  },
  data() {
    return {
      TaxNumberOptions: [],
      temp: {
        OrgCode: this.$store.state.user.orgCode,
        WorkDate: this.$store.state.user.sysTime,
        TaxNumber: "",
        limit: 10,
        page: 1
      },
      tableKey: 0,
      total: 0,
      list: [],
      listLoading: false
    };
  },
  methods: {
    handleFilter() {
      this.getOrgStatu();
    },
    Excel() {
      ExportServiceTaxDetail(this.temp).then(response => {
        if (response.data.code === 2000) {
          window.open(process.env.BASE_API + response.data.item, "_blank");
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
    },
    getOrgStatu() {
      this.listLoading = true;
      getOrgStatus(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: response.data.message,
            type: "success",
            duration: 2000
          });
        } else {
          this.list = null;
          this.total = 0;
          this.$notify({
            position: "bottom-right",
            title: "失败",
            message: response.data.message,
            type: "error",
            duration: 2000
          });
        }
        this.listLoading = false;
      });
    },
    getTaxNumberOptions() {
      getTaxNumberOptions(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.TaxNumberOptions = response.data.items;
          if (this.TaxNumberOptions.length > 0) {
            this.temp.TaxNumber = this.TaxNumberOptions[0].Code;
          }
          this.getOrgStatu();
        }
      });
    },
    handleSizeChange(val) {
      this.temp.limit = val;
      this.getOrgStatu();
    },
    handleCurrentChange(val) {
      this.temp.page = val;
      this.getOrgStatu();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    }
  },
  created() {
    this.getTaxNumberOptions();
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

