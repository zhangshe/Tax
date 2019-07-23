<template>
  <div id="MonthKnots" class="app-container calendar-list-container">
    <el-row type="flex">
      <el-col :xs="4" :sm="5" :md="6" :lg="7" :xl="8"></el-col>
      <el-col :xs="16" :sm="14" :md="12" :lg="10" :xl="7">
        <el-card>
          <div slot="header" class="header">
            <span>月度结转</span>
          </div>
          <el-form label-width="80px">
            <el-form-item label="工作日期">
              <el-col :span="23">
                <el-date-picker
                  v-model="temp.SysOperateDate"
                  type="month"
                  placeholder="选择日期"
                  :disabled="true"
                  style="width:100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="工作状态">
              <el-col :span="23">
                <el-select v-model="state" placeholder="上报状态" :disabled="true" style="width:100%;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <div class="button" style="text-align:center">
              <el-button type="primary" @click="personTax">上报情况</el-button>
              <el-button type="primary" @click="showed1=true">金税情况</el-button>
              <el-button type="primary" @click="MonthKonts" :disabled="state!=2">月度结转</el-button>
            </div>
          </el-form>
        </el-card>
        <el-dialog :visible.sync="showed">
          <el-select size="mini" v-model="searchState">
            <el-option
              v-for="(item,key) in options"
              :key="key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="showData">查询</el-button>
          <span>{{total}}条记录</span>
          <el-table
            :key="tableKey"
            size="mini"
            :data="list"
            :header-cell-class-name="tableRowClassName"
            element-loading-text="给我一点时间"
            border
            fit
            highlight-current-row
            height="320"
            style="width: 100%;"
          >
            <el-table-column align="center" label="部门">
              <template slot-scope="scope">
                <span>{{scope.row.ORG_NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="数据状态">
              <template slot-scope="scope">
                <span>{{scope.row.ReportStatus | stateFilter}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog :visible.sync="showed1" title="金税明细未导入详情">
          <el-card>
            <el-table
              :header-cell-class-name="tableRowClassName"
              element-loading-text="给我一点时间"
              border
              fit
              highlight-current-row
              height="320"
              style="width: 100%;"
              :data="detaillist"
              size="mini"
              v-loading="loading"
            >
              <el-table-column label="未导入人员部门" prop="ORG_NAME"></el-table-column>
              <el-table-column label="未导入人员编号" prop="S_WorkerCode"></el-table-column>
              <el-table-column label="未导入人员姓名" prop="S_WorkerName"></el-table-column>
            </el-table>
          </el-card>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  MonthKonts,
  getCalculateData,
  judgeStatus,
  getJudgeCount
} from "@/frame_src/api/BusinessKonts";
const states = [
  {
    value: 0,
    label: "待计算"
  },
  {
    value: 1,
    label: "待上报"
  },
  {
    value: 2,
    label: "已上报"
  },
  {
    value: -1,
    label: "待导入"
  }
];
const statesKeyValue = states.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {});
export default {
  data() {
    return {
      temp: {
        SysOperateDate: "",
        UpdateBy: "",
        OrgCode: ""
      },
      state: "", //结转状态
      state1: "", //金税明细导入状态
      options: [
        {
          value: -1,
          label: "待导入"
        },
        // { value: 0, label: "待计算" },
        {
          value: 1,
          label: "待上报"
        },
        {
          value: 2,
          label: "已上报"
        }
      ],
      searchState: "",
      showed: false, //上报dialog标志位
      showed1: false, //金税导入明细dialog标志位
      total: 0,
      tableKey: 0,
      list: [], //全部数据列表
      list1: [], //操作数据列表
      detaillist: [], //未导入部门列表
      loading: true
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
    personTax() {
      //   this.$router.push({
      //     path: "/IndividualTaxManager/BusinessCompletion/IndividualTaxCompletion"
      //   });
      this.showed = true;
    },
    getSysTime() {
      this.temp.SysOperateDate = this.$store.state.user.sysTime;
      this.temp.UpdateBy = this.$store.state.user.userId;
      this.temp.OrgCode = this.$store.state.user.orgCode;
      this.getCalculateData();
      this.judgeStatus();
    },
    MonthKonts() {
      let val = this.temp.SysOperateDate.substring(5, 7);
      let str = "";
      let cb = "";
      let title = "";
      let num = "";
      getJudgeCount(this.temp).then(response => {
        if (response.data.code === 2000) {
          num = response.data.items[0].num;
          if (num == 0) {
            str = "您确认执行月度结转操作?操作结果将不可逆转,是否继续?";
            cb = "继续操作";
            title = "提示";
          } else {
            str =
              "系统内还有未导入金税明细的员工！请确认是否进行强制结转操作？(强制结转可能会导致部分未导入金税明细的员工数据查询不准确)";
            cb = "强制结转";
            title = "警告！";
          }
          this.$confirm(str, title, {
            confirmButtonText: cb,
            cancelButtonText: "我再想想",
            type: "warning"
          })
            .then(() => {
              if (val != "12") {
                MonthKonts(this.temp).then(response => {
                  if (response.data.code === 2000) {
                    this.$message({
                      message: "变更系统日期成功,系统将在5秒后强制刷新!",
                      type: "success"
                    });
                    setTimeout(location.reload(), 5000);
                  } else {
                    this.$message({
                      message: response.data.message,
                      type: "warning"
                    });
                  }
                });
              } else {
                this.$message({
                  message: "12月份本功能禁用！",
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "操作已取消"
              });
            });
        } else {
          this.$message({
            message: "网络错误！",
            type: "error"
          });
        }
      });
    },
    getCalculateData() {
      getCalculateData(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          this.list1 = response.data.items;
          this.total = response.data.total;
          this.state = response.data.TaxStatus;
        }
      });
    },
    judgeStatus() {
      judgeStatus(this.temp).then(respone => {
        if (respone.data.code == 2000) {
          this.detaillist = respone.data.items;
          this.state1 = respone.data.status;
          this.loading = false;
        }
      });
    },
    showData() {
      if (this.list1.length != 0) {
        var newlist = [];
        var s = this.searchState;
        var t = 0;
        this.list1.forEach(function(c) {
          if (c.ReportStatus == s) {
            newlist.push(c);
            t = t + 1;
          }
        });
        this.list = newlist;
        this.total = t;
      }
    }
  },
  mounted() {
    this.getSysTime();
  },
  activated() {
    this.getSysTime();
  },
  components: {},
  filters: {
    stateFilter: function(val) {
      return statesKeyValue[val];
    },
    formatState(data) {
      switch (data) {
        case 0:
          return "待导入";
          break;
        case 1:
          return "待计算";
          break;
        case 2:
          return "待上报";
          break;
        case 3:
          return "已上报";
          break;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.header {
  font-weight: bold;
  font-size: 20px;
  max-height: 30px;
  text-align: center;
  img {
    width: 25px;
    height: 25px;
  }
}
</style>

