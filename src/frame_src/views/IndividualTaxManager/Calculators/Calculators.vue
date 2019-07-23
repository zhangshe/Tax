<template>
  <div id="calculators" class="app-container calendar-list-container">
    <el-row type="flex">
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="0"></el-col>
      <el-col :xs="10" :sm="9" :md="8" :lg="7" :xl="7">
        <el-card>
          <div slot="header" class="header">
            <span>按月计算税额</span>
          </div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">计算方式：输入(实发)工资：a，</div>
          <div
            style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;"
          >月纳税额 b=(a-5000)x税率-速算扣除数</div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">年纳税额 c=bx12</div>
          <el-form label-width="90px">
            <el-form-item label="请输入工资">
              <el-col :span="24">
                <el-input v-model="temp.nashuie" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="月纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="MonthResult">
                  <template slot="append">元/月</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="年纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="YearResult">
                  <template slot="append">元/年</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-col :span="24" style="text-align:center;">
              <el-button type="primary" @click="cal" style="margin-bottom:5px;margin-top:58px;">计算</el-button>
            </el-col>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="1"></el-col>
      <el-col :xs="10" :sm="9" :md="8" :lg="7" :xl="7">
        <el-card>
          <div slot="header" class="header">
            <span>按年计算税额</span>
          </div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">计算方式：输入(实发)工资：a，</div>
          <div
            style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;"
          >年纳税额 b=(a-(5000x输入月份))x税率-速算扣除数</div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">月纳税额 c=b/输入月份</div>
          <el-form label-width="110px" :rules="rules" :model="temp3" ref="temp3">
            <el-form-item label="请输入工资(年)">
              <el-col :span="24">
                <el-input v-model="temp3.nashuie3" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="当前月份" prop="month">
              <el-col :span="24">
                <el-input v-model.number="temp3.month" type="number">
                  <template slot="append">月</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="年纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="YearResult3">
                  <template slot="append">元/年</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="月纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="MonthResult3">
                  <template slot="append">元/月</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-col :span="24" style="text-align:center;">
              <el-button type="primary" @click="Yearcal" style="margin-bottom:5px;">计算</el-button>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="1"></el-col>
      <el-col :xs="10" :sm="9" :md="8" :lg="7" :xl="7">
        <el-card>
          <div slot="header" class="header">
            <span>一次性奖金计算器</span>
          </div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">计算方式：输入奖金：a，</div>
          <div
            style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;"
          >月纳税额 b=(a)x年税率-速算扣除数</div>
          <div style="font-size:13px;color:red;padding-left:7px;margin-bottom:2px;">年纳税额 c=b/12</div>
          <el-form label-width="90px">
            <el-form-item label="请输入工资">
              <el-col :span="24">
                <el-input v-model="temp2.nashuie2" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="年纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="MonthResult2">
                  <template slot="append">元/年</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="月纳税额">
              <el-col :span="24">
                <el-input readonly="true" width="100%" v-model="YearResult2">
                  <template slot="append">元/月</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-col :span="24" style="text-align:center;">
              <el-button type="primary" @click="onetimecal" style="margin-bottom:5px;margin-top:58px;">计算</el-button>
            </el-col>
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
import {
  cal,
  onetimecal,
  Yearcal
} from "@/frame_src/api/IndividualTaxCalculate";
export default {
  name: "calculators",
  directives: {
    waves
  },
  data() {
    const validateMonth = (rule, value, callback) => {
      if (value % 1 === 0) {
        if (value < 1 || value > 12) {
          return callback(new Error("您所输入的月份不正确！"));
        } else {
          return callback();
        }
      } else {
        return callback(new Error("请输入整数!"));
      }
    };
    return {
      temp: {
        nashuie: 0
      },
      result: 0,
      temp2: {
        nashuie2: 0
      },
      temp3: {
        nashuie3: 0,
        month: 1
      },
      MonthResult: 0,
      YearResult: 0,
      MonthResult2: 0,
      YearResult2: 0,
      MonthResult3: 0,
      YearResult3: 0,
      rules: {
        month: [
          {
            required: true,
            type: "number",
            message: "此项不能为空！",
            trigger: "change"
          },
          {
            validator: validateMonth,
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    cal() {
      if (this.temp.nashuie == null || this.temp.nashuie == undefined) {
        this.$notify({
          position: "bottom-right",
          title: "提示",
          message: "请输入工资数！",
          type: "error",
          duration: 2000
        });
        return false;
      }
      cal(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.MonthResult = response.data.result.toFixed(4);
          this.YearResult = (response.data.result * 12).toFixed(4);
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: "计算成功！",
            type: "success",
            duration: 2000
          });
        } else {
          this.Salary = response.data.result;
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
      if (this.temp2.nashuie2 == null || this.temp2.nashuie2 == undefined) {
        this.$notify({
          position: "bottom-right",
          title: "提示",
          message: "请输入工资数！",
          type: "error",
          duration: 2000
        });
        return false;
      }
      onetimecal(this.temp2).then(response => {
        if (response.data.code === 2000) {
          this.MonthResult2 = response.data.result.toFixed(4);
          this.YearResult2 = (response.data.result / 12).toFixed(4);
          this.$notify({
            position: "bottom-right",
            title: "成功",
            message: "计算成功！",
            type: "success",
            duration: 2000
          });
        } else {
          this.Salary = response.data.result;
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
    Yearcal() {
      this.$refs["temp3"].validate(valid => {
        if (valid) {
          if (this.temp3.nashuie3 == null || this.temp3.nashuie3 == undefined) {
            this.$notify({
              position: "bottom-right",
              title: "提示",
              message: "请输入工资数！",
              type: "error",
              duration: 2000
            });
            return false;
          }
          Yearcal(this.temp3).then(response => {
            if (response.data.code === 2000) {
              this.YearResult3 = response.data.result.toFixed(4);
              this.MonthResult3 = (this.YearResult3 / this.temp3.month).toFixed(
                4
              );
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
              this.Salary = response.data.result;
              this.$notify({
                position: "bottom-right",
                title: "失败",
                message: response.data.message,
                type: "error",
                duration: 2000
              });
            }
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
.el-card{
  min-height: 400px;
}

</style>


