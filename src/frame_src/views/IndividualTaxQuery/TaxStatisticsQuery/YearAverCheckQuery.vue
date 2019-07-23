<template>
  <div id="YearAverCheckQuery" class="app-container calendar-list-container">
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
          ></el-date-picker>

          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入部门名称"
            v-model="listQuery.S_Department"
            size="mini"
          ></el-input>
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
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcel">导出</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportYearAverTax">导出</el-button>
        </el-col>
      </el-row>
    </div>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="people"
            border
            :header-cell-class-name="tableRowClassName"
            style="width: 100%"
            fit
            size="mini"
          >
            <el-table-column label="序号" prop="RowNo" fixed="left" width="50px"></el-table-column>
            <el-table-column prop="S_WorkerCode" label="工号" width="90px" fixed="left"></el-table-column>
            <el-table-column prop="S_WorkerName" label="姓名" width="60px" fixed="left"></el-table-column>
            <el-table-column prop="IdNumber" label="身份证号" width="145px" fixed="left"></el-table-column>
            <el-table-column
              prop="S_OrgName"
              label="所属单位"
              width="150px"
              :show-overflow-tooltip="true"
              fixed="left"
            ></el-table-column>
            <el-table-column
              prop="S_Department"
              label="部门"
              width="250px"
              :show-overflow-tooltip="true"
              fixed="left"
            ></el-table-column>
            <el-table-column prop="WorkerStatus" label="身体状况" width="70px"></el-table-column>
            <el-table-column prop="dateYear" label="申报年份" width="70px"></el-table-column>
            <el-table-column prop="totalT_YFHJ" label="劳资提供的应发数(仅供参考)" width="180px"></el-table-column>
            <el-table-column prop="NJSGZHJ" label="年计税工资合计" width="110px"></el-table-column>
            <el-table-column prop="totalK_YangLaoBX" label="年养老" width="100px"></el-table-column>
            <el-table-column prop="totalK_YiLiaoBX" label="年医疗" width="100px"></el-table-column>
            <el-table-column prop="totalK_SYBX" label="年失业" width="100px"></el-table-column>
            <el-table-column prop="totalK_ZFGJJ" label="年公积金" width="100px"></el-table-column>
            <el-table-column prop="totalK_QYNJ" label="年金" width="100px"></el-table-column>
            <el-table-column
              prop="NYNSSDE"
              label="年应纳税所得额=年计税工资合计-年养老-年医疗-年失业-年公积金-年金"
              width="400px"
            ></el-table-column>
            <el-table-column prop="FYKCBZHJ" label="费用扣除标准合计" width="120px"></el-table-column>
            <el-table-column prop="ShuiLv" label="税率" width="60px"></el-table-column>
            <el-table-column prop="TaxDeduction" label="速算扣除数" width="100px"></el-table-column>
            <el-table-column prop="NYNSE" label="年应纳税额" width="180px"></el-table-column>
            <el-table-column prop="CanJiManShuiHou" label="残疾人免税后年应纳税额" width="180px"></el-table-column>
            <el-table-column prop="Qian11YuJiao" label="前11月预缴税额" width="180px"></el-table-column>
            <el-table-column prop="YuJiao12Month" label="12月税额=残疾人免税后年应纳税额-前11月预缴税额" width="340px"></el-table-column>
            <el-table-column prop="totalErpKS" label="EMP扣税合计" width="150px"></el-table-column>
            <el-table-column prop="ShiJiYJSE" label="实际应交税额=残疾人免税后年应纳税额-ERP扣税合计" width="330px"></el-table-column>
            <!-- <el-table-column label="操作" width="150px" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="detail()" type="primary" plain>详情</el-button>
              </template>
            </el-table-column>-->
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
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="showed" width="80%">
      <el-card>
        <el-table
          :data="people"
          title="机关财务科2018年10月个人所得税明细表"
          border
          :header-cell-class-name="tableRowClassName"
          style="width: 100%"
          fit
          size="mini"
        >
          <el-table-column prop="id" label="编号" fixed="left" width="80px"></el-table-column>
          <el-table-column prop="job_id" label="工号" fixed="left"></el-table-column>
          <el-table-column prop="name" label="姓名" fixed="left"></el-table-column>
          <el-table-column prop="department" label="所属单位" width="150px"></el-table-column>
          <el-table-column prop="national_ID" label="身份证号" width="200px"></el-table-column>
          <el-table-column prop="apply_month" label="申报年份" width="180px"></el-table-column>
          <el-table-column prop="before_salary" label="劳资提供应发数" width="180px"></el-table-column>
          <el-table-column prop="tax_salary" label="应计税工资项目合计" width="180px"></el-table-column>
          <el-table-column prop="total_tax_salary" label="报税项目合计" width="180px"></el-table-column>
          <el-table-column prop="order_insurance" label="养老保险" width="180px"></el-table-column>
          <el-table-column prop="hospital_insurance" label="医疗保险" width="180px"></el-table-column>
          <el-table-column prop="job_insurance" label="失业保险" width="180px"></el-table-column>
          <el-table-column prop="house_insurance" label="住房公积金" width="180px"></el-table-column>
          <el-table-column prop="years_gold" label="年金(个人部分)" width="180px"></el-table-column>
          <el-table-column prop="real_salary" label="实发工资" width="180px"></el-table-column>
          <!-- (报税项目合计+养老保险+医疗保险+失业保险+住房公积金+年金) -->
          <el-table-column prop="tax_standard" label="费用扣除标准" width="180px"></el-table-column>
          <el-table-column prop="tax" label="应纳所得税" width="180px"></el-table-column>
          <el-table-column prop="tax_ratio" label="税率" width="100px"></el-table-column>
          <el-table-column prop="fast_Calculation" label="速算扣除数" width="180px"></el-table-column>
          <el-table-column prop="normal_tax" label="正常薪金数额" width="180px"></el-table-column>
          <el-table-column prop="once_gold" label="一次性奖金" width="180px"></el-table-column>
          <el-table-column prop="total_gold" label="税额(工资薪金和一次性税额合计)" width="230px"></el-table-column>
          <el-table-column prop="EMP_tax" label="EMP扣税" width="150px"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChangedetail"
            @current-change="handleCurrentChangedetail"
            :current-page="listQuerydetail.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuerydetail.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailtotal"
          ></el-pagination>
        </div>
      </el-card>
    </el-dialog>
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
import { getYearAverCheck,exportYearAverTax } from "@/frame_src/api/YearAverCheck";
export default {
  data() {
    return {
      DateYear: "",
      people: [],
      total: 0,
      detailtotal: 0,
      showed: false,
      title: "提示",
      temp: {},
      searchTemp: {
        date: "",
        type: "",
        department: ""
      },
      listQuery: {
        page: 1,
        limit: 10,
        S_Department: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        queryType: "query",
        S_OrgName: this.$store.state.user.departName,
      },
      listQuerydetail: {
        page: 1,
        limit: 10
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
     exportYearAverTax() {
      this.listQuery.queryType = "Export";
      exportYearAverTax(this.listQuery).then(response => {
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
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    detail() {
      this.title = "详情";
      //this.$store.dispatch("setShowed", true);
      this.showed = true;
    },
    tableRowClassName({ row, rowIndex }) {
      // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
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
      getYearAverCheck(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.total > 0) {
          this.people = response.data.items;
          this.total = response.data.total;
        } else if (response.data.total === 0) {
          this.people = [];
          this.total = 0;
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
    handleSizeChangedetail(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChangedetail(val) {
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
    exportExcel() {
      this.listQuery.queryType = "Export";
      getYearAverCheck(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.total > 0) {
          this.importList = response.data.items;
          this.exportExcelInfo();
        } else if (response.data.total === 0) {
          this.people = [];
          this.total = 0;
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
          "序号",
          "工号",
          "姓名",
          "身份证号",
          "所在单位",
          "部门",
          "身体状况",
          "年份",
          "劳资提供的应发数(仅供参考)",
          '年计税工资合计',
          "年养老",
          "年医疗",
          "年失业",
          "年公积金",
          "年金",
          "年应纳税所得额=年计税工资合计-年养老-年医疗-年失业-年公积金-年金",
          "费用扣除标准合计",
          "税率",
          "速算扣除数",
          "年应纳税额",
          "残疾人免税后年应纳税额",
          "前11月预缴税额",
          "12月税额=残疾人免税后年应纳税额-前11月预缴税额",
          "MP扣税合计",
          "实际应交税额=残疾人免税后年应纳税额-ERP扣税合计"
        ];
        const filterVal = [
          "RowNo",
          "S_WorkerCode",
          "S_WorkerName",
          "IdNumber",
          'S_OrgName',
          "S_Department",
          "WorkerStatus",
          "dateYear",
          "totalT_YFHJ",
          "NJSGZHJ",
          "totalK_YangLaoBX",
          "totalK_YiLiaoBX",
          "totalK_SYBX",
          "totalK_ZFGJJ",
          "totalK_QYNJ",
          "NYNSSDE",
          "FYKCBZHJ",
          "ShuiLv",
          "TaxDeduction",
          "NYNSE",
          "CanJiManShuiHou",
          "Qian11YuJiao",
          "YuJiao12Month",
          "totalErpKS",
          "ShiJiYJSE"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            
            this.listQuery.S_WorkDate.substr(0, 4) +
            "年全年平均核算"
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
};
</script>


<style lang="scss" >
#YearAverCheckQuery {
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

