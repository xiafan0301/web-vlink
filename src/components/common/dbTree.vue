<template>
<div>
  <div class="sdd_c_tab" v-show="showTypes.indexOf('D') >= 0 && showTypes.indexOf('B') >= 0">
    <span :class="{'active': leftTabShow === 0}" @click="leftTabShow = 0">摄像头</span>
    <span :class="{'active': leftTabShow === 1}" @click="leftTabShow = 1">卡口</span>
  </div>
  <ul class="db_tree" :id="dbId">
    <li :id="'db_area_' + item.areaId" v-for="(item, index) in treeList" :key="'tl_' + index">
      <!-- <i class="el-icon-arrow-right" @click="selFirstEvent(item.areaId)"></i>
      <span @click="selFirstEvent(item.areaId)">{{item.areaName}}</span> -->
      <ul class="db_tree_s" v-if="item.areaTreeList && item.areaTreeList.length > 0">
        <template v-if="leftTabShow === 0">
          <li :id="'db_area_' + sitem.areaId" v-for="(sitem, sindex) in item.areaTreeList" :key="'stl_' + sindex">
            <template v-if="sitem.deviceBasicList && sitem.deviceBasicList.length > 0">
              <i class="el-icon-caret-right" @click="selSecondEvent(sitem.areaId, item.areaId)"></i>
              <span @click="selSecondEvent(sitem.areaId, item.areaId)">{{sitem.areaName}}</span>
              <div class="db_tree_c">
              <!--  <div>
                  <span class="db_tree_ct_d db_tree_ct_sed" @click="changeType(sitem.areaId, 1)">摄像头</span>
                  <span class="db_tree_ct_b" @click="changeType(sitem.areaId, 2)">卡口</span>
                </div> -->
                <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                    <li @click="selectItem(1, ditem, $event)" v-for="(ditem, dindex) in sitem.deviceBasicList" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                      {{ditem.deviceName}}
                      <i class="vl_icon vl_icon_v11"></i>
                    </li>
                </ul>
                <ul class="db_tree_cul db_tree_cb db_tree_cul_open"  v-if="leftTabShow === 1">
                  <template v-if="sitem.bayonetList && sitem.bayonetList.length > 0">
                    <li @click="selectItem(2, bitem, $event)" v-for="(bitem, bindex) in sitem.bayonetList" :key="'bl_' + index + '_' + sindex + '_' + bindex">
                      {{bitem.bayonetName}}
                      <i class="vl_icon db_tree_cul_ck"></i>
                    </li>
                  </template>
                  <template v-else>
                    <li class="db_li_empty">暂无</li>
                  </template>
                </ul>
              </div>
            </template>
          </li>
        </template>
        <template v-if="leftTabShow === 1">
          <li :id="'db_area_' + sitem.areaId" v-for="(sitem, sindex) in item.areaTreeList" :key="'stl_' + sindex">
            <template v-if="sitem.bayonetList && sitem.bayonetList.length > 0">
              <i class="el-icon-caret-right" @click="selSecondEvent(sitem.areaId, item.areaId)"></i>
              <span @click="selSecondEvent(sitem.areaId, item.areaId)">{{sitem.areaName}}</span>
              <div class="db_tree_c">
                <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                  <li @click="selectItem(2, bitem, $event)" v-for="(bitem, bindex) in sitem.bayonetList" :key="'bl_' + index + '_' + sindex + '_' + bindex">
                      {{bitem.bayonetName}}
                      <i class="vl_icon db_tree_cul_ck"></i>
                    </li>
                </ul>
              </div>
              </template>
          </li>
        </template>
      </ul>
    </li>
  </ul>
</div>
</template>
<script>
import {random14} from '@/utils/util.js';
import {MapGETmonitorList} from '@/views/index/api/api.map.js';
export default {
  props: ['likeKey', 'doSearch', 'showTypes'],
  data () {
    return {
      treeList: [],
      dbId: 'db_tree_' + random14(),
      leftTabShow: 0,
    }
  },
  watch: {
    doSearch () {
      this.getTreeList();
    },
  },
  mounted () {
    this.getTreeList();
  },
  methods: {
    getCurTypeData (item) {
        if (this.filterable) {
          return item.filter(x => x.dataType === this.leftTabShow && x.infoName.includes(this.filterable));
        } else {
          return item.filter(x => x.dataType === this.leftTabShow);
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
          this.$nextTick(() => {
            $('#' + this.dbId).children('li').first().addClass('db_tree_sli_sed');
            $('#' + this.dbId).find('.db_tree_s').first().slideDown(300);
          });
        }
      });
    },
    changeType (areaId, type) {
      let $li = $('#' + this.dbId).find('#db_area_' + areaId);
      if ($li && $li.length > 0) {
        if (type === 1) { // 摄像头
          $li.find('.db_tree_ct_b').removeClass('db_tree_ct_sed');
          $li.find('.db_tree_ct_d').addClass('db_tree_ct_sed');
          $li.find('.db_tree_cb').removeClass('db_tree_cul_open');
          $li.find('.db_tree_cd').addClass('db_tree_cul_open');
        } else {
          $li.find('.db_tree_ct_d').removeClass('db_tree_ct_sed');
          $li.find('.db_tree_ct_b').addClass('db_tree_ct_sed');
          $li.find('.db_tree_cd').removeClass('db_tree_cul_open');
          $li.find('.db_tree_cb').addClass('db_tree_cul_open');
        }
      }
    },
    selFirstEvent (areaId) {
      let $li = $('#' + this.dbId).find('#db_area_' + areaId);
      if ($li && $li.length > 0) {
        let $cld = $li.children('.db_tree_s');
        if ($cld.is(':hidden')) {
          // $('#' + this.dbId).find('#db_area_' + pareaId).find('.db_tree_c').hide();
          $cld.slideDown(300);
          $li.addClass('db_tree_sli_sed');
        } else {
          $cld.slideUp(300);
          $li.removeClass('db_tree_sli_sed');
        }
      }
    },
    // areaId, pareaId
    selSecondEvent (areaId) {
      let $li = $('#' + this.dbId).find('#db_area_' + areaId);
      if ($li && $li.length > 0) {
        let $cld = $li.children('.db_tree_c');
        if ($cld.is(':hidden')) {
          // $('#' + this.dbId).find('#db_area_' + pareaId).find('.db_tree_c').hide();
          $cld.slideDown(300);
          $li.addClass('db_tree_sli_sed');
        } else {
          $cld.slideUp(300);  
          $li.removeClass('db_tree_sli_sed');
        }
      }
    },
    // type 1摄像头，2卡口
    // item 摄像头/卡口对象
    selectItem (type, item, $event) {
      let $t = $($event.target);
      if (!$t.hasClass('bd_tree_dbli_sed')) {
        this.$emit('selectItem', type, item);
        $('#' + this.dbId).find('.db_tree_cul').children('li').removeClass('bd_tree_dbli_sed');
        $($event.target).addClass('bd_tree_dbli_sed');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sdd_c_tab {
    height: 28px;
    border: 1px solid #D3D3D3;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    width: 232px;
    margin-left: 20px;
    > span {
      display: inline-block;
      float: left;
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    >.active{
      background: #E0F2FF;
      color: #0C70F8;
    }
  }
/* 设备/卡口 树样式 */
.db_tree {
  > li {
    position: relative;
    > span {
      display: block;
      height: 36px; line-height: 36px;
      padding-left: 30px;
      cursor: pointer;
    }
    > i {
      position: absolute; top: 11px; left: 10px;
      font-size: 14px; font-weight: bold;
      transition: all .4s ease-out;
    }
    &.db_tree_sli_sed {
      > span { color: #0C70F8; }
      > i {
        top: 10px;
        color: #0C70F8;
        transform: rotate(90deg);
      }
    }
  }
  .db_tree_s {
    display: none;
    position: relative;
    > li {
      position: relative;
      top: 5px;
      > span {
        display: block;
        height: 36px; line-height: 36px;
        padding-left: 48px;
        cursor: pointer;
      }
      > i {
        position: absolute; top: 11px; left: 30px;
        font-size: 14px; font-weight: bold;
        transition: all .4s ease-out;
        cursor: pointer;
      }
      &.db_tree_sli_sed {
        > span { color: #0C70F8; }
        > i {
          top: 10px;
          color: #0C70F8;
          transform: rotate(90deg);
        }
      }
    }
  }
  .db_tree_c {
    display: none;
    > div {
      text-align: center;
      overflow: hidden;
      padding-left: 25px;
      > span {
        display: inline-block;
        width: 100px;
        padding: 3px 0;
        border: 1px solid #dcdfe6;
        cursor: pointer;
        color: #666;
        float: left;
        &:first-child {
          border-radius: 4px 0 0 4px;
        }
        &:last-child {
          border-radius: 0 4px 4px 0;
          border-left: 0;
        }
        &.db_tree_ct_sed {
          background-color: #F2F2F2;
          color: #0C70F8;
          cursor: default;
        }
      }
    }
    .db_tree_cul {
      display: none;
      padding-top: 5px;
      > li {
        position: relative;
        height: 36px; line-height: 36px;
        padding: 0 30px 0 40px;
        color: #666;
        cursor: default;
        &:hover {
          background-color: #f2f2f2;
        }
        &.db_li_empty { color: #999; }
        &.db_li_empty:hover { background-color: #fff; }
        > i {
          position: absolute; top: 9px; right: 10px;
        }
        &.bd_tree_dbli_sed {
          background-color: #ddd;
        }
      }
      &.db_tree_cul_open {
        display: block;
      }
    }
  }
}
.db_tree_cul_ck { 
  width: 16px; height: 18px;
  background-position: -69px -375px;
 }
</style>


