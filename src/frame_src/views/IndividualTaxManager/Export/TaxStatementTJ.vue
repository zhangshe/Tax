<template>
    <div id="TaxStatementTJ" class="app-container calendar-list-container">
        <div class="filter-container">
            <span>所得月份：</span>
            <el-date-picker size="mini" v-model="value4" style="width:120px;" type="month" placeholder="选择月">
            </el-date-picker>
            <span>状态：</span>
            <el-select v-model="value3" size="mini" style="width:120px;" clearable placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="mini" type="primary" v-waves  @click="handleFilter">工资导出</el-button>
            <el-button size="mini" type="primary" v-waves  @click="handleFilter">一次性奖金导出</el-button>
        </div>
        <el-card class="box-card">
            <el-table :key='tableKey' size="mini" :data="list" :header-cell-class-name="tableRowClassName" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
                <el-table-column width="300px" fixed="left" align="center" label="单位">
                    <template slot-scope="scope">
                        <span>{{scope.row.OrgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120px" fixed="left" align="center" label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.Status | statusFormater}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column width="95px" fixed="left" align="center" label="计算状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.TaxStatus | TaxStatusFormater}}</span>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if='scope.row.Status!=1' size="mini" @click="Lock(scope.row)">锁定</el-button>
                        <el-button type="primary" v-if='scope.row.Status===1' size="mini" @click="UnLock(scope.row)">解锁</el-button>
                        <el-button type="primary" v-if='scope.row.Status===1' size="mini" >导出</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div>
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
export default {
    name: "IndividualTaxCompletion",
    directives: {
        waves
    },
    data() {
        return {
            tableKey: 0,
            list: [
                {
                    OrgName: "财务机关科",
                    Status: 1,
                    TaxStatus: 1
                },
                {
                    OrgName: "工程实施部",
                    Status: 0,
                    TaxStatus: 0
                }
            ],
            total: 2,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10
            },
            temp: {
                OrgName: "单位2",
                Status: 0
            },
            value4: "",
            value3: "",
            options: [
                {
                    value: "1",
                    label: "待导入"
                },
                {
                    value:"2",
                    label: "待计算"
                },
                {
                    value:"3",
                    label: "待上报"
                },
                {
                    value:"4",
                    label: "已上报"
                }
            ]
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
        Lock(row) {},
        UnLock(row) {}
    },
    created() {
        this.getList();
    },
    activated() {
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
    },
    filters: {
        statusFormater(value) {
            if (value === 1) {
                return "已上报";
            } else {
                return "未上报";
            }
        },
        TaxStatusFormater(data) {
            if (data === 1) {
                return "已计算";
            } else {
                return "未计算";
            }
        }
    }
};
</script>


<style lang="scss" scoped>
</style>



