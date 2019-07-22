<!-- 设备下拉列表 通用组件 -->
<template>
  <div class="dev_select">
    <el-select
      style="width: 100%;"
      v-model="devIdData"
      multiple
      popper-class="statistics_select_list"
      @remove-tag="removeSeletedDev"
      @click.native="showChange"
      collapse-tags
      placeholder="请选择设备">
      <el-option :value="devIdData[0]" :label="devIdData[0] && devIdData[0].label"></el-option>
    </el-select>
    <div class="search_item" :style="{'height': isShowSelectList ? '160px' : '0px'}">
      <vue-scroll>
        <el-checkbox style="padding-left: 24px;padding-top: 10px;" v-model="checked" @change="checkedAll">全选</el-checkbox>
        <el-tree
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
  },
  methods: {
    checkedAll(){
      if (this.checked) {
        //全选
        this.$refs.selectTree.setCheckedNodes(this.treeList);
      }else{
        //取消选中
        this.$refs.selectTree.setCheckedKeys([]);
        this.devIdData = [];
      }
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
            this.checkedAll();//  全选
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
    // 重置表单
    resetSelect () {
      this.devIdData = [];
      this.selObj = {
        selSelectedData1: [],
        selSelectedData2: [],
      };
      if (this.$refs.selectTree) {
        this.$refs.selectTree.setCheckedKeys([]);
      }
      this.isShowSelectList = false;
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
.statistics_select_list {
  display: none!important;
}
</style>
