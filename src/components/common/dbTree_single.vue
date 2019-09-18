<template>
  <div>
    <div class="sdd_c_tab" v-show="showTypes.indexOf('D') >= 0 && showTypes.indexOf('B') >= 0">
      <span :class="{'active': leftTabShow === 0}" @click="leftTabShow = 0">摄像头</span>
      <span :class="{'active': leftTabShow === 1}" @click="leftTabShow = 1">卡口</span>
    </div>
    <ul class="db_tree" :id="dbId">
      <li :id="'db_area_' + item.areaUid" v-for="(item, index) in treeList" :key="'tl_' + index">
        <i class="el-icon-arrow-right" @click="selFirstEvent(item.areaUid)"></i>
        <span @click="selFirstEvent(item.areaUid)">{{item.areaName}}</span>
        <ul class="db_tree_s" v-if="item.childList && item.childList.length > 0">
          <li :id="'db_area_' + sitem.areaUid" v-for="(sitem, sindex) in item.childList" :key="'stl_' + sindex">
            <i class="el-icon-caret-right" @click="selSecondEvent(sitem.areaUid, item.areaUid)"></i>
            <span @click="selSecondEvent(sitem.areaUid, item.areaUid)">{{sitem.areaName}}</span>
            <div class="db_tree_c">
              <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                <template v-if="sitem.childList && getCurTypeData(sitem.childList).length">
                  <li v-for="(ditem, dindex) in getCurTypeData(sitem.childList)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                    {{ditem.infoName}}
                    <i @click="delOne(ditem)" class="el-icon-delete"></i>
                  </li>
                </template>
                <template v-else>
                  <li class="db_li_empty">暂无</li>
                </template>
              </ul>
            </div>
          </li>
        </ul>
        <ul class="db_tree_s" v-else>
          <li><span>暂无数据</span></li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
  import {random14} from '@/utils/util.js';
  export default {
    props: ['treeList', 'showTypes'],
    data () {
      return {
        dbId: 'db_tree_' + random14(),
        leftTabShow: 0
      }
    },
    watch: {
    },
    methods: {
      getCurTypeData (item) {
        return item.filter(x => x.dataType === this.leftTabShow)
      },
      delOne (item) {
        this.$emit('delOne', item)
      },
      selFirstEvent (areaUid) {
        let $li = $('#' + this.dbId).find('#db_area_' + areaUid);
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
      // areaUid, pareaId
      selSecondEvent (areaUid) {
        let $li = $('#' + this.dbId).find('#db_area_' + areaUid);
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
    margin-top: 20px;
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
    width: 100%;
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
          white-space: nowrap;
          &:hover {
            /*background-color: #f2f2f2;*/
          }
          &.db_li_empty { color: #999; }
          &.db_li_empty:hover { background-color: #fff; }
          > i {
            position: absolute;
            top: 0px;
            right: -20px;
            display: block;
            width: 27px;
            background: #ffffff;
            height: 36px;
            line-height: 36px;
            text-align: center;
            cursor: pointer;
            &:hover {
              color: #0C70F8;
            }
          }
          &.bd_tree_dbli_sed {
            /*background-color: #ddd;*/
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

