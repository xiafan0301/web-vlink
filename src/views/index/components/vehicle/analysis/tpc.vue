<template>
  <div class="tpc">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>套牌车分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div>
          <el-input v-model="value1" placeholder="请选择" style="width: 230px">
          </el-input>
        </div>
        <div class="kaishi">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value1"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kaishi">
          <el-button style="width: 110px">重置</el-button>
          <el-button type="primary" style="width: 110px">统计</el-button>
        </div>
      </div>
      <div class="ccrc_content_right">
        <div class="clearfix">
          <div style="padding: 10px 0; float: right">
            <el-button type="primary" style="width: 110px">导出</el-button>
          </div>
        </div>
        <div class="ccrc_content_right_content">
          <div class="ccrc_content_right_table">
            <el-table
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  type="index"
                  width="120px"
                  prop="date"
                  label="序号">
              </el-table-column>
              <el-table-column
                  prop="name"
                  width="100px"
                  label="车牌号码">
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="号牌颜色"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="登记信息"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="套牌记录"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="操作">
                <template slot-scope="scope">
                  <el-button type="text" style="padding: 0" @click="dialogVisible = true">抓拍记录</el-button>
                  <el-button type="text" style="padding: 0">车辆布控</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogVisible" width="870px">
      <div style="display: flex; margin: 0 auto; width: 750px">
        <div style="width: 360px; height: 360px; border: 1px solid red; margin-right: 30px">
          <div class="struc_c_d_qj struc_c_d_img " style="position: relative">
            <span>真车</span>
          </div>
        </div>
        <div style="width: 360px; height: 360px; border: 1px solid red">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      value1: '',
      value2: '',
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>
<style lang="scss">
  html {
    font-size: 100px;
  }
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
  .tpc{
    height: 100%;
    /*.struc_c_d_img {*/
    /*  width: 3.6rem;*/
    /*  height: 3.6rem;*/
    /*  background: #EAEAEA;*/
    /*  position: relative;*/
    /*  img {*/
    /*    width: 100%;*/
    /*    height: auto;*/
    /*    max-height: 100%;*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    bottom: 0;*/
    /*    margin: auto;*/
    /*  }*/
    /*  i {*/
    /*    display: block;*/
    /*    position: absolute;*/
    /*    top: .1rem;*/
    /*    right: .1rem;*/
    /*    line-height: .26rem;*/
    /*    height: .26rem;*/
    /*    background: rgba(255, 255, 255, .8);*/
    /*    border-radius: .13rem;*/
    /*    font-style: normal;*/
    /*    color: #0C70F8;*/
    /*    font-size: 12px;*/
    /*    padding: 0 .1rem;*/
    /*  }*/
    /*}*/
    .struc_c_d_qj {
      margin-right: .3rem;
      &:before {
        display: block;
        content: '';
        position: absolute;
        top: -.5rem;
        left: -.5rem;
        transform: rotate(-45deg);
        border: .5rem solid #0c70f8;
        border-color: transparent transparent #0C70F8;
        z-index: 9;
      }
      span {
        display: block;
        position: absolute;
        top: .1rem;
        left: .1rem;
        width: .6rem;
        height: .6rem;
        text-align: center;
        color: #FFFFFF;
        font-size: .12rem;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
        z-index: 99;
      }
    }
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .ccrc_content{
      display: flex;
      height: calc(100% - 62px);
      .ccrc_content_left{
        height: 100%;
        background-color: white;
        width: 272px;
        padding: 20px;
        box-shadow: 5px 0 10px #E5E7E7;
        .kaishi{
          padding-top: 10px;
        }
        .jiesu{
          padding-top: 10px;
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        padding-top: 0;
        .ccrc_content_right_content{
          min-height: calc(100% - 60px);
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          padding: 20px;
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
  }
</style>