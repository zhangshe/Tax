<template>
    <div id="IndividualTaxCalculate" class="app-container calendar-list-container">
        <el-row type="flex" justify="center">
            <el-col :xs="16" :sm="14" :md="12" :lg="10" :xl="8">
                <el-card>
                    <div slot="header" class="header">
                        <span>个税计算</span>
                    </div>
                    <el-form label-width="80px">
                        <el-form-item label="当前月份">
                            <el-col :span="22">
                                <el-date-picker type="month" placeholder="选择日期" style="width:100%;" v-model="temp.time" :disabled="true"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="当前单位">
                            <el-col :span="22">
                                <el-input v-model="temp.department" :disabled="true" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="当前状态">
                            <el-col :span="22">
                                <el-select v-model="temp.state" placeholder="选择计算状态" style="width:100%;" disabled>
                                    <el-option v-for="item in stateoptions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="纳税人数">
                            <el-col :span="22">
                                <el-input :disabled="true" width="50%" v-model="temp.number"></el-input>
                            </el-col>
                        </el-form-item>
                        <div class="button" style="text-align:center">
                            <el-form-item>
                                <el-button type="primary" @click="btnQueryDetail" >查看详情</el-button>
                                <el-button type="primary" @click="btnCalcluteTax" style="width:100px;"  >计&nbsp;&nbsp;算</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="详情" :visible.sync="DialogVisible" width="610px;">
            <el-card class="box-card">
                <el-select v-model="queryState" size="mini" placeholder="选择计算状态" style="140px;">
                    <el-option v-for="item in stateoptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="btnQuery">查询</el-button>
                <span>{{total}}条记录</span>
                <el-table :key='tableKey' size="mini" :data="list" :header-cell-class-name="tableRowClassName" element-loading-text="给我一点时间" border fit highlight-current-row height="320" style="width: 100%;">
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
            </el-card>
        </el-dialog>
    </div>
</template>



<script>
import { TaxCalculate, GetData } from "@/frame_src/api/IndividualTaxCalculate";
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
    name: "IndividualTaxCalculate",
    data() {
        return {
            tableKey: 0,
            list: [], //按条件查询单位
            total: 0, //单位数
            listTotal: [], //记录总单位
            temp: {
                time: this.$store.state.user.sysTime,
                department: this.$store.state.user.departName,
                state: -1,
                number: 0
            },
            stateoptions: [
                {
                    value: -1,
                    label: "待导入"
                },
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
                }
            ],
            listQuery: {
                OrgCode: "",
                WorkMonth: ""
            },
            DialogVisible: false,
            queryState: ""
        };
    },
    filters: {
        stateFilter: function(val) {
            return statesKeyValue[val];
        }
    },
    methods: {
        getList() {
            this.listQuery.OrgCode = this.$store.state.user.orgCode;
            this.listQuery.WorkMonth = this.temp.time;
            GetData(this.listQuery).then(response => {
                if (response.data.code === 2000) {
                    if (response.data.TaxPayerCount >= 0) {
                        this.list = response.data.items;
                        this.listTotal = response.data.items;
                        this.total = response.data.total;
                        this.temp.state = response.data.TaxStatus;
                        this.temp.number = response.data.TaxPayerCount;
                    }
                } else {
                }
            });
        },
        btnQueryDetail() {
            this.DialogVisible = true;
        },
        btnQuery() {
            var newlist = [];
            var s = this.queryState;
            var t = 0;
            this.listTotal.forEach(function(c) {
                if (c.ReportStatus == s) {
                    newlist.push(c);
                    t = t + 1;
                }
            });
            this.list = newlist;
            this.total = t;
        },
        btnCalcluteTax() {
            var parm = {
                OrgCode: this.$store.state.user.orgCode, //this.$store.state.user.orgCode,// "100001004",
                WorkMonth: this.temp.time,
                UserId: this.$store.state.user.userId
            };
            if (this.temp.state == 2) {
                this.$notify({
                    position: "bottom-right",
                    title: "提示",
                    message:
                        "已经上报，不能计算，请联系上级进行解锁，才可重新计算！",
                    type: "warning",
                    duration: 2000
                });
                return false;
            }
            if (this.temp.state == 1) {
                this.$confirm("已经计算过了, 是否重新计算?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        TaxCalculate(parm).then(response => {
                            if (response.data.code === 2000) {
                                this.$notify({
                                    position: "bottom-right",
                                    title: "成功",
                                    message: response.data.message,
                                    type: "success",
                                    duration: 2000
                                });
                                this.getList();
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
                    })
                    .catch(() => {
                       
                    });
            }
            else{
            if (this.temp.state == 0) {
                TaxCalculate(parm).then(response => {
                    if (response.data.code === 2000) {
                        this.$notify({
                            position: "bottom-right",
                            title: "成功",
                            message: response.data.message,
                            type: "success",
                            duration: 2000
                        });
                         this.getList();
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
            } else {
                this.$notify({
                    position: "bottom-right",
                    title: "提示",
                    message: "工资没有全部导入，不能计算！",
                    type: "warning",
                    duration: 2000
                });
                return false;
            }}
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 0) {
                return "el-button--primary is-active"; // 'warning-row'
            } // 'el-button--primary is-plain'// 'warning-row'
            return "";
        }
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
  },
    mounted() {
    },
    watch:{
        $route(to){
            this.getList();
        }
    }
};
</script>


<style lang="scss" scoped>
.el-dialog__body {
    padding-top: 0px 20px !important;
    height: 410px !important;
}
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

