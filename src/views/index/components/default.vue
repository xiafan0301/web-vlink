<template>
  <div class="vl_main">
    <div is="vlinkHeader"></div>
    <div class="vl_content">
      <router-view></router-view>
    </div>
    <!-- 登录提示dialog -->
    <!-- <el-dialog
      title="登录提示"
      :visible.sync="loginDialogVisible"
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
      :append-to-body="true"
      width="400px">
      <p style="padding: 20px 0 10px 0;">登录已过期，请重新登录！</p>
      <p style="padding: 10px 0 0 0;">系统将在&nbsp;<span style="color: red; font-size: 16px;">{{time}}</span>&nbsp;秒后自动进入登录页面。</p>
      <div style="padding: 30px 0 10px 0; text-align: center;">
        <el-button style="width: 80%;" type="primary" @click="reLogin">重&nbsp;新&nbsp;登&nbsp;录</el-button>
      </div>
    </el-dialog> -->
    <!--视频通话-->
    <div is="webrtc" @wrStateEmit="wrStateEmit" @wrClose="wrClose" @wrSwitchCall="wrSwitchCall" @exceptCalling="exceptCalling" :oAdd="oAdd" :oDel="oDel"></div>
  </div>
</template>
<script>
import {random14} from '../../../utils/util.js';
import webrtc from '@/components/common/webrtc.vue';
import vlinkHeader from '../../../components/header.vue';
import {MapGETmonitorList} from '../api/api.map.js';
export default {
  components: {vlinkHeader, webrtc},
  data () {
    return {
      /* loginDialogVisible: false,
      time: 10,
      intval: null */
    }
  },
  computed: {
    unLogin () {
      return this.$store.state.loginToken;
    },
    oAdd () {
      return this.$store.state.oAdd;
    },
    oDel () {
      return this.$store.state.oDel;
    },
    callingList () {
      return this.$store.state.callingList;
    }
  },
  watch: {
    unLogin () {
      console.log('relogin: ', this.$store.state.loginToken);
      this.reLogin();
      /* this.loginDialogVisible = true;
      if (this.intval) {
        window.clearInterval(this.intval);
      }
      this.intval = window.setInterval(() => {
        this.time -= 1;
        if (this.time <= 0) {
          this.reLogin();
          window.clearInterval(this.intval);
        }
      }, 1000); */
    }
  },
  mounted () {
  },
  methods: {
    reLogin () {
      if (this.intval) {
        window.clearInterval(this.intval);
      }
      localStorage.setItem('as_vlink_user_info', '');
      this.$router.push({name: 'login'});
    },
    // 语音视频通话
    wrStateEmit (oData) {
      console.log('状态EMIT oData: ', oData);
      if (oData.state > 20) {
        this.wrClose(oData);
      } else if (oData.state === 20 && oData.minute === 0 && oData.second === 0) {
        this.$nextTick(() => {
          this.$set(oData, 'isTime', true)
        })
        oData.countTime(oData);
        this.$store.commit('STATE_HANDLER', Object.assign({}, oData))
      }
    },
    wrClose (data) {
      // $('#' + data._mid).removeClass('vl_icon_map_mark_calling');
      let o = this.callingList.find(x => x.uid === data.uid);
      if (o) {
        // this.map.remove(o.mark);
        o.clearTime(o);
      }
      // 关闭通话，手动将state设为32，需要监听的模块，监听到继续做响应操作
      data.state = 32;
      this.$store.commit('STATE_HANDLER', Object.assign({}, data));
      this.$store.commit('DEL_WEBRTC', data);
      console.log(this.callingList)
    },
    wrSwitchCall (data) {
      this.$store.commit('SWITCH_CALL', Object.assign({}, data))
    },
    // 收到手机端发送的视频请求
    exceptCalling (data) {
      // 增加通话对象到webrtc ，先查询到该来点用户信息，
      let params = {
        areaUid: '431224'
      }
      MapGETmonitorList(params).then( res => {
        if (res) {
          console.log(res.data);
          let _obj = {}, cObj = {};
          res.data.areaTreeList.forEach(x => {
            x.sysUserExtendList.forEach(y => {
              if (y.uid + '' === data.remoteId) {
                _obj = y;
              }
            })
          })
          cObj = {
            uid: _obj.uid + '',
            longitude: _obj.longitude,
            latitude: _obj.latitude,
            remoteId: _obj.uid + '',
            remoteName: _obj.infoName,
            type: data.type,
            _id: 'mapCall' + random14(),
            _mid: 'mapMark3' +_obj.uid,
            isTime: false,
            minute: 0,
            second: 0,
            timer: null,
            mark: null,
            mute: false,
            oMsData: data.oMsData,
            isAddOffered: data.isAddOffered
          }
          this.$store.commit('ADD_WEBRTC', {oAdd: cObj})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_main {
  height: 100%;
  min-width: 1200px;
  min-height: 625px;
  > .vl_content {
    padding-top: 100px;
    height: 100%;
    background-color: #fafafa;
  }
}
</style>
