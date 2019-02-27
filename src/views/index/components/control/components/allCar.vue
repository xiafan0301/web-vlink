<template>
<!-- 全部车像列表 -->
  <div class="set_list">
    <div class="member_title">
      <div>
        <div><span class="vl_f_333">全部车辆</span></div>
        <div><el-checkbox v-model="allChecked" @click.native="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
      </div>
      <div>
        <el-button @click="judgeIsSelectedCopy">复制到组</el-button>
        <el-button @click="judgeIsSelectedRemove">删除人像</el-button>
        <el-collapse-transition>
          <ul class="group_copy" v-show="isShowGroupCopy">
            <li @click="copyIsGroup">系统默认</li>
            <li>重点青少年</li>
            <li>拐卖妇女</li>
            <li>失踪儿童</li>
            <li class="group_copy_add" @click="popGroupDialog"><i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span></li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
    <div class="list_box">
      <div class="list_info" v-for="item in memberList" :key="item.id">
        <div class="list_img"><img src="//via.placeholder.com/200x200" alt="" style="width: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @click.native="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span>湘A12345</span><span>小型汽车号牌</span>
          </div>
          <div class="data_list">
            <span>大客车</span><span>白</span>
          </div>
          <div class="data_list">
            <span>蓝底黑字</span>
            <span>组2</span>
            <div class="more">
              <span @mouseenter="showMoreId = item.id" @mouseleave="showMoreId = null">更多组</span>
              <template v-if="showMoreId === item.id">
                <div>
                  <span>失踪儿童</span>
                  <span>拐卖儿童</span>
                </div>
                <i></i>
              </template>
            </div>
          </div>
          <div class="data_list">
            <span>环保路十字路口一小孩从电动车上掉下，被宝马车方救起送往天心区公安局。</span>
          </div>
        </div>
      </div>
      <div style="width: 100%;">
        <el-pagination
          style="text-align: center;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
    <!-- 新增组 -->
    <div is="groupDialog" operateType="1" ref="groupDialog"></div>
    <!-- 删除车像 -->
    <div class="del_car_dialog">
      <el-dialog
        :visible.sync="delCarDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh"
        title="删除提示">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">是否删除布控库中已选的{{allIsChecked}}条对象数据？</h1>
        <div slot="footer">
          <el-button @click="delCarDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import groupDialog from './groupDialog.vue';
export default {
  components: {groupDialog},
  data () {
    return {
      // 翻页数据
      currentPage: 1,
      pageSzie: 10,
      pageNum: 1,
      allChecked: false,
      memberList: [
        {isChecked: false, id: '00001'},
        {isChecked: false, id: '00002'},
        {isChecked: false, id: '00003'},
        {isChecked: false, id: '00004'},
        {isChecked: false, id: '00005'},
        {isChecked: false, id: '00006'},
        {isChecked: false, id: '00007'}
      ],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
      // 弹出框参数
      delCarDialog: false,
      loadingBtn: false,
    }
  },
  computed: {
    allIsChecked () {
      return this.memberList.filter(f => f.isChecked).length;
    }
  },
  methods: {
    popGroupDialog () {
      this.$refs['groupDialog'].reset();
    },
    // 单选
    operateRadio () {
      console.log(this.memberList)
      this.$nextTick(() => {
        this.allChecked = !this.memberList.some(s => s.isChecked === false);
      })
    },
    // 全选
    operateAllChecked () {
      this.$nextTick(() => {
        if (!this.allChecked) {
          console.log(1111111)
          this.memberList.map(m => {
            m.isChecked = false;
          })
          console.log(this.memberList)
        } else {
          this.memberList.map(m => {
            m.isChecked = true;
          })
        }
      })
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    // 判断是否选择了复制对象
    judgeIsSelectedCopy () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请选择复制对象!');
      } else {
        this.isShowGroupCopy = !this.isShowGroupCopy;
      }
    },
    // 判断是否选择了移出对象
    judgeIsSelectedRemove () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请选择删除对象!');
      } else {
        this.delCarDialog = true;
      }
    },
    // 复制到自定义组
    copyIsGroup () {
      this.isShowGroupCopy = !this.isShowGroupCopy;
    },
  }
}
</script>
<style lang="scss" scoped>

</style>


