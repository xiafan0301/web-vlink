<template>
  <div class="spec_m_add">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'special_csmanage' }"><span style="color: #999999">特殊场所管理</span></el-breadcrumb-item>
        <el-breadcrumb-item>{{parseInt(this.$route.query.isadd)? "新增分组": "修改分组"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="overflow: auto; padding-top: 20px" class="spec_m_add_cot_out">
      <div class="spec_m_add_cot">
        <div class="add_name">
          分组名称:
          <el-input style="display: inline-block" class="input" v-model="value1" placeholder="请输入分组名称"></el-input>
        </div>
        <div class="add_sty">
          选择方式：
          <div is="mapSele" isNotDialog  :showTypes="'DB'" filter ref="myseb" :activeDeviceList="deviceList"></div>
        </div>
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="baocun" :loading="addloading">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mapSele from  '@/components/common/mapSelector.vue';
import { postfezu ,getfezu, putfezu} from '@/views/index/api/api.base.js';
export default {
  components: {
    mapSele
  },
  name: "specialcsManageadd",
  data () {
    return {
      value1: '',
      deviceList: [],
      addloading: false
    }
  },
  created () {
    if (!parseInt(this.$route.query.isadd)) {
      let params = {
        groupId: this.$route.query.uid
      }
      getfezu (params)
        .then(res => {
          if (res) {
            this.deviceList = (res.data.deviceList).map((item)=>{
              return item.uid
            })
            this.value1 = res.data.groupName
          }
        }).catch(error => {
      })
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    baocun () {
      this.addloading = true
      if (this.value1.length <= 0) {
        this.$message.error('请输入分组名称');
        this.addloading = false
        return
      }
      let deviceList = this.$refs['myseb'].getCheckedIds().deviceList.map((item)=> {
        return item.uid
      })
      let bayonetList = this.$refs['myseb'].getCheckedIds().bayonetList.map((item)=> {
        return item.uid
      })
      if (parseInt(this.$route.query.isadd) === 0) {
        let params ={
          addIdList: deviceList.join() + bayonetList.join(),
          groupId: this.$route.query.uid,
          groupName: this.value1
        }
        putfezu (params)
          .then(res => {
            if (res) {
              this.$message.success('保存成功');
              this.$router.go(-1)
            }
            this.addloading = false
          }).catch(error => {
          this.addloading = false
        })
      }else {
        let params = {
          deviceIds: deviceList.join() + bayonetList.join() ,
          groupName: this.value1
        }
        postfezu (params)
          .then(res => {
            if (res) {
              this.$message.success('保存成功');
              this.$router.go(-1)
              console.log(res)
            }
            this.addloading = false
          }).catch(error => {
          this.addloading = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .spec_m_add{
    height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .spec_m_add_cot_out{
      height: calc(100% - 62px);
      padding: 0 10px;
    }
    .spec_m_add_cot{
      background-color: white;
      padding: 20px;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      .add_name{
        .input{
          width: calc(100% - 100px);
        }
      }
      .add_sty{
        padding-bottom: 50px;
      }
      div{
        padding: 5px 0;
      }
    }
  }
</style>