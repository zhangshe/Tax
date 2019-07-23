<template>
  <div id="TaxStatementHB" class="app-container calendar-list-container">
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
      <!-- <span>上报状态：</span>
      <el-select v-model="temp.Status" size="mini" style="width:120px;" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
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
      <el-button size="mini" type="primary" v-waves @click="Excel(1)">人员导出</el-button>
      <el-button size="mini" type="primary" v-waves @click="Excel(4)">人员变动导出</el-button>
      <el-button size="mini" type="primary" v-waves @click="Excel(2)">工资导出</el-button>
      <el-button size="mini" type="primary" v-waves @click="Excel(3)">一次性奖金导出</el-button>
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
            <span>{{scope.row.ReportStatus | statusFormater}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="95px" fixed="left" align="center" label="计算状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.TaxStatus | TaxStatusFormater}}</span>
                    </template>
        </el-table-column>-->
        <!-- <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if='scope.row.Status!=1' size="mini" @click="Lock(scope.row)">锁定</el-button>
                        <el-button type="primary" v-if='scope.row.Status===1' size="mini" @click="UnLock(scope.row)">解锁</el-button>
                        <el-button type="primary" v-if='scope.row.Status===1' size="mini" >导出</el-button>
                    </template>
        </el-table-column>-->
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
  getExportPayerInfo,
  getExportSalary,
  getExportOnceBonus,
  getOrgStatus,
  getTaxNumberOptions,
  exportSalary, //金税导出工资
  exportOnceBonus, //金税导出一次性奖金
  exportPayerInfo, //金税导出人员
  exportChangePayerInfo//导出变动的金税人员
} from "@/frame_src/api/Export";
const flagOptions = [{ key: 0, flag_name: "否" }, { key: 1, flag_name: "是" }];
const sexOptions = [{ key: 0, sex_name: "男" }, { key: 1, sex_name: "女" }];
const workOptions = [
  { key: 0, workOptions_name: "正常" },
  { key: 1, workOptions_name: "非正常" }
];
// arr to obj ,such as { CN : "China", US : "USA" }
const flagOptionsKeyValue = flagOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.flag_name;
  return acc;
}, {});
const sexOptionsKeyValue = sexOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.sex_name;
  return acc;
}, {});
const workOptionsKeyValue = workOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.workOptions_name;
  return acc;
}, {});
export default {
  name: "TaxStatementHB",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [
        {
          OrgName: "单位1",
          Status: 1,
          TaxStatus: 1
        },
        {
          OrgName: "单位2",
          Status: 0,
          TaxStatus: 0
        }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        OrgCode: this.$store.state.user.orgCode,
        WorkDate: this.$store.state.user.sysTime,
        Status: "",
        TaxNumber: "",
        limit: 10,
        page: 1,
      },
      listdata: [], //这个是excel导出的公共数组对象
      options: [
        {
          value: "-1",
          label: "待导入"
        },
        // {
        //   value: "0",
        //   label: "待计算"
        // },
        {
          value: "1",
          label: "待上报"
        },
        {
          value: "2",
          label: "已上报"
        }
      ],
      TaxNumberOptions: []
    };
  },

  methods: {
    getList() {
      this.listLoading = false;
      this.getTaxNumberOptions();
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.listUpdate.CONF_NAME = "";
    },
    handleSizeChange(val) {
      this.temp.limit = val;
      this.getOrgStatus();
    },
    handleCurrentChange(val) {
      this.temp.page = val;
      this.getOrgStatus();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getOrgStatus();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    Excel(data) {
      switch (data) {
        case 1:
          this.getExportPayerInfo();
          //this.PayerInfoExport();
          break;
        case 2:
          let list = [];
          let result = "";
          // let temp = {
          //   OrgCode: this.$store.state.user.orgCode,
          //   WorkDate: this.$store.state.user.sysTime,
          //   Status: "",
          //   TaxNumber: "",
          //   limit: 10,
          //   page: 1
          // };
          // temp.TaxNumber = this.temp.TaxNumber;
          getOrgStatus(this.temp).then(response => {
            if (response.data.code === 2000) {
              list = response.data.items;
              result = list.some(item => {
                return item.ReportStatus != 2;
              });
              if (!result) {
                this.getExportSalary();
              } else {
                this.$notify({
                  position: "bottom-right",
                  title: "失败",
                  message: "存在未上报的单位,禁止导出",
                  type: "error",
                  duration: 2000
                });
              }
            }
          });
          break;
        case 3:
          // this.getExportOnceBonus();
          let list2 = [];
          let result2 = "";
          // let temp = {
          //   OrgCode: this.$store.state.user.orgCode,
          //   WorkDate: this.$store.state.user.sysTime,
          //   Status: "",
          //   TaxNumber: "",
          //   limit: 10,
          //   page: 1
          // };
          // temp.TaxNumber = this.temp.TaxNumber;
          getOrgStatus(this.temp).then(response => {
            if (response.data.code === 2000) {
              list2 = response.data.items;
              result2 = list2.some(item => {
                return item.ReportStatus != 2;
              });
              if (!result2) {
                this.getExportOnceBonus();
              } else {
                this.$notify({
                  position: "bottom-right",
                  title: "失败",
                  message: "存在未上报的单位,禁止导出",
                  type: "error",
                  duration: 2000
                });
              }
            }
          });
          break;
        case 4:
          this.getExportChangePayerInfo();
          break;
      }
    },
    Lock(row) {},
    UnLock(row) {},
    getTaxNumberOptions() {
      getTaxNumberOptions(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.TaxNumberOptions = response.data.items;
          if (this.TaxNumberOptions.length > 0) {
            this.temp.TaxNumber = this.TaxNumberOptions[0].Code;
          }
          this.getOrgStatus();
        }
      });
    },
    getExportPayerInfo() {
      exportPayerInfo(this.temp).then(response => {
        if (response.data.code === 2000) {
          window.open(process.env.BASE_API + response.data.item, "_blank");
          // this.listdata = response.data.items;
          // this.PayerInfoExport();
        } else {
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: "没有数据：" + response.data.message,
            type: "success",
            duration: 2000
          });
        }
      });
    },
    getExportChangePayerInfo(){
      exportChangePayerInfo(this.temp).then(response=>{
        if (response.data.code === 2000) {
          window.open(process.env.BASE_API + response.data.item, "_blank");
          // this.listdata = response.data.items;
          // this.PayerInfoExport();
        } else {
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: "没有数据：" + response.data.message,
            type: "success",
            duration: 2000
          });
        }
      })
    },
    getExportSalary() {
      exportSalary(this.temp).then(response => {
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
      // getExportSalary(this.temp).then(response => {
      //   if (response.data.code === 2000 && response.data.total > 0) {
      //     this.listdata = response.data.items;
      //     this.ExportSalary();
      //   } else {
      //     this.$notify({
      //       position: "bottom-right",
      //       title: "成功",
      //       message: "没有数据：" + response.data.message,
      //       type: "success",
      //       duration: 2000
      //     });
      //   }
      // });
    },
    // getExportOnceBonus() {
    //   getExportOnceBonus(this.temp).then(response => {
    //     if (response.data.code === 2000 && response.data.total > 0) {
    //       this.listdata = response.data.items;
    //       this.ExportOnceBonus();
    //     } else {
    //       this.$notify({
    //         position: "bottom-right",
    //         title: "成功",
    //         message: "没有数据：" + response.data.message,
    //         type: "success",
    //         duration: 2000
    //       });
    //     }
    //   });
    // },

    getExportOnceBonus() {
      exportOnceBonus(this.temp).then(response => {
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

    getOrgStatus() {
      getOrgStatus(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.total = response.data.total;
        }
      });
    },
    PayerInfoExport() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "工号",
          "*姓名",
          "*证照类型",
          "*证照号码",
          "*国籍(地区)",
          "*性别",
          "*出生日期",
          "*人员状态",
          "*是否雇员",
          "*手机号码",
          "是否残疾",
          "是否烈属",
          "是否孤老",
          "残疾证号",
          "烈属证号",
          "任职受雇日期",
          "离职日期",
          "电子邮箱",
          "学历",
          "职业",
          "开户银行",
          "银行账号",
          "是否特定行业",
          "是否股东、投资者",
          "个人股本（投资）额",
          "户籍所在地（省)",
          "户籍所在地（市）",
          "户籍所在地（区县）",
          "户籍所在地（详细地址）",
          "居住地址（省）",
          "居住地址（市）",
          "居住地址（区县）",
          "居住地址（详细地址）",
          "备注",
          "是否境外人员",
          "姓名（中文）",
          "境内有无住所",
          "出生地",
          "首次入境时间",
          "本年入境时间",
          "预计离境时间",
          "联系地址（省）",
          "联系地址（市）",
          "联系地址（区县）",
          "联系地址（详细地址）",
          "支付地",
          "境外支付地",
          "境内职务",
          "境外职务",
          "任职期限",
          "境外纳税人识别号"
        ];
        const filterVal = [
          "WorkerNumber",
          "WorkerName",
          "idt",
          "IdNumber",
          "nat",
          "Sex",
          "BirthDate",
          "WorkerStatus",
          "IsEmployee",
          "Tel",
          "IsDisability",
          "IsLieShu",
          "IsAlone",
          "DisabilityNo",
          "LiShuZH",
          "EmployeeDate",
          "QuitDate",
          "Email",
          "edu",
          "occ",
          "BankName",
          "BankNumber",
          "IsSpecialIndustry",
          "IsShareholder",
          "Investment",
          "Province",
          "City",
          "County",
          "Domicile",
          "Adress_Province",
          "Adress_City",
          "Adress_County",
          "PostalAddress",
          "Remark",
          "IsAbroad",
          "BroadName",
          "IsLive",
          "BirthPlace",
          "FirstEntryTime",
          "ThisYearEntryTime",
          "EstimatedDepartureTime",
          "S_Province",
          "S_City",
          "S_County",
          "S_Address",
          "PayPlace",
          "OtherPayPlace",
          "ChinaPost",
          "UnChinaPost",
          "OfficeTime",
          "TaxpayersNumber"
        ];
        const data = this.formatJson(filterVal, this.listdata);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "纳税人信息表"
        });
      });
    },
    ExportSalary() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          // "工号",
          // "姓名",
          // "证照类型",
          // "*证照号码",
          // "债款负担方式",
          // "*收入额",
          // "免税所得",
          // "基本养老保险费",
          // "基本医疗保险费",
          // "失业保险费",
          // "住房公积金",
          // "允许扣除的税费",
          // "年金",
          // "商业健康保险费",
          // "税延养老保险费",
          // "其他扣除",
          // "减除费用",
          // "实际捐赠额",
          // "允许列支的捐赠比例",
          // "准予扣除的捐赠额",
          // "减免税额",
          // "已扣缴税额",
          // "备注"
          "工号",
          "姓名",
          "证照类型",
          "证照号码",
          "本期收入",
          "本期免税收入",
          "基本养老保险费",
          "基本医疗保险费",
          "失业保险费",
          "住房公积金",
          "累计子女教育",
          "累计继续教育",
          "累计住房贷款利息",
          "累计住房租金",
          "累计赡养老人",
          "企业(职业)年金",
          "商业健康保险费",
          "税延养老保险费",
          "其他",
          "准予扣除的捐赠额",
          "减免税额",
          "备注"
        ];
        const filterVal = [
          // "S_WorkerCode",
          // "S_WorkerName",
          // "Name",
          // "IdNumber",
          // "FKFS",
          // "SRE",
          // "MSSD",
          // "K_YangLaoBX",
          // "K_YiLiaoBX",
          // "K_SYBX",
          // "K_ZFGJJ",
          // "YXKCDSF",
          // "K_QYNJ",
          // "SYJKBXF",
          // "SYYLBXF",
          // "QTKC",
          // "JCFY",
          // "SJJZE",
          // "YXLZDJZBL",
          // "ZYKCDJZE",
          // "JMSE",
          // "YKJSE",
          // "Remark"
          "S_WorkerCode",
          "S_WorkerName",
          "Name",
          "IdNumber",
          "SRE",
          "MSSD",
          "K_YangLaoBX",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_ZFGJJ",
          "K_LJZVJY",
          "K_LJJXJY",
          "K_LJDKLX",
          "K_LJZFZJ",
          "K_LJSYLR",
          "K_QYNJ",
          "SYJKBXF",
          "SYYLBXF",
          "QTKC",
          "ZYKCDJZE",
          "JMSE",
          "Remark"
        ];
        const data = this.formatJson(filterVal, this.listdata);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "工资表"
        });
      });
    },
    ExportOnceBonus() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "工号",
          "姓名",
          // "证照类型",
          // "*证照号码",
          "一次性奖金",
          "预扣税"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          // "IdType",
          // "IdNumber",
          "OneTimeBonus",
          "DeductibleTax"
        ];
        const data = this.formatJson(filterVal, this.listdata);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "一次性奖金表"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "Sex") {
            return sexOptionsKeyValue[v[j]];
          } else if (j === "WorkerStatus") {
            return workOptionsKeyValue[v[j]];
          } else if (j.startsWith("Is")) {
            return flagOptionsKeyValue[v[j]];
          } else if (
            (j.endsWith("Date") || j.endsWith("Time")) &&
            j !== "OfficeTime"
          ) {
            if (v[j] === null) {
              return v[j];
            } else {
              if (v[j].startsWith("1900")) {
                return null;
              } else {
                return v[j].substring(0, 10);
              }
            }
          } else {
            return v[j];
          }
        })
      );
    }
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]));
    // }
  },
  mounted() {
    //this.getOrgStatus();
  },
  created() {
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
  filters: {
    statusFormater(value) {
      switch (value) {
        case -1:
          return "待导入";
          break;
        case 0:
          return "待计算";
          break;
        case 1:
          return "待上报";
          break;
        case 2:
          return "已上报";
          break;
      }
    },
    typeFilter(type) {
      return flagOptionsKeyValue[type];
    },
    sexFilter(type) {
      return sexOptionsKeyValue[type];
    },
    workOptionsKeyValueFilter(type) {
      return flagOptionsKeyValue[type];
    }
  }
};
</script>


<style lang="scss" scoped>
</style>



