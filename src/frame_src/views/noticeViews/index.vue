<template>
  <div id="notice" class="notice">
    <el-row type="flex" :gutter="20">
      <el-col :span="1"></el-col>
      <el-col :span="22">
        <div class="noticecard">
          <!-- <el-table :data="noticeList" style="width: 100%" @row-click="goToContent">
                        <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="writter" width="120px" label="发布人"></el-table-column>
                        <el-table-column prop="time" label="日期" width="120px"></el-table-column>
          </el-table>-->
          <el-card>
            <el-row>
              <!-- <el-col :span="12">
                <div class="breadcrumb">
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item>首页</el-breadcrumb-item>
                    <el-breadcrumb-item>通知列表</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </el-col>-->
              <el-col :span="21">
                  <div class="mainTitle">公告列表</div>
              </el-col>
              <!-- <el-col :span="3">
                <div class="backbutton">
                  <a href="#" @click="goback" title="后退" class="changePlatform">
                    <img style="margin-top:2px;" src="../../../frame_src/imgs/back.png">
                  </a>
                </div>
              </el-col> -->
            </el-row>

            <el-row>
              <el-col>
                <!-- <el-card v-for="(item,key) in  noticeList" :key="key" @click.native="goToContent(item)">
                                    <el-row>
                                        <el-col :span="24">
                                            <div class="header">
                                                {{item.title}}
                                                <div class="foot">
                                                    <img src="../../../app_src/imgs/time.png" title="发表日期">
                                                    {{item.time}}
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                </el-card>-->
                <el-table :data="noticeList" size="mini" :show-header="false">
                  <el-table-column>
                    <template slot-scope="scope">
                      <div class="header" @click="goToContent(scope.row)">{{scope.row.NOTICE_TITLE}}</div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="writter" width="120px" align="center"></el-table-column> -->
                  <el-table-column width="120px">
                    <template slot-scope="scope">
                      <img src="../../../frame_src/imgs/time.png" title="发表日期">
                      {{scope.row.NOTICE_DATETIME|formatTime}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            <div class="page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 15, 20, 25]"
                :page-size="100"
                :current-page="currentPage1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="detailVisible" title="详情" width="800px">
      <el-card>
        <el-form ref="dataForm" :model="temp">
          <el-row type="flex">
            <el-col :span="2"></el-col>
            <el-col :span="20">
              <div class="noticecontent">
                <div slot="header" class="header" style="text-align:center;">
                  <span style="font-size:20px;font-weight:bold;">{{temp.NOTICE_TITLE}}</span>
                </div>
                <div class="content">
                  <el-row>
                    <el-col :span="24">
                      <p v-html="temp.NOTICE_CONTENT"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row v-if="detailList!=null">
                  <el-col :span="24">附件：
                    <div style="margin-left:25px;" v-for="(item,key) in detailList" :key="key">
                      <el-button
                        @click="downLoad(item)"
                        type="primary"
                        size="text"
                      >{{item.FILE_NAME}}</el-button>
                    </div>
                    <!-- <a target="blank" :href="baseurl+item.FILE_URL" v-for="(item,key) in detailList" :key="key">{{item.FILE_NAME}}</a> -->
                  </el-col>
                </el-row>
                <div class="foot">
                  <el-row>
                    <el-col :span="24">作者：{{temp.CREATER}} 发布时间：{{temp.CREATE_DATE | parseTime}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>


<script>
import { getNotice, getNoticeDetail } from "@/frame_src/api/Home";
import { parseTime } from "@/frame_src/utils";
export default {
  data() {
    return {
      baseurl: process.env.BASE_API,
      detailVisible: false,
      noticeList: [],
      detailList: [],
      total: 1,
      currentPage1: 1,
      listQuery: {
        limit: 10,
        page: 1,
        id: null
      },
      temp: {
        NOTICE_ID: "",
        NOTICE_CODE: "",
        NOTICE_TITLE: "",
        NOTICE_CONTENT: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: "",
        NOTICE_DATETIME: "",
        CREATER: "",
        NOTICE_ORGID: "",
        NOTICE_ORGNAME: ""
      }
    };
  },
  methods: {
    goToContent(data) {
      this.detailVisible = true;
      this.temp = Object.assign({}, data);
      this.listQuery.id = data.NOTICE_ID;
      this.getNoticeDetail();
    },
    getNoticeList() {
      getNotice(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.total = response.data.total;
          this.noticeList = response.data.items;
          //   for (let i = 0; i < response.data.items.length; i++) {
          //     let longtime = response.data.items[i].CREATE_DATE;
          //     let shorttime = longtime.substring(0, 10);
          //     this.noticeList.push({
          //       title: response.data.items[i].NOTICE_TITLE,
          //       date: response.data.items[i].NOTICE_DATETIME,
          //       id: response.data.items[i].NOTICE_ID,
          //       content: response.data.items[i].NOTICE_CONTENT,
          //       writter: response.data.items[i].CREATER,
          //       time: shorttime
          //     });
          //}
        } else {
          // this.$notify({
          //     position: "bottom-right",
          //     title: "失败",
          //     message: response.data.message,
          //     type: "error",
          //     duration: 2000
          // });
        }
      });
    },
    getNoticeDetail() {
      getNoticeDetail(this.listQuery).then(response => {
        if (response.data.code === 2000) {
          this.detailList = response.data.items;
        }
      });
    },
    downLoad(data) {
      window.open(this.baseurl + data.FILE_URL);
    },
    goback() {
      this.$router.go(-1);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.noticeList = [];
      this.getNoticeList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.noticeList = [];
      this.getNoticeList();
    }
  },
  mounted() {
    this.getNoticeList();
  },
  filters: {
    formatTime(val) {
      if (val != null) {
        return val.substring(0, 10);
      }
    }
  }
};
</script>


<style lang="scss">
.noticecard {
  min-height: 500px;
  margin-top: 20px;
  img {
    //margin-right: 5px;
    width: 15px;
    height: 15px;
  }
  .header {
    font-size: 16px;
  }
  .header:hover {
    text-decoration: underline;
    color: red;
    cursor: pointer;
  }
  .content {
    padding-left: 20px;
    margin-top: 15px;
    margin-left: 25px;
    margin-right: 20px;
    font-size: 15px;
    line-height: 20px;
    color: rgb(53, 49, 49);
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .mainTitle{
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
  }
  // .foot {
  //     float: right;
  //     font-size: 10px;
  //     color: gray;
  //     img {
  //         width: 15px;
  //         height: 15px;
  //     }
  // }
  .page {
    text-align: center;
  }
  .el-card {
    font-family: "微软雅黑";
  }
  .backbutton {
    float: right;
    margin-bottom: 10px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .breadcrumb {
    margin-top: 20px;
  }
  .noticecontent {
    margin-top: 20px;
    min-height: 500px;
    .header {
      font-size: 25px;
      font-weight: bold;
    }
    .content {
      font-size: 18px;
    }
    .foot {
      float: right;
      font-size: 12px;
      color: gray;
    }
    .back {
      float: right;
    }
    .el-card {
      font-family: "微软雅黑";
    }
  }
}
</style>


