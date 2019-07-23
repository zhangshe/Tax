<template>
  <div id="OrgConfig" class="app-container calendar-list-container">
    <el-row type="flex" :gutter="15">
      <el-col :span="5">
        <el-card>
          <el-tree
            :data="leftTreeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            ref="tree"
            highlight-current
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card>
          <div class="topSearh">
            <el-row>
              <!-- <el-col :span="5">
                <treeselect
                  v-model="searchTemp.department"
                  :multiple="false"
                  :options="treeData"
                  :load-options="loadOptions"
                  :loadOptions="loadOptions"
                  placeholder="请选择部门"
                  :normalizer="normalizer"
                  :disable-branch-nodes="false"
                  noResultsText="未搜索到结果"
                  noChildrenText
                  style="font-size:15px;"
                />
              </el-col>-->
              <!-- <el-col :span="5">
                <el-input
                  v-model="searchTemp.param"
                  placeholder="请输入关键字"
                  size="mini"
                  style="width:95%"
                ></el-input>
              </el-col>-->
              <el-col :span="24">
                <!-- <el-date-picker
                  v-model="searchTemp.date"
                  type="year"
                  placeholder="选择年份"
                  style="width:150px"
                ></el-date-picker>
                <el-select v-model="searchTemp.type" placeholder="请选择地区" style="width:150px">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>-->
                <!-- <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button> -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-circle-plus-outline"
                  @click="createData"
                  style="float:right;"
                >添加</el-button>
                <!-- <el-button type="primary" size="mini" icon="el-icon-search" @click="createData">新建</el-button> -->
              </el-col>
            </el-row>
          </div>
          <el-table
            :data="list"
            border
            :header-cell-class-name="tableRowClassName"
            style="width: 100%"
            fit
            size="mini"
          >
            <el-table-column label="序号" width="100px">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column label="名称" prop="Name"></el-table-column>
            <el-table-column label="英文编码" prop="EnglishCode"></el-table-column>
            <el-table-column label="编码" prop="Code"></el-table-column>
            <el-table-column label="排序编号" prop="SortNo" width="100px"></el-table-column>
            <el-table-column label="操作" width="180px;">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editData(scope.row)">修改</el-button>
                <el-button type="primary" size="mini" @click="delData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center;">
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
      </el-col>
    </el-row>

    <el-dialog :visible.sync="showed" :title="title" width="40%">
      <el-form :model="temp" ref="temp" label-width="80px" :rules="rules">
        <el-form-item label="上级" prop="ParentCode">
          <treeselect
            v-model="temp.ParentCode"
            :multiple="false"
            :options="leftTreeData"
            :load-options="loadOptions"
            :loadOptions="loadOptions"
            placeholder="请选择"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText
            style="font-size:15px;"
          />
        </el-form-item>
        <el-form-item label="编码" prop="Code">
          <el-input v-model="temp.Code" :disabled="title==='修改'"></el-input>
        </el-form-item>
        <el-form-item label="英文编码" prop="EnglishCode">
          <el-input v-model="temp.EnglishCode"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="SortNo">
          <el-input v-model.number="temp.SortNo"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>



<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { fetchOrgList } from "@/frame_src/api/org";
import {
  getLeftTree,
  editNode,
  createNode,
  delNode
} from "@/frame_src/api/TaxConfig";
export default {
  data() {
    return {
      leftTreeData: [],
      defaultProps: {
        id: "Code",
        children: "children",
        label: "Name"
      },
      orgList: [], ///节点数组,
      list: [], ///分页数组
      listQuery: {
        page: 1,
        limit: 10
      },
      title: "",
      total: 0,
      showed: false,
      temp: {
        S_Id: "",
        ParentCode: null,
        Code: "",
        Name: "",
        EnglishCode: "",
        SortNo: "",
        username: this.$store.state.user.userId
      },
      rules: {
        ParentCode: [
          { required: true, message: "请选择父节点", trigger: "blur" }
        ],
        Code: [{ required: true, message: "请输入节点编码", trigger: "blur" }],
        Name: [
          {
            required: true,
            message: "请输入节点名称",
            trigger: "blur"
          }
        ],
        SortNo: [{ type: "number", message: "必须为数字值" }]
      },
      searchTemp: {
        param: ""
      },
      treeData: [],
      normalizer(node) {
        return {
          id: node.Code,
          label: node.Name,
          children: node.children
        };
      },
      options: [
        {
          value: "财务机关",
          label: "财务机关"
        },
        {
          value: "人事",
          label: "人事"
        }
      ]
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
    restTemp() {
      this.temp = {
        S_Id: "",
        ParentCode: null,
        Code: "",
        Name: "",
        EnglishCode: "",
        SortNo: "",
        username: this.$store.state.user.name
      };
    },
    createData() {
      this.restTemp();
      this.showed = true;
      this.title = "创建";
      if(this.$refs["temp"]!=undefined){
        this.$refs["temp"].resetFields();
      }
    },
    editData(data) {
      this.showed = true;
      this.title = "修改";
      this.temp = Object.assign({}, data);
      this.temp.username = this.$store.state.user.name;
      this.$nextTick(() => {
        this.$refs["temp"].clearValidate();
      });
    },
    delData(data) {
      this.$confirm("您确定要删除此节点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delNode(data).then(response => {
            if (response.data.code == 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.getLeftTree();
              this.list.splice(
                this.list.findIndex(t => t.S_Id === data.S_Id),
                1
              );
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancel() {
      this.showed = false;
    },
    submit() {
      if (this.title === "修改") {
        this.editNode();
      } else {
        this.createNode();
      }
    },
    load() {
      // 查询组织结构数据this.treeListQuery
      fetchOrgList().then(response => {
        if (response.data.code === 2000) {
          this.treeData = [];
          this.treeData = response.data.items;
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
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.list = this.getPageList(
        this.listQuery.limit,
        this.listQuery.page,
        this.orgList
      );
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.list = this.getPageList(
        this.listQuery.limit,
        this.listQuery.page,
        this.orgList
      );
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getLeftTree() {
      getLeftTree().then(response => {
        this.leftTreeData = response.data;
      });
    },
    handleNodeClick(data) {
      let array = [];
      if (data.children != null && data.children.length > 0) {
        this.total = data.children.length;
        this.orgList = data.children;
        this.list = this.getPageList(
          this.listQuery.limit,
          this.listQuery.page,
          this.orgList
        );
       }
      else if(data.ParentCode===""){
        this.list=[],
        this.total=0
      } 
      else {
        this.total = 1;
        array.push(data)
        this.list = array;
      }
    },
    getPageList(limit, page, list) {
      ///分页方法
      if (list.length < limit) {
        return list;
      } else {
        if (page * limit >= list.length) {
          return list.slice((page - 1) * limit, list.length);
        } else {
          return list.slice((page - 1) * limit, page * limit);
        }
      }
    },
    editNode() {
      this.$refs.temp.validate(valid => {
        if (valid) {
          editNode(this.temp).then(response => {
            if (response.data.code === 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.showed = false;
              this.getLeftTree();
              this.list.splice(
                this.list.findIndex(t => t.S_Id === this.temp.S_Id),
                1,
                this.temp
              );
            }
          });
        }
      });
    },
    createNode() {
      this.$refs.temp.validate(valid => {
        if (valid) {
          createNode(this.temp).then(response => {
            if (response.data.code == 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.showed = false;
              this.getLeftTree();
              if(this.list[0].ParentCode===this.temp.ParentCode){
                this.list.push(this.temp);
              }
            } else {
              this.$notify({
                position: "bottom-right",
                title: "失败",
                message: response.data.message,
                type: "warning",
                duration: 2000
              });
            }
          });
        }
      });
    },
    search() {
      let data = this.searchTemp.param;
      for (let i = 0; i <= this.orgList.length; i++) {
        if (
          this.orgList[i].Code === data ||
          this.orgList[i].Name == data ||
          this.orgList[i].EnglishCode == data
        ) {
          this.list = [];
          this.list.push(this.orgList[i]);
        }
      }
    }
  },
  components: {
    Treeselect
  },
  mounted() {
    //this.load();
    this.getLeftTree();
  },
    activated() {
    this.getLeftTree();
  },
};
</script>


<style lang="scss" scoped>
.topSearh {
  margin-bottom: 15px;
}
.button {
  float: right;
}
</style>

