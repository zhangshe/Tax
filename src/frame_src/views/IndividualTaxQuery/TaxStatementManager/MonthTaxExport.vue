<template>
  <div id="MonthTaxExport">
    <el-card>
          <div class="topSearh">
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
            @select="getnode"
          />
        </el-col>
        <el-col :span="20">
          <el-date-picker
            size="mini"
            v-model="listQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            placeholder="选择年月"
            :clearable="false"
          ></el-date-picker>

          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入部门名称"
            v-model="listQuery.S_Department"
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
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcel">导出</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportTest">导出</el-button>
        </el-col>
      </el-row>
          </div>
      <el-row>
        <el-col :span="24">
          <el-table size="mini" border style="width: 100%" fit :data="statistics">
            <el-table-column label="税率(%)" prop="D_SL">
              <template slot-scope="scope">
                <span>{{scope.row.D_SL  | NumFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column label="月度" align="center">
              <el-table-column label="人次" align="right" prop="total2">
                <template slot-scope="scope">
                  <span>{{scope.row.total2}}</span>
                </template>
              </el-table-column>
              <el-table-column label="基数" align="right" prop="totalJS2">
                <template slot-scope="scope">
                  <span>{{scope.row.totalJS2  | NumFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="税额" align="right" prop="totalDJJE2">
                <template slot-scope="scope">
                  <span>{{scope.row.totalDJJE2  | NumFormat}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="累计" align="center">
              <el-table-column label="人次" align="right" prop="total">
                <template slot-scope="scope">
                  <span>{{scope.row.total}}</span>
                </template>
              </el-table-column>
              <el-table-column label="基数" align="right" prop="totalJS">
                <template slot-scope="scope">
                  <span>{{scope.row.totalJS | NumFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="税额" align="right"  prop="totalDJJE">
                <template slot-scope="scope">
                  <span>{{scope.row.totalDJJE | NumFormat}}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { NumFormat } from "@/frame_src/filters/index.js";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { getMonthTax,exportMonthTax } from "@/frame_src/api/MonthTaxExport";
export default {
  data() {
    return {
      statistics: [],
      DateYear: "",
      people: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        S_Department: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        queryType: "query",
        S_OrgName: this.$store.state.user.departName,
      },
      treeData: [],
      normalizer(node) {
        return {
          id: node.ORG_CODE,
          label: node.ORG_SHORT_NAME,
          children: node.children
        };
      },
      importList: []
    };
  },
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  filters: {
    parseTime1,
    NumFormat
  },
  methods: {
        getnode(node, instanceId) {
      this.listQuery.S_OrgName = node.ORG_SHORT_NAME;
    },
    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },
    handleFilter() {
      this.listQuery.queryType = "query";
      this.getList();
    },
    getList() {
      getMonthTax(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.items.length > 0) {
          this.statistics = response.data.items;
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
    exportTest() {
      exportMonthTax(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          window.open(process.env.BASE_API +response.data.item, '_blank');
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
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.queryType = "query";
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.listQuery.queryType = "query";
      this.getList();
    },

    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
      if (rowIndex < 4) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    exportExcel() {
      this.listQuery.queryType = "Export";
      getMonthTax(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.items.length > 0) {
          this.importList = response.data.items;
          this.exportExcelInfo();
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
    exportExcelInfo() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "税率",
          "人次",
          "基数",
          "税额",
          "人次",
          "基数",
          "税额"
        ];
        const filterVal = [
          "D_SL",
          "total2",
          "totalJS2",
          "totalDJJE2",
          "total",
          "totalJS",
          "totalDJJE"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.listQuery.S_WorkDate.substr(0, 7) + "月度地税报表"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
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
};
</script>


<style lang="scss" >
#MonthTaxExport {
  .topSearh {
    margin-bottom: 15px;
  }
  .page {
    text-align: center;
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