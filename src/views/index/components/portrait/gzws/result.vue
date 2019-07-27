<template>
  <div class="result_container">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[
          {name: '人像侦查', routerName: 'portrait_menu'},
          {name: '跟踪尾随', routerName: 'gzws_portrait'},{name: '分析结果'}]">
      </div>
    </div>
    <div class="content_box">
      <div class="left">
        <ul>
          <li>
            <img :src="taskDetail.taskWebParam && taskDetail.taskWebParam.targetPicUrl" alt="" class="bigImg">
          </li>
          <li>
            <span>任务名称：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>分析时间：</span>
            <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.startTime && taskDetail.taskWebParam.endTime ? taskDetail.taskWebParam.startTime + '-' + taskDetail.taskWebParam.endTime : '无'}}</span>
          </li>
          <li>
            <span>起点设备：</span>
            <span>{{taskDetail.taskWebParam&& taskDetail.taskWebParam.deviceName ? taskDetail.taskWebParam.deviceName : '无'}}</span>
          </li>
          <li>
            <span>尾随间隔：</span>
            <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.interval ? taskDetail.taskWebParam.interval + '分钟' : '无'}}</span>
          </li>
          <li>
            <span>创建时间：</span>
            <span>{{taskDetail.createTime ? taskDetail.createTime : '无'}}</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <template v-if="taskDetail.taskResult && taskDetail.taskResult.length > 0">
          <div class="content_top">
            <p>
              <span>检索结果</span>
              <span>（{{taskDetail.taskResult.length}}）</span>
            </p>
          </div>
          <div class="result_detail">
            <ul class="clearfix">
              <li v-for="(item, index) in taskDetail.taskResult" :key="index">
                <div class="de_left">
                  <img :src="item.subStoragePath" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>{{item.shotTime}}</span>
                  </p>
                  <p class="detail_info">
                    <span v-show="item.sex">{{item.sex}}性</span>
                    <span v-show="item.age">{{item.age}}</span>
                    <span v-show="item.hat" :title="item.hat">{{item.hat}}</span>
                    <span v-show="item.mask" :title="item.mask">{{item.mask}}</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">查看尾随记录</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import { getTaskInfosDetail } from '@/views/index/api/api.analysis.js';
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    return {
      isInitPage: false,
      dataList: [], // 查询的抓拍结果列表
      taskDetail: {} // 离线任务详情
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        getTaskInfosDetail(id)
          .then(res => {
            if (res && res.data) {
              this.taskDetail = res.data;
              this.taskDetail.taskResult = JSON.parse(this.taskDetail.taskResult);
              this.taskDetail.taskWebParam = JSON.parse(this.taskDetail.taskWebParam);

            }
          })
      }
    },
    // 跳至尾随记录页面
    skipWsReocrdPage (obj) {
      console.log('obj', obj)
      let queryObj = JSON.stringify(obj);
      this.$router.push({name: 'gzws_detail', query: {obj: queryObj, id: this.$route.query.id}})
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.result_container {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 265px;
      height: 100%;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
      >ul {
        margin-top: 15px;
        >li {
          line-height: 30px;
          > img {
            width: 160px;
            height: 160px;
          }
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
      }
    }
    .right {
      width: calc(100% - 265px);
      padding: 10px 15px;
      .content_top {
        display: flex;
        justify-content: space-between;
        >p {
          span:first-child {
            color: #333333;
          }
          span:last-child {
            color: #666666;
          }
        }
      }
      .result_detail {
        width: 100%;
        >ul {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-top: 15px;
          >li {
            background-color: #ffffff;
            height: 180px;
            width: 375px;
            max-width: 32%;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            margin-right: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 5px 16px 0px #A9A9A9;
            .de_left {
              width: 45%;
              img {
                width: 130px;
                height: 130px;
              }
            }
            .de_right {
              width: 55%;
              line-height: 30px;
              .title {
                color: #999999;
              }
              .time {
                margin-bottom: 10px;
                padding-left: 5px;
                background:rgba(250,250,250,1);
                border:1px solid rgba(242,242,242,1);
                border-radius:3px;
                color: #333333;
                font-size: 12px;
                
                i {
                  margin-right: 5px;
                }
              }
              .detail_info {
                >span {
                  background-color: #FAFAFA;
                  color: #333333;
                  font-size: 12px;
                  margin-right: 3px;
                  border-radius:3px;
                  // padding: 5px 8px;
                  padding: 0 2px;
                  max-width: 43px;
                  cursor: pointer;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  border: 1px solid #F2F2F2;
                  display: inline-block;
                }
              }
              .record_btn {
                width:100px;
                height:30px;
                background:rgba(246,248,249,1);
                border:1px solid rgba(211,211,211,1);
                border-radius:4px;
                text-align: center;
                cursor: pointer;
                &:hover {
                  background-color: #ffffff;
                  color: #0C70F8;
                  border-color: #0C70F8;
                }
              }
            }
          }
        }
      }
    }
  }
  .reset_btn {
    width: 110px;
    background-color: #D3D3D3;
    color: #666666;
    border-radius: 4px;
    &:hover {
      background-color: #ffffff;
      color: #0C70F8;
      border-color: #0C70F8;
    }
  }
  .select_btn {
    width: 110px;
    background-color: #0C70F8;
    color: #ffffff;
    border-radius: 4px;
  }
}
</style>