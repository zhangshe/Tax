<template>
  <div id="SalaryDetailsQuery" class="app-container calendar-list-container">
    <div class="topSearh" id="topsearch">
      <el-row>
        <el-col :span="4">
          <treeselect
            :clearable="false"
            v-model="listQuery.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :loadOptions="loadOptions"
            placeholder="请选择单位"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px;"
          />
        </el-col>
        <el-col :span="20">
          <el-date-picker
            size="mini"
            v-model="listQuery.S_WorkDate"
            style="width:120px;"
            type="month"
            value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM"
            placeholder="选择年月"
          ></el-date-picker>
          <el-select
            size="mini"
            filterable
            v-model="listQuery.ImportModel"
            placeholder="请选择导入模板"
            style="width:150px"
          >
            <el-option
              v-for="item in importmodeloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入部门名称"
            v-model="listQuery.S_Department"
            size="mini"
          ></el-input>
           <el-input
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入姓名"
            v-model="listQuery.S_WorkerName"
            size="mini"
          ></el-input>
          <el-button
            size="mini"
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>

          <!-- <el-button
            size="mini"
            class="filter-item"
            style="margin-left: 10px;"
            @click="handleCreate"
            type="primary"
            icon="el-icon-edit"
          >新增</el-button>-->
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="exportExcel">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        size="mini"
        :data="list"
        :header-cell-class-name="tableRowClassName"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="90px" fixed="left" align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" fixed="left" align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkerName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" label="单位" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.S_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" fixed="left" label="部门" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.S_Department}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" fixed="left" align="center" label="工资年月">
          <template slot-scope="scope">
            <span>{{scope.row.S_WorkDate|parseTime1}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="right" label="岗位（技）工资">
          <template slot-scope="scope">
            <span>{{scope.row.G_GWJGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="岗位（技）工资（补）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_GWJGZB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="right" label="保留工资">
          <template slot-scope="scope">
            <span>{{scope.row.G_BLGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="工龄津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_GLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="上岗津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_SGJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="技术（技能）津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_JSJNJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房补贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_ZFBT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="保留津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_BLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="边远矿贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_BYKT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="政府津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZFJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="回民津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_HMJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="驾驶津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JSJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="信访工作津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_XFGZJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="法轮功斗争津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_FLGDZJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="班主任津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BZRJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="医疗卫生津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_SYYLJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="其他津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_QTJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="夜班津贴">
          <template slot-scope="scope">
            <span>{{scope.row.G_YBJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="加班、加点工资"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JBJDGZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="星期加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_XQJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="平时加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_PSJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="节日加班"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JRJB | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="基础月奖">
          <template slot-scope="scope">
            <span>{{scope.row.G_JCYJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="业绩奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_YJJJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="总额内补发补扣"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZENBFBK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZXJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="C01专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C01 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="C02专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C02 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="C03专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C03 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="C04专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C04 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="小计1"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_XJ1 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="独生子女补贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_DSZNJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="保健食品津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BJSPJT | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="防暑降温费"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_FSJWF | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="误餐补助"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_WCBZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="通讯补助"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_TXBZ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="交通津贴"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_JTBZ | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="合理化建议奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_HLHJYJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="C05专项奖"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_C05 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="总额外补发（补扣）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_ZEWBFBK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="疗养费"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_LYF | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="小计2"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_XJ2 | NumFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表二'"
          label="小计3"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_YFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="独生子女（保健防暑）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_DSZNBJFS | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="误餐补贴（三费）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_WCBTSF | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="补发（扣）"
        >
          <template slot-scope="scope">
            <span>{{scope.row.G_BFK | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="right"
          :key="Math.random()"
          v-if="this.listQuery.ImportModel === '样表一'"
          label="应发合计"
        >
          <template slot-scope="scope">
            <span>{{scope.row.T_YFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="医疗保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YiLiaoBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="失业保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_SYBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="养老保险">
          <template slot-scope="scope">
            <span>{{scope.row.K_YangLaoBX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="住房公积金">
          <template slot-scope="scope">
            <span>{{scope.row.K_ZFGJJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="企业年金">
          <template slot-scope="scope">
            <span>{{scope.row.K_QYNJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="奖金">
          <template slot-scope="scope">
            <span>{{scope.row.G_YCXJJ | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="奖金预扣税">
          <template slot-scope="scope">
            <span>{{scope.row.K_YCXJJYKS | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="其他扣项">
          <template slot-scope="scope">
            <span>{{scope.row.K_QTKX | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="应税合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_YSHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="扣税">
          <template slot-scope="scope">
            <span>{{scope.row.K_KS | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="实发合计">
          <template slot-scope="scope">
            <span>{{scope.row.T_SFHJ | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项1">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust1 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项2">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust2 | NumFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项3">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust3 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调增项4">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust4 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项1">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust5 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项2">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust6 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项3">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust7 | NumFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="right" label="调减项4">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust8 | NumFormat}}</span>
          </template>
        </el-table-column>



        <el-table-column width="180px" align="right" label="调增项5">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust9 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项6">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust10 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项7">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust11 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项8">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust12 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项9">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust13 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项10">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust14 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项11">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust15 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项12">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust16 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项13">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust17 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调增项14">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust18 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项5">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust19 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项6">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust20 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项7">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust21 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项8">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust22 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项9">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust23 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项10">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust24 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项11">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust25 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项12">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust26 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项13">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust27 | NumFormat}}</span>
          </template>
        </el-table-column>
                <el-table-column width="180px" align="right" label="调减项14">
          <template slot-scope="scope">
            <span>{{scope.row.Adjust28 | NumFormat}}</span>
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
    </el-card>
  </div>
</template>



<script>
import waves from "@/frame_src/directive/waves"; // 水波纹指令
import { getToken } from "@/frame_src/utils/auth";
import { parseTime1 } from "@/frame_src/utils/index.js";
import { NumFormat } from "@/frame_src/filters/index.js";
import {
  getTaxSalaryList,
  exportBaseTaxSalary
} from "@/frame_src/api/taxSalary";
import { fetchOrgListByCode } from "@/frame_src/api/org";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "SalaryDetailQuery",
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
      exportComp:this.$store.state.user.orgName,
      tableKey: 0,
      list: [],
      importList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        ImportModel: "",
        S_Department: "",
        S_WorkerName: "",
        Is_Page:"true",
        S_OrgCode: this.$store.state.user.orgCode,
        S_WorkDate: this.$store.state.user.sysTime
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
      treeData: []
    };
  },
  filters: {
    parseTime1,
    NumFormat
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
      this.exportComp = node.ORG_SHORT_NAME;
    },
    loadOrgByCode() {
      const query = { sysCode: this.$store.state.user.orgCode };
      fetchOrgListByCode(query).then(response => {
        this.treeData = JSON.parse(response.data);
      });
    },
    getList() {
      this.listLoading = true;

      getTaxSalaryList(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
          if (this.list.length > 0&&this.listQuery.ImportModel==="") {
            this.listQuery.ImportModel = this.list[0].ImportModel;
          } else {
            this.listQuery.ImportModel = "样表一";
          }
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
    exportExcel() {
      //this.getList();
      exportBaseTaxSalary(this.listQuery).then(response => {
        if (response.data.code === 2000 && response.data.total > 0) {
          this.importList = response.data.items;
          if (this.listQuery.ImportModel === "样表二") {
            this.exportExcel2();
          } else {
            this.exportExcel1();
          }
        } else if(response.data.total===0){
          this.$notify({
            position: "bottom-right",
            title: "提示信息",
            message: "暂无数据",
            type: "info",
            duration: 2000
          });
        }
        else{
          this.$notify({
            position: "bottom-right",
            title: "失败",
            message: "导出失败：" + response.data.message,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    exportExcel2() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "员工编号",
          "姓名",
          "部门",
          "岗位（技）工资",
          "岗位（技）工资（补）",
          "保留工资",
          "工龄津贴",
          "上岗津贴",
          "技术(技能)津贴",
          "住房补贴",
          "保留津贴",
          "边远矿贴",
          "政府津贴",
          "回民津贴",
          "驾驶津贴",
          "信访工作津贴",
          "法轮功斗争津贴",
          "班主任津贴",
          "医疗卫生津贴",
          "夜班津贴",
          "星期加班",
          "平时加班",
          "节日加班",
          "基础月奖",
          "业绩奖金",
          "总额内补发（补扣）",
          "专项奖",
          "C01专项奖",
          "C02专项奖",
          "C03专项奖",
          "C04专项奖",
          "小计1",
          "独生子女补贴",
          "保健食品津贴",
          "防暑降温费",
          "误餐补助",
          "通讯补助",
          "交通津贴",
          "合理化建议奖",
          "C05专项奖",
          "总额外补发（补扣）",
          "疗养费",
          "小计2",
          "小计3",
          "医疗保险",
          "失业保险",
          "养老保险",
          "住房公积金",
          "企业年金",
          "奖金",
          "奖金预扣税",
          "其他扣项",
          "应税合计",
          "扣税",
          "实发合计",
          "调增项1",
          "调增项2",
          "调增项3",
          "调增项4",
          "调减项1",
          "调减项2",
          "调减项3",
          "调减项4",
          "调增项5",
          "调增项6",
          "调增项7",
          "调增项8",
          "调增项9",
          "调增项10",
          "调增项11",
          "调增项12",
          "调增项13",
          "调增项14",
          "调减项5",
          "调减项6",
          "调减项7",
          "调减项8",
          "调减项9",
          "调减项10",
          "调减项11",
          "调减项12",
          "调减项13",
          "调减项14"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          "G_GWJGZ",
          "G_GWJGZB",
          "G_BLGZ",
          "G_GLJT",
          "G_SGJT",
          "G_JSJNJT",
          "G_ZFBT",
          "G_BLJT",
          "G_BYKT",
          "G_ZFJT",
          "G_HMJT",
          "G_JSJT",
          "G_XFGZJT",
          "G_FLGDZJT",
          "G_BZRJT",
          "G_SYYLJT",
          "G_YBJT",
          "G_XQJB",
          "G_PSJB",
          "G_JRJB",
          "G_JCYJ",
          "G_YJJJ",
          "G_ZENBFBK",
          "G_ZXJ",
          "G_C01",
          "G_C02",
          "G_C03",
          "G_C04",
          "T_XJ1",
          "G_DSZNJT",
          "G_BJSPJT",
          "G_FSJWF",
          "G_WCBZ",
          "G_TXBZ",
          "G_JTBZ",
          "G_HLHJYJ",
          "G_C05",
          "G_ZEWBFBK",
          "G_LYF",
          "T_XJ2",
          "T_YFHJ",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_YangLaoBX",
          "K_ZFGJJ",
          "K_QYNJ",
          "G_YCXJJ",
          "K_YCXJJYKS",
          "K_QTKX",
          "T_YSHJ",
          "K_KS",
          "T_SFHJ",
          "Adjust1",
          "Adjust2",
          "Adjust3",
          "Adjust4",
          "Adjust5",
          "Adjust6",
          "Adjust7",
          "Adjust8",
          "Adjust9",
          "Adjust10",
          "Adjust11",
          "Adjust12",
          "Adjust13",
          "Adjust14",
          "Adjust15",
          "Adjust16",
          "Adjust17",
          "Adjust18",
          "Adjust19",
          "Adjust20",
          "Adjust21",
          "Adjust22",
          "Adjust23",
          "Adjust24",
          "Adjust25",
          "Adjust26",
          "Adjust27",
          "Adjust28"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportComp +this.listQuery.S_WorkDate.substr(0,7)+"工资表"
        });
      });
    },
    exportExcel1() {
      import("@/frame_src/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "员工编号",
          "姓名",
          "部门",
          "岗位（技）工资",
          "保留工资",
          "工龄津贴",
          "上岗津贴",
          "技术(技能)津贴",
          "住房补贴",
          "保留津贴",
          "边远矿贴",
          "其它津贴",
          "夜班津贴",
          "加班、加点工资",
          "基础月奖",
          "业绩奖金",
          "独生子女(保健防暑）",
          "误餐补贴(三费)",
          "补发（扣）",
          "应发合计",
          "医疗保险",
          "失业保险",
          "养老保险",
          "住房公积金",
          "企业年金",
          "奖金",
          "奖金预扣税",
          "其他扣项",
          "应税合计",
          "扣税",
          "实发合计",
          "调增项1",
          "调增项2",
          "调增项3",
          "调增项4",
          "调减项1",
          "调减项2",
          "调减项3",
          "调减项4",
           "调增项5",
          "调增项6",
          "调增项7",
          "调增项8",
          "调增项9",
          "调增项10",
          "调增项11",
          "调增项12",
          "调增项13",
          "调增项14",
          "调减项5",
          "调减项6",
          "调减项7",
          "调减项8",
          "调减项9",
          "调减项10",
          "调减项11",
          "调减项12",
          "调减项13",
          "调减项14"
        ];
        const filterVal = [
          "S_WorkerCode",
          "S_WorkerName",
          "S_OrgName",
          "G_GWJGZ",
          "G_BLGZ",
          "G_GLJT",
          "G_SGJT",
          "G_JSJNJT",
          "G_ZFBT",
          "G_BLJT",
          "G_BYKT",
          "G_QTJT",
          "G_YBJT",
          "G_JBJDGZ",
          "G_JCYJ",
          "G_YJJJ",
          "G_DSZNBJFS",
          "G_WCBTSF",
          "G_BFK",
          "T_YFHJ",
          "K_YiLiaoBX",
          "K_SYBX",
          "K_YangLaoBX",
          "K_ZFGJJ",
          "K_QYNJ",
          "G_YCXJJ",
          "K_YCXJJYKS",
          "K_QTKX",
          "T_YSHJ",
          "K_KS",
          "T_SFHJ",
          "Adjust1",
          "Adjust2",
          "Adjust3",
          "Adjust4",
          "Adjust5",
          "Adjust6",
          "Adjust7",
          "Adjust8",
          "Adjust9",
          "Adjust10",
          "Adjust11",
          "Adjust12",
          "Adjust13",
          "Adjust14",
          "Adjust15",
          "Adjust16",
          "Adjust17",
          "Adjust18",
          "Adjust19",
          "Adjust20",
          "Adjust21",
          "Adjust22",
          "Adjust23",
          "Adjust24",
          "Adjust25",
          "Adjust26",
          "Adjust27",
          "Adjust28"
        ];
        const data = this.formatJson(filterVal, this.importList);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportComp +this.listQuery.S_WorkDate.substr(0,7)+"工资表"
        });
      });
    }
  },

  created() {
    this.loadOrgByCode();
    this.getList();
  },
   activated() {
    this.loadOrgByCode();
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


<style lang="scss" >
#SalaryDetailsQuery {
    .page {
  text-align: center;
}
  .topSearh {
    margin-bottom: 15px;
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
</style>

