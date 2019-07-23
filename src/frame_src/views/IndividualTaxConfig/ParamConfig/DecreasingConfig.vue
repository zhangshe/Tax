<template>
  <div id="DecreasingConfig" class="app-container calendar-list-container">
    <!-- <div style="text-align: center; font-weight: bold;margin-bottom:15px;">
      <span>上限额度配置表</span>
    </div>-->
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="24">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.TaxOffice"
            placeholder="机关所在地"
          >
            <el-option
              v-for="item in taxofficeoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
          <el-select size="mini" filterable clearable v-model="listQuery.DCode" placeholder="请选择科目">
            <el-option
              v-for="item in dcodeoptions"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>

          <el-button
            size="mini"
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>

          <el-button
            size="mini"
            class="filter-item"
            style="margin-left: 10px;"
            @click="handleCreate"
            type="primary"
            icon="el-icon-edit"
          >新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table
            :key="tableKey"
            :data="list"
            size="mini"
            :header-cell-class-name="tableRowClassName"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            border
            fit
            highlight-current-row
            style="width: 100%;text-align:left;"
          >
            <el-table-column align="center" label="税务机关所在地" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.TaxOfficeName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="科目编码" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.DCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="科目名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.DName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="上限额度" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.DLimit|NumFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="配置比例" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.Proportion|ProFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="配置模式" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.Pattern|PatternFormat}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" width="200" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="editVisible" :title="textMap[dialogStatus]" width="500px">
      <el-card>
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="temp"
          label-width="120px"
          style="width: 99%;"
        >
          <el-col :span="24">
            <el-form-item label="机关所在地" prop="TaxOffice">
              <el-select
                size="mini"
                filterable
                clearable
                v-model="temp.TaxOffice"
                placeholder="机关所在地"
                style="width:100%;"
              >
                <el-option
                  v-for="item in taxofficeoptions"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="科目名称" prop="DCode">
              <el-select
                size="mini"
                filterable
                clearable
                v-model="temp.DCode"
                placeholder="科目名称"
                style="width:100%;"
                @change="getnode"
              >
                <el-option
                  v-for="item in dcodeoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="上限额度" prop="DLimit">
              <el-input size="mini" placeholder="上限额度" v-model="temp.DLimit"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="配置比例" prop="Proportion">
              <el-input size="mini" placeholder="配置比例" v-model.number="temp.Proportion">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="配置模式" prop="Pattern">
              <el-radio-group v-model="temp.Pattern" size="mini">
                <el-radio :label="0">上限</el-radio>
                <el-radio :label="1">比例</el-radio>
                <el-radio :label="2">混合模式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
        <div style="text-align:center">
          <el-button size="mini" @click="editVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">保存</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>



<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getDecreasingConfig,
  createDecreasingConfig,
  delDecreasingConfig,
  editDecreasingConfig,
  getAllDictionary
} from "@/frame_src/api/ParamsConfig";

// import { fetchOrgListByCode } from "@/frame_src/api/org";
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import { getToken } from "@/frame_src/utils/auth";
export default {
  name: "DecreasingConfig",
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  data() {
    const ProValidator = (rule, value, callback) => {
        if (value >= 0 && value <= 100) {
          return callback();
        } else {
          return callback(new Error("您所输入的比例有误,请确认！"));
        }
    };
    return {
      // normalizer(node) {
      //   return {
      //     id: node.ORG_CODE,
      //     label: node.ORG_SHORT_NAME,
      //     children: node.children
      //   };
      // },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      // defaultProps: {
      //   children: "children",
      //   label: "ORG_SHORT_NAME",
      //   id: "id"
      // },
      // importmodeloptions: [
      //   {
      //     value: "样表一",
      //     label: "样表一"
      //   },
      //   {
      //     value: "样表二",
      //     label: "样表二"
      //   }
      // ],
      taxofficeoptions: [], //机关所在地
      dcodeoptions: [], //科目
      listQuery: {
        limit: 10,
        page: 1,
        TaxOffice: "",
        DCode: ""
      },
      temp: {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgCode: "",
        S_OrgName: "",
        DName: "",
        DCode: "",
        DLimit: "",
        TaxOffice: "",
        Proportion: "",
        Pattern: ""
      },
      textMap: {
        update: "修改上限配置",
        create: "添加上限配置"
      },
      editVisible: false,

      rules: {
        TaxOffice: [
          { required: true, message: "机关所在地不能为空", trigger: "change" }
        ],
        DCode: [
          { required: true, message: "科目名称不能为空", trigger: "change" }
        ],
        DLimit: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value != "") {
                if (/^(-?\d+)(\.\d+)?$/.test(value) == false) {
                  callback(new Error("请填写数字"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("上限额度不能为空"));
              }
            },
            message: "",
            trigger: "change"
          }
        ],
        Proportion: [
          {
            validator: ProValidator,
            message: "请输入0-100之间的数值",
            trigger: "change"
          },
          {
            required:true,
            trigger:"change",
            message:'此项不能为空'
          }
        ],
        Pattern: [
          {
            required: true,
            trigger: "change",
            message: "此项不能为空！"
          }
        ]
      },
      dialogStatus: ""

      //treeData: []
    };
  },
  filters: {
    NumFormat,
    ProFormat(val) {
      return val * 100 + "%";
    },
    PatternFormat(val) {
      switch (val) {
        case 0:
          return "上限模式";
        case 1:
          return "比例模式";
        case 2:
          return "混合模式";
      }
    }
  },
  methods: {
    // loadOptions({ action, parentNode, callback }) {
    //   if (action === LOAD_CHILDREN_OPTIONS) {
    //     if (parentNode.children == null) {
    //       parentNode.children = undefined;
    //       callback();
    //     }
    //   }
    // },
    getnode(node) {
      let obj = {};
      obj = this.dcodeoptions.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.code === node; //筛选出匹配数据
      });
      this.temp.DName = obj.name;
    },
    getAllDictionary() {
      getAllDictionary().then(response => {
        if (response.data.code === 2000) {
          this.taxofficeoptions = response.data.taxOffice;
          this.dcodeoptions = response.data.dCode;
        }
      });
    },
    number() {
      this.famount = this.famount.replace(/[^\.\d]/g, "");
      this.famount = this.famount.replace(".", "");
    },
    resetTemp() {
      this.temp = {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgCode: "",
        S_OrgName: "",
        DName: "",
        DCode: "",
        DLimit: "",
        TaxOffice: "",
        Proportion: "",
        Pattern: ""
      };
    },
    getList() {
      this.listLoading = true;
      getDecreasingConfig(this.listQuery).then(response => {
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

    // loadOrgByCode() {
    //   const query = { sysCode: this.$store.state.user.orgCode };
    //   fetchOrgListByCode(query).then(response => {
    //     this.treeData = JSON.parse(response.data);
    //   });
    // },

    handleCreate() {
      this.resetTemp();
      this.editVisible = true;
      this.dialogStatus = "create";
      if (this.$refs["dataForm"] !== undefined) {
        this.$refs["dataForm"].resetFields();
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.editVisible = true;
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const query = { S_ID: row.S_Id };
          delDecreasingConfig(query).then(response => {
            this.message = response.data.message;
            this.title = "失败";
            this.type = "error";
            if (response.data.code === 2000) {
              // const index = this.list.indexOf(row)
              // this.list.splice(index, 1)
              this.getList();
              this.title = "成功";
              this.type = "success";
            }
            this.$notify({
              position: "bottom-right",
              title: this.title,
              message: this.message,
              type: this.type,
              duration: 2000
            });
          });
        })
        .catch(() => {});
    },
    createData() {
      // 创建
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createDecreasingConfig(this.temp).then(response => {
            var message = response.data.message;
            var title = "失败";
            var type = "error";
            if (response.data.code === 2000) {
              this.getList();
              title = "成功";
              type = "success";
              // this.list.unshift(this.temp)
            }
            this.editVisible = false;
            this.$notify({
              position: "bottom-right",
              title: title,
              message: message,
              type: type,
              duration: 3000
            });
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp); // 这样就不会共用同一个对象
          tempData.S_UpdateBy = this.$store.state.user.userId;
          //tempData.NOTICE_CONTENT=this.content
          editDecreasingConfig(tempData).then(response => {
            var message = response.data.message;
            var title = "失败";
            var type = "error";
            if (response.data.code === 2000) {
              this.getList();
              title = "成功";
              type = "success";
            }
            this.editVisible = false;
            this.$notify({
              position: "bottom-right",
              title: title,
              message: message,
              type: type,
              duration: 3000
            });
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
    handleFilter() {
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
    this.listLoading = false;
    // this.loadOrgByCode();
    this.getAllDictionary();
    this.getList();
  },
  activated() {
    this.listLoading = false;
    // this.loadOrgByCode();
    this.getAllDictionary();
    this.getList();
  },
  computed: {
    getRoleLevel() {
      if (this.$store.state.user.roleLevel === "admin") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.topSearh {
  margin-bottom: 15px;
}
.page {
  text-align: center;
}
.buttom {
  float: right;
}
</style>

