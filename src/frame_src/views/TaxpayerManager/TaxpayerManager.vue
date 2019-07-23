<template>
  <div id="TaxpayerManager" class="app-container calendar-list-container">
    <!-- <div style="text-align: center; font-weight: bold;margin-bottom:15px;">
      <span>纳税人信息明细表</span>
    </div>-->
    <div class="topSearh">
      <el-row>
        <el-col :span="4">
          <treeselect
            v-model="searchTemp.S_OrgCode"
            :multiple="false"
            :options="treeData"
            :load-options="loadOptions"
            :loadOptions="loadOptions"
            placeholder="请选择部门"
            :normalizer="normalizer"
            :disable-branch-nodes="false"
            noResultsText="未搜索到结果"
            noChildrenText=" "
            style="font-size:14px; width:95%;"
            :clearable="false"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入工号"
            v-model="searchTemp.WorkerNumber"
            style="width:95%;"
            size="mini"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入姓名"
            v-model="searchTemp.WorkerName"
            style="width:95%;"
            size="mini"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入身份证号"
            v-model="searchTemp.IdNumber"
            style="width:95%;"
            size="mini"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            size="mini"
            v-model="searchTemp.Education"
            style="width:95%;"
            placeholder="请选择学历"
            clearable
            filterable
          >
            <el-option
              v-for="(item,key) in educationOptions"
              :key="key"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-select
            size="mini"
            v-model="searchTemp.Occupation"
            style="width:95%;"
            placeholder="请选择职业"
            clearable
            filterable
          >
            <el-option
              v-for="(item,key) in jobOptions"
              :key="key"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="mini"
            v-model="searchTemp.WorkPost"
            style="width:95%;"
            placeholder="请选择职务"
            clearable
            filterable
          >
            <el-option
              v-for="(item,key) in workPostOptions"
              :key="key"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            placeholder="请选择健康状况"
            v-model="searchTemp.IsDisability"
            style="width:95%;"
            size="mini"
            clearable
          >
            <el-option
              v-for="(item,key) in selectOptions1"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="10" :xl="8">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getTaxInfo">查询</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="createData" size="mini">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleImport">导入</el-button>

          <a class="astyle" :href="urldownload1">
            <el-button size="mini" type="primary" icon="el-icon-edit">模板下载</el-button>
          </a>
          &nbsp;&nbsp;
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-table
            :key="tableKey"
            size="mini"
            :data="people"
            :header-cell-class-name="tableRowClassName"
            v-loading="listloading"
            element-loading-text="给我一点时间"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <!-- <el-table-column prop="id" label="编号" fixed="left" width="80px"></el-table-column> -->
            <el-table-column prop="S_OrgName" label="单位" width="250" fixed="left"></el-table-column>
            <el-table-column prop="WorkerNumber" label="工号" width="115" fixed="left"></el-table-column>
            <el-table-column prop="WorkerName" label="姓名" fixed="left"></el-table-column>
            <el-table-column prop="idt" label="证照类型" width="120"></el-table-column>
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
            <!-- <el-table-column prop label="是否雇员" width="100px">
              <template slot-scope="scope">
                <span>{{scope.row.IsEmployee|formatOther}}</span>
              </template>
            </el-table-column>-->
            <el-table-column prop="Tel" label="手机号码" width="150px"></el-table-column>
            <el-table-column label="任职受雇日期" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.EmployeeDate|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jobt" label="任职受雇从业类型" width="200px"></el-table-column>
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
            <el-table-column prop="otheridt" label="其他证照类型" width="200px"></el-table-column>
            <el-table-column prop="OtherIdNumber" label="其他证照号码" width="200px"></el-table-column>
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
            <el-table-column prop="PostalAddress" label="居住地址" width="200px"></el-table-column>
            <el-table-column prop="L_Adress" label="联系地址" width="200px"></el-table-column>
            <el-table-column prop="Remark" label="备注" width="300px"></el-table-column>
            <el-table-column label="操作" width="150px" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="edit(scope.row)" type="primary">修改</el-button>
                <el-button size="mini" @click="del(scope.row)" type="danger">删除</el-button>
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
    <el-dialog :title="title" :visible.sync="showed" width="60%">
      <el-card>
        <el-form ref="temp" :model="temp" label-width="140px" label-position="right" :rules="rules">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="人员必填信息" name="1">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="单位" prop="S_OrgCode">
                    <treeselect
                      v-model="temp.S_OrgCode"
                      :multiple="false"
                      :options="treeData"
                      :load-options="loadOptions"
                      :loadOptions="loadOptions"
                      placeholder="请选择部门"
                      :normalizer="normalizer"
                      :disable-branch-nodes="false"
                      noResultsText="未搜索到结果"
                      noChildrenText=" "
                      style="font-size:14px; width:100%;"
                      :clearable="false"
                      @select="getnode"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="工号" prop="WorkerNumber">
                    <el-input size="mini" v-model="temp.WorkerNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="姓名" prop="WorkerName">
                    <el-input size="mini" v-model="temp.WorkerName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="性别" prop="Sex">
                    <el-select size="mini" v-model="temp.Sex" style="width:100%;">
                      <el-option
                        v-for="(item,key) in selectSex"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生日期" prop="BirthDate">
                    <el-date-picker
                      type="date"
                      v-model="temp.BirthDate"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="国籍（地区）" prop="Nationality">
                    <el-select
                      size="mini"
                      v-model="temp.Nationality"
                      style="width:100%;"
                      @change="getID"
                      filterable
                    >
                      <el-option
                        v-for="(item,key) in nationOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="证照类型" prop="IdType">
                    <el-select size="mini" v-model="temp.IdType" style="width:100%;">
                      <el-option
                        v-for="(item,key) in IdtypeOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证照号码" prop="IdNumber">
                    <el-input size="mini" v-model="temp.IdNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- <el-form-item label="是否雇员" prop="IsEmployee">
                    <el-select size="mini" v-model="temp.IsEmployee" style="width:100%;">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>-->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="手机号码" prop="Tel">
                    <el-input size="mini" v-model="temp.Tel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任职受雇日期" prop="EmployeeDate">
                    <el-date-picker
                      v-model="temp.EmployeeDate"
                      type="date"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任职受雇从业类型" prop="JobType">
                    <el-select size="mini" v-model="temp.JobType" style="width:100%;">
                      <el-option
                        v-for="(item,key) in jopTypeOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="人员状态" prop="WorkerStatus">
                    <el-select size="mini" v-model="temp.WorkerStatus" style="width:100%;">
                      <el-option
                        v-for="(item,key) in selectOptions2"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否残疾" prop="IsDisability">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsDisability">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="离职日期" v-show="temp.WorkerStatus=='0'" prop="QuitDate">
                    <el-date-picker
                      v-model="temp.QuitDate"
                      type="date"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8" v-show="temp.IsDisability==!0">
                  <el-form-item label="残疾证号" prop="DisabilityNo">
                    <el-input size="mini" v-model="temp.DisabilityNo"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="人员基本信息" name="2">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="学历">
                    <el-select size="mini" v-model="temp.Education" style="width:100%;" filterable>
                      <el-option
                        v-for="(item,key) in educationOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否在职">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsWorking">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否特行业">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsSpecialIndustry">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="职业">
                    <el-select size="mini" v-model="temp.Occupation" style="width:100%;" filterable>
                      <el-option
                        v-for="(item,key) in jobOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="职务">
                    <el-select size="mini" v-model="temp.WorkPost" style="width:100%;" filterable>
                      <el-option
                        v-for="(item,key) in workPostOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否孤老">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsAlone">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="电子邮箱">
                    <el-input size="mini" v-model="temp.Email"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="开户银行">
                    <el-input size="mini" v-model="temp.BankName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="银行账号">
                    <el-input size="mini" v-model="temp.BankNumber"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="其他证照类型">
                    <el-select size="mini" v-model="temp.OtherIdType" style="width:100%;">
                      <el-option
                        v-for="(item,key) in otherIdTypeOptions"
                        :key="key"
                        :label="item.Name"
                        :value="item.Code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其他证照号码">
                    <el-input size="mini" v-model="temp.OtherIdNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注">
                    <el-input size="mini" v-model="temp.Remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否股东">
                    <el-select size="mini" v-model="temp.IsShareholder" style="width:100%;">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否烈属">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsLieShu">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" v-show="temp.IsShareholder!=0">
                  <el-form-item label="个人股本">
                    <el-input size="mini" v-model="temp.Investment"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="temp.Investment">
                  <el-form-item label="投资额占比" prop="PerInvestment">
                    <el-input size="mini" v-model.number="temp.PerInvestment">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="temp.IsLieShu!=0">
                  <el-form-item label="烈属证号">
                    <el-input size="mini" v-model="temp.LiShuZH"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="人员居住信息">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="户籍所在地(省)">
                    <el-input size="mini" v-model="temp.Province" @change="createDomicile"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="户籍所在地（市）">
                    <el-input size="mini" v-model="temp.City" @change="createDomicile"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="户籍所在地（区县）">
                    <el-input size="mini" v-model="temp.County" @change="createDomicile"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="户籍所在地">
                    <el-input size="mini" v-model="temp.Domicile"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="居住地址（省）">
                    <el-input
                      size="mini"
                      v-model="temp.Adress_Province"
                      @change="createPostalAddress"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="居住地址（市）">
                    <el-input size="mini" v-model="temp.Adress_City" @change="createPostalAddress"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="居住地址（区县）">
                    <el-input
                      size="mini"
                      v-model="temp.Adress_County"
                      @change="createPostalAddress"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="居住地址">
                    <el-input size="mini" v-model="temp.PostalAddress"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="联系地址（省）">
                    <el-input size="mini" v-model="temp.L_Province" @change="createL_Adress"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系地址（市）">
                    <el-input size="mini" v-model="temp.L_City" @change="createL_Adress"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系地址（区县）">
                    <el-input size="mini" v-model="temp.L_County" @change="createL_Adress"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="联系地址">
                    <el-input size="mini" v-model="temp.L_Adress"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="境外人员信息">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否境外人员">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsAbroad">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="姓名（中文）">
                    <el-input size="mini" v-model="temp.BroadName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="境内有无住所">
                    <el-select size="mini" style="width:100%;" v-model="temp.IsLive">
                      <el-option
                        v-for="(item,key) in selectOptions"
                        :key="key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="首次入境时间">
                    <el-date-picker
                      v-model="temp.FirstEntryTime"
                      type="date"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="本年入境时间">
                    <el-date-picker
                      v-model="temp.ThisYearEntryTime"
                      type="date"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预计离境时间">
                    <el-date-picker
                      v-model="temp.EstimatedDepartureTime"
                      type="date"
                      placeholder="请选择日期"
                      size="mini"
                      style="width:100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="联系地址（省）">
                    <el-input size="mini" v-model="temp.S_Province" @change="createS_Address"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系地址（市）">
                    <el-input size="mini" v-model="temp.S_City" @change="createS_Address"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系地址（区县）">
                    <el-input size="mini" v-model="temp.S_County" @change="createS_Address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="联系地址（详细）">
                    <el-input size="mini" v-model="temp.S_Address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="出生地">
                    <el-input size="mini" v-model="temp.BirthPlace"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="支付地">
                    <el-input size="mini" v-model="temp.PayPlace"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="境外支付地">
                    <el-input size="mini" v-model="temp.OtherPayPlace"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="境内职务">
                    <el-input size="mini" v-model="temp.ChinaPost"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="境外职务">
                    <el-input size="mini" v-model="temp.UnChinaPost"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任职期限">
                    <el-input size="mini" v-model="temp.OfficeTime"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="境外纳税人识别号">
                    <el-input size="mini" v-model="temp.TaxpayersNumber"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <div class="button">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button type="danger" @click="showed=false">取消</el-button>
          </div>
        </el-form>
      </el-card>
    </el-dialog>

    <el-dialog :visible.sync="showUpload">
      <el-card class="box-card">
        <div class="filter-container">
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
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >确认导入</el-button>
          </el-upload>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>



<script>
import { getToken } from "@/frame_src/utils/auth";
import { Treeselect, LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { fetchOrgList } from "@/frame_src/api/org";
import {
  fetchTaxPlayerInfo,
  createTaxPlayerInfo,
  delTaxPlayerInfo,
  editTaxPlayerInfo,
  getAllOptions,
  fetchTaxOrgNodeList,
  uploadTaxPayerInfo
} from "@/frame_src/api/taxPlayerinfo";
import { parseTime } from "@/frame_src/utils";
var _self;
export default {
  name: "TaxpayerManager",
  data() {
    const validateIdNumber = (rule, value, callback) => {
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (this.temp.IdType === "SFZ") {
        if (!reg.test(value)) {
          return callback(new Error("身份证格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateNULL = (rule, value, callback) => {
      if (this.temp.IsDisability != 0) {
        if (value === null || value === "") {
          return callback(new Error("此项不能为空！"));
        } else {
          return callback();
        }
      } else {
        callback();
      }
    };
    const validateNULL1 = (rule, value, callback) => {
      if (this.temp.WorkerStatus === "0") {
        if (value === null || value === "") {
          return callback(new Error("此项不能为空！"));
        } else {
          return callback();
        }
      } else {
        callback();
      }
    };
    const validatePerInvestment = (rule, value, callback) => {
      if (this.temp.Investment) {
        if (value === null || value === "") {
          return callback(new Error("此项不能为空！"));
        } else {
          if (value > 0 && value <= 100) {
            return callback();
          } else {
            return callback(new Error("请输入正确的数值！"));
          }
        }
      } else {
        callback();
      }
    };
    return {
      listloading:true,
      showUpload: false,
      limitNum: 1,
      urldownload1: process.env.BASE_API + "/ExcelModel/纳税人信息表.xls",
      urlUpload: process.env.BASE_API + "/TaxPlayerInfo/ValidateTaxPayerInfo",
      people: [],
      tableKey: 0,
      showed: false,
      title: "提示",
      temp: {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgName: "",
        S_OrgCode: null,
        WorkerNumber: "",
        WorkerName: "",
        IdType: "",
        IdNumber: "",
        Nationality: "",
        NationalityId: "",
        Sex: "",
        BirthDate: "",
        WorkerStatus: "",
        WorkerStatusId: "",
        IsEmployee: 1,
        Tel: "",
        EmployeeDate: "",
        IsDisability: 0,
        Education: "",
        Occupation: "",
        WorkPost: "",
        DisabilityNo: "",
        IsLieShu: 0,
        LiShuZH: "",
        IsAlone: "",
        Email: "",
        BankName: "",
        BankNumber: "",
        IsSpecialIndustry: "",
        PostalAddress: "",
        Domicile: "",
        Remark: "",
        IsWorking: "",
        QuitDate: "",
        IsShareholder: 0,
        Investment: "",
        Province: "",
        City: "",
        County: "",
        Adress_Province: "",
        Adress_City: "",
        Adress_County: "",
        IsAbroad: 0,
        BroadName: "",
        IsLive: "",
        BirthPlace: "",
        FirstEntryTime: "",
        ThisYearEntryTime: "",
        EstimatedDepartureTime: "",
        S_Province: "",
        S_City: "",
        S_County: "",
        S_Address: "",
        PayPlace: "",
        OtherPayPlace: "",
        ChinaPost: "",
        UnChinaPost: "",
        OfficeTime: "",
        TaxpayersNumber: "",
        JobType: "",
        OtherIdType: "",
        OtherIdNumber: "",
        L_Province: "",
        L_City: "",
        L_County: "",
        L_Adress: "",
        PerInvestment: ""
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 1,
      searchTemp: {
        limit: 10,
        page: 1,
        S_OrgCode: "",
        WorkerNumber: "",
        WorkerName: "",
        IdNumber: "",
        Education: "",
        Occupation: "",
        WorkPost: "",
        IsDisability: ""
      },
      orgTemp: {
        S_OrgCode: ""
      },
      treeData: [],
      normalizer(node) {
        return {
          id: node.orgCode,
          label: node.orgShortName,
          children: node.children
        };
      },
      selectOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      selectOptions1: [
        {
          value: 0,
          label: "非正常"
        },
        {
          value: 1,
          label: "正常"
        }
      ],
      selectOptions2: [
        {
          value: "0",
          label: "非正常"
        },
        {
          value: "1",
          label: "正常"
        }
      ],
      selectSex: [
        {
          value: 0,
          label: "女性"
        },
        {
          value: 1,
          label: "男性"
        }
      ],
      nationOptions: [],
      IdTypeOptions: [],
      educationOptions: [],
      IdtypeOptions: [],
      jobOptions: [],
      workPostOptions: [],
      jopTypeOptions: [],
      otherIdTypeOptions: [],
      filedata: {
        // orgCode: this.$store.state.user.orgCode,
        // dateMonth: this.$store.state.user.sysTime,
        userId: this.$store.state.user.userId
        // orgName: this.$store.state.user.orgName
      },
      fileList: [],
      rules: {
        S_OrgCode: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        WorkerNumber: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        WorkerName: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        IdType: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        IdNumber: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          },
          {
            validator: validateIdNumber,
            trigger: "change"
          }
        ],
        Nationality: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        Sex: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        BirthDate: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        WorkerStatus: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        IsEmployee: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        Tel: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        EmployeeDate: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        IsDisability: [
          {
            required: true,
            message: "此项不能为空！",
            trigger: "change"
          }
        ],
        DisabilityNo: [
          {
            validator: validateNULL,
            trigger: "change"
          }
        ],
        QuitDate: [
          {
            validator: validateNULL1,
            trigger: "change"
          }
        ],
        JobType: [
          {
            required: true,
            trigger: "change",
            message: "此项不能为空！"
          }
        ],
        PerInvestment: [
          {
            validator: validatePerInvestment,
            trigger: "change"
          }
        ]
      },
      activeNames: ["1"]
    };
  },
  methods: {
    reset() {
      this.temp = {
        S_Id: "",
        S_CreateDate: "",
        S_CreateBy: this.$store.state.user.userId,
        S_UpdateBy: this.$store.state.user.userId,
        S_UpdateDate: "",
        S_OrgName: "",
        S_OrgCode: null,
        WorkerNumber: "",
        WorkerName: "",
        IdType: "",
        IdNumber: "",
        Nationality: "",
        NationalityId: "",
        Sex: "",
        BirthDate: "",
        WorkerStatus: "",
        WorkerStatusId: "",
        IsEmployee: 1,
        Tel: "",
        EmployeeDate: "",
        IsDisability: 0,
        Education: "",
        Occupation: "",
        WorkPost: "",
        DisabilityNo: "",
        IsLieShu: 0,
        LiShuZH: "",
        IsAlone: "",
        Email: "",
        BankName: "",
        BankNumber: "",
        IsSpecialIndustry: "",
        PostalAddress: "",
        Domicile: "",
        Remark: "",
        IsWorking: "",
        QuitDate: "",
        IsShareholder: 0,
        Investment: "",
        Province: "",
        City: "",
        County: "",
        Adress_Province: "",
        Adress_City: "",
        Adress_County: "",
        IsAbroad: 0,
        BroadName: "",
        IsLive: "",
        BirthPlace: "",
        FirstEntryTime: "",
        ThisYearEntryTime: "",
        EstimatedDepartureTime: "",
        S_Province: "",
        S_City: "",
        S_County: "",
        S_Address: "",
        PayPlace: "",
        OtherPayPlace: "",
        ChinaPost: "",
        UnChinaPost: "",
        OfficeTime: "",
        TaxpayersNumber: "",
        JobType: "",
        OtherIdType: "",
        OtherIdNumber: "",
        L_Province: "",
        L_City: "",
        L_County: "",
        L_Adress: "",
        PerInvestment: ""
      };
    },
    getnode(node, instanceId) {
      this.temp.S_OrgName = node.orgName;
    },
    getID(data) {
      console.log(data);
    },
    createDomicile() {
      this.temp.Domicile =
        this.temp.Province + this.temp.City + this.temp.County;
    },
    createPostalAddress() {
      this.temp.PostalAddress =
        this.temp.Adress_Province +
        this.temp.Adress_City +
        this.temp.Adress_County;
    },
    createS_Address() {
      this.temp.S_Address =
        this.temp.S_Province + this.temp.S_City + this.temp.S_County;
    },
    createL_Adress() {
      this.temp.L_Adress =
        this.temp.L_Province + this.temp.L_City + this.temp.L_County;
    },
    edit(data) {
      this.title = "修改";
      this.temp = Object.assign({}, data);
      this.temp.IsEmployee = 1;
      this.showed = true;
      this.$nextTick(() => {
        this.$refs["temp"].clearValidate();
      });
    },
    del(data) {
      this.$confirm("您确定要删除本条信息吗?", "用户确认", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃"
      })
        .then(() => {
          delTaxPlayerInfo(data).then(response => {
            if (response.data.code === 2000) {
              this.$notify({
                position: "bottom-right",
                title: "成功",
                message: response.data.message,
                type: "success",
                duration: 2000
              });
              this.getTaxInfo();
            }
          });
        })
        .catch(() => {
          this.$notify({
            position: "bottom-right",
            title: "失败",
            message: response.data.message,
            type: "success",
            duration: 2000
          });
        });
    },
    createData() {
      this.title = "创建";
      this.showed = true;
      this.reset();
      if (this.$refs["temp"] !== undefined) {
        this.$refs["temp"].resetFields();
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
      if (rowIndex === 0) {
        return "el-button--primary is-active"; // 'warning-row'
      } // 'el-button--primary is-plain'// 'warning-row'
      return "";
    },
    submit() {
      if (this.title === "创建") {
        this.$refs["temp"].validate(valid => {
          if (valid) {
            createTaxPlayerInfo(this.temp).then(response => {
              if (response.data.code === 2000) {
                this.$notify({
                  position: "bottom-right",
                  title: "成功",
                  message: response.data.message,
                  type: "success",
                  duration: 2000
                });
                this.showed = false;
                this.getTaxInfo();
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
          }
        });
      } else if (this.title === "修改") {
        this.$refs["temp"].validate(valid => {
          if (valid) {
            editTaxPlayerInfo(this.temp).then(response => {
              if (response.data.code === 2000) {
                this.$notify({
                  position: "bottom-right",
                  title: "成功",
                  message: response.data.message,
                  type: "success",
                  duration: 2000
                });
                this.showed = false;
                this.getTaxInfo();
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
          }
        });
      }
    },
    handleSizeChange(val) {
      this.searchTemp.limit = val;
      this.getTaxInfo();
    },
    handleCurrentChange(val) {
      this.searchTemp.page = val;
      this.getTaxInfo();
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
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children == null) {
          parentNode.children = undefined;
          callback();
        }
      }
    },
    getTaxInfo() {
      this.listloading=true;
      fetchTaxPlayerInfo(this.searchTemp).then(response => {
        if (response.data.code === 2000) {
          this.people = response.data.items;
          this.total = response.data.total;
          this.listloading = false;
        } else {
          this.listloading = false;
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
      getAllOptions() {
      getAllOptions().then(response => {
        if (response.data.code === 2000) {
          this.nationOptions = response.data.nationally;
          this.educationOptions = response.data.education;
          this.jobOptions = response.data.job;
          this.IdtypeOptions = response.data.idtype;
          this.workPostOptions = response.data.workpost;
          this.jopTypeOptions = response.data.jobtype;
          this.otherIdTypeOptions = response.data.otheridtype;
        }
      });
    },
    getCode() {
      this.searchTemp.S_OrgCode = this.$store.state.user.orgCode;
      this.orgTemp.S_OrgCode = this.$store.state.user.orgCode;
      this.fetchTaxOrgNodeList();
      this.getTaxInfo();
    },
    fetchTaxOrgNodeList() {
      fetchTaxOrgNodeList(this.orgTemp).then(response => {
        this.treeData = response.data;
      });
    },
    //upload
    submitUpload() {
      this.$refs.upload.submit();
    },

    handleSuccess(res, file, fileList) {
      var message = res.message;
      var title = "失败";
      var type = "error";
      if (res.code === 2000) {
        let fd = new FormData();
        fd.append("filePath", res.item); //传文件
        // fd.append("orgCode", this.$store.state.user.orgCode); //传其他参数
        // fd.append("orgName", this.$store.state.user.orgName); //传其他参数
        // fd.append("dateMonth", this.$store.state.user.sysTime); //传其他参数
        fd.append("userId", this.$store.state.user.userId); //传其他参数
        return new Promise((resolve, reject) => {
          uploadTaxPayerInfo(fd)
            .then(response => {
              if (response.data.code === 2000) {
                message = "导入成功！";
                title = "成功";
                type = "success";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });

                this.showUpload = false;
                this.getTaxInfo();
              } else {
                message = response.data.message;
                title = "失败";
                type = "error";
                this.$notify({
                  position: "bottom-right",
                  title: title,
                  message: message,
                  type: type,
                  duration: 5000
                });

                this.showUpload = false;
                this.getTaxInfo();
              }
            })
            .catch(error => {});
        });
      } else {
        this.$notify({
          position: "bottom-right",
          title: title,
          message: message,
          type: type,
          duration: 5000
        });
      }

      this.showUpload = false;
      this.getTaxInfo();
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitNum}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleImport() {
      this.showUpload = true;
      this.fileList = [];
    },
    download() {
      window.open(this.urldownload1);
    }
  },
  mounted() {
    this.getCode();
    this.getAllOptions();
  },
  filters: {
    parseTime,
    formatSex(val) {
      if (val === 1) {
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
  components: {
    Treeselect
  }
};
</script>


<style lang="scss" >
#TaxpayerManager {
  .topSearh {
    margin-bottom: 15px;
  }
  .page {
    text-align: center;
  }
  .button {
    text-align: center;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .el-row {
    margin-top: 10px;
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
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__error {
    padding-top: 0px;
  }
  a.astyle {
    color: #333;
    text-decoration: none;
  }
  a.astyle:hover {
    color: #cc3300;
    text-decoration: underline;
  }
}
</style>

