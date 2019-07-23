<template>
  <div id="SalaryAdjustmentQuery" class="app-container calendar-list-container">
     <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="4">
          <treeselect
            :clearable="false"
            v-model="listQuery.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :loadOptions="loadOptions"
            placeholder="请选择单位"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px;"
          />
        </el-col>
        <el-col :span="20">
          <el-date-picker
            size="mini"
            v-model="listQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM"
            placeholder="选择年月"
          ></el-date-picker>
          
          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入姓名"
            v-model="listQuery.S_WorkerName"
            size="mini"
          ></el-input>
          <el-button
            size="mini"
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>

          <!-- <el-button
            size="mini"
            class="filter-item"
            style="margin-left: 10px;"
            @click="handleCreate"
            type="primary"
            icon="el-icon-edit"
          >新增</el-button>-->
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcel">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <el-table
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
        <el-table-column width="95px" fixed="left" align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column width="95px" fixed="left" align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" align="center" label="单位" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项5">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust9 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项6">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust10 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项7">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust11 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项8">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust12 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项9">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust13 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项10">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust14 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项11">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust15 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项12">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust16 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项13">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust17 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项14">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust18 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项5">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust19 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项6">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust20 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项7">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust21 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项8">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust22 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项9">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust23 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项10">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust24 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项11">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust25 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项12">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust26 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项13">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust27 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项14">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust28 |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.S_Remark }}</span>
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
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getTaxAdjustList,
  exportBaseTaxAdjust
} from "@/frame_src/api/taxAdjust";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "SalaryAjustQuery",
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  data() {
    return {
      normalizer(node) {
        return {
          id: node.ORG_CODE,
          label: node.ORG_SHORT_NAME,
          children: node.children
        };
      },
      exportComp: this.$store.state.user.orgName,
      tableKey: 0,
      list: [],
      importList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime
      },

      treeData: []
    };
  },
  filters: {
    parseTime1,
    NumFormat
  },
  methods: {
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getnode(node, instanceId) {
      this.exportComp = node.ORG_SHORT_NAME;
    },
    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },
    getList() {
      this.listLoading = true;
      getTaxAdjustList(this.listQuery).then(response => {
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
    exportExcel() {
      exportBaseTaxAdjust(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.total > 0) {
          this.importList = response.data.items;
          this.exportExcelInfo();
        } else if (response.data.total === 0) {
          this.$notify({
            position: "bottom-right",
            title: "提示信息",
            message: "暂无数据",
            type: "info",
            duration: 2000
          });
        } else {
          this.$notify({
            position: "bottom-right",
            title: "失败",
            message: "导出失败：" + response.data.message,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    exportExcelInfo() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "工号",
          "姓名",
          "单位",
          "调增项5",
          "调增项6",
          "调增项7",
          "调增项8",
          "调增项9",
          "调增项10",
          "调增项11",
          "调增项12",
          "调增项13",
          "调增项14",
          "调减项5",
          "调减项6",
          "调减项7",
          "调减项8",
          "调减项9",
          "调减项10",
          "调减项11",
          "调减项12",
          "调减项13",
          "调减项14",
          "备注"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          // "S_OrgCode",
          "Adjust9",
          "Adjust10",
          "Adjust11",
          "Adjust12",
          "Adjust13",
          "Adjust14",
          "Adjust15",
          "Adjust16",
          "Adjust17",
          "Adjust18",
          "Adjust19",
          "Adjust20",
          "Adjust21",
          "Adjust22",
          "Adjust23",
          "Adjust24",
          "Adjust25",
          "Adjust26",
          "Adjust27",
          "Adjust28",
          "S_Remark"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            this.exportComp + this.listQuery.S_WorkDate.substr(0, 7) + "调整表"
        });
      });
    }
  },
  created() {
    this.loadOrgByCode();
    this.getList();
  },
      activated() {
    this.loadOrgByCode();
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


<style lang="scss">

#SalaryAdjustmentQuery {
  .page {
  text-align: center;
}
  .topSearh {
    margin-bottom: 15px;
  }
  .vue-treeselect__control {
    height: 28px !important;
    width: 100%;
  }
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 28px;
  }
}
</style>

