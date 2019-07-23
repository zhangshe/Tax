<template>
    <div id="InverseTaxCalculator" class="app-container calendar-list-container InverseTaxCalculator">
        <el-row type="flex">
            <el-col :span="7"></el-col>
            <el-col :span="10">
                <el-card>
                    <div slot="header" class="header">
                        <span>工资倒算器</span>
                    </div>
                    <el-form label-width="120px">
                        <el-form-item label="请输入缴税额">
                            <el-col :span="22">
                                <el-input-number v-model="temp.TaxNumber"  style="width:100%;" :controls='false'  label="请输入税额"></el-input-number>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="应发工资">
                            <el-col :span="22">
                                <el-input v-model="Salary" style="width:100%;"  :disabled="true" ></el-input>
                            </el-col>
                        </el-form-item>
                        <div class="button">
                            <el-form-item style="text-align:center">
                                <el-button type="primary" @click="btnCalculate">计算</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { InverseCalculate } from "@/frame_src/api/IndividualTaxCalculate";
export default {
    name: "InverseTaxCalculator",
    data() {
        return {
            temp:{
                TaxNumber:0
            },
            Salary:0
        };
    },
    filters: {
    },
    methods: {
        btnCalculate(){
            if(this.temp.TaxNumber<0){
                this.$notify({
                        position: "bottom-right",
                        title: "提示",
                        message: '请输入大于或等于0的税额！',
                        type: "error",
                        duration: 2000
                    });
                return false;
            }
             InverseCalculate(this.temp).then(response => {
                if (response.data.code === 2000) {
                     this.Salary=response.data.result;
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
        }
    },
    created() {
       
    },
    computed: {
    },
    components: {},
    mounted() {
    }
};
</script>


<style lang="scss" >
.InverseTaxCalculator{
.el-input-number.is-without-controls .el-input__inner{
    text-align: left;
    
}
}

</style>

