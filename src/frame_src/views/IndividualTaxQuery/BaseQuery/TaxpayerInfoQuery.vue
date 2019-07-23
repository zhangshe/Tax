<template>
  <div id="TaxpayerInfoQuery" class="app-container calendar-list-container">
    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="topSearh">
            <el-row>
              <el-col :span="5">
                <treeselect
                  :multiple="false"
                  :options="treeData"
                  v-model="listQuery.OrgCode"
                  :load-options="loadOptions"
                  :loadOptions="loadOptions"
                  placeholder="请选择部门"
                  :normalizer="normalizer"
                  :disable-branch-nodes="false"
                  noResultsText="未搜索到结果"
                  noChildrenText=" "
                  style="font-size:15px;"
                  :clearable="false"
                />
              </el-col>
              <el-col :span="19">
                <el-input
                  size="mini"
                  placeholder="请输入工号"
                  style="width:150px;"
                  v-model="listQuery.WorkerNumber"
                ></el-input>
                <el-input
                  size="mini"
                  placeholder="请输入姓名"
                  style="width:150px;"
                  v-model="listQuery.name"
                ></el-input>
                <el-input
                  size="mini"
                  placeholder="请输入身份证号"
                  style="width:150px;"
                  v-model="listQuery.IDNumber"
                ></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="getTaxpayer">搜索</el-button>
              </el-col>
            </el-row>
            <!-- <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="createData" >创建</el-button> -->
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="people"
            title="人员基本信息表"
            border
            :header-cell-class-name="tableRowClassName"
            style="width: 100%"
            fit
            size="mini"
          >
            <!-- <el-table-column prop="id" label="编号" fixed="left" width="80px"></el-table-column> -->
            <el-table-column prop="S_OrgName" label="单位" width="250" fixed="left"></el-table-column>
            <el-table-column prop="WorkerNumber" label="工号" width="115" fixed="left"></el-table-column>
            <el-table-column prop="WorkerName" label="姓名" fixed="left"></el-table-column>
            <el-table-column prop="idt" label="证照类型"></el-table-column>
            <el-table-column prop="IdNumber" label="证照号码" width="200px"></el-table-column>
            <el-table-column prop="nat" label="国籍地区" width="120px"></el-table-column>
            <el-table-column label="性别" width="100px">
              <template slot-scope="scope">
                <span>{{scope.row.Sex|formatSex}}</span>
              </template>
            </el-table-column>
            <el-table-column label="出生日期" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.BirthDate|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="人员状态" width="100px">
              <template slot-scope="scope">
                <span>{{scope.row.WorkerStatusId|formatStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column prop label="是否雇员" width="100px">
              <template slot-scope="scope">
                <span>{{scope.row.IsEmployee|formatOther}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Tel" label="手机号码" width="150px"></el-table-column>
            <el-table-column label="任职受雇日期" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.EmployeeDate|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否残疾" width="100px">
              <template slot-scope="scope">
                <span>{{scope.row.IsDisability|formatOther}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="DisabilityNo" label="残疾证号" width="200px"></el-table-column>
            <el-table-column label="离职日期" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.QuitDate|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Email" label="电子邮箱" width="200px"></el-table-column>
            <el-table-column prop="edu" label="学历" width="200px"></el-table-column>
            <el-table-column prop="occ" label="职业" width="200px"></el-table-column>
            <el-table-column prop="wor" label="职务" width="200px"></el-table-column>
            <el-table-column label="是否烈属" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.IsLieShu|formatOther}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="LiShuZH" label="烈属证号" width="200px"></el-table-column>
            <el-table-column prop="IsAlone" label="是否孤老" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.IsAlone|formatOther}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="BankName" label="开户银行" width="200px"></el-table-column>
            <el-table-column prop="BankNumber" label="银行账号" width="200px"></el-table-column>
            <el-table-column label="是否特定职业" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.IsSpecialIndustry|formatOther}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Domicile" label="户籍所在地" width="200px"></el-table-column>
            <el-table-column prop="PostalAddress" label="通讯地址" width="200px"></el-table-column>
            <el-table-column prop="Remark" label="备注" width="300px"></el-table-column>
            <el-table-column label="操作" width="150px" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="detail(scope.row)" type="primary" >查看纳税详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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

    <el-dialog :title="title" :visible.sync="showed" width="70%">
      <el-card>
        <el-table
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
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>



<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getTaxpayer,
  getPayerSalary,
  fetchTaxOrgNodeList
} from "@/frame_src/api/taxPlayerinfo";
import { NumFormat } from "@/frame_src/filters/index.js";
import { parseTime1 } from "@/frame_src/utils/index.js";
export default {
  name:'TaxpayerInfoQuery', 
  data() {
    return {
      people: [],
      total: 0,
      showed: false,
      title: "提示",
      listLoading: false,
      temp: {
        id: "",
        name: "",
        national_ID: "",
        health: 0,
        Education: "",
        job: "",
        email: "",
        phoneNumber: "",
        code: "",
        address: ""
      },
      treeData: [],
      normalizer(node) {
        return {
          id: node.orgCode,
          label: node.orgShortName,
          children: node.children
        };
      },
      listQuery: {
        OrgCode: this.$store.state.user.orgCode,
        systime: this.$store.state.user.sysTime,
        name: "",
        IDNumber: "",
        WorkerNumber: "",
        limit: 10,
        page: 1
      },
      list: [],
      temp: {
        systime: this.$store.state.user.sysTime,
        id: ""
      },
      orgtemp: {
        S_OrgCode: this.$store.state.user.orgCode
      }
    };
  },
  methods: {
    detail(data) {
      this.title = "详情";
      this.showed = true;
      this.temp.id = data.S_Id;
      this.getPayerSalary();
    },
    tableRowClassName({ row, rowIndex }) {
      // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getTaxpayer();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getTaxpayer();
    },
    load() {
      // 查询组织结构数据this.treeListQuery
      fetchTaxOrgNodeList(this.orgtemp).then(response => {
        this.treeData = response.data;
      });
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getTaxpayer() {
      getTaxpayer(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.people = response.data.items;
          this.total = response.data.total;
        }
      });
    },
    getPayerSalary() {
      getPayerSalary(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.list = response.data.items;
        }
      });
    }
  },
  components: {
    Treeselect
  },
  mounted() {
    this.getTaxpayer();
    this.load();
  },
     activated() {
    this.getTaxpayer();
    this.load();
  },
  filters: {
    NumFormat,
    parseTime1,
    formatSex(val) {
      if (val === 1 || val === "1") {
        return "男";
      } else {
        return "女";
      }
    },
    formatOther(val) {
      if (val === 0) {
        return "否";
      } else {
        return "是";
      }
    },
    formatStatus(val) {
      if (val === 0) {
        return "非正常";
      } else {
        return "正常";
      }
    },
    formatTime(val) {
      if (val === null || val.startsWith("1900")) {
        return null;
      } else {
        return val.substring(0, 10);
      }
    }
  }
};
</script>


<style lang="scss">
#TaxpayerInfoQuery {
  .topSearh {
    margin-bottom: 15px;
  }
  .vue-treeselect__control {
    height: 28px !important;
    width: 95%;
  }
  .page {
    text-align: center;
  }
  .vue-treeselect__control {
    height: 28px !important;
    width: 100%;
  }
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 28px;
  }
  .vue-treeselect--single .vue-treeselect__input-container {
    height: 28px;
    width: 100%;
  }
}
</style>

