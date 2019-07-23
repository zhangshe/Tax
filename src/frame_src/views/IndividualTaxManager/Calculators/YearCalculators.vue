<template>
  <div id="YearCalculators" class="app-container calendar-list-container">
    <el-row type="flex" justify="center">
      <el-col :xs="10" :sm="9" :md="8" :lg="7" :xl="6">
        <el-card>
          <div slot="header" class="header">
            <span>按年计算税额</span>
          </div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">计算方式：输入(实发)工资：a，</div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">年纳税额 b=(a-60000)x税率-速算扣除数</div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">月纳税额 c=b/12</div>
          <el-form label-width="110px">
            <el-form-item label="请输入工资(年)">
              <el-col :span="16">
                <el-input v-model="temp.nashuie" type="number"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" @click="Yearcal" style="margin-left:5px;width:100%">计算</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="年纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="YearResult"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="月纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="MonthResult"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import{ Yearcal} from "@/frame_src/api/IndividualTaxCalculate";
export default {
  name: "YearCalculators",
  directives: {
    waves
  },
  data() {
    return {
      temp: {
        nashuie: 0
      },
      result: 0,
      temp2: {
        nashuie2: 0
      },
      MonthResult: 0,
      YearResult: 0,
      MonthResult2: 0,
      YearResult2: 0,
    };
  },
  methods: {
    Yearcal() {
        if(this.temp.nashuie==null||this.temp.nashuie==undefined){
                this.$notify({
                        position: "bottom-right",
                        title: "提示",
                        message: '请输入工资数！',
                        type: "error",
                        duration: 2000
                    });
                return false;
            }
        Yearcal(this.temp).then(response => {
                if (response.data.code === 2000) {
                    this.YearResult=(response.data.result).toFixed(4);
                    this.MonthResult=(this.YearResult/12).toFixed(4);
                    //  this.MonthResult=response.data.result.toFixed(4);
                    //  this.YearResult=(response.data.result*12).toFixed(4);
                      this.$notify({
                        position: "bottom-right",
                        title: "成功",
                        message: "计算成功！",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.Salary=response.data.result;
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
    onetimecal() {
         if(this.temp2.nashuie2==null||this.temp2.nashuie2==undefined){
                this.$notify({
                        position: "bottom-right",
                        title: "提示",
                        message: '请输入工资数！',
                        type: "error",
                        duration: 2000
                    });
                return false;
            }
        onetimecal(this.temp2).then(response => {
                if (response.data.code === 2000) {
                     this.MonthResult2=response.data.result.toFixed(4);
                     this.YearResult2=(response.data.result*12).toFixed(4);
                      this.$notify({
                        position: "bottom-right",
                        title: "成功",
                        message: "计算成功！",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.Salary=response.data.result;
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    }
  },
  created() {},
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


<style lang="scss" scoped>
</style>


