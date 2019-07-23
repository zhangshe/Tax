<template>
  <div id="MonthTaxCheckQuery" class="app-container calendar-list-container">
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="3">
          <el-select
            v-model="listSumQuery.TaxNumber"
            clearable
            size="mini"
            placeholder="请选择税号"
            style="width:100%;"
          >
            <el-option
              v-for="(item,key) in TaxNumberOptions"
              :key="key"
              placeholder="请选择税号"
              :label="item.Name"
              :value="item.Code"
            >
              <span style="float: left">{{ item.EnglishCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <treeselect
            :clearable="false"
            v-model="listSumQuery.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :loadOptions="loadOptions"
            placeholder="请选择单位"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px;"
            @select="getsumnode"
          />
        </el-col>
        <el-col :span="15">
          <el-date-picker
            size="mini"
            v-model="listSumQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择年月"
            :clearable="false"
          ></el-date-picker>
          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入部门名称"
            v-model="listSumQuery.S_Department"
            size="mini"
          ></el-input>
          <el-col :span="3">
            <el-select v-model="listSumQuery.TaxRate" size="mini" placeholder="请选择税率" style="width:100%;" clearable>
              <el-option v-for="(item,key) in taxRateOption" :key="key" :label="item.TaxRate+'%'" :value="item.TaxRate">
                
              </el-option>
            </el-select>
          </el-col>

          <!-- <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入姓名"
            v-model="listQuery.S_WorkerName"
            size="mini"
          ></el-input>-->
          <el-button
            size="mini"
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportSumExcel">导出</el-button>
        </el-col>
      </el-row>
    </div>

    <el-card class="box-card">
      <el-table
        size="mini"
        :data="sumlist"
        :header-cell-class-name="tableRowClassName"
        v-loading="sumlistLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          width="180px"
          fixed="left"
          align="center"
          label="单位"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.StartTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="right" prop="Tax_Num" label="纳税人数">
          <template slot-scope="scope">
            <span>{{scope.row.Tax_Num}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="T_YFHJ" label="劳资提供的应发数">
          <template slot-scope="scope">
            <span>{{scope.row.T_YFHJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Income" label="报税工资项目合计">
          <template slot-scope="scope">
            <span>{{scope.row.Income | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Cost" label="本期费用">
          <template slot-scope="scope">
            <span>{{scope.row.Cost | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="Tax" align="right" label="本期免税收入">
          <template slot-scope="scope">
            <span>{{scope.row.Tax | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="OlderInsurance" align="right" label="本期养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.OlderInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="HeathInsurance" align="right" label="本期医疗保险">
          <template slot-scope="scope">
            <span>{{scope.row.HeathInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="JobInsurance" align="right" label="本期失业保险">
          <template slot-scope="scope">
            <span>{{scope.row.JobInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="HousingFund" align="right" label="本期住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.HousingFund |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="EnterpriseAnnuity" align="right" label="本期企业年金(个人部分)">
          <template slot-scope="scope">
            <span>{{scope.row.EnterpriseAnnuity |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          prop="CommercialHealthinsurance"
          align="right"
          label="本期商业健康"
        >
          <template slot-scope="scope">
            <span>{{scope.row.CommercialHealthinsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="EndowmentInsurance" align="right" label="本期税延养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.EndowmentInsurance |NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" prop="Other" align="right" label="本期其他扣除">
          <template slot-scope="scope">
            <span>{{scope.row.Other |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="230px"
          prop="CumulativeOther"
          align="right"
          label="当月其他扣除(本期年金+本期其他扣除)"
        >
          <template slot-scope="scope">
            <span>{{scope.row.CumulativeOther |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          prop="Month_AccumulatedSpecialDeduction"
          align="right"
          label="当月专项扣除"
        >
          <template slot-scope="scope">
            <span>{{scope.row.Month_AccumulatedSpecialDeduction |NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" prop="Month_ChildEdu" align="right" label="当月子女教育">
          <template slot-scope="scope">
            <span>{{scope.row.Month_ChildEdu |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="Month_Support" align="right" label="当月赡养老人">
          <template slot-scope="scope">
            <span>{{scope.row.Month_Support |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="Month_ContinueEdu" align="right" label="当月继续教育">
          <template slot-scope="scope">
            <span>{{scope.row.Month_ContinueEdu |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="Month_HousingLoan" align="right" label="当月住房贷款利息">
          <template slot-scope="scope">
            <span>{{scope.row.Month_HousingLoan |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Month_HousingRent" label="当月住房租金">
          <template slot-scope="scope">
            <span>{{scope.row.Month_HousingRent |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Drawback" label="正常薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.Drawback |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" prop="lj_SE" label="税额(ERP扣税+一次性奖金预扣税+奖金预扣税)">
          <template slot-scope="scope">
            <span>{{scope.row.lj_SE |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="sumdetail(scope.row.S_OrgName,scope.row.S_OrgCode)"
              type="primary"
              plain
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="showed" width="80%" title="详细信息">
      <div class="topSearh" id="topsearch">
        <el-row>
          <!-- <el-col :span="3">
      <el-select v-model="listQuery.TaxNumber" size="mini" placeholder="请选择税号" style="width:100%;">
        <el-option
          v-for="(item,key) in TaxNumberOptions"
          :key="key"
          placeholder="请选择税号" 
          :label="item.Name"
          :value="item.Code"
        >
          <span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
        </el-option>
      </el-select>
          </el-col>-->
          <el-col :span="3">
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
          <el-col :span="21">
            <el-date-picker
              size="mini"
              v-model="listQuery.S_WorkDate"
              style="width:120px;"
              type="month"
              value-format="yyyy-MM-dd"
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
            <el-input
              style="width: 200px;"
              class="filter-item"
              placeholder="请输入姓名"
              v-model="listQuery.S_WorkerName"
              size="mini"
            ></el-input>
            <el-col :span="3">
            <el-select v-model="listQuery.TaxRate" size="mini" placeholder="请选择税率" style="width:100%;" clearable>
              <el-option v-for="(item,key) in taxRateOption" :key="key" :label="item.TaxRate+'%'" :value="item.TaxRate">
                
              </el-option>
            </el-select>
          </el-col>
            <el-button
              size="mini"
              class="filter-item"
              type="primary"
              v-waves
              icon="el-icon-search"
              @click="handleFilterDetail"
            >搜索</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="exportMonthTaxDetail"
            >导出月度核算明细</el-button>
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
              <span>{{scope.row.S_WorkNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column width="95px" fixed="left" align="center" label="姓名">
            <template slot-scope="scope">
              <span>{{scope.row.S_WorkName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="180px"
            fixed="left"
            align="center"
            label="单位"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{scope.row.S_OrgName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="部门" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.S_Department}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="证照类型">
            <template slot-scope="scope">
              <span>{{scope.row.IDType}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="证照号码">
            <template slot-scope="scope">
              <span>{{scope.row.IDNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column width="90px" align="center" label="工资年月">
            <template slot-scope="scope">
              <span>{{scope.row.StartTime|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="劳资提供的应发数">
            <template slot-scope="scope">
              <span>{{scope.row.T_YFHJ |NumFormat}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column width="180px" align="right" label="应计税工资条目合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_SFHJ |NumFormat}}</span>
          </template>
          </el-table-column>-->
          <el-table-column width="180px" align="right" label="报税工资项目合计">
            <template slot-scope="scope">
              <span>{{scope.row.Income | NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期费用">
            <template slot-scope="scope">
              <span>{{scope.row.Cost | NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期免税收入">
            <template slot-scope="scope">
              <span>{{scope.row.Tax | NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期养老保险">
            <template slot-scope="scope">
              <span>{{scope.row.OlderInsurance |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期医疗保险">
            <template slot-scope="scope">
              <span>{{scope.row.HeathInsurance |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期失业保险">
            <template slot-scope="scope">
              <span>{{scope.row.JobInsurance |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期住房公积金">
            <template slot-scope="scope">
              <span>{{scope.row.HousingFund |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期企业年金(个人部分)">
            <template slot-scope="scope">
              <span>{{scope.row.EnterpriseAnnuity |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期商业健康">
            <template slot-scope="scope">
              <span>{{scope.row.CommercialHealthinsurance |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="本期税延养老保险">
            <template slot-scope="scope">
              <span>{{scope.row.EndowmentInsurance |NumFormat}}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="right" label="本期其他扣除">
            <template slot-scope="scope">
              <span>{{scope.row.Other |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="230px" align="right" label="当月其他扣除(本期年金+本期其他扣除)">
            <template slot-scope="scope">
              <span>{{scope.row.Month_Other |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月专项扣除">
            <template slot-scope="scope">
              <span>{{scope.row.Month_AccumulatedSpecialDeduction |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月子女教育">
            <template slot-scope="scope">
              <span>{{scope.row.Month_ChildEdu |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月赡养老人">
            <template slot-scope="scope">
              <span>{{scope.row.Month_Support |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月继续教育">
            <template slot-scope="scope">
              <span>{{scope.row.Month_ContinueEdu |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月住房贷款利息">
            <template slot-scope="scope">
              <span>{{scope.row.Month_HousingLoan |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="当月住房租金">
            <template slot-scope="scope">
              <span>{{scope.row.Month_HousingRent |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="正常薪金税额">
            <template slot-scope="scope">
              <span>{{scope.row.Drawback |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="累计应纳税额">
            <template slot-scope="scope">
              <span>{{scope.row.AccumulatedTax |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="累计已预缴税额">
            <template slot-scope="scope">
              <span>{{scope.row.WithholdingTax |NumFormat}}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="right" label="奖金">
            <template slot-scope="scope">
              <span>{{scope.row.G_JJ |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="奖金预扣税">
            <template slot-scope="scope">
              <span>{{scope.row.JJ_KS |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="一次性奖金">
            <template slot-scope="scope">
              <span>{{scope.row.OneTimeBonus |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="一次性奖金预扣税">
            <template slot-scope="scope">
              <span>{{scope.row.DeductibleTax |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="right" label="ERP扣税">
            <template slot-scope="scope">
              <span>{{scope.row.K_KS |NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="280px" align="right" label="税额(ERP扣税+一次性奖金预扣税+奖金预扣税)">
            <template slot-scope="scope">
              <span>{{scope.row.HJ_SE |NumFormat}}</span>
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
    </el-dialog>
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { parseTime } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getMonthTaxSalaryDetail,
  getGroupMonthTaxSalary,
  getTaxSalaryList,
  exportMonthTaxSalaryDetail,
  exportGroupMonthTaxSalary
} from "@/frame_src/api/taxSalary";
import{ getSubtrackStandardConfig } from "@/frame_src/api/ParamsConfig";
import { getTaxNumberOptions } from "@/frame_src/api/Export";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "MonthTaxSalaryCheckQuery",
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  data() {
    return {
      showed: false,
      normalizer(node) {
        return {
          id: node.ORG_CODE,
          label: node.ORG_SHORT_NAME,
          children: node.children
        };
      },
      // exportComp: this.$store.state.user.orgName,
      tableKey: 0,
      list: [],
      sumlist: [],
      sumlistLoading: true,
      listDetail: [],
      importList: [],
      taxRateOption:[],
      total: null,
      totalDetail: null,
      listLoading: true,
      listLoadingDetail: true,
      listQuery: {
        page: 1,
        limit: 10,
        Is_Page: "true",
        S_Department: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        TaxRate:"",
      },
      listSumQuery: {
        S_Department: "",
        //S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        TaxNumber: "",
        TaxRate:"",
      },
      treeData: [],
      TaxNumberOptions: []
    };
  },
  filters: {
    parseTime,
    NumFormat,
    formatTime(val) {
      if (val != null && val != "") {
        return val.substring(0, 7);
      }
    }
  },
  methods: {
    getTaxNumberOptions() {
      getTaxNumberOptions(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.TaxNumberOptions = response.data.items;
          // if (this.TaxNumberOptions.length > 0) {
          //   this.temp.TaxNumber = this.TaxNumberOptions[0].Code;
          // }
          //this.getOrgStatus();
        }
      });
    },
    getnode(node, instanceId) {
      this.listQuery.S_OrgName = node.ORG_SHORT_NAME;
    },
    getsumnode(node, instanceId) {
      this.listSumQuery.S_OrgName = node.ORG_SHORT_NAME;
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },

    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => item[column.property]);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 2) {
            sums[index] += " 人";
          } else {
            sums[index] = sums[index].toFixed(2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getSumList() {
      this.sumlistLoading = true;
      getGroupMonthTaxSalary(this.listSumQuery).then(response => {
        if (response.data.code === 2000) {
          this.sumlist = response.data.items;
          this.sumlistLoading = false;
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
    sumdetail(orgName, orgCode) {
      this.title = "详情";
      this.showed = true;
      // if(this.listSumQuery.TaxRate!=null&&this.listSumQuery.TaxRate!=""){
      //   this.listQuery.TaxRate=this.listSumQuery.TaxRate
      // }
      // else{
      //   this.listQuery.TaxRate="";
      // }
      this.listQuery.S_OrgCode = orgCode;
      this.listQuery.S_OrgName = orgName;
      this.listQuery.S_WorkDate = this.listSumQuery.S_WorkDate;
      this.listQuery.S_Department = this.listSumQuery.S_Department;
      this.getList();
    },
    getList() {
      this.listLoading = true;

      getMonthTaxSalaryDetail(this.listQuery).then(response => {
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
    subtrackStandardConfig(){
      getSubtrackStandardConfig().then(response=>{
        if(response.data.code===2000){
          this.taxRateOption=response.data.items
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    exportMonthTaxDetail() {
      exportMonthTaxSalaryDetail(this.listQuery).then(response => {
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

    exportSumExcel() {
      exportGroupMonthTaxSalary(this.listSumQuery).then(response => {
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    handleFilter() {
      //this.listQuery.page = 1;
      this.getSumList();
    },
    handleFilterDetail() {
      this.listQuery.page = 1;
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    }
  },
  created() {
    this.loadOrgByCode();
    //this.getList();
    this.getSumList();
    this.getTaxNumberOptions();
    this.subtrackStandardConfig();
  },
  activated() {
    this.loadOrgByCode();
    //this.getList();
    this.getSumList();
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


<style lang="scss">
#MonthTaxCheckQuery {
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

