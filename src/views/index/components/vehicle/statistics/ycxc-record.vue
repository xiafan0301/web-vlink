  <template>
    <div class="zpjl_container">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{name: 'vehicle'}">侦查</el-breadcrumb-item>
          <el-breadcrumb-item class="con_back" @click.native="pageType = 1;">夜间行车</el-breadcrumb-item>
          <el-breadcrumb-item>抓拍记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="zpjl_list">
        <div class="list_sort">
          <div><span>时间排序</span><span class="sort_icon"><i class="el-icon-caret-top"></i><i class="el-icon-caret-bottom"></i></span></div>
          <div><span>监控排序</span><span class="sort_icon"><i class="el-icon-caret-top"></i><i class="el-icon-caret-bottom"></i></span></div>
        </div>
        <div class="list_box">
          <div class="list_item" v-for="item in '123123123123123'" :key="item.id">
            <img src="//via.placeholder.com/32x32" alt="">
            <p>2018.-11-12  13:14:15</p>
            <div><span>抓拍设备：</span><span>京广高速收费站京广高速收费站京广高速收费站</span></div>
          </div>
          <el-pagination
            class="pagination"
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        pageSize: 10,
        currentPage: 1
      }
    },
    methods: {
      handleCurrentChange () {}
    }
  }
  </script>
  <style lang="scss" scoped>
  .zpjl_container{
    .zpjl_list{
      width: 100%;
      height: calc(100% - 55px);
      padding: 0 20px 20px 0;
      background: #f7f9f9;
      .list_sort{
        display: flex;
        justify-content: flex-end;
        line-height: 45px;
        > div:nth-child(1){
          margin-right: 70px;
        }
        > div{
          display: flex;
          > span{
            color: #999999;
          }
          .sort_icon{
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 12px 0;
            > i{
              height: 8px;
              cursor: pointer;
              color: #999999;
            }
          }
        }
      }
      .list_box{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        flex-flow: row wrap;
        height: calc(100% - 45px);
        .list_item{
          width: 3.56rem;
          height: 3.2rem;
          padding: .15rem;
          margin-left: .2rem;
          margin-bottom: .2rem;
          background: #fff;
          img{
            width: 3.28rem;
            height: 2.19rem;
          }
          > div > span{
            color: #333;
          }
          > p{
            color: #333;
          }
        }
        .pagination{
          width: 100%;
          text-align: center;
          padding-bottom: 20px;
        }
      }
    }
  }
</style>
  