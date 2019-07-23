<template>
  <div id="TaxpayerChange" class="app-container calendar-list-container">
    <el-card>
      <!-- <div style="text-align: center; font-weight: bold;margin-bottom:15px;">
        <span>{{searchTemp.ImportMonth|changeYear}}年{{searchTemp.ImportMonth|changeMonth}}月纳税人数变动明细表</span>
      </div> -->
      <div class="topSearh">
        <el-row>
          <el-col :span="5">
            <treeselect
              v-model="searchTemp.S_OrgCode"
              :multiple="false"
              :options="treeData"
              :load-options="loadOptions"
              :loadOptions="loadOptions"
              placeholder="请选择部门"
              :normalizer="normalizer"
              :disable-branch-nodes="false"
              noResultsText="未搜索到结果"
              style="font-size:14px;width:95%;"
              :clearable="false"
            />
          </el-col>
          <el-col :span="19">
            <el-date-picker
              v-model="searchTemp.ImportMonth"
              type="month"
              placeholder="选择月份"
              size="mini"
              style="width:150px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
            ></el-date-picker>
            <!-- <el-select v-model="searchTemp.type" placeholder="请选择地区" size="mini" style="width:150px">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
            </el-select>-->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="getTaxPlayerChange"
            >搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        title="纳税人统计变动"
        :data="list"
        border
        :header-cell-class-name="tableRowClassName"
        style="width: 100%"
        fit
        size="mini"
        height="500"
      >
        <el-table-column label="单位" prop="ORG_NAME"></el-table-column>
        <el-table-column label="会计期间">
          <template slot-scope="scope">{{scope.row.ImportMonth|changeTime}}</template>
        </el-table-column>
        <el-table-column label="纳税人数" prop="COUNTNUMBER"></el-table-column>
        <el-table-column label="变动人数" prop="CHANGPEOPLE"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="getContent(scope.row)" type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="40%" title="纳税人变动详细信息" :visible.sync="showed">
        <el-table
          title
          :data="list1"
          border
          :header-cell-class-name="tableRowClassName"
          style="width: 100%"
          fit
          size="mini"
        >
          <el-table-column label="姓名" prop="WorkerName"></el-table-column>
          <el-table-column label="工号" prop="WorkerCode"></el-table-column>
          <el-table-column label="纳税人状态">
            <template slot-scope="scope">{{scope.row.WorkerStatus|changeStauts}}</template>
          </el-table-column>
        </el-table>
        <div class="header">
          <el-pagination
            background
            @size-change="dialogSizeChange"
            @current-change="dialogCurrentChange"
            :current-page="dialogTemp.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="dialogTemp.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dialogtotal"
          ></el-pagination>
        </div>
      </el-dialog>
      <div class="header">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchTemp.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="searchTemp.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>



<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { fetchOrgList } from "@/frame_src/api/org";
import {
  fetchTaxPlayerChange,
  getTaxContent,
  fetchTaxOrgNodeList
} from "@/frame_src/api/taxPlayerinfo";
export default {
  name:"TaxpayerChange",
  data() {
    return {
      list: [],
      list1: [],
      total: 10,
      dialogtotal: 0,
      searchTemp: {
        S_OrgCode: "",
        ImportMonth: "",
        limit: 10,
        page: 1
      },
      dialogTemp: {
        limit: 10,
        page: 1,
        S_OrgCode: "",
        ImportMonth: ""
      },
      orgTemp: {
        S_OrgCode: ""
      },
      showed: false,
      treeData: [],
      normalizer(node) {
        return {
          id: node.orgCode,
          label: node.orgShortName,
          children: node.children
        };
      },
      options: [
        {
          value: "财务机关",
          label: "财务机关"
        },
        {
          value: "人事",
          label: "人事"
        }
      ]
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    handleSizeChange(val) {
      this.searchTemp.limit = val;
      this.getTaxPlayerChange();
    },
    handleCurrentChange(val) {
      this.searchTemp.page = val;
      this.getTaxPlayerChange();
    },
    dialogSizeChange(val) {
      this.dialogTemp.limit = val;
      this.getTaxContent();
    },
    dialogCurrentChange(val) {
      this.dialogTemp.page = val;
      this.getTaxContent();
    },
    // load() {
    //   // 查询组织结构数据this.treeListQuery
    //   fetchOrgList().then(response => {
    //     if (response.data.code === 2000) {
    //       this.treeData = [];
    //       this.treeData = response.data.items;
    //     } else {
    //       this.$notify({
    //         position: "bottom-right",
    //         title: "失败",
    //         message: response.data.message,
    //         type: "error",
    //         duration: 2000
    //       });
    //     }
    //   });
    // },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getTaxPlayerChange() {
      fetchTaxPlayerChange(this.searchTemp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
        }
      });
    },
    getUserCode() {
      this.searchTemp.S_OrgCode = this.$store.state.user.orgCode;
      this.orgTemp.S_OrgCode = this.$store.state.user.orgCode;
      this.searchTemp.ImportMonth = this.$store.state.user.sysTime;
      this.fetchTaxOrgNodeList();
      this.getTaxPlayerChange();
    },
    getContent(data) {
      this.showed = true;
      this.dialogTemp.S_OrgCode = data.S_OrgCode;
      this.dialogTemp.ImportMonth = data.ImportMonth;
      this.getTaxContent();
    },
    getTaxContent() {
      getTaxContent(this.dialogTemp).then(response => {
        if (response.data.code === 2000) {
          this.list1 = response.data.items;
          this.dialogtotal = response.data.total;
        }
      });
    },
    fetchTaxOrgNodeList() {
      fetchTaxOrgNodeList(this.orgTemp).then(response => {
        this.treeData = response.data;
      });
    }
  },
  components: {
    Treeselect
  },
  mounted() {
    this.getUserCode();
    console.log(1)
  },
    activated() {
    this.getUserCode();
    console.log(this.$route)
  },
  filters: {
    changeStauts(val) {
      switch (val) {
        case 0:
          return "调出";
          break;
        case 1:
          return "调入";
          break;
        case 2:
          return "新增";
          break;
      }
    },
    changeYear(val) {
      return val.substring(0, 4);
    },
    changeMonth(val) {
      return val.substring(5, 7);
    },
    changeTime(val) {
      return val.substring(0, 7);
    }
  }
};
</script>


<style lang="scss" >
#TaxpayerChange{
  .topSearh {
  margin-bottom: 15px;
}
.vue-treeselect__control {
  height: 28px !important;
  width: 95%;
}
.header {
  text-align: center;
}
.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 20px;
}
.vue-treeselect__control {
    height: 28px !important;
    width: 100%;
  }
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 28px;
  }
  .vue-treeselect--single .vue-treeselect__input-container {
    height: 28px;
    width: 100%;
  }
}

</style>

