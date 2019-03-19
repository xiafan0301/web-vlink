<template>
  <div class="custom_group">
    <div class="custom_group_left">
      <div class="search_box">
        <el-input  placeholder="搜索组" size="small" style="width: 220px;">
          <i
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="handleIconClick">
        </i>
        </el-input>
      </div>
      <div class="add_btn">
        <i class="vl_icon vl_icon_manage_4" @click="skipAddGroupPage"></i>
        <span>新增分组</span>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li class="temp_active">
              <span>重点场所</span>
              <i class="operation_btn del_btn vl_icon vl_icon_manage_8"></i>
              <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
            </li>
            <li>
              <span>重点场所</span>
              <i class="operation_btn del_btn vl_icon vl_icon_manage_8"></i>
              <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
            </li>
            <li>
              <span>重点场所</span>
              <i class="operation_btn del_btn vl_icon vl_icon_manage_8"></i>
              <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="custom_group_right">
      <div class="no_data">
        <i class="vl_icon_manage_9 vl_icon"></i>
      </div>
      <div class="detail_info_right">
        <ul class="tab_ul clearfix">
          <li class="tab_ul_li" :class="[arrowActive === 1 ? 'active_tab_li' : '']" @click="changeTab(1)">摄像头</li>
          <li class="tab_ul_li" :class="[arrowActive === 2 ? 'active_tab_li' : '']" @click="changeTab(2)">卡口</li>
        </ul>
        <div class="data_list">
          <p>广场监控点1-300</p>
          <p>广场监控点1-300</p>
          <p>广场监控点1-300</p>
          <p>广场监控点1-300</p>
          <p>广场监控点1-300</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arrowActive: 1, // tab选中
      groupData: [
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        },
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        },
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        }
      ], // 所有的组名数据
    }
  },
  methods: {
    handleIconClick () {},
    // 跳至新增分组页面
    skipAddGroupPage () {
      this.$router.push({name: 'add_group'});
    },
    // change  tab
    changeTab (val) {
      this.arrowActive = val;
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_group {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .custom_group_left {
    height: 100%;
    width: 260px;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px 15px 10px;
      /deep/ .el-input--small .el-input__inner {
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .add_btn {
      padding: 0 15px 10px;
      display: flex;
      color: #333333;
      align-items: center;
      i {
        cursor: pointer;
      }
      > span {
        margin-left: 5px;
      }
    }
    .content_box {
      height: calc(100% - 120px);
      .temp_detail_info {
        height: 100%;
        border-right: 1px solid #f2f2f2;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          padding: 0 30px 0;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &:hover {
              background-color: #E0F2FF;
              .operation_btn {
                display: block;
              }
            }
            &.temp_active {
              background-color: #E0F2FF;
              i, span {
                color: #0C70F8;
              }
            }
        }
      }
    }
  }
  .custom_group_right {
    width: calc(100% - 260px);
    .no_data {
      display: none;
      width: 186px;
      height: 196px;
      margin-left: 40%;
      margin-top: 15%;
    }
    .detail_info_right {
      width: 100%;
      .tab_ul {
        clear: both;
        padding: 10px 10px 0;
        border-bottom: 1px solid #f2f2f2;
        .tab_ul_li {
          width: auto;
          float: left;
          padding: 0 15px 10px;
          cursor: pointer;
          &.active_tab_li {
            color: #0C70F8;
            border-bottom: 2px solid #0C70F8;
          }
        }
      }
      .data_list {
        p {
          padding: 10px 20px 0;
          color: #666666;
        }
      }
    }
  }
}
</style>

