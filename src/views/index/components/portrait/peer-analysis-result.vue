<template>
  <div class="peer-analysis">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'}, 
        {name: '同行分析', routerName: 'peer_analysis_list'}, {name: '分析结果'}]">
      </div>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
        <template v-if="showNewTask">
          <vue-scroll>
            <div class="task_name">
              <span>任务名称：</span>
              <span>{{editForm.taskName}}</span>
            </div>
            <!--查询范围-->
            <div class="per_left_time">
              <div class="left_time">
                <el-date-picker
                  v-model="editForm.startTime"
                  style="width: 100%;margin-bottom: 10px;"
                  class="vl_date"
                  type="datetime"
                  :clearable="false"
                  :time-arrow-control="true"
                  @change="chooseStartTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
                <el-date-picker
                  style="width: 100%;"
                  class="vl_date vl_date_end"
                  v-model="editForm.endTime"
                  @change="chooseEndTime"
                  :clearable="false"
                  :time-arrow-control="true"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
            <div class="vl_jtc_img_box">
              <div style="padding: 0 25px; height: 210px;">
                <div is="vlUpload" :clear="uploadClear" :imgData="imgData" @uploadEmit="uploadEmit"></div>
              </div>
            </div>
            <div class="per_semblance_ytsr">
              <span>同行次数≥：</span>
              <el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100; if(value&&value <2)value = 2;" placeholder="填写同行次数" v-model="editForm.number">
              </el-input>(2-100)
            </div>
            <div class="peer_xzsb_s" @click="areaTypeChanged" v-if="chooseType === 1">
              <span>选择设备</span>
              <span class="el-icon-arrow-down"></span>
            </div>
            <div class="peer_dtxz_rst" v-else>
              已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
            </div>
            <div class="vl_jtc_search">
              <div style="text-align: center;margin-bottom: 0px;">
                <el-button @click="resetSearch">取消</el-button>
                <el-button type="primary" :loading="searching" @click="tcDiscuss()">确定</el-button>
              </div>
            </div>
          </vue-scroll>
        </template>

        <template v-else>
          <ul>
            <li v-if="taskDetail.taskWebParam && taskDetail.taskWebParam.targetPicUrl">
              <img :src="taskDetail.taskWebParam.targetPicUrl" alt="">
            </li>
            <!-- <li v-else>
              <img src="../../../../assets/img/temp/vis-eg.png" alt="">
            </li> -->
            <li>
              <span>任务名称：</span>
              <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
            </li>
            <li>
              <span>已选设备：</span>
              <span>{{deviceStr ? deviceStr : '无'}}</span>
            </li>
            <li>
              <span>分析时间：</span>
              <span>
              <p>从{{taskDetail.taskWebParam && taskDetail.taskWebParam.startTime ? taskDetail.taskWebParam.startTime : '无'}}</p>
              <p>至{{taskDetail.taskWebParam && taskDetail.taskWebParam.endTime ? taskDetail.taskWebParam.endTime : '无'}}</p>
            </span>
            </li>
            <li>
              <span>同行次数：</span>
              <span v-if="taskDetail.taskWebParam && taskDetail.taskWebParam.number">不少于{{ taskDetail.taskWebParam.number}}次</span>
              <span v-else>无</span>
            </li>
            <li>
              <span>创建时间：</span>
              <span>{{taskDetail.createTime ? taskDetail.createTime : '无'}}</span>
            </li>
          </ul>
          <div class="update_task">
            <el-button type="primary" @click="showNewTaskBox">修改任务</el-button>
          </div>
        </template>
      </div>
      <div class="the-right-result">
        <template v-if="pagination.total !== 0">
          <div class="the-result-box-peer">
            <vue-scroll>
              <div class="the-result-number">检查结果<span>（{{pagination.total}}）</span></div>
              <div class="list-box">
                <ul class="rlcx_r_list clearfix">
                  <li v-for="(item, index) in boxList" :key="index + 'dd'">
                    <div>
                      <!-- <img class="box_img" src="../../../../assets/img/666.jpg" alt=""> -->
                      <img class="bigImg" :src="item.subStoragePath" alt="">
                      <div class="box_right_detail">
                        <h4>检索资料</h4>
                        <div><i class="vl_icon rlcx_sj"></i>{{item.shotTime}}</div>
                        <p>
                          <span v-if="item.sex" style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;">{{item.sex}}性</span>
                          <span v-else style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;">无</span>
                          <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;margin-left: 8px;">{{item.age ? item.age : '无'}}</span>
                        </p>
                        <p><img src="../../../../assets/img/txfx_pao.png" alt=""><b style="color: #0C70F8;font-size: 34px;padding-left: 8px;">{{item.peerNumber}}</b><span style="color: #0C70F8;"> 次同行</span></p>
                        <div style="margin-top: 15px; cursor: pointer;border:1px solid #D3D3D3;border-radius:4px;background:rgba(246,248,249,1);color: #666;" @click="goRecord(item)">查看同行记录</div>
                      </div>
                    </div>
                  </li>
                </ul>
                <el-pagination
                  class="cum_pagination th-center-pagination"
                  @current-change="onPageChange"
                  :current-page.sync="pagination.currentPage"
                  :page-size="pagination.pageSize"
                  layout="prev, pager, next"
                  :total="pagination.total">
                </el-pagination>
              </div>
            </vue-scroll>
          </div>
        </template>
        <template v-else>
          <div class="not_content">
            <img src="../../../../assets/img/not-content.png" alt="">
            <p>抱歉，没有相关的结果!</p>
          </div>
        </template>
      </div>
    </div>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
      is="mapSelector"
      :open="openMap"
      :clear="msClear"
      :showTypes="'DB'"
      :activeDeviceList="activeSelectList"
      @mapSelectorEmit="mapSelectorEmit">
    </div>
  </div>
</template>

<script>
import { getPeopleTaskDetail, postPeopleTask } from '@/views/index/api/api.analysis.js';
import { mapXupuxian } from '@/config/config.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { formatDate } from "@/utils/util.js";
import vlUpload from "@/components/common/upload.vue";
import mapSelector from '@/components/common/mapSelector.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
export default {
  components: {vlUpload, mapSelector, vlBreadcrumb},
  data () {
    return {
      imgData:null,
      uploadClear: {},
      imgList: null,
      openMap: false,
      dSum: 0,
      chooseType: 1,
      msClear: {},
      selectCameraArr: [],
      selectBayonetArr: [],
      showNewTask: false,
      searching: false,

      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      taskDetail: {},
      deviceStr: null,
      deviceList: [],
      boxList: [],
      editForm: {},
      activeSelectList: [], // 选中的设备数据
    }
  },
 
  mounted() {
    this.getMonitorList().then(() => {
      this.getDetail();
    })
    // this.setDTime();
  },
  methods: {
    uploadEmit(data) {
      if (data && data.path) {
        this.imgList = data;
      } else {
        this.imgList = null;
      }
    },
    resetSearch () {
      // this.searchData.minSemblance = 5;
      this.uploadClear = {}
      this.msClear = {};
      this.showNewTask = false;
      this.dSum = 0;
      // this.setDTime();
    },
    tcDiscuss () {
      let params = {
      }
      if (!this.imgList) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请上传图片')
        }
        return false;
      } else {
        params['targetPicUrl'] = this.imgList.path;
      }
      if (this.editForm.number) {
        params['number'] = this.editForm.number;
      } else {
        params['number'] = 2;
      }
      params['deviceId'] = this.selectCameraArr.join(',');
      params['bayonetIds'] = this.selectBayonetArr.join(',');
      params['startTime'] = formatDate(this.editForm.startTime, 'yyyy-MM-dd HH:mm:ss');
      params['endTime'] = formatDate(this.editForm.endTime, 'yyyy-MM-dd HH:mm:ss');
      params['uid'] = this.$route.query.uid;
      params['taskName'] = this.editForm.taskName;
      postPeopleTask(params).then(res => {
        this.searching = false;
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '修改成功',
            customClass: 'request_tip'
          })
          this.$router.push({name: "peer_analysis_list"});
        }
      })
    },
    // setDTime() {
    //   let date = new Date();
    //   let curDate = date.getTime();
    //   let curS = 1 * 24 * 3600 * 1000;
    //   let _sDate = new Date(curDate - curS);
    //   let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
    //   this.searchData.startTime = new Date(_s).getTime();
    //   this.searchData.endTime = curDate;
    // },
    chooseEndTime (e) {
      if (e < this.editForm.startTime) {
        this.$message.info('结束时间必须大于开始时间才会有结果')
      }
    },
    chooseStartTime (e) {
      if (e > this.editForm.endTime) {
        this.$message.info('结束时间必须大于开始时间才会有结果')
      }
    },
    areaTypeChanged () {
      this.chooseType = 2;
      this.openMap = {};
    },
    mapSelectorEmit (result) {
      this.selectBayonetArr = [];
      this.selectCameraArr = [];
      if (result) {
        console.log('result', result);
        
        // bayonetList deviceList
        this.dSum = 0;
        if (result.deviceList && result.deviceList.length > 0) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.selectCameraArr.push(result.deviceList[i].uid);
          }
        } else {
          this.selectCameraArr = [];
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          for (let i = 0; i < result.bayonetList.length; i++) {
            this.selectBayonetArr.push(result.bayonetList[i].uid);
          }
          this.dSum += result.bayonetList.length;
        } else {
          this.selectBayonetArr = [];
        }
      }
    },
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.uid;
      if (id) {
        getPeopleTaskDetail(id)
          .then(res => {
            if (res) {
              this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
              this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
              console.log('aaa', res.data);
              
              let deviceArr = res.data.taskWebParam && res.data.taskWebParam.deviceId.split(',');
              let bayonetArr = res.data.taskWebParam.bayonetIds && res.data.taskWebParam.bayonetIds.split(',');
              let arr1 = [];
              if (deviceArr && deviceArr.length > 0) {
                deviceArr.forEach(item => {
                  let o = this.deviceList.find(x => {return item === x.uid});
                  if (o) {
                    arr1.push(o.deviceName);
                  }
                })
              }
              if (bayonetArr && bayonetArr.length > 0) {
                bayonetArr.forEach(item => {
                  let o = this.deviceList.find(x => {return item === x.uid});
                  if (o) {
                    arr1.push(o.bayonetName);
                  }
                })
              }
              if (arr1.length > 1 && arr1.length < this.deviceList.length) {
                this.deviceStr = `${arr1[0]}等${arr1.length - 1}个设备`;
              } else if (arr1.length === 1) {
                this.deviceStr = arr1[0];
              } else if (arr1.length === 0) {
                 this.deviceStr = null;
              } else if (arr1.length === this.deviceList.length) {
                this.deviceStr = '全部设备';
              }

              this.pagination.total = res.data.taskResult.length;
              this.boxList = [...res.data.taskResult.slice(0, 12)];
              this.boxList.sort((a, b) => {return b.peerNumber - a.peerNumber});

              this.taskDetail = res.data;
              this.imgData = {
                cname: '带图' + Math.random(),
                filePathName: '带图' + Math.random(),
                path: res.data.taskWebParam.targetPicUrl
              };
            }
          })
      }
    },
    /**
     * 获取摄像头卡口信息列表
     */
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      return MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          console.log('bbbb', res.data);
          
          if (res.data.areaTreeList) {
            let arr = res.data.areaTreeList;
            arr.forEach(item => {
              if (item.deviceBasicList && item.deviceBasicList.length > 0) {
                this.deviceList.push(...item.deviceBasicList);
              }
              if (item.bayonetList && item.bayonetList.length > 0) {
                this.deviceList.push(...item.bayonetList);
              }
            })
            console.log('this.deviceList', this.deviceList);
            
          }
        }
      });
    },
    goRecord (obj) {
      this.$router.push({name: 'peer_analysis_record', query: {uid: this.$route.query.uid, id: obj.uid}});
    },
    onPageChange (page) {
      this.boxList.splice(0, this.boxList.length);
      this.boxList = [...this.taskDetail.taskResult.slice((page - 1) * 12, 12 + (page - 1) * 12)];
      this.boxList.sort((a, b) => {return a.peerNumber - b.peerNumber});
    },
    // 点击修改任务按钮
    showNewTaskBox () {
      this.editForm = {
        ...this.taskDetail.taskWebParam
      };

      let deviceArr = this.taskDetail.taskWebParam.deviceId.split(',');
      let bayonetArr = this.taskDetail.taskWebParam.bayonetIds.split(',');

      // console.log(deviceArr);
      // console.log('mmmm', this.deviceList)
      let arrIds = [];
      if (deviceArr && deviceArr.length > 0) {
        deviceArr.forEach(item => {
          this.selectCameraArr.push(item);
          let o = this.deviceList.find(x => {return item === x.uid});
          if (o) {
            arrIds.push(o.uid);
            // arr1.push(o.deviceName);
          }
        })
      }
      if (bayonetArr && bayonetArr.length > 0) {
        bayonetArr.forEach(item => {
          this.selectBayonetArr.push(item);
          let o = this.deviceList.find(x => {return item === x.uid});
          if (o) {
            arrIds.push(o.uid);
            // arr1.push(o.bayonetName);
          }
        })
      }
      console.log(arrIds);
      
      if (arrIds.length > 0) {
        console.log('aaaaaaaaaaaa');
        console.log(arrIds);
        
        this.activeSelectList = arrIds;
        this.chooseType = 2;
        this.dSum = arrIds.length;
      }

      this.showNewTask = true;
    }
  }
}
</script>

<style lang="scss" scoped>

@media screen and (max-width: 1439px) {
  .list-box {
    > .rlcx_r_list {
      li {
        width: 33%;
        > div {
          > img {
            top: 30px;
            width: 150px;
            height: 150px;
          }
          > div {
            margin-left: 160px;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1440px) {
  .list-box {
    > .rlcx_r_list {
      li {
        width: 24.5%;
        > div {
          > img {
            top: 10px;
            width: 190px;
            height: 190px;
            border: 1px solid #f2f2f2;
          }
          > div {
            margin-left: 200px;
          }
        }
      }
    }
  }
}

.peer_xzsb_s {
  height: 40px;
  line-height: 40px;
  width: calc(100% - 40px);
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  cursor: pointer;
  color: #999999;
  padding: 0 6px;
  margin-left: 20px;
  > span {
    display: inline-block;
    width: 50%;
    &:last-child {
      text-align: right;
    }
  }
}
.peer_dtxz_rst {
  width: calc(100% - 40px);
  line-height: 40px;
  padding: 0px 15px; margin-top: 5px;
  margin-left: 20px;
  background-color: #F5F7FA;
  color: #C0C4CC;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  > span {
    display: inline-block;
    padding: 0 3px;
    color: #333;
  }
  > a {
    display: inline-block;
    padding-left: 5px;
    color: #2580FC !important;
    text-decoration: none !important;
    /*font-style: italic;*/
    cursor: pointer;
  }
}
.peer-analysis {
  width: 100%; height: 100%;
  overflow: hidden;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .the-bottom {
    width: 100%;
    margin-top: 50px;
    height: calc(100% - 50px);
    display: flex;
    position: relative;
      // overflow: hidden;
    .the-left-search {
      width: 272px;
      height: 100%;
      // min-height: 600px;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding-top: 20px;
      position: relative;
      .task_name {
        font-size: 14px;
        height: 40px;
        margin-left: 20px;
        margin-bottom: -10px;
        span:first-child {
          color: #999999;
        }
        span:last-child {
          color: #333333;
        }
      }
      > ul {
        width: 100%;
        margin-bottom: 20px;
        padding-left: 20px;
        li:nth-child(1) {
          img {
            display: inline-block;
            width: 232px;height: 232px;
            border-radius: 10px;
          }
        }
        li {
          padding-bottom: 10px;
          span:nth-child(1) {
            color: #999;
            display: inline-block;
            width: 75px;
            vertical-align: top;
          }
          span:nth-child(2) {
            display: inline-block;
            width: calc(100% - 75px);
            color: #555;
          }
        }
      }
      .update_task{
        text-align: center;
      }
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #D3D3D3;
        padding-bottom: 10px;
        margin-bottom: 10px;
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 20px 0;
        .el-input__inner {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-input__icon {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-range-editor {
          width: 100%;
          /*padding: 0;*/
          > .el-range__close-icon {
            display: none;
          }
          > input {
            width: 50%;
          }
          /*.el-range-separator {*/
          /*height: 40px;*/
          /*line-height: 40px;*/
          /*width: 10px;*/
          /*padding: 0;*/
          /*}*/
        }
        button {
          width: 110px;
          height: 40px;
          line-height: 40px;
          padding: 0 12px;
        }
        .el-select {
          margin-bottom: 10px;
        }
        > div {
          margin-bottom: 10px;
        }
        .vl_jtc_search_item {
          height: 217px;
          .camera-tree {
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            -webkit-box-sizing: border-box;
          }
        }
      }
      .ytsr_left_radio {
        padding-left: 20px;
        margin: 20px 0;
        display: flex;
        height: 40px;
        >span {
          display: block;
          &:first-child {
            width: 90px;
            line-height: 40px;
          }
        }
      }
      .per_left_time {
        margin-left: 20px;
        width: 232px;
        .el-select {
          width: 100%;
        }
        .left_time {
          width: 100%;
          margin: 0 0 10px 0;
          .el-date-editor {
            width: 100%;
          }
          .el-range__close-icon {
            display: none;
          }
        }
      }
    }
    .the-right-result {
      width: calc(100% - 285px);
      height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 0 25px 0;
      overflow-y: hidden;
      .the-result-box-peer {
        width: 100%; height: 100%;
        background: #F6F8F9;
        .the-result-number {
          color: #333;
          padding: 0 0 8px 12px;
          span {
            color: #666;
          }
        }
        .list-box {
          display: flex;
          flex-wrap: wrap;
          flex-flow: row wrap;
          > .rlcx_r_list {
            width: 100%;
            padding: 5px;
            li {
              // width: 33%;
              padding: 5px;
              float: left;
              > div {
                position: relative;
                height: 210px;
                padding: 10px;
                background-color: #fff;
                box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
                > img {
                  position: absolute;
                  left: 10px;
                }
                > div {
                  height: 100%;
                  > h4 {
                    color: #999;
                    margin-bottom: 10px;
                  }
                  > div {
                    position: relative;
                    height: 30px; line-height: 30px;
                    margin-bottom: 10px; padding-left: 30px;
                    font-size: 12px;
                    background:rgba(250,250,250,1);
                    border:1px solid rgba(242,242,242,1);
                    border-radius:3px;
                    > i {
                      position: absolute; top: 7px; left: 10px;
                      width: 12px; height: 15px;
                      &.rlcx_sxt { background-position: -325px -377px; }
                      &.rlcx_sj { background-position: -787px -376px; }
                    }
                  }
                }
              }
            }
          }
        }
        .th-center-pagination {
          width: 100%;
          text-align: center;
          padding: 20px 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
  .per_semblance_ytsr {
    position: relative;
    margin-bottom: 10px;
    padding-left: 20px;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
      color: #999999;
      width: 95px;
      padding-left: 12px;
    }
    >i {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #999;
      margin: 19px 16px;
      vertical-align: middle;
    }
    .el-input {
      width: 180px;
      margin-right: 10px;
      input{
        text-indent: 69px;
      }
    }
  }
</style>
