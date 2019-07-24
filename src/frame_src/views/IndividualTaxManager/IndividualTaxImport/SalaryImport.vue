<template>
  <div id="SalaryImport" class="app-container calendar-list-container">
    <div class="filter-container">
      <span>当前月份：</span>
      <el-date-picker
        size="mini"
        v-model="importMonth"
        style="width:120px;"
        readonly
        type="month"
        placeholder="选择月"
      ></el-date-picker>
      <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleImport">导入</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-document"
        v-if="this.$store.state.user.orgCode!='100'"
        @click="deleteSalary"
      >清空</el-button>
      <span>模板下载：</span>
      <a class="astyle" :href="urldownload1">样表一</a>&nbsp;&nbsp;
      <a class="astyle" :href="urldownload2">样表二</a>
      <!-- <el-button size="mini" type="primary" icon="el-icon-document" @click="showTemplateUpload=true">模板下载</el-button> -->
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
            <span>{{scope.row.S_WorkDate|parseTime1}}</span>
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表一'"
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
          v-if="this.ImportModel === '样表一'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表二'"
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
          v-if="this.ImportModel === '样表一'"
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
          v-if="this.ImportModel === '样表一'"
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
          v-if="this.ImportModel === '样表一'"
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
          v-if="this.ImportModel === '样表一'"
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

    <el-dialog :visible.sync="showUpload">
      <el-card class="box-card">
        <div class="filter-container">
          <el-upload
            accept=".xls, .xlsx"
            :limit="limitNum"
            :action="urlUpload"
            :data="filedata"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            :on-exceed="handleExceed"
            class="upload-demo"
            ref="upload"
            :auto-upload="false"
            :file-list="fileList"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >确认导入</el-button>
          </el-upload>
        </div>
      </el-card>
    </el-dialog>

    <!-- <el-dialog :visible.sync="showTemplateUpload" title="模板下载">
            <el-card class="box-card">
                <div class="filter-container">
                    <div style="margin-bottom:5px;">
                        <a :href="urldownload">样表一下载</a>&nbsp;&nbsp;
                        <a :href="urldownload">样表二下载</a>
                    </div>
                </div>
            </el-card>
    </el-dialog>-->
  </div>
</template>

<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
// import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getTaxSalaryList,
  getReportStatus,
  uploadTaxSalary,
  delTaxSalary
} from "@/frame_src/api/taxSalary";
export default {
  name: "SalaryImport",
  directives: {
    waves
  },
  data() {
    return {
      importMonth: this.$store.state.user.sysTime,
      validateCondition: {
        S_OrgCode: "",
        ReportStatus: "",
        IsComputeTax: ""
      },
      ImportModel:'样表一',
      //showTemplateUpload:false,
      showUpload: false,
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      deldate: {
        dateMonth: this.$store.state.user.sysTime,
        orgCode: this.$store.state.user.orgCode
      },
      listQuery: {
        page: 1,
        limit: 10,
        Is_Page: true,
        S_OrgName: "",
        S_WorkerName: "",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime
      },
      limitNum: 1,
      urldownload1: process.env.BASE_API + "/ExcelModel/样表一.xls",
      urldownload2: process.env.BASE_API + "/ExcelModel/样表二.xls",
      urlUpload: process.env.BASE_API + "/TaxSalary/validateTaxSalary",
      filedata: {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime,
        userId: this.$store.state.user.userId,
        orgName: this.$store.state.user.orgName
      },
      fileList: []
    };
  },
  filters: {
    parseTime1,
    NumFormat
  },
  methods: {
    getList() {
      this.listLoading = true;
      getTaxSalaryList(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
         if(response.data.items.length>0) 
          {
          this.ImportModel=response.data.items[0].ImportModel;
          }
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

    //upload
    submitUpload() {
      this.$refs.upload.submit();
    },

    handleSuccess(res, file, fileList) {
      var message = res.message;
      var title = "失败";
      var type = "error";
      if (res.code === 2000) {
        let fd = new FormData();
        fd.append("filePath", res.item); //传文件
        fd.append("orgCode", this.$store.state.user.orgCode); //传其他参数
        fd.append("orgName", this.$store.state.user.orgName); //传其他参数
        fd.append("dateMonth", this.$store.state.user.sysTime); //传其他参数
        fd.append("userId", this.$store.state.user.userId); //传其他参数
        return new Promise((resolve, reject) => {
          uploadTaxSalary(fd)
            .then(response => {
              if (response.data.code === 2000) {
                message = "导入成功！";
                title = "成功";
                type = "success";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });

                this.showUpload = false;
                this.getList();
              } else {
                message = response.data.message;
                title = "失败";
                type = "error";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });

                this.showUpload = false;
                this.getList();
              }
            })
            .catch(error => {});
        });
      } else if (res.code === 2001) {
        this.$confirm(message + "确认导入数据吗？", "导入确认", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "放弃",
          customClass:'message-layout'
          
        })
          .then(() => {
            let fd = new FormData();
            fd.append("filePath", res.item); //传文件
            fd.append("orgCode", this.$store.state.user.orgCode); //传其他参数
            fd.append("orgName", this.$store.state.user.orgName); //传其他参数
            fd.append("dateMonth", this.$store.state.user.sysTime); //传其他参数
            fd.append("userId", this.$store.state.user.userId); //传其他参数
            return new Promise((resolve, reject) => {
              uploadTaxSalary(fd)
                .then(response => {
                  if (response.data.code === 2000) {
                    message = "导入成功！";
                    title = "成功";
                    type = "success";
                    this.$notify({
                      position: "bottom-right",
                      title: title,
                      message: message,
                      type: type,
                      duration: 5000
                    });
                    this.showUpload = false;
                    this.getList();
                  } else {
                    message = response.data.message;
                    title = "失败";
                    type = "error";
                    this.$notify({
                      position: "bottom-right",
                      title: title,
                      message: message,
                      type: type,
                      duration: 5000
                    });
                    this.showUpload = false;
                    this.getList();
                  }
                })
                .catch(error => {});
            });
          })
          .catch(() => {});
      } else {
        this.$notify({
          position: "bottom-right",
          title: title,
          message: message,
          type: type,
          duration: 5000
        });
      }

      this.showUpload = false;
      this.getList();
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitNum}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleImport() {
      const data = {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime
      };
      getReportStatus(data).then(response => {
        if (response.data.items.length === 1) {
          this.validateCondition = Object.assign({}, response.data.items[0]);
          if (this.validateCondition.IsComputeTax === 1) {
            if (
              this.validateCondition.ReportStatus === 0 ||
              this.validateCondition.ReportStatus === 1
            ) {
              this.$confirm("已存在工资信息，是否重新导入?", "导入确认", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "放弃"
              })
                .then(() => {
                  this.showUpload = true;
                })
                .catch(() => {
                  // this.$message({
                  //     type: "cancel",
                  //     message: "取消"
                  // });
                });
            } else if (this.validateCondition.ReportStatus === 2) {
              this.$notify({
                position: "bottom-right",
                title: "消息提示",
                message: "当前部门工资已锁定！",
                type: "warning",
                duration: 5000
              });
            } else {
              this.showUpload = true;
            }
          } else {
            this.$notify({
              position: "bottom-right",
              title: "消息提示",
              message: "当前部门没有导入工资的权限！",
              type: "warning",
              duration: 5000
            });
          }
        } else if (response.data.items.length === 0) {
          this.showUpload = true;
        } else {
          this.$notify({
            position: "bottom-right",
            title: "消息提示",
            message: "导入月份数据异常！",
            type: "warning",
            duration: 5000
          });
        }
      });
      this.fileList = [];
    },
    deleteSalary() {
      const data = {
        orgCode: this.$store.state.user.orgCode,
        dateMonth: this.$store.state.user.sysTime
      };
      getReportStatus(data).then(response => {
        this.validateCondition = Object.assign({}, response.data.items[0]);
        if (this.validateCondition.ReportStatus === 2) {
          this.$notify({
            position: "bottom-right",
            title: "操作失败",
            message:
              "本部门已上报,不可清空工资信息,若需要重新导入,请联系上级部门解锁",
            type: "error",
            duration: 3000
          });
        } else {
          this.$confirm("是否清空本月工资数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              delTaxSalary(this.deldate).then(response => {
                var message = response.data.message;
                var title = "失败";
                var type = "error";
                if (response.data.code === 2000) {
                  title = "成功";
                  type = "success";
                }
                this.getList();
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 2000
                });
              });
            })
            .catch(() => {});
        }
      });
    }
  },
  created() {
    this.getList();
  },
  activated() {
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



<style lang="scss" >

.page {
  text-align: center;
}
a.astyle {
  color: #333;
  text-decoration: none;
}
a.astyle:hover {
  color: #cc3300;
  text-decoration: underline;
}
// .el-message-box__content{
//   height: 300px!important;
//   overflow-y: auto!important ;
// }
.message-layout{
    height: 300px!important;
  overflow-y: auto!important ;
}
</style>                                                                                                   

