<template>
  <div id="IndividualTaxReport" class="app-container calendar-list-container">
    <el-row type="flex">
      <el-col :xs="5" :sm="6" :md="7" :lg="8" :xl="9"></el-col>
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-card>
          <div slot="header" class="header">
            <span>个税上报</span>
          </div>
          <el-form label-width="80px">
            <el-form-item label="当前月份">
              <el-col :span="23">
                <el-date-picker
                  type="month"
                  placeholder="选择日期"
                  style="width:100%;"
                  v-model="CONSTtemp.S_WorkDate"
                  :disabled="true"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="当前单位">
              <el-col :span="23">
                <el-input v-model="CONSTtemp.S_OrgName" :disabled="true"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="状态">
              <el-col :span="23">
                <el-select
                  v-model="temp.ReportStatus"
                  placeholder="选择计算状态"
                  style="width:100%;"
                  disabled
                >
                  <el-option
                    v-for="item in stateoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="工资人数">
              <el-col :span="23">
                <el-input :disabled="true" width="50%" v-model="temp.number"></el-input>
              </el-col>
            </el-form-item>
            <div class="button" style="text-align:center">
              <el-form-item>
                <el-button type="primary" @click="report" :disabled="temp.ReportStatus!=1||this.$store.state.user.orgCode=='100'">上报</el-button>
              </el-form-item>
            </div>
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
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { fetchOrgList } from "@/frame_src/api/org";
import {
  Report,
  getStatus,
  getCalculateData
} from "@/frame_src/api/BusinessCompelete";
export default {
  name: "IndividualTaxReport",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [
        {
          CONF_CODE: "12345678"
        }
      ],
      treeData: [],
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        CONF_NAME: ""
      },
      CONSTtemp: {
        S_WorkDate: "",
        S_OrgName: "",
        S_OrgCode: "",
        S_UpdateBy: ""
      },
      temp: {
        ReportStatus: "未上报",
        number: ""
      },
      stateoptions: [
        {
          value: -1,
          label: "待导入"
        },
        // {
        //   value: 0,
        //   label: "待计算"
        // },
        {
          value: 1,
          label: "待上报"
        },
        {
          value: 2,
          label: "已上报"
        }
      ],
      fileList: [],
      value4: ""
    };
  },
  methods: {
    getList() {
      this.listLoading = false;
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.listUpdate.CONF_NAME = "";
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
    exportExcel() {},
    // loadOptions({ action, parentNode, callback }) {
    //     if (action === LOAD_CHILDREN_OPTIONS) {
    //         if (parentNode.children === []||parentNode.children===null) {
    //             parentNode.children = undefined;
    //             callback();
    //         }
    //     }
    // }
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getUserCode() {
      this.CONSTtemp.S_OrgCode = this.$store.state.user.orgCode;
      this.CONSTtemp.S_WorkDate = this.$store.state.user.sysTime;
      this.CONSTtemp.S_OrgName = this.$store.state.user.departName;
      this.CONSTtemp.S_UpdateBy = this.$store.state.user.userId;
    },
    report() {
      this.$confirm("您确定要执行上报功能呢？", "提示", {
        confirmButtonText: "继续操作",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          Report(this.CONSTtemp).then(response => {
            if (response.data.code === 2000) {
              // this.$message({
              //   message: "操作成功！",
              //   type: "success"
              // });
              this.getStatus();
              this.$notify({
                position: "bottom-right",
                //title: "操作提示",
                message: "操作成功！",
                type: "success",
                duration: 2000
              });
            } else {
              // this.$message({
              //   message: response.data.message,
              //   type: "info"
              // });
              this.$notify({
                position: "bottom-right",
                title: "失败",
                message: response.data.message,
                type: "error",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   message: "操作取消",
          //   type: "info"
          // });
        });
    },
    getStatus() {
      getStatus(this.CONSTtemp).then(response => {
        if (response.data.code === 2000) {
          //this.CONSTtemp.S_Id = response.data.items[0].S_Id;
          this.temp.ReportStatus = response.data.items[0].ReportStatus;
        }
      });
    },
    getCalculateData() {
      getCalculateData(this.CONSTtemp).then(response => {
        if (response.data.code === 2000) {
          this.temp.number = response.data.TaxPayerCount;
          this.temp.ReportStatus=response.data.TaxStatus
        }
      });
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
  },
  components: {
    Treeselect
  },
  mounted() {
    this.getUserCode();
    //this.getStatus();
    this.getCalculateData();
  },
          activated() {
  this.getUserCode();
    //this.getStatus();
    this.getCalculateData();
  },
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

