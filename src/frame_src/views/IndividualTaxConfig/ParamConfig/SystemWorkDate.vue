<template>
    <div id="SystemWorkDate" class="app-container calendar-list-container">
        <span>当前工作日期：</span>
        <el-date-picker size="mini" v-model="value4" style="width:120px;" type="month" placeholder="选择月">
        </el-date-picker>
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="HandleCreate">设置</el-button>
    </div>
</template>



<script>
     import waves from "@/frame_src/directive/waves"; // 水波纹指令
import panel from "@/frame_src/components/TreeList/panel.vue";
import { getToken } from "@/frame_src/utils/auth";
export default {
    name: "SystemWorkDate",
    directives: {
        waves
    },
    data() {
        return {
            value4:'2018-10'
        };
    },
    methods: {
        getList() { 
        },
        HandleCreate() {
        }},
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
</style>