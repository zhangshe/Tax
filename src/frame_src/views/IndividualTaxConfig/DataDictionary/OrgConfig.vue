<template>
  <div id="OrgConfig2" class="app-container calendar-list-container">
    <!-- <div style="text-align: center; font-weight: bold;margin-bottom:15px;">
      <span>组织单位配置表</span>
    </div> -->
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="3">
          <treeselect
            v-model="listQuery.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :loadOptions="loadOptions"
            placeholder="请选择单位"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px;width:95%;"
          />
        </el-col>
        <el-col :span="3">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.TaxNumber"
            placeholder="请选择税号"
            style="width:95%;"
          >
            <el-option
              v-for="item in taxcodeoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ><span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span></el-option>
          </el-select>
          </el-col>
          <el-col :span="3">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.ImportModel"
            placeholder="请选择导入模板"
            style="width:95%;"
          >
            <el-option
              v-for="item in importmodeloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </el-col>

          <el-col :span="3">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.TaxOffice"
            placeholder="请选择机关所在地"
            style="width:95%;"
          >
            <el-option
              v-for="item in taxofficeoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
          </el-col>

          <el-col :span="3">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.ResponsibilityCenter"
            placeholder="请选择责任中心"
            style="width:95%;"
          >
            <el-option
              v-for="item in responsibilityoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
          </el-col>
          <el-col :span="3">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="listQuery.OrgRegion"
            placeholder="请选择税务机关"
            style="width:95%;"
          >
            <el-option
              v-for="item in orgregionoptions"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="5">
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
            <el-table-column align="center" label="组织单位" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.S_OrgName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="税务机关" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.OrgRegionName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="责任中心" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.ResponsibilityCenterName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="导入模板" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.ImportModel}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="税号" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.TaxNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="机关所在地" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.TaxOfficeName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否导入" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.IsComputeTax|formatStatus}}</span>
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
    <el-dialog :visible.sync="editVisible" class="selecttrees" :title="textMap[dialogStatus]" width="500px">
      <el-card>
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="temp"
          label-width="120px"
          style="width: 99%;"
        >
          <el-col :span="24">
            <el-form-item label="组织单位" prop="S_OrgCode">
              <treeselect
                v-model="temp.S_OrgCode"
                :multiple="false"
                :options="treeData"
                :normalizer="normalizer"
                :disable-branch-nodes="false"
                placeholder="组织单位"
                noResultsText="未搜索到结果"
                :loadOptions="loadOptions"
                @select="getnode"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="税务机关" prop="OrgRegion">
              <el-select
                filterable
                v-model="temp.OrgRegion"
                size="mini"
                placeholder="税务机关"
                style="width:100%;"
              >
                <el-option
                  v-for="item in orgregionoptions"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="责任中心" prop="ResponsibilityCenter">
              <el-select
                filterable
                v-model="temp.ResponsibilityCenter"
                placeholder="责任中心"
                style="width:100%;"
                 size="mini"
              >
                <el-option
                  v-for="item in responsibilityoptions"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="导入模板" prop="ImportModel">
              <el-select
                filterable
                v-model="temp.ImportModel"
                placeholder="导入模板"
                style="width:100%;"
                 size="mini"
              >
                <el-option
                  v-for="item in importmodeloptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="机关所在地" prop="TaxOffice">
              <el-select
                filterable
                v-model="temp.TaxOffice"
                placeholder="机关所在地"
                style="width:100%;"
                 size="mini"
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
            <el-form-item label="税号" prop="TaxCode">
              <el-select filterable v-model="temp.TaxCode"  size="mini" placeholder="税号" style="width:100%;">
                <el-option
                  v-for="item in taxcodeoptions"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                >
                <span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- <el-form-item label="税号" prop="TaxCode">
              <el-select filterable v-model="temp.TaxCode"  size="mini" placeholder="税号" style="width:100%;">
                <el-option
                  v-for="item in taxcodeoptions"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                >
                <span style="float: left">{{ item.EnglishCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span></el-option>
              </el-select>
            </el-form-item> -->
                <el-form-item label="是否导入" prop="IsComputeTax" >
                      <el-radio v-model="temp.IsComputeTax" :label="0">否</el-radio>
                      <el-radio v-model="temp.IsComputeTax" :label="1">是</el-radio>
                    </el-form-item>
          </el-col>
                          
        </el-form>
        <div style="text-align:center">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button v-else type="primary" @click="updateData">保存</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>



<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getTaxOrgList,
  createTaxOrg,
  updateTaxOrg,
  deleteTaxOrg,
  getAllDictionary
} from "@/frame_src/api/taxOrg";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import { getToken } from "@/frame_src/utils/auth";
export default {
  name: "orgConfig",
  directives: {
    waves
  },
  components: {
    Treeselect
  },
  data() {
    return {
      normalizer(node) {
        return {
          id: node.ORG_CODE,
          label: node.ORG_SHORT_NAME,
          children: node.children
        };
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      defaultProps: {
        children: "children",
        label: "ORG_SHORT_NAME",
        id: "id"
      },
      importmodeloptions: [
        {
          value: "样表一",
          label: "样表一"
        },
        {
          value: "样表二",
          label: "样表二"
        }
      ],
      taxofficeoptions: [], //税务机关
      orgregionoptions: [], //机关所在地
      taxcodeoptions: [], //税号
      responsibilityoptions: [], //责任中心
      listQuery: {
        limit: 10,
        page: 1,
        S_OrgCode: null,
        ResponsibilityCenter: "",
        TaxOffice: "",
        ImportModel: "",
        TaxNumber: "",
        OrgRegion: ""
      },
      temp: {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgCode: null,
        S_OrgName: "",
        ImportModel: "",
        TaxOffice: "",
        ResponsibilityCenter: "",
        IsComputeTax: "",
        OrgRegion: "",
        TaxCode: ""
      },
      textMap: {
        update: "修改组织配置",
        create: "添加组织配置"
      },
      editVisible: false,
      rules: {
        S_OrgCode: [
          { required: true, message: "组织单位不能为空", trigger: "change" }
        ],
        ImportModel: [
          { required: true, message: "导入模板不能为空", trigger: "change" }
        ],
        TaxOffice: [
          { required: true, message: "税务机关不能为空", trigger: "change" }
        ],
        ResponsibilityCenter: [
          { required: true, message: "责任中心不能为空", trigger: "change" }
        ],
        TaxCode: [
          { required: true, message: "税号不能为空", trigger: "change" }
        ],
        OrgRegion: [
          { required: true, message: "机关所在地不能为空", trigger: "change" }
        ]
        // PROJECT_AMOUNT: [
        //   {
        //     validator: (rule, value, callback) => {
        //       if (value != "") {
        //         if (
        //           /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
        //         ) {
        //           callback(new Error("请填写大于0的数字"));
        //         } else {
        //           callback();
        //         }
        //       } else {
        //         callback();
        //       }
        //     },
        //     trigger: "change"
        //   }
        // ]
      },
      dialogStatus: "",

      treeData: []
    };
  },
  methods: {
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getnode(node, instanceId) {
      this.temp.S_OrgName = node.ORG_SHORT_NAME;
    },
    getAllDictionary() {
      getAllDictionary().then(response => {
        if (response.data.code === 2000) {
          this.taxofficeoptions = response.data.taxOffice;
          this.orgregionoptions = response.data.orgRegion;
          this.taxcodeoptions = response.data.taxCode;
          this.responsibilityoptions = response.data.responsibilityCenter;
        }
      });
    },
    resetTemp() {
      this.temp = {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgCode: null,
        S_OrgName: "",
        ImportModel: "",
        TaxOffice: "",
        ResponsibilityCenter: "",
        IsComputeTax: 1,
        OrgRegion: "",
        TaxCode: ""
      };
    },

    getList() {
      this.listLoading = true;
      getTaxOrgList(this.listQuery).then(response => {
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

    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },

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
          deleteTaxOrg(query).then(response => {
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
          createTaxOrg(this.temp).then(response => {
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
          updateTaxOrg(tempData).then(response => {
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
    this.loadOrgByCode();
    this.getAllDictionary();
    this.getList();
  },
    activated() {
this.listLoading = false;
    this.loadOrgByCode();
    this.getAllDictionary();
    this.getList();
  },
  filters: {
    formatStatus(val) {
      if (val === 0) {
        return "否";
      } else if(val === 1) {
        return "是";
      }
      else{
        return "";
      }
    }
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


<style lang="scss" >
#OrgConfig2 {
  .topSearh {
    margin-bottom: 15px;
  }
  .page {
    text-align: center;
  }
  .buttom {
    float: right;
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
.selecttrees{
.vue-treeselect--searchable .vue-treeselect__input-container {
    height: 28px !important;
    width: 100%;
  }
  .el-dialog__body{
    padding:0px 10px 10px !important;
  }
}
</style>

