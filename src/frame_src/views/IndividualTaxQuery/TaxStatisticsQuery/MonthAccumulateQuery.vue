<template>
  <div id="MonthAccumulateQuery" class="app-container calendar-list-container">
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="3">
      <el-select clearable v-model="listSumQuery.TaxNumber" size="mini" placeholder="请选择税号" style="width:100%;">
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
          <!-- <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入姓名"
            v-model="listQuery.S_WorkerName"
            size="mini"
          ></el-input> -->
          <el-col :span="3">
            <el-select v-model="listSumQuery.TaxRate" size="mini" placeholder="请选择税率" style="width:100%;" clearable>
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
            @click="handleFilter"
          >搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportSumExcel">导出</el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportMonthTax">导出</el-button> -->
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
        <el-table-column width="90px"  align="center" label="累计至年月">
          <template slot-scope="scope">
            <span>{{scope.row.StartTime|parseTime1}}</span>
          </template>
        </el-table-column>
         <!-- <el-table-column width="80px" align="right" prop="Tax_Num" label="纳税人数">
          <template slot-scope="scope">
            <span>{{scope.row.Tax_Num}}</span>
          </template>
        </el-table-column> -->
         <el-table-column width="180px" align="right" prop="ljYFHJ" label="劳资提供的应发数累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljYFHJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="AccumulatedIncome" label="报税工资项目合计累计">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedIncome |NumFormat}}</span>
          </template>
        </el-table-column>
      
        <el-table-column width="180px" prop="ljOlderInsurance" align="right" label="养老累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljOlderInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="ljHeathInsurance" align="right" label="医疗累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljHeathInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="ljJobInsurance" align="right" label="失业累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljJobInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="ljHousingFund" align="right" label="住房公积金累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljHousingFund |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="ljEnterpriseAnnuity" align="right" label="年金累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljEnterpriseAnnuity |NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" prop="Donation" align="right" label="累计准予扣除的捐赠">
          <template slot-scope="scope">
            <span>{{scope.row.Donation |NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" prop="Deductions" label="累计应纳税所得额">
          <template slot-scope="scope">
            <span>{{scope.row.Deductions |NumFormat}}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="180px" align="right" prop="TaxSavings" label="累计减免税额">
          <template slot-scope="scope">
            <span>{{scope.row.TaxSavings |NumFormat}}</span>
          </template>
        </el-table-column>   
        <el-table-column width="180px" align="right" prop="AccumulatedSpecialDeduction" label="累计专项扣除">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedSpecialDeduction |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="CumulativeOther" label="累计其他扣除">
          <template slot-scope="scope">
            <span>{{scope.row.CumulativeOther |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="ChildEdu" label="累计子女教育">
          <template slot-scope="scope">
            <span>{{scope.row.ChildEdu |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="HousingLoan" label="累计住房贷款利息">
          <template slot-scope="scope">
            <span>{{scope.row.HousingLoan |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="HousingRent" label="累计住房租金">
          <template slot-scope="scope">
            <span>{{scope.row.HousingRent |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Support" label="累计赡养老人">
          <template slot-scope="scope">
            <span>{{scope.row.Support |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="ContinueEdu" label="累计继续教育">
          <template slot-scope="scope">
            <span>{{scope.row.ContinueEdu |NumFormat}}</span>
          </template>
        </el-table-column>
          <!-- <el-table-column width="180px" align="right" label="累计费用扣除">
          <template slot-scope="scope">
            <span>{{scope.row.Reduction |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="税率">
          <template slot-scope="scope">
            <span>{{scope.row.TaxRate |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="速算扣除数">
          <template slot-scope="scope">
            <span>{{scope.row.QuickDeduction |NumFormat}}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="180px" align="right" prop="AccumulatedTax" label="累计应纳税额">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedTax |NumFormat}}</span>
          </template>
        </el-table-column>
      
        <el-table-column width="180px" align="right" prop="CumulativeWithholding" label="累计应扣缴税额">
          <template slot-scope="scope">
            <span>{{scope.row.CumulativeWithholding |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" prop="WithholdingTax" label="累计已预缴税额">
          <template slot-scope="scope">
            <span>{{scope.row.WithholdingTax |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="Drawback" label="累计应补(退)税额">
          <template slot-scope="scope">
            <span>{{scope.row.Drawback |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" prop="K_KS" label="累计扣税(ERP扣税+奖金扣税+一次性奖金扣税)">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="sumdetail(scope.row.S_OrgName,scope.row.S_OrgCode)" type="primary" plain>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="showed" width="80%" title="月度累计明细">
      <div class="topSearh" >
        <el-row>
          <!-- <el-col :span="24">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="exportMonthTax"
            >导出月度累计明细</el-button>
          </el-col> -->
             <el-col :span="3">
      <!-- <el-select v-model="listQuery.TaxNumber" size="mini" placeholder="请选择税号" style="width:100%;">
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
      </el-select> -->
      </el-col>
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
        <el-col :span="18">
              <el-date-picker
            size="mini"
            v-model="listQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择年月"
            :clearable="false"
          ></el-date-picker>
          <el-col :span="3">
            <el-select v-model="listQuery.TaxRate" size="mini" placeholder="请选择税率" style="width:100%;" clearable>
              <el-option v-for="(item,key) in taxRateOption" :key="key" :label="item.TaxRate+'%'" :value="item.TaxRate">
                
              </el-option>
            </el-select>
          </el-col>
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
            @click="handleFilterDetail"
          >搜索</el-button>
            <el-button
              size="mini"
              type="primary"
              v-waves
              icon="el-icon-edit"
              @click="exportMonthTax"
            >导出月度累计明细</el-button>

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
        <el-table-column
          width="180px"
          align="center"
          label="部门"
          :show-overflow-tooltip="true"
        >
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
        <!-- <el-table-column width="90px"  align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.StartTime|formatTime}}</span>
          </template>
        </el-table-column> -->
          <el-table-column width="180px" align="right" label="劳资提供的应发数累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljYFHJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="报税工资项目合计累计">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedIncome |NumFormat}}</span>
          </template>
        </el-table-column>
      
        <el-table-column width="180px" align="right" label="养老累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljOlderInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="医疗累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljHeathInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="失业累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljJobInsurance |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房公积金累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljHousingFund |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="年金累计">
          <template slot-scope="scope">
            <span>{{scope.row.ljEnterpriseAnnuity |NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="right" label="累计准予扣除的捐赠">
          <template slot-scope="scope">
            <span>{{scope.row.Donation |NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="累计应纳税所得额">
          <template slot-scope="scope">
            <span>{{scope.row.Deductions |NumFormat}}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="180px" align="right" label="累计减免税额">
          <template slot-scope="scope">
            <span>{{scope.row.TaxSavings |NumFormat}}</span>
          </template>
        </el-table-column>   
        <el-table-column width="180px" align="right" label="累计专项扣除">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedSpecialDeduction |NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="累计其他扣除">
          <template slot-scope="scope">
            <span>{{scope.row.CumulativeOther |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计子女教育">
          <template slot-scope="scope">
            <span>{{scope.row.ChildEdu |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计住房贷款利息">
          <template slot-scope="scope">
            <span>{{scope.row.HousingLoan |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计住房租金">
          <template slot-scope="scope">
            <span>{{scope.row.HousingRent |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计赡养老人">
          <template slot-scope="scope">
            <span>{{scope.row.Support |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计继续教育">
          <template slot-scope="scope">
            <span>{{scope.row.ContinueEdu |NumFormat}}</span>
          </template>
        </el-table-column>
          <el-table-column width="180px" align="right" label="累计费用扣除">
          <template slot-scope="scope">
            <span>{{scope.row.Reduction |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="税率">
          <template slot-scope="scope">
            <span>{{scope.row.TaxRate |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="速算扣除数">
          <template slot-scope="scope">
            <span>{{scope.row.QuickDeduction |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计应纳税额">
          <template slot-scope="scope">
            <span>{{scope.row.AccumulatedTax |NumFormat}}</span>
          </template>
        </el-table-column>
      
        <el-table-column width="180px" align="right" label="累计应扣缴税额">
          <template slot-scope="scope">
            <span>{{scope.row.CumulativeWithholding |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" label="累计已预缴税额">
          <template slot-scope="scope">
            <span>{{scope.row.WithholdingTax |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计应补(退)税额">
          <template slot-scope="scope">
            <span>{{scope.row.Drawback |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" label="累计扣税(ERP扣税+奖金扣税+一次性奖金扣税)">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="detail(scope.row.S_WorkerCode,scope.row.ImportModel,scope.row.S_WorkerName)"
              type="primary"
              plain
            >详情</el-button>
          </template>
        </el-table-column> -->
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
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getGroupSumMonthTaxSalary,
  getMonthTaxSalary,
  getTaxSalaryList,
  exportMonthTaxSalary,
  exportGroupSumMonthTaxSalary
} from "@/frame_src/api/taxSalary";
import{ getSubtrackStandardConfig } from "@/frame_src/api/ParamsConfig";
import {
  getTaxNumberOptions
} from "@/frame_src/api/Export";
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
      // pickerOptions0: {
      //   disabledDate: time => {
      //     if (
      //       typeof this.listQuery.S_EndWorkDate === undefined ||
      //       this.listQuery.S_EndWorkDate === ""
      //     ) {
      //       //return time.getTime() > Date.now();
      //       //return time.getTime() >new Date( this.$store.state.user.sysTime).getTime();
      //     } else {
      //       var sta = this.listQuery.S_EndWorkDate;
      //       var end = this.$store.state.user.sysTime;
      //       // var sta =
      //       //   this.listQuery.S_EndWorkDate.substring(0, 4) +
      //       //   "/" +
      //       //   this.listQuery.S_EndWorkDate.substring(4, 6) +
      //       //   "/01";
      //       // var end =
      //       //   this.$store.state.user.sysTime.substring(0, 4) +
      //       //   "/" +
      //       //   this.$store.state.user.sysTime.substring(4, 6) +
      //       //   "/01";
      //       return (
      //         time.getTime() > new Date(sta).getTime() ||
      //         time.getTime() > new Date(end).getTime()
      //       );
      //     }
      //   }
      // },
      // pickerOptions1: {
      //   disabledDate: time => {
      //     if (
      //       typeof this.listQuery.S_BeginWorkDate === undefined ||
      //       this.listQuery.S_BeginWorkDate === ""
      //     ) {
      //       //return time.getTime() > Date.now();
      //       //return time.getTime() >new Date( this.$store.state.user.sysTime).getTime();
      //     } else {
      //       // var sta =
      //       //   this.listQuery.S_BeginWorkDate.substring(0, 4) +
      //       //   "/" +
      //       //   this.listQuery.S_BeginWorkDate.substring(4, 6) +
      //       //   "/01";
      //       // var end =
      //       //   this.$store.state.user.sysTime.substring(0, 4) +
      //       //   "/" +
      //       //   this.$store.state.user.sysTime.substring(4, 6) +
      //       //   "/01";
      //       // //return time.getTime() < new Date(sta).getTime() || time.getTime() > Date.now();
      //       var sta = this.listQuery.S_BeginWorkDate;
      //       var end = this.$store.state.user.sysTime;
      //       return (
      //         time.getTime() < new Date(sta).getTime() //||
      //         //time.getTime() < new Date(end).getTime()
      //       );
      //     }
      //   }
      // },
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
        sumlist:[],
      sumlistLoading:true,
      listDetail: [],
      importList: [],
      taxRateOption:[],
      total: null,
      totalDetail: null,
      listLoading: true,
      listLoadingDetail: true,
       listSumQuery: {
        S_Department: "",
        //S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        TaxNumber: ""
      },
      listQuery: {
        page: 1,
        limit: 10,
        Is_Page: "true",
        S_Department: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        // S_BeginWorkDate: '',
        // S_EndWorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        S_WorkDate:this.$store.state.user.sysTime,
        TaxNumber: "",
        TaxRate:"",
      },
      listQueryDetail: {
        // page: 1,
        // limit: 10,
        S_WorkerCode: "",
        // S_Department: "",
        S_WorkerName: "",
        Is_Page: "false",
        // S_OrgCode: this.$store.state.user.orgCode,
        //S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        S_BeginWorkDate: this.$store.state.user.sysTime,
        S_EndWorkDate: this.$store.state.user.sysTime,
        TaxRate:"",
      },
      treeData: [],
      TaxNumberOptions: []
    };
  },
  filters: {
    parseTime1,
    NumFormat
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
    // createTime() {
    //   let date = this.$store.state.user.sysTime;
    //   let year = date.substring(0,4);
    //   this.listQuery.S_BeginWorkDate=year+"-01";
    //   this.listQuery.S_EndWorkDate=date.substring(0,7)
    // },
    // beginChange(value) {
    //   var sta = value.substring(0, 4) + "/" + value.substring(4, 6) + "/01";
    //   var end = "";
    //   if (this.listQuery.S_EndWorkDate.indexOf("-") >= 0) {
    //     end =
    //       this.listQuery.S_EndWorkDate.substring(0, 4) +
    //       "/" +
    //       this.listQuery.S_EndWorkDate.substring(5, 7) +
    //       "/01";
    //   } else {
    //     end =
    //       this.listQuery.S_EndWorkDate.substring(0, 4) +
    //       "/" +
    //       this.listQuery.S_EndWorkDate.substring(4, 6) +
    //       "/01";
    //   }

    //   if (new Date(sta).getTime() > new Date(end).getTime()) {
    //     this.listQuery.S_EndWorkDate = sta.replace("/", "");
    //   }
    // },
    // endChange(value) {
    //   var sta = "";
    //   if (this.listQuery.S_BeginWorkDate.indexOf("-") >= 0) {
    //     sta =
    //       this.listQuery.S_BeginWorkDate.substring(0, 4) +
    //       "/" +
    //       this.listQuery.S_BeginWorkDate.substring(5, 7) +
    //       "/01";
    //   } else {
    //     sta =
    //       this.listQuery.S_BeginWorkDate.substring(0, 4) +
    //       "/" +
    //       this.listQuery.S_BeginWorkDate.substring(4, 6) +
    //       "/01";
    //   }

    //   var end = value.substring(0, 4) + "/" + value.substring(4, 6) + "/01";
    //   if (new Date(sta).getTime() > new Date(end).getTime()) {
    //     this.listQuery.S_BeginWorkDate = end.replace("/", "");
    //   }
    // },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    // getnode(node, instanceId) {
    //   this.exportComp = node.ORG_SHORT_NAME;
    // },
    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },
    // detail(workcode, importmodel, workname) {
    //   this.title = "详情";
    //   this.showed = true;

    //   this.getDetailList(workcode, importmodel, workname);
    // },


getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => item[column.property]);
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev+ curr;
              } else {
                return prev;
              }
            }, 0);
            //               if (index === 2) {
            // sums[index]  += ' 人';
            //   }
//else{            
  sums[index]=sums[index].toFixed(2);
            sums[index] += ' 元';
            //}

          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
    getSumList() {
      this.sumlistLoading= true;
      getGroupSumMonthTaxSalary(this.listSumQuery).then(response => {
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
       sumdetail( orgName, orgCode)
    {
 this.title = "月度累计明细";
      this.showed = true;
this.listQuery.S_OrgCode=orgCode;
this.listQuery.S_OrgName=orgName;
      this.listQuery.S_WorkDate=this.listSumQuery.S_WorkDate;
      this.listQuery.S_Department=this.listSumQuery.S_Department;
this.getList();
    },

    getList() {
      this.listLoading = true;

      getMonthTaxSalary(this.listQuery).then(response => {
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
    getDetailList(workcode, importmodel, workname) {
      this.listLoadingDetail = true;
      this.listQueryDetail.S_BeginWorkDate = this.listQuery.S_BeginWorkDate;
      this.listQueryDetail.S_EndWorkDate = this.listQuery.S_EndWorkDate;
      this.listQueryDetail.S_WorkerCode = workcode;
      this.listQueryDetail.S_WorkerName = workname;
      this.listQueryDetail.ImportModel = importmodel;
      getTaxSalaryList(this.listQueryDetail).then(response => {
        if (response.data.code === 2000) {
          this.listDetail = response.data.items;
          this.totalDetail = response.data.total;
          this.listLoadingDetail = false;
        } else {
          this.listLoadingDetail = false;
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
    subtrackStandardConfig(){
      getSubtrackStandardConfig().then(response=>{
        if(response.data.code===2000){
          this.taxRateOption=response.data.items
        }
      })
    },
    exportMonthTax() {
      exportMonthTaxSalary(this.listQuery).then(response => {
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
      exportGroupSumMonthTaxSalary(this.listSumQuery).then(response => {
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
    },
  },
  
  created() {
    this.loadOrgByCode();
    this.getTaxNumberOptions();
    this.getSumList();
    this.subtrackStandardConfig();
    //this.getList();
    //this.createTime();
  },
  activated() {
    this.loadOrgByCode();
    this.getTaxNumberOptions();
    this.getSumList();
    //this.getList();
    //this.createTime();
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
#MonthAccumulateQuery {
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



