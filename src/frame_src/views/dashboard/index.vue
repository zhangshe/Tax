<template>
  <div class="app-container calendar-list-container">
    <div class="containerTop">
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="11">
          <el-card>
            <div slot="header" class="header">
              <el-row>
                <el-col :span="2">
                  <img src="../../../frame_src/imgs/notice.png" alt>
                </el-col>
                <el-col :span="14">
                  <span>通知公告</span>
                </el-col>
                <el-col :span="8">
                  <el-button size="mini" type="primary" style="float:right;" @click="getMore">查看更多</el-button>
                </el-col>
              </el-row>
            </div>
            <el-table :data="noticeList" :show-header="false" size="mini">
              <el-table-column show-overflow-tooltip>
                <template slot-scope="scope">
                  <span
                    class="noticetitle"
                    @click="goToContent(scope.row)"
                  >{{scope.row.NOTICE_TITLE}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column  prop="writter" align="center"></el-table-column> -->
              <el-table-column align="center" width="150px">
                <template slot-scope="scope">
                  <span class="noticetitle">{{scope.row.NOTICE_DATETIME|parseTime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="11">
          <el-card>
            <div slot="header" class="header">
              <el-row>
                <el-col :span="2">
                  <img src="../../../frame_src/imgs/notice.png" alt>
                </el-col>
                <el-col :span="22">
                  <span>纳税人数统计图</span>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="pic">
              <img src="../../../frame_src/imgs/pic1.png" alt>
            </div>-->
            <div id="pic1" class="pic1"></div>
          </el-card>
        </el-col>
        <el-col :xs="0" :sm="0" :md="0" :lg="0" :xl="1"></el-col>
      </el-row>
    </div>

    <div class="containerBottom">
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="11">
          <el-card>
            <div slot="header" class="header">
              <el-row>
                <el-col :span="2">
                  <img src="../../../frame_src/imgs/notice.png" alt class="pic">
                </el-col>
                <el-col :span="22">
                  <span>每月纳税图</span>
                </el-col>
              </el-row>
            </div>
            <div class="pic1" id="pic2"></div>
          </el-card>
        </el-col>

        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="11">
          <el-card>
            <div slot="header" class="header">
              <el-row>
                <el-col :span="2">
                  <img src="../../../frame_src/imgs/notice.png" alt>
                </el-col>
                <el-col :span="22">
                  <span>纳税分档分析</span>
                </el-col>
              </el-row>
            </div>
            <div class="pic1" id="pic3"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import {
  getMonthData,
  getNotice,
  getLv,
  CompareData,
  getNoticeDetail
} from "@/frame_src/api/Home";
import { parseTime } from "@/frame_src/utils";
// import editorDashboard from './editor'

export default {
  name: "dashboard",
  // components: { adminDashboard, editorDashboard },
  components: { adminDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
      noticeList: [],
      detailList: [],
      temp: {
        orgcode: this.$store.state.user.orgCode,
        systime: this.$store.state.user.sysTime,
        limit: 6,
        page: 1
      },
      listQuery: {
        limit: 10,
        page: 1,
        id: null
      },
      baseurl: process.env.BASE_API,
      detailVisible: false,

      option: {
        title: {
          //text: "纳税人员统计图"
          //subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
          data: [],
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: [],
            animation: false
          },
          {
            type: "bar",
            barMaxWidth:30,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: []
          }
        ]
      },

      option2: {
        //归档图options
        title: {
          //text: "归档图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: []
      },

      option1: {
        color: ["#6495ED", "#6A5ACD", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: []
      }
    };
  },
  methods: {
    drawline() {
      ///绘制echarts 柱状图
      let mycharts = this.$echarts.init(document.getElementById("pic1"));
      mycharts.setOption(this.option);
    },
    drawline1() {
      let mycharts1 = this.$echarts.init(document.getElementById("pic2"));
      mycharts1.setOption(this.option1);
    },
    drawline2() {
      //绘制echarts 折线图
      let mycharts2 = this.$echarts.init(document.getElementById("pic3"));
      mycharts2.setOption(this.option2);
    },
    getMonthData() {
      getMonthData(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.option.xAxis.data = Object.keys(response.data.items[0]);
          this.option.series[1].data = Object.values(response.data.items[0]);
          console.log(this.option)
          this.drawline();
        }
      });
    },
    getLv() {
      getLv(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.changeLvData(response.data.items);
          this.drawline2();
        }
      });
    },
    // changeLvData(data) {
    //   let na = "";
    //   let arr = [];
    //   let Xop = [];
    //   let SL = [];
    //   data.forEach(item => {
    //     na = Object.values(item)[0];
    //     arr = Object.values(item);
    //     arr.splice(0, 1);
    //     this.option2.series.push({
    //       name: na,
    //       type: "line",
    //       areaStyle: {},
    //       data: arr
    //     });
    //     Xop = Object.keys(data[0]);
    //     Xop.slice(0, 1);
    //     this.option2.xAxis.push({
    //       type: "category",
    //       boundaryGap: false,
    //       data: Xop
    //     });
    //   });
    // },
    changeLvData(data) {
      let na = "";
      let Xlist = [];
      let arr = [];
      let namelist = [];
      data.forEach(item => {
        na = Object.values(item)[0];
        na += "%";
        namelist.push(na);
        arr = Object.values(item);
        arr.splice(0, 1);
        this.option2.series.push({
          name: na,
          type: "line",
          data: arr,
          areaStyle: { normal: {} }
        });
      });
      Xlist = Object.keys(data[0]);
      Xlist.splice(0, 1);
      this.option2.xAxis.push({
        type: "category",
        boundaryGap: false,
        data: Xlist
      });
      this.option2.legend.data = namelist;
    },
    CompareData() {
      CompareData(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.changeCompareData(response.data.items);
          this.drawline1();
        }
      });
    },
    changeCompareData(data) {
      let arr1 = [];
      let arr2 = [];
      let mon = [];
      let temp = "";
      data.forEach(item => {
        (temp = item.mm + "月"), mon.push(temp);
        arr1.push(item.KS);
        arr2.push(item.DJ);
      });
      this.option1.series.push({
        name: "预缴",
        type: "bar",
        barGap: 0,
        label: "预缴",
        data: arr1,
        barMaxWidth: 30
      });
      this.option1.series.push({
        name: "代缴",
        type: "bar",
        barGap: 0,
        label: "代缴",
        data: arr2,
        barMaxWidth: 35
      });
      this.option1.legend.data = ["预缴", "代缴"];
      this.option1.xAxis.push({
        type: "category",
        axisTick: { show: false },
        data: mon
      });
    },
    getNotice() {
      getNotice(this.temp).then(response => {
        if (response.data.code === 2000) {
          this.noticeList = response.data.items;
        }
      });
    },
    goToContent(data) {
      // let id = data.NOTICE_ID.toString();
      // this.$router.push({ path: "noticeViews/noticecontent/" + id });
      this.detailVisible = true;
      this.temp = Object.assign({}, data);
      this.listQuery.id = data.NOTICE_ID;
      this.getNoticeDetail();
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
    getMore() {
      this.$router.push({ path: "noticeViews/noticelist/" });
    }
  },
  created() {},
  mounted() {
    this.getMonthData();
    this.getLv();
    this.CompareData();
    this.getNotice();
  },
  computed: {
    ...mapGetters(["roles"])
  },
  fliters: {
    parseTime
  }
  /* created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  } */
};
</script>


<style lang="scss" scoped>
.app-container {
  .containerTop {
    .header {
      font-weight: bold;
      font-size: 20px;
      max-height: 30px;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .noticetitle： {
      font-size: 20px;
    }
    .noticetitle:hover {
      text-decoration: underline;
      color: red;
      cursor: pointer;
    }
  }
  .containerBottom {
    margin-top: 20px;
    .header {
      font-weight: bold;
      font-size: 20px;
      max-height: 30px;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .noticetitle： {
      font-size: 20px;
    }
    .noticetitle:hover {
      text-decoration: underline;
      color: red;
      cursor: pointer;
    }
  }
  .pic1 {
    height: 250px;
    width: 100%;
  }
}
.el-card {
  font-family: "微软雅黑";
  min-height: 360px;
}
</style>

