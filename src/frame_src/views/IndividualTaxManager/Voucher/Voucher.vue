<template>
    <div id="Voucher" class="app-container calendar-list-container">
        <div class="filter-container">
            <span>所得月份：</span>
            <el-date-picker size="mini" v-model="value4" style="width:120px;" type="month" placeholder="选择月">
            </el-date-picker>
            <el-button size="mini" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="calculate">计提凭证导出</el-button>
        </div>
        <el-card class="box-card">
            <el-table :key='tableKey' size="mini" :data="list" :header-cell-class-name="tableRowClassName" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
                <el-table-column width="95px" fixed="left" align="center" label="工号">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="95px" fixed="left" align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="工资年月">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="岗位绩效工资">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="保留工资">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="工龄津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="上岗津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="技术技能津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="住房补贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="保留津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="边远矿贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="夜班津贴">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="加班加点工资">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="基础月奖">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="业绩奖金">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="独生子女保健防暑">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="午餐补贴三费">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="补发补扣">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="应发合计">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="扣养老">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="扣失业">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="扣医疗">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="扣公积金">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="企业年金">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他扣项">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="应税合计">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="扣税">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="实发合计">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整1">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整2">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整3">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整4">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整5">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整6">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整7">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="其他调整8">
                    <template slot-scope="scope">
                        <span>{{scope.row.CONF_CODE}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
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
    name: "Voucher",
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
            total: 1,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10,
                CONF_NAME: ""
            },
            temp: {
                CONF_NAME: ""
            },

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
        exportExcel() {}
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
    }
};
</script>


<style lang="scss" scoped>
.page {
    text-align: center;
}
</style>

