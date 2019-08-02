<!-- 设备下拉列表 通用组件 -->
<template>
  <div :class="['dev_select', {'rlsjfx': flag === 1, 'all': devIdData && devIdData[0] && devIdData[0].label === '全部设备'}]">
    <el-select
      style="width: 100%;"
      v-model="devIdData"
      multiple
      popper-class="statistics_select_list"
      @remove-tag="removeSeletedDev"
      @click.native="showChange"
      collapse-tags
      placeholder="请选择卡口">
      <el-option :value="devIdData[0]" :label="devIdData[0] && devIdData[0].label"></el-option>
    </el-select>
    <div class="search_item" :style="{'height': isShowSelectList ? '160px' : '0px'}">
      <vue-scroll>
        <el-checkbox style="padding-left: 24px;padding-top: 10px;" v-model="checked" @change="isCheckedAll">全选</el-checkbox>
        <el-tree
          default-expand-all
          :data="treeList"
          class="select_tree"
          ref="selectTree"
          @check-change="changeSeletedStatus"
          show-checkbox
          node-key="label">
        </el-tree>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
import {MapGETmonitorList} from '@/views/index/api/api.map.js';
export default {
  props: ['flag'],
  data () {
    return {
      likeKey: null,
      devIdData: [],
      isShowSelectList: false,
      selObj: {
        selSelectedData1: [],
        selSelectedData2: [],
      },
      checked: false,
      tabIndex: 1, // select 下拉 tab 切换下标
      treeList: [],
      selectNum: null
    }
  },
  created () {
    this.getTreeList();
    let _this = this;
    $(':not(.dev_select)').on('click', function () {
      _this.isShowSelectList = false;
    })
  },
  destroyed () {
    $(':not(.dev_select)').unbind('click');
  },
  methods: {
    isCheckedAll(){
      if (this.checked) {
        //全选
        this.$refs.selectTree.setCheckedNodes(this.treeList);
      }else{
        //取消选中
        this.$refs.selectTree.setCheckedKeys([]);
        this.devIdData = [];
      }
    },
    checkedAll () {
      this.checked = true;
      this.$refs.selectTree.setCheckedNodes(this.treeList);
    },
    getTreeList () {
      let params = {
        areaUid: '431224',
        likeKey: this.likeKey
      }
      MapGETmonitorList(params).then(res => {
        if (res) {
          this.treeList = [res.data];
          this.treeList = this.transformTreeList(this.treeList);//改造成所需要的树结构
          this.selectNum = this.getDevTotal(this.treeList);//获取设备和卡口总数
          this.checked = true;
          this.$nextTick(() => {
            this.isCheckedAll();//  全选
          })
        }
      });
    },
    // 获取设备和卡口总数方法
    getDevTotal (arr) {
      const result = [];
      const func = (_arr) => {
        _arr.forEach(f => {
          if (f.children) {
            func(f.children);
          } else {
            result.push(f);
          }
        })
      }
      func(arr);
      return result.length;
    },
    // 改造成所需要的数结构方法
    transformTreeList (arry, result = []) {
      arry.forEach(f => {
        if (f.areaTreeList.length > 0) {
          let child = {
            id: f.areaId,
            label: f.areaName,
            children: []
          }
          result.push(child);
          this.transformTreeList(f.areaTreeList, child.children);
        } else {
          let child = {
            id: f.areaId,
            label: f.areaName,
            children: [...f.bayonetList.map(b => {
              return {
                id: b.uid,
                label: b.bayonetName,
                type: 2
              }
            }),...f.deviceBasicList.map(d => {
              return {
                id: d.uid,
                label: d.deviceName,
                type: 1
              }
            })]
          }
          result.push(child);
        }
      })
      return result;
    },
    // 是否显示下拉列表
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    // 移除已选择的下拉列表项
    removeSeletedDev (data) {
      this.$refs.selectTree.setChecked(data, false);
      this.$emit('sendSelectData', this.selObj);
      this.$emit('allSelectLength', this.selectNum);
    },
    // 切换下拉列表的选中状态并关联到select上
    changeSeletedStatus () {
      let data = [], obj = null;
      this.$refs.selectTree.getCheckedNodes().forEach(f => {
        data.push(f);
      })
      data = data.filter(f => !f.children);
      this.selObj.selSelectedData1 = data.filter(f => f.type === 1);
      this.selObj.selSelectedData2 = data.filter(f => f.type === 2);
      this.devIdData = data;
      if (this.devIdData.length < this.selectNum) {
        this.checked = false;
      } else {
        this.checked = true;
      }
      if (this.devIdData.length === this.selectNum) {
        this.devIdData = [{label: '全部设备'}];
      }
      this.$emit('sendSelectData', this.selObj);
      this.$emit('allSelectLength', this.selectNum);
    }
  }
}
</script>
<style lang="scss" scoped>
.dev_select{
  position: relative;
  .search_item {
    position: absolute;
    left: 0;
    top: 40px;
    z-index: 9999;
    width: 100%;
    height: 0;
    overflow: hidden;
    transition: all .3s linear;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin-top: 10px;
  }
}
</style>
<style lang="scss">
.dev_select{
  .el-tag--info{
    background: #fff;
    border-color: #fff;
    > span{
      font-size: 14px;
    }
    .el-tag__close{
      display: none;
    }
  }
  .el-tag--info:nth-child(1){
    .el-select__tags-text{
      max-width: 100px;
      display: inline-block;
      overflow-x: hidden;
    }
  }
  .el-tag--info:nth-child(2){
    .el-select__tags-text{
      color: #0c70f8;
    }
  }
}
.dev_select.rlsjfx{
  .el-tag--info:nth-child(1){
    .el-select__tags-text{
      max-width: 70px;
    }
  }
}
.statistics_select_list {
  display: none!important;
}
</style>
  