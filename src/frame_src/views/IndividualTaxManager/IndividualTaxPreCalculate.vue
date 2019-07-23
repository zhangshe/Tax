<template>
  <div id="IndividualTaxPreCalculate" class="app-container calendar-list-container">
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="4">
          <treeselect
            :clearable="false"
            v-model="sumlistQuery.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :loadOptions="loadOptions"
            placeholder="请选择单位"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px;"
            @select="sumgetnode"
          />
        </el-col>
        <el-col :span="20">
          <el-date-picker
            size="mini"
            v-model="sumlistQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择年月"
            :clearable="false"
          ></el-date-picker>
      <!-- <el-select
            size="mini"
            filterable
            clearable
            v-model="sumlistQuery.TaxCode"
            placeholder="请选择税号"
            
          >
            <el-option
              v-for="item in taxcodeoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ><span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span></el-option>
          </el-select> -->
          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入部门名称"
            v-model="sumlistQuery.S_Department"
            size="mini"
          ></el-input>
         
          <el-button
            size="mini"
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilterSum"
          >搜索</el-button>
<el-button size="mini" type="primary"  @click="btnCalcluteTax" icon="el-icon-edit">测算</el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcel">导出</el-button> -->
            <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportSumPreTax">导出</el-button> -->
            <!-- <el-button size="mini" type="primary"  @click="btnCalcluteTax" icon="el-icon-edit"  v-if=" this.$store.state.user.sysTime.substring(0,10)==this.sumlistQuery.S_WorkDate.substring(0,10)">测算</el-button> -->
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
    
        <el-table-column width="90px" fixed="left" align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="right" prop="Person_Num" label="纳税人数">
          <template slot-scope="scope">
            <span>{{scope.row.Person_Num}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="right"  prop="T_YSHJ" label="劳资提供的应发数">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSHJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="right" prop="T_BQSR" label="报税工资项目">
          <template slot-scope="scope">
            <span>{{scope.row.T_BQSR |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="right" prop="K_YangLaoBX" label="养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YangLaoBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="right" prop="K_YiLiaoBX" label="医疗保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YiLiaoBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="right" prop="K_SYBX" label="失业保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_SYBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="right" prop="K_ZFGJJ" label="住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.K_ZFGJJ |NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" prop="K_SJZFGJJ" label="上限住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.K_SJZFGJJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="K_QYNJ" label="年金(个人部分)">
          <template slot-scope="scope">
            <span>{{scope.row.K_QYNJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="350px" align="right" prop="T_SFGZ" label="实发工资=报税工资项目合计-养老-医疗-失业-公积金-年金">
          <template slot-scope="scope">
            <span>{{scope.row.T_SFGZ |NumFormat}}</span>
          </template>
        </el-table-column> -->
      <el-table-column width="260px" align="right" prop="T_DYYSSDE" label="本月应纳税所得额">
          <template slot-scope="scope">
            <span>{{scope.row.T_DYYSSDE |NumFormat}}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="240px" align="right" prop="T_YSSDE" label="累计应纳税所得额">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSSDE |NumFormat}}</span>
          </template>
        </el-table-column>
       <el-table-column width="180px" align="right" prop="T_LJYJS" label="累计薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.T_LJYJS |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="right" prop="WithholdingTax" label="累计实际已缴薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.WithholdingTax |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="T_DJJE" label="累计正常薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.T_DJJE |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="180px" align="right" prop="T_DJJE" label="累计正常薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.T_DJJE |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="right" prop="WithholdingTax" label="累计实际已缴薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.WithholdingTax |NumFormat}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column width="180px" align="right" prop="G_YCXJJ" label="一次性奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_YCXJJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" prop="K_YCXJJYKS" label="一次性奖金税额">
          <template slot-scope="scope">
            <span>{{scope.row.K_YCXJJYKS |NumFormat}}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="300px" align="right" prop="KS_HJ" label="累计税额(奖金预扣税+一次性奖金预扣税+ERP扣税)">
          <template slot-scope="scope">
            <span>{{scope.row.KS_HJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="180px" align="right" prop="K_KS" label="累计ERP扣税">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS |NumFormat}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="100px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="sumdetail(scope.row.S_OrgName,scope.row.S_OrgCode)" type="primary" plain>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="sumshowed" width="80%">
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
            @select="getnode"
          />
        </el-col>
        <el-col :span="20">
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
    <!-- <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.TaxCode"
            placeholder="请选择税号"
          >
            <el-option
              v-for="item in taxcodeoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ><span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span></el-option>
          </el-select> -->

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
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportPreTax">导出</el-button>
            <!-- <el-button size="mini" type="primary"  @click="btnCalcluteTax" icon="el-icon-edit">测算</el-button> -->
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
        <el-table-column width="90px" align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="证件号码">
          <template slot-scope="scope">
            <span>{{scope.row.IdNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="劳资提供的应发数">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSHJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="报税工资项目合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_BQSR |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YangLaoBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="医疗保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YiLiaoBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="失业保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_SYBX |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.K_ZFGJJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="年金(个人部分)">
          <template slot-scope="scope">
            <span>{{scope.row.K_QYNJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="380px" align="right" label="实发工资=报税工资项目合计-养老-医疗-失业-公积金-年金">
          <template slot-scope="scope">
            <span>{{scope.row.T_SFGZ |NumFormat}}</span>
          </template>
        </el-table-column> -->
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
        <el-table-column width="180px" align="right" label="费用扣除标准">
          <template slot-scope="scope">
            <span>{{scope.row.D_FYJCBZ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="本月应纳税所得额(测算)">
          <template slot-scope="scope">
            <span>{{scope.row.T_DYYSSDE |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="累计应纳税所得额(测算)">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSSDE |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="税率">
          <template slot-scope="scope">
            <span>{{scope.row.D_SL |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="速算扣除数">
          <template slot-scope="scope">
            <span>{{scope.row.D_SSKCS |NumFormat}}</span>
          </template>
        </el-table-column>

         <el-table-column width="180px" align="right" label="累计薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.T_LJYJS |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="right" label="累计实际已缴薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.WithholdingTax |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="正常薪金税额">
          <template slot-scope="scope">
            <span>{{scope.row.T_DJJE |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_JJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="奖金预扣税额">
          <template slot-scope="scope">
            <span>{{scope.row.K_JJYKS |NumFormat}}</span>
          </template>
        </el-table-column> 

        <el-table-column width="180px" align="right" label="一次性奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_YCXJJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="一次性奖金预扣税额">
          <template slot-scope="scope">
            <span>{{scope.row.K_YCXJJYKS |NumFormat}}</span>
          </template>
        </el-table-column> 
        <el-table-column width="180px" align="right" label="ERP扣税">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" label="税额(奖金预扣税+一次性奖金预扣税+ERP扣税)">
          <template slot-scope="scope">
            <span>{{scope.row.KS_HJ |NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="right" label="累计预扣税额">
          <template slot-scope="scope">
            <span>{{scope.row.LJ_KS |NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="detail(scope.row.S_WorkerCode,scope.row.ImportModel,scope.row.S_WorkerName)" type="primary" plain>详情</el-button>
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
    <el-dialog :visible.sync="showed" width="80%">
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="24">

          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcelDetail">导出工资条</el-button>
        </el-col>
      </el-row>
    </div>
     <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="listDetail"
        :header-cell-class-name="tableRowClassName"
        v-loading="listLoadingDetail"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="90px" fixed="left" align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" fixed="left" align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" label="单位" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" label="部门" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.S_Department}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" fixed="left" align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="right" label="岗位（技）工资">
          <template slot-scope="scope">
            <span>{{scope.row.G_GWJGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="岗位（技）工资（补）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_GWJGZB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="right" label="保留工资">
          <template slot-scope="scope">
            <span>{{scope.row.G_BLGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="工龄津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_GLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="上岗津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_SGJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="技术（技能）津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_JSJNJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房补贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_ZFBT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="保留津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_BLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="边远矿贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_BYKT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="政府津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZFJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="回民津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_HMJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="驾驶津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JSJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="信访工作津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_XFGZJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="法轮功斗争津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_FLGDZJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="班主任津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BZRJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="医疗卫生津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_SYYLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="其他津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_QTJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="夜班津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_YBJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="加班、加点工资"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JBJDGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="星期加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_XQJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="平时加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_PSJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="节日加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JRJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="基础月奖">
          <template slot-scope="scope">
            <span>{{scope.row.G_JCYJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="业绩奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_YJJJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="总额内补发补扣"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZENBFBK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZXJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="C01专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C01 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="C02专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C02 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="C03专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C03 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="C04专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C04 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="小计1"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_XJ1 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="独生子女补贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_DSZNJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="保健食品津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BJSPJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="防暑降温费"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_FSJWF | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="误餐补助"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_WCBZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="通讯补助"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_TXBZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="交通津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JTBZ | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="合理化建议奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_HLHJYJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="C05专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C05 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="总额外补发（补扣）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZEWBFBK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="疗养费"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_LYF | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="小计2"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_XJ2 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表二'"
          label="小计3"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_YFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="独生子女（保健防暑）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_DSZNBJFS | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="误餐补贴（三费）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_WCBTSF | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="补发（扣）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BFK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQueryDetail.ImportModel === '样表一'"
          label="应发合计"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_YFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="医疗保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YiLiaoBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="失业保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_SYBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YangLaoBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.K_ZFGJJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="企业年金">
          <template slot-scope="scope">
            <span>{{scope.row.K_QYNJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="其他扣项">
          <template slot-scope="scope">
            <span>{{scope.row.K_QTKX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="应税合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="扣税">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="实发合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_SFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项1">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust1 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项2">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust2 | NumFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项3">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust3 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项4">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust4 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项1">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust5 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项2">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust6 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项3">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust7 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项4">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust8 | NumFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
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
import { getSumPreCalculateTax,getPreCalculateTax,getTaxSalaryList,exportPreCalTax } from "@/frame_src/api/taxSalary";
import {
  getAllDictionary
} from "@/frame_src/api/taxOrg";
import { calPreCalculateTax } from "@/frame_src/api/IndividualTaxCalculate";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "IndividualTaxPreCalculate",
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  data() {
    return {
      showed: false,
      sumshowed: false,
      normalizer(node) {
        return {
          id: node.ORG_CODE,
          label: node.ORG_SHORT_NAME,
          children: node.children
        };
      },
      exportComp: this.$store.state.user.orgName,
      tableKey: 0,
      sumlist:[],
      list: [],
      listDetail:[],
      importList: [],
      taxcodeoptions: [], //税号
      total: null,
      totalDetail: null,
      listLoading: true,
      sumlistLoading:true,
      listLoadingDetail:true,
      fullscreenLoading: false,
      sumlistQuery:{
        S_Department: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        S_UpdateBy: this.$store.state.user.userId,
        TaxCode:""
      },
      listQuery: {
        page: 1,
        limit: 10,
        Is_Page: "true",
        S_Department: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_OrgName: this.$store.state.user.departName,
        S_UpdateBy: this.$store.state.user.userId,
        TaxCode:""
      },
      listQueryDetail: {
        // page: 1,
        // limit: 10,
        S_WorkerCode:"",
        // S_Department: "",
        S_WorkerName: "",
        Is_Page:"false",
        // S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime,
        S_UpdateBy: this.$store.state.user.userId
      },
      treeData: []
    };
  },
  filters: {
    parseTime,
    NumFormat,
    formatTime(val){
      if(val!=null&&val!=""){
        return val.substring(0,7)
      }
    }
  },
  methods: {
        getAllDictionary() {
      getAllDictionary().then(response => {
        if (response.data.code === 2000) {
          // this.taxofficeoptions = response.data.taxOffice;
          // this.orgregionoptions = response.data.orgRegion;
          this.taxcodeoptions = response.data.taxCode;
          // this.responsibilityoptions = response.data.responsibilityCenter;
        }
      });
    },
      getnode(node, instanceId) {
      this.listQuery.S_OrgName = node.ORG_SHORT_NAME;
    },
    sumgetnode(node, instanceId) {
      this.sumlistQuery.S_OrgName = node.ORG_SHORT_NAME;
    },
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
    detail(workcode,importmodel,workname) {
      this.title = "工资详情";
      this.showed = true;

     this.getDetailList(workcode,importmodel,workname);
    },
    sumdetail( orgName, orgCode)
    {
 this.title = "详情";
      this.sumshowed = true;
this.listQuery.S_WorkDate=this.sumlistQuery.S_WorkDate;
this.listQuery.S_Department=this.sumlistQuery.S_Department;
this.listQuery.S_OrgCode=orgCode;
this.listQuery.S_OrgName=orgName;
this.listQuery.TaxCode=this.sumlistQuery.TaxCode;
this.getList();
    },
    btnCalcluteTax() {
        // this.fullscreenLoading = true;
         const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      calPreCalculateTax(this.sumlistQuery).then(response => {
        if (response.data.code === 2000) {
           //this.fullscreenLoading = false;
             loading.close();
       //this.getList();
       this.getSumList();
       this.$notify({
              position: "bottom-right",
              title: "成功",
              message: "测算完成",
              type: "success",
              duration: 2000
          });
        } else {
           //this.fullscreenLoading = false;
             loading.close();
          this.getSumList();
         //this.getList();
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
    //  getSummaries(param) {
    //     const { columns, data } = param;
    //     const sums = [];
    //     columns.forEach((column, index) => {
    //       if (index === 0) {
    //         sums[index] = '合计';
    //         return;
    //       }
    //       const values = data.map(item => Number(item[column.property]));
    //       const values2 = data.map(item => item[column.property]);
    //       if (!values.every(value => isNaN(value))) {
    //         sums[index] = values.reduce((prev, curr) => {
    //           const value = Number(curr);
    //           if (!isNaN(value)) {
    //             return Number(prev+ curr).toFixed(2);
    //             // if(index === 2)
    //             // {return Number(prev + curr);}
    //             // else{return Number(prev + curr).toFixed(2)}
    //           } else {
    //             return prev.toFixed(2);
    //           }
    //         }, 0);
    //           if (index === 2) {
    //         //sums[index]  = sums[index]|NumFormat +' 人';
    //         sums[index]  += ' 人';
    //           }
    //           else{
    //             //sums[index]  =sums[index]|NumFormat +  ' 元';
    //             sums[index] += ' 元';
    //           }
    //       } else {
    //         sums[index] = '';
    //       }
    //     });

    //     return sums;
    //   },
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
                          if (index === 2) {
            sums[index]  += ' 人';
              }
else{            sums[index]=sums[index].toFixed(2);
            sums[index] += ' 元';}

          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
    getSumList() {
      this.sumlistLoading= true;
      getSumPreCalculateTax(this.sumlistQuery).then(response => {
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
    getList() {
      this.listLoading= true;

      getPreCalculateTax(this.listQuery).then(response => {
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
getDetailList(workcode,importmodel,workname) {
      this.listLoadingDetail = true;
this.listQueryDetail.S_WorkDate=this.listQuery.S_WorkDate;
this.listQueryDetail.S_WorkerCode=workcode;
this.listQueryDetail.S_WorkerName=workname;
this.listQueryDetail.ImportModel=importmodel;
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

 exportPreTax() {
      exportPreCalTax(this.listQuery).then(response => {
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
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilterSum()
    {
          this.getSumList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    exportSumPreTax()
    {
      this.getSumList();
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
         "单位",
"工资年月",
"纳税人数",
"累计劳资提供的应发数",
"累计报税工资项目",
"累计养老保险",
"累计医疗保险",
"累计失业保险",
"累计住房公积金",
"累计上限住房公积金",
"累计年金(个人部分)",
"累计实发工资=报税工资项目合计-养老-医疗-失业-公积金-年金",
"累计应纳税所得额",
"累计正常薪金税额",
"累计一次性奖金",
"累计一次性奖金税额",
"累计税额(工资薪金和一次性税额合计)",
"累计ERP扣税"
        ];
        const filterVal = [
 "S_OrgName",
"S_WorkDate",
"Person_Num",
"T_YSHJ",
"T_SRE",
"K_YangLaoBX",
"K_YiLiaoBX",
"K_SYBX",
"K_ZFGJJ",
"K_SJZFGJJ",
"K_QYNJ",
"T_SFGZ",
"T_YSSDE",
"T_DJJE",
"G_YCXJJ",
"K_YCXJJYKS",
"T_SE",
"K_KS"
        ];
        const data = this.formatJson(filterVal, this.sumlist);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            this.sumlistQuery.S_OrgName +
            this.sumlistQuery.S_WorkDate.substr(0, 7) +
            "个税测算汇总"
        });
      });
    },
    exportExcel() {
      //this.getList();
      this.listQuery.Is_Page="false";
      getPreCalculateTax(this.listQuery).then(response => {
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
          "部门",
          "身份证",
          "工资年月",
          "应税合计(劳资)",
          "实发合计(劳资)",
          "报税工资项目合计",
          "养老保险",
          "医疗保险",
          "失业保险",
          "住房公积金",
          "年金(个人部分)",
          "实发工资=报税工资项目合计+养老+医疗+失业+公积金+年金",
          "费用扣除标准",
          "应纳税所得额",
          "税率",
          "速算扣除数",
          "正常薪金税额",
          "一次性奖金",
          "一次性奖金税额",
          "税额(工资薪金和一次性税额合计)",
          "ERP扣税"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          "S_Department",
          "IdNumber",
          "S_WorkDate",
          "T_YSHJ",
          "T_SFHJ",
          "T_BSGZHJ",
          "K_YangLaoBX",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_ZFGJJ",
          "K_QYNJ",
          "T_SFGZ",
          "D_FYJCBZ",
          "T_YSSDE",
          "D_SL",
          "D_SSKCS",
          "T_DJJE",
          "G_YCXJJ",
          "K_YCXJJYKS",
          "T_SE",
          "K_KS"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            this.exportComp +
            this.listQuery.S_WorkDate.substr(0, 7) +
            "个税汇总"
        });
      });
    },
        exportExcelDetail() {

          if (this.listQueryDetail.ImportModel === "样表二") {
            this.exportExcel2();
          } else {
            this.exportExcel1();
          }
        

    },
    exportExcel2() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "员工编号",
          "姓名",
          "部门",
          "岗位（技）工资",
          "岗位（技）工资（补）",
          "保留工资",
          "工龄津贴",
          "上岗津贴",
          "技术(技能)津贴",
          "住房补贴",
          "保留津贴",
          "边远矿贴",
          "政府津贴",
          "回民津贴",
          "驾驶津贴",
          "信访工作津贴",
          "法轮功斗争津贴",
          "班主任津贴",
          "医疗卫生津贴",
          "夜班津贴",
          "星期加班",
          "平时加班",
          "节日加班",
          "基础月奖",
          "业绩奖金",
          "总额内补发（补扣）",
          "专项奖",
          "C01专项奖",
          "C02专项奖",
          "C03专项奖",
          "C04专项奖",
          "小计1",
          "独生子女补贴",
          "保健食品津贴",
          "防暑降温费",
          "误餐补助",
          "通讯补助",
          "交通津贴",
          "合理化建议奖",
          "C05专项奖",
          "总额外补发（补扣）",
          "疗养费",
          "小计2",
          "小计3",
          "医疗保险",
          "失业保险",
          "养老保险",
          "住房公积金",
          "企业年金",
          "其他扣项",
          "应税合计",
          "扣税",
          "实发合计",
          "调增项1",
          "调增项2",
          "调增项3",
          "调增项4",
          "调减项1",
          "调减项2",
          "调减项3",
          "调减项4"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          "G_GWJGZ",
          "G_GWJGZB",
          "G_BLGZ",
          "G_GLJT",
          "G_SGJT",
          "G_JSJNJT",
          "G_ZFBT",
          "G_BLJT",
          "G_BYKT",
          "G_ZFJT",
          "G_HMJT",
          "G_JSJT",
          "G_XFGZJT",
          "G_FLGDZJT",
          "G_BZRJT",
          "G_SYYLJT",
          "G_YBJT",
          "G_XQJB",
          "G_PSJB",
          "G_JRJB",
          "G_JCYJ",
          "G_YJJJ",
          "G_ZENBFBK",
          "G_ZXJ",
          "G_C01",
          "G_C02",
          "G_C03",
          "G_C04",
          "T_XJ1",
          "G_DSZNJT",
          "G_BJSPJT",
          "G_FSJWF",
          "G_WCBZ",
          "G_TXBZ",
          "G_JTBZ",
          "G_HLHJYJ",
          "G_C05",
          "G_ZEWBFBK",
          "G_LYF",
          "T_XJ2",
          "T_YFHJ",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_YangLaoBX",
          "K_ZFGJJ",
          "K_QYNJ",
          "K_QTKX",
          "T_YSHJ",
          "K_KS",
          "T_SFHJ",
          "Adjust1",
          "Adjust2",
          "Adjust3",
          "Adjust4",
          "Adjust5",
          "Adjust6",
          "Adjust7",
          "Adjust8"
        ];
        const data = this.formatJson(filterVal, this.listDetail);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.listQueryDetail.S_WorkerName +this.listQueryDetail.S_WorkDate.substr(0,7)+"工资表"
        });
      });
    },
    exportExcel1() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "员工编号",
          "姓名",
          "部门",
          "岗位（技）工资",
          "保留工资",
          "工龄津贴",
          "上岗津贴",
          "技术(技能)津贴",
          "住房补贴",
          "保留津贴",
          "边远矿贴",
          "其它津贴",
          "夜班津贴",
          "加班、加点工资",
          "基础月奖",
          "业绩奖金",
          "独生子女(保健防暑）",
          "误餐补贴(三费)",
          "补发（扣）",
          "应发合计",
          "医疗保险",
          "失业保险",
          "养老保险",
          "住房公积金",
          "企业年金",
          "其他扣项",
          "应税合计",
          "扣税",
          "实发合计",
          "调增项1",
          "调增项2",
          "调增项3",
          "调增项4",
          "调减项1",
          "调减项2",
          "调减项3",
          "调减项4"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          "G_GWJGZ",
          "G_BLGZ",
          "G_GLJT",
          "G_SGJT",
          "G_JSJNJT",
          "G_ZFBT",
          "G_BLJT",
          "G_BYKT",
          "G_QTJT",
          "G_YBJT",
          "G_JBJDGZ",
          "G_JCYJ",
          "G_YJJJ",
          "G_DSZNBJFS",
          "G_WCBTSF",
          "G_BFK",
          "T_YFHJ",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_YangLaoBX",
          "K_ZFGJJ",
          "K_QYNJ",
          "K_QTKX",
          "T_YSHJ",
          "K_KS",
          "T_SFHJ",
          "Adjust1",
          "Adjust2",
          "Adjust3",
          "Adjust4",
          "Adjust5",
          "Adjust6",
          "Adjust7",
          "Adjust8"
        ];
        const data = this.formatJson(filterVal, this.listDetail);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.listQueryDetail.S_WorkerName +this.listQueryDetail.S_WorkDate.substr(0,7)+"工资表"
        });
      });
    }
  },
  created() {
       // this.getAllDictionary();
    this.loadOrgByCode();
    this.getSumList();
    //this.getList();
  },
    activated() {
          this.getAllDictionary();
    this.loadOrgByCode();
    this.getSumList();
    //this.getList();
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
#IndividualTaxPreCalculate {
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
