<template>
  <div id="IndividualTaxCalculateConfig" class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button> -->
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateTaxComputeconfig">保存</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="list"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        :header-cell-class-name="tableRowClassName"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="95px" fixed="left" align="center" label="序号">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column width="150px" prop="TermName" align="center" label="工资条目"></el-table-column>
        <el-table-column width="130px" prop="TermCode" align="center" label="条目编码"></el-table-column>
        <el-table-column width="130px" align="center" label="按月税务核算">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.MonthCompute" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="按月税务核算比例（%）">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.MonthProportion"
              size="mini"
              @dblclick.native="edit"
              :disabled="editStatus"
            >
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <div>
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
import {
  getTaxComputeconfig,
  updateTaxComputeconfig
} from "@/frame_src/api/ParamsConfig";
export default {
  name: "IndividualTaxCalculateConfig",
  directives: {
    waves
  },
  data() {
    return {
      showUpload: false,
      editStatus: true,
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        userid: this.$store.state.user.userId
      }
    };
  },
  methods: {
    getList() {
      this.listLoading = false;
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.listUpdate.CONF_NAME = "";
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getTaxComputeconfig();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getTaxComputeconfig();
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
    HandleCreate() {
      this.dialogStatus = "create";
      this.showUpload = true;
    },
    submit() {},
    edit() {
      this.editStatus = false;
    },
    del(row) {},
    getTaxComputeconfig() {
      getTaxComputeconfig(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
        }
      });
    },
    updateTaxComputeconfig() {
      let arr = Array.from(this.list);
      arr.push(this.temp);
      updateTaxComputeconfig(arr).then(response => {
        if (response.data.code === 2000) {
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: response.data.message,
            type: "success",
            duration: 2000
          });
          //this.getTaxComputeconfig();
        }
      });
    }
  },
  mounted() {
    this.getTaxComputeconfig();
  },
  created() {
    this.getList();
  },
  activated() {
    this.getTaxComputeconfig();
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
  },
  filter: {}
};
</script>


<style lang="scss" scoped>
</style>