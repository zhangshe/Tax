<template>
  <div id="TaxCalculator" class="app-container calendar-list-container">
    <el-row type="flex">
      <el-col :span="7"></el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="header">
            <span>税额计算器(全年平均核算)</span>
          </div>
          <el-form label-width="130px">
            <el-form-item label="请选择模板">
              <el-col :span="22">
                <el-select v-model="fileType" size="small" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="item in fileTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="请选择机关所在地">
              <el-col :span="22">
                <el-select
                  v-model="taxOfficeType"
                  size="small"
                  style="width:100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in taxOfficeTypes"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="请选择文件">
              <el-col :span="22">
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
                  <el-button slot="trigger" size="small" type="primary">点击选择</el-button>
                </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="导入并计算">
              <el-col :span="22">
                <el-form-item>
                  <el-button size="small" type="success" @click="submitUpload">点击确定</el-button>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="全年应缴">
              <el-col :span="22">
                <el-form-item>
                  <el-input v-model="YearSalaryTax" style="width:100%;" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="每月应缴">
              <el-col :span="22">
                <el-form-item>
                  <el-input v-model="MonthSalaryTax" style="width:100%;" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { InverseCalculate } from "@/frame_src/api/IndividualTaxCalculate";
import { getToken } from "@/frame_src/utils/auth";
import { getAllDictionary } from "@/frame_src/api/taxOrg";
export default {
  name: "TaxCalculator",
  data() {
    return {
      urlUpload: process.env.BASE_API + "/TaxCalculate/CalculateImportSalary",
      filedata: {
        importModel: "",
        taxOffice: "",
        userId: this.$store.state.user.userId
      },
      fileList: [],
      limitNum: 1,
      YearSalaryTax: 0,
      MonthSalaryTax: 0,
      fileTypes: [
        { label: "样表一", value: "样表一" },
        { label: "样表二", value: "样表二" }
      ],
      fileType: "样表一",
      taxOfficeTypes: [
      ],
      taxOfficeType: "TJ"
    };
  },
  filters: {},
  methods: {
    submitUpload() {
      this.filedata.importModel = this.fileType;
      this.filedata.taxOffice = this.taxOfficeType;
      this.$refs.upload.submit();
    },
    handleSuccess(res, file, fileList) {
      this.$refs.upload.clearFiles();
      if (res.code == 2000) {
        this.YearSalaryTax = res.YeaTax;
        this.MonthSalaryTax = res.MonthTax;
        this.$notify({
          position: "bottom-right",
          title: "成功",
          message: "计算成功！",
          type: "success",
          duration: 2000
        });
      } else {
        this.$notify({
          position: "bottom-right",
          title: "失败",
          message: res.message,
          type: "error",
          duration: 2000
        });
      }
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitNum}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    getAllDictionary() {
      getAllDictionary().then(response => {
        if (response.data.code === 2000) {
          this.taxOfficeTypes = response.data.taxOffice;
        }
      });
    }
  },
  created() {
      this.getAllDictionary()
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
  components: {},
  mounted() {}
};
</script>


<style lang="scss" >
</style>

