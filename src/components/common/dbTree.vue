<template>
  <ul class="db_tree" :id="dbId">
    <li :id="'db_area_' + item.areaId" v-for="(item, index) in treeList" :key="'tl_' + index">
      <i class="el-icon-arrow-right" @click="selFirstEvent(item.areaId)"></i>
      <span @click="selFirstEvent(item.areaId)">{{item.areaName}}</span>
      <ul class="db_tree_s" v-if="item.areaTreeList && item.areaTreeList.length > 0">
        <li :id="'db_area_' + sitem.areaId" v-for="(sitem, sindex) in item.areaTreeList" :key="'stl_' + sindex">
          <i class="el-icon-caret-right" @click="selSecondEvent(sitem.areaId, item.areaId)"></i>
          <span @click="selSecondEvent(sitem.areaId, item.areaId)">{{sitem.areaName}}</span>
          <div class="db_tree_c">
            <div>
              <span class="db_tree_ct_d db_tree_ct_sed" @click="changeType(sitem.areaId, 1)">摄像头</span>
              <span class="db_tree_ct_b" @click="changeType(sitem.areaId, 2)">卡口</span>
            </div>
            <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
              <template v-if="sitem.deviceBasicList && sitem.deviceBasicList.length > 0">
                <li @click="selectItem(1, ditem, $event)" v-for="(ditem, dindex) in sitem.deviceBasicList" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                  {{ditem.deviceName}}
                  <i class="vl_icon vl_icon_v11"></i>
                </li>
              </template>
              <template v-else>
                <li class="db_li_empty">暂无</li>
              </template>
            </ul>
            <ul class="db_tree_cul db_tree_cb">
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
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
import {random14} from '@/utils/util.js';
import {MapGETmonitorList} from '@/views/index/api/api.map.js';
export default {
  props: ['likeKey', 'doSearch'],
  data () {
    return {
      treeList: [],
      dbId: 'db_tree_' + random14(),
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
    position: relative; top: -5px;
    > li {
      position: relative;
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


