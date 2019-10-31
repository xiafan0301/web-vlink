<template>
  <div class="special_csmanage">
   <div class="special_csmanage_cot">
     <div class="special_csmanage_right">
       <div style="padding: 20px; padding-bottom: 0">
         <el-input size="small" suffix-icon="el-icon-search"></el-input>
       </div>
       <div class="add_zu" @click="addzu('新增')">
         <i class="vl_icon vl_icon_manage_4"></i>
         <span>新增分组</span>
       </div>
       <ul class="fen_zu">
         <li>
           <span>是佛教护法</span>
           <i class="operation_btn del_btn vl_icon vl_icon_manage_8"></i>
           <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
         </li>
         <li v-for="(item, index) in fenzulist" :key ="index">{{item.groupName}}
           <i class="operation_btn del_btn vl_icon vl_icon_manage_8" @click="delfenzu(item)"></i>
           <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="addzu('修改', item.uid)"></i>
         </li>
       </ul>
     </div>
     <div class="special_csmanage_right_r special_csmanage_right" :class="{'hideResult': Result}">
       <vue-scroll>
         <div v-for="(item, index) in fenzulist" :key ="index" :class="['special_csmanage_right_r_tree', 'special_csmanage_right_r_tree_'+ index]">
           <div class="special_csmanage_right_r_tree_hd" @click="oo(item,index)" :class="{'opencolor': item.isopen }"><i :class="[{'el-icon-arrow-right': !item.isopen},{'el-icon-arrow-down':item.isopen}]"></i>{{item.deviceList[0].address}}</div>
           <div class="special_csmanage_right_r_tree_i" v-for="(ite, inde) in item.deviceList" :key ="inde">
             <div v-show="item.isopen">{{ite.deviceName}}</div>
           </div>
         </div>
       </vue-scroll>
       <div class="insetLeft vl_icon vl_icon_vehicle_02" @click="hideResult" :class="{'vl_icon_vehicle_03': Result}"></div>
     </div>
     <div class="map_rm" id="mapMap"></div>
   </div>
    <!--删除任务弹出框-->
    <el-dialog
        title="删除任务确认"
        :visible.sync="deleteDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
    >
      <span style="color: #999999;">是否确定删除该分组</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button @click="delConfirm(item)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Jtcgettsc} from '@/views/index/api/api.judge.js';
import {delfezu } from '@/views/index/api/api.base.js';
export default {
  name: "specialcsManage",
  data() {
    return {
      mapCenter: [110.594419,27.908869],
      Result: false,
      hide: false,
      fenzulist: [],
      deleteDialog: false,
      item: {},
    }
  },
  created () {
    this.getlist()
  },
  mounted() {
    let _this = this;
    let map = new window.AMap.Map('mapMap', {
      zoom: 14, // 级别
      center: _this.mapCenter, // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
  },
  methods: {
    getlist () {
      Jtcgettsc()
        .then(res => {
          if (res) {
            this.fenzulist = res.data
            this.fenzulist.map((item)=>{
              this.$set(item, 'isopen', false)
              return item
            })
          }
        })
    },
    delfenzu (val) {
      this.deleteDialog = true
      this.item = val
    },
    delConfirm (val) {
      let deviceList = val.deviceList.map((item)=>{
        return item.uid
      })
      let bayonetList = [];
      if (val.bayonetList) {
         bayonetList = val.bayonetList.map((item)=>{
          return item.uid
        })
      }
      let params = {
        delIdList: deviceList.join() + bayonetList.join(),
        groupId: val.uid,
        groupName: val.groupName
      }
      console.log(params)
      delfezu (params)
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.deleteDialog = false
            this.getlist()
          }
        })
    },
    addzu (val, item) {
      if (val === '修改') {
        this.$router.push({name: 'special_csmanageadd',  query: {uid :item, isadd: 0}})
      }else{
        this.$router.push({name: 'special_csmanageadd', query: {isadd: 1}})
      }
    },
    hideResult () {
      this.Result = !this.Result
    },
    oo (val,index) {
      val.isopen = !val.isopen
      let _heit  = 0
      if(val.isopen) {
        _heit = $('.special_csmanage_right_r_tree_' + index).height()
      }
      console.log(_heit)
      if (val.isopen) {
        $('.special_csmanage_right_r_tree_' + index).animate({height:175}, 300, "linear")
      } else {
        $('.special_csmanage_right_r_tree_' + index).animate({height:_heit + 20}, 300, "linear")
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .special_csmanage{
    height: 100%;
    width: 100%;
    padding: 15px;
    .special_csmanage_cot{
      height: 100%;
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      position: relative;
      .special_csmanage_right{
        width: 260px;
        z-index: 99;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: white;
        border-radius:4px;
        border-right:1px solid rgba(242,242,242,1);
        /deep/ .el-input__inner{
          border-radius: 20px;
          background-color: #F2F2F2;
        }
        .add_zu{
          padding-left: 20px;
          padding-top: 20px;
          cursor: pointer;
          padding-bottom: 5px;
          .vl_icon_manage_4{
            padding-bottom: 27px;
            margin-right: 5px;
            vertical-align: middle;
          }
        }
        .fen_zu{
          li{
            padding-left: 48px;
            padding-bottom: 10px;
            cursor: pointer;
            .vl_icon_manage_7{
              background-position: -584px -377px;
            }
            .vl_icon_manage_8{
              background-position: -694px -376px;
            }
            &:hover{
              background-color: #E0F2FF;
              .operation_btn {
                display: block;
              }
            }
            .del_btn {
              &:hover {
                background-position: -694px -349px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
          }
        }
      }
      .special_csmanage_right_r{
        padding: 20px;
        left: 260px;
        border-right: 0;
        z-index: 90;
        transition: left linear .3s;
        .insetLeft{
          position: absolute;
          left: 260px;
          top: 50%;
          margin-top: -89px;
        }
        .special_csmanage_right_r_tree{
          cursor: pointer;
          padding-bottom: 20px;
          overflow: hidden;
          .special_csmanage_right_r_tree_hd{
          }
          .opencolor{
            color: #0C70F8;
          }
          .special_csmanage_right_r_tree_i{
            /*padding-left: 14px;*/
            /*padding-top: 15px;*/
            div{
              padding-top: 15px;
              padding-left: 14px;
            }
          }
        }
      }
      .hideResult{
        left: 0;
        z-index: 90;
        transition: left linear .3s;
      }
      #mapMap{
        height: 100%;
        width: 100%;
        border-radius:4px;
      }
    }
  }
</style>