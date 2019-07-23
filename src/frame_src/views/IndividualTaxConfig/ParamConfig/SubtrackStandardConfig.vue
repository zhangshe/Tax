<template>
  <div id="SubtrackStandardConfig" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="HandleCreate">新增</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="HandleQZD">设置起征点</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="list"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="95px" prop="TaxLevel" fixed="left" align="center" label="级数"></el-table-column>
        <el-table-column width="260px" align="center" label="全月应纳税所得额">
          <el-table-column width="130px" prop="TaxStart" align="center" label=">"></el-table-column>
          <el-table-column width="130px" prop="TaxEnd" align="center" label="<="></el-table-column>
        </el-table-column>
        <el-table-column width="130px" prop="TaxRate" align="center" label="税率(%)"></el-table-column>
        <el-table-column width="130px" prop="TaxDeduction" align="center" label="速算扣除数"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)" type="primary" >修改</el-button>
            <el-button size="mini" @click="del(scope.row)" type="danger" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div>
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
      </div>-->
    </el-card>
    <el-dialog :title="title" :visible.sync="showUpload" width="420px">
      <el-card>
        <el-form
          ref="temp"
          :model="temp"
          label-position="right"
          label-width="140px"
          style="width: 300px; "
          :rules="rules"
        >
          <el-form-item label="级数" prop="TaxLevel">
            <el-input v-model="temp.TaxLevel"></el-input>
          </el-form-item>
          <el-form-item label="应纳税所得额(>)" prop="TaxStart">
            <el-input v-model="temp.TaxStart"></el-input>
          </el-form-item>
          <el-form-item label="应纳税所得额(<=)" prop="TaxEnd">
            <el-input v-model="temp.TaxEnd"></el-input>
          </el-form-item>
          <el-form-item label="税率(%)" prop="TaxRate">
            <el-input v-model="temp.TaxRate"></el-input>
          </el-form-item>
          <el-form-item label="速算扣除数" prop="TaxDeduction">
            <el-input v-model="temp.TaxDeduction"></el-input>
          </el-form-item>

          <el-button type="primary" style="float:right;margin-bottom:5px;" @click="submit">提交</el-button>
        </el-form>
      </el-card>
    </el-dialog>
    <el-dialog title="设置起征点" :visible.sync="showUploadQZD" width="420px">
      <el-card>
        <el-form
          ref="tempQZD"
          :model="tempQZD"
          label-position="right"
          label-width="100px"
          style="width: 300px; "
          :rules="rulesQZD"
        >
          <el-form-item label="当前起征点" prop="QZD">
            <el-input v-model="tempQZD.QZD"></el-input>
          </el-form-item>
          <el-button type="primary" style="float:right;margin-bottom:5px;" @click="btnSave">保存</el-button>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
import {
  getSubtrackStandardConfig,
  editConfig,
  createConfig,
  delConfig,
  updateTaxDateSub,
  getTaxDateSub
} from "@/frame_src/api/ParamsConfig";
export default {
  name: "SubtrackStandardConfig",
  directives: {
    waves
  },
  data() {
    return {
      showUpload: false,
      tableKey: 0,
      showUploadQZD: false,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        CONF_NAME: ""
      },
      temp: {
        S_Id: "",
        username: this.$store.state.user.userId,
        TaxLevel: "",
        TaxStart: "",
        TaxEnd: "",
        TaxRate: "",
        TaxDeduction: ""
      },
      tempQZD: {
        QZD: "",
        userId: this.$store.state.user.userId
      },
      title: "",
      rules: {
        TaxLevel: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (/^\+?[1-9][0-9]*$/.test(value) == false) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ],
        TaxStart: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ],
        TaxEnd: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ],
        TaxRate: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ],
        TaxDeduction: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ]
      },
      rulesQZD: {
        QZD: [
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            required: "true",
            message: "请填写大于0的数字"
          }
        ]
      }
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
    restTemp() {
      this.temp = {
        S_Id: "",
        username: this.$store.state.user.userId,
        TaxLevel: "",
        TaxStart: "",
        TaxEnd: "",
        TaxRate: "",
        TaxDeduction: ""
      };
    },
    HandleCreate() {
      this.showUpload = true;
      this.title = "创建";
      this.restTemp();
      if (this.$refs["temp"] != undefined) {
        this.$refs["temp"].resetFields();
      }
    },
    edit(row) {
      this.showUpload = true;
      this.temp = Object.assign({}, row);
      this.title = "修改";
      this.temp.username = this.$store.state.user.userId;
      this.$nextTick(() => {
        this.$refs["temp"].resetFields();
      });
    },
    submit() {
      if (this.title === "创建") {
        this.createConfig();
      } else {
        this.editConfig();
      }
    },
    del(row) {
      this.$confirm("您确定要删除此项吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delConfig(row).then(response => {
          if (response.data.code === 2000) {
            this.$notify({
              position: "bottom-right",
              title: "成功",
              message: response.data.message,
              type: "success",
              duration: 2000
            });
            this.getSubtrackStandardConfig();
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
      });
    },
    getSubtrackStandardConfig() {
      getSubtrackStandardConfig().then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
        }
      });
    },
    editConfig() {
      this.$refs.temp.validate(valid => {
        if (valid) {
          editConfig(this.temp).then(response => {
            if (response.data.code === 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.showUpload = false;
              this.getSubtrackStandardConfig();
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
        }
      });
    },
    createConfig() {
      this.$refs.temp.validate(valid => {
        if (valid) {
          createConfig(this.temp).then(response => {
            if (response.data.code === 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.showUpload = false;
              this.getSubtrackStandardConfig();
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
        }
      });
    },
    btnSave() {
      //保存起征点设置
      this.$refs.tempQZD.validate(valid => {
        if (valid) {
          updateTaxDateSub(this.tempQZD).then(response => {
            if (response.data.code === 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
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
            this.showUploadQZD = false;
          });
        }
      });
    },
    HandleQZD() {
      getTaxDateSub().then(response => {
        //查询起征点
        if (response.data.code === 2000) {
          this.tempQZD.QZD = response.data.QZD;
          this.showUploadQZD = true;
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
    }
  },
  mounted() {
    this.getSubtrackStandardConfig();
  },
  created() {
    this.getList();
  },
  activated() {
    this.getSubtrackStandardConfig();
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


<style lang="scss" scoped>
</style>