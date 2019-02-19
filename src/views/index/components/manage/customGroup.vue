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
        <i class="vl_icon vl_icon_manage_4" @click="skipTempGrantPage"></i>
        <span>新增分组</span>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul>
            <li>
              <div>
                
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="custom_group_right"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    }
  },
  methods: {
    handleIconClick () {}
  }
}
</script>
<style lang="scss" scoped>
.custom_group {
  background-color: #ffffff;
  height: 100%;
  .custom_group_left {
    height: 100%;
    width: 260px;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px;
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
      padding: 15px;
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
  }
}
</style>

