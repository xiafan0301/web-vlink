<template>
  <div class="wr_main">
    <ul>
      <li v-for="(item, index) in aWRData" :key="'wr_list_' + index">
        <div class="wr_video_container" :id="videoContainerIdPre + item.remoteId" v-show="item.isOpen">
          <video :muted="item.mute" :id="videoIdPre + item.remoteId" style="object-fit: fill;" autoplay></video>
          <div class="vl_icon vl_icon_vc_011 wr_video_scale" v-show="item.isTime" @click="item.isOpen = false"></div>
          <div class="wr_video_user">
            <img src="../../assets/img/wr_photo.png" alt="">
            <div>
              <h3>{{item.remoteName ? item.remoteName : item.remoteId}}</h3>
              <p class="wr_dl_user_msg">正在准备通话</p>
            </div>
          </div>
          <div class="wr_video_opts">
            <p v-if="item.isTime" style="margin-bottom: 20px;">
              {{item.minute &lt; 10 ? '0' + item.minute : item.minute}}:{{item.second &lt; 10 ? '0' + item.second : item.second}}
            </p>
            <div class="wr_video_opts_l">
              <span v-if="item.type === '1'" :class="{'wr_video_on_connect': !item.isTime}">
                <span @click="wrSwitchCall(item)" class="vl_icon" :class="{'vl_icon_vc_025': !item.isTime, 'vl_icon_vc_023': item.isTime}"></span>
                <p v-if="item.type === '0'">切到视频聊天</p>
                <p v-else>切换到语音</p>
              </span>
              <span @click="wrClose(item, true)">
                <span class="vl_icon vl_icon_vc_021"></span>
                <p>取消</p>
              </span>
              <span @click="wrMute(item)" v-if="item.isTime">
                <span class="vl_icon"  :class="{'vl_icon_vc_024': item.mute, 'vl_icon_vc_022': !item.mute}"></span>
                <p>静音</p>
              </span>
            </div>
          </div>
          <span class="wr_video_mask" v-show="item.type === '0'"></span>
        </div>
        <div class="wr_video_mini"  @click="item.isOpen = true" v-show="!item.isOpen">
          <p>{{item.minute &lt; 10 ? '0' + item.minute : item.minute}}:{{item.second &lt; 10 ? '0' + item.second : item.second}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import {webrtcConfig} from '@/config/config.js';
  import {random14} from '../../utils/util.js';
  import {oWRMsgs} from './webrtc.data.js';
  import {MapGETmonitorList} from '../../views/index/api/api.map.js';
  export default {
    /**
     *  // 初始化的时候webrt对象
     *  aInit: [webrtcObj, ...],
     *  // 需要新增webrtc对象
     *  oAdd: webrtcObj,
     *  // 需要删除webrtc对象
     *  oDel: webrtcObj,
     *  // webrtc配置信息
     *  oConfig: {
   *    localId: '', // 本地ID
   *  }
     *
     *  webrtcObj: {
   *    // localId: '', // 本地ID (在oConfig中)
   *    remoteId: '', // 对方ID
   *    remoteName: '', // 对方名称
   *    type: 1, // 1视频 / 2语音
   *  }
     *
     *  emits:
     *   wrStateEmit(oData) // 通话状态改变的emit
     *  exceptCalling // 收到移动端的通话请求，
     *  wrSwitchCall // 视频切换到语音通话
     */
//  props: ['oInit', 'oAdd', 'oDel', 'oConfig'],
    data () {
      return {
        localId: 'aorise',
        aWRData: [], // webrtcObj
        bReconnect: true,
        max: 3, // 同时通话的最大数量
        config: {
        },

        // websocket 存储对象
        wsObj: {
          stompHeaders: null,
          stompClient: null,
          submessage: null,
          subping: null,
          pongInval: null, // 心跳定时器
          pongTime: 30 * 1000,
          wsTimeout: null,
          wsLimit: 3
        },
        // webrtc 存储对象
        wrObj: {
          pcs: {},
          mediaStream: null,
          candidateList: {}, // 候选集合
        },
        videoContainerIdPre: 'remoteContainer_',
        videoIdPre: 'remoteVideo_'
      }
    },
    computed: {
      oAdd () {
        return this.$store.state.oAdd;
      },
      oDel () {
        return this.$store.state.oDel;
      },
      callingList () {
        return this.$store.state.callingList;
      },
      oWaitAdd () {
        return this.$store.state.oWaitAdd;
      }
    },
    watch: {
      // 添加通话
      oAdd () {
        console.log('watch oAdd:', this.oAdd);
        this.wrAdd(this.oAdd, this.oAdd.oMsData);
      },
      // 删除通话
      oDel () {
        console.log('watch oDel:', this.oDel); // remoteId
        this.wrClose(Object.assign({}, this.oAdd), true);
      },
      oWaitAdd () {
        console.log('watch oAdd:', this.oWaitAdd);
        let flag = false; // 是否已经在通话中
        for (let i = 0; i < this.aWRData.length; i++) {
          if (this.aWRData[i].remoteId === this.oWaitAdd.remoteId) {
            flag = true;
            break;
          }
        }
        if (flag) {
          this.$message({
            message: '您已经在与 ' + this.oWaitAdd.remoteName + '（' + this.oWaitAdd.remoteId + '）进行通话！',
            type: 'warning'
          });
          // this.$emit('wrClose', {uid: obj.uid, _mid: obj._mid});
          return;
        }
        if (this.aWRData && this.aWRData.length >= this.wsObj.wsLimit) {
          this.$message({
            message: '您最多一次与 ' + this.wsObj.wsLimit + ' 个人进行通话！',
            type: 'info'
          });
          return;
        } else {
          this.$store.commit('ADD_WEBRTC', {oAdd: this.oWaitAdd})
        }
      }
    },
    created () {
      if (this.oConfig && this.oConfig.localId) {
        this.localId = this.oConfig.localId;
      } else {
        this.localId = this.$store.state.loginUser.uid;
//      this.localId = this.$store.state.loginUser.userMobile;
      }
      console.log('webrtc localId', this.localId);
      // 初始化websocket
      this.wsInit({
        username: this.localId,
        name: this.localId
      });
    },
    mounted () {
    },
    methods: {
      /* =========== websocket 函数 =========== */
      // 初始化websocket
      wsInit (_data) {
        let _this = this;
        let stompHeaders =  Object.assign({}, webrtcConfig.stompHeaders, {
          username: _data.username,
          name: _data.name
        });
        this.wsObj.stompHeaders = stompHeaders;
        let stompClient = window.Stomp.client(webrtcConfig.wsUrl + '?r=' + Math.random() + '&' + $.param(stompHeaders));
        stompClient.connect(stompHeaders, function () {
          _this.wsObj.stompClient = stompClient;
          console.log('websocket 连接成功！');
          // subscribe 接收到消息
          let submessage = stompClient.subscribe(webrtcConfig.apis.message, _this.wsMessageCallback);
          // subscribe 接收到心跳
          let subping = stompClient.subscribe(webrtcConfig.apis.ping, _this.wsPingCallback);
          _this.wsObj.submessage = submessage;
          _this.wsObj.subping = subping;
          // 发送心跳 30S一次
          _this.wsObj.pongInval = window.setInterval(function () {
            stompClient.send(webrtcConfig.apis.pong, stompHeaders, '');
          }, _this.wsObj.pongTime);
        }, function (error) {
          console.log('websocket 连接失败:', error);
          // 取消心跳定时器
          if (_this.wsObj.pongInval) {
            window.clearInterval(_this.wsObj.pongInval);
            _this.wsObj.pongInval = null;
          }
          // 取消订阅
          if (_this.wsObj.submessage) {
            _this.wsObj.submessage.unsubscribe();
            _this.wsObj.submessage = null;
          }
          if (_this.wsObj.subping) {
            _this.wsObj.subping.unsubscribe();
            _this.wsObj.subping = null;
          }
          if (_this.bReconnect) {
            // 重连ws
            _this.wsObj.wsTimeout = window.setTimeout(() => {
              _this.wsReInit(_data);
            }, 3000);
          }
        });
      },
      // 重连ws
      wsReInit (_data) {
        // 关闭ws定时器
        if (this.wsObj.wsTimeout) {
          window.clearTimeout(this.wsObj.wsTimeout);
        }
        console.log('重连 websocket');
        this.wsInit(_data);
      },
      /**
       * 接收到消息后的回调函数
       * @param {object} message
       */
      wsMessageCallback (message) {
        if (message.body) {
          this.wrWsMessageHandler(message.body);
        }
      },
      wsPingCallback () {
      },
      /**
       * websocket 发送信令
       * @param {string} signal 信令
       * @param {object} obj
       { type: 'CANDIDATE',  // 信令类型
         data: JSON.stringify(event.candidate), // 传输的数据
         recipient: obj.userId,  // 接收人ID
         recipientName: obj.userName // 接收人名称
       }
       */
      wsSend (signal, obj) {
        if (this.wsObj.stompClient) {
          this.wsObj.stompClient.send(signal, this.wsObj.stompHeaders, JSON.stringify(Object.assign({
            sender: obj.remoteId,
            senderName: this.$store.state.loginUser.userName,
            senderImgurl: '',
            limit: this.wsObj.wsLimit
          }, obj)));
        }
      },
      /* =========== webrtc 函数 =========== */
      /**
       * 添加WR
       * @param {object} obj webrtcObj
       * @param {m} desc
       */
      wrAdd (obj, desc) {
        if (obj && obj.remoteId) {
          // 添加isOpen字段，是否最小化
          obj['isOpen'] = true;
//        if (this.aWRData && this.aWRData.length >= this.wsObj.wsLimit) {
//          this.$message({
//            message: '您最多一次与 ' + this.wsObj.wsLimit + ' 个人进行通话！',
//            type: 'warning'
//          });
//          this.wrClose(obj);
//          return;
//        }
//        let flag = false; // 是否已经在通话中
//        for (let i = 0; i < this.aWRData.length; i++) {
//          if (this.aWRData[i].remoteId === obj.remoteId) {
//            flag = true;
//            break;
//          }
//        }
//        if (flag) {
//          this.$message({
//            message: '您已经在与 ' + obj.remoteName + '（' + obj.remoteId + '）进行通话！',
//            type: 'warning'
//          });
//          // this.$emit('wrClose', {uid: obj.uid, _mid: obj._mid});
//          return;
//        }
          // this.aWRData.push(obj);
          this.$nextTick(() => {
            this.wrMediaStream(obj.type, obj, desc);
          });
        } else {
          console.log('wrAdd >>> remoteId为空！');
        }
      },
      /**
       * 接收到ws的消息后wr处理器
       * @param {object} message
       */
      wrWsMessageHandler (message) {
        let _this = this;
        let oMsg = JSON.parse(message);
        console.log(message)
        if (oMsg.type === 'CANDIDATE') {
          // 收到 CANDIDATE 候选
          let oData = JSON.parse(oMsg.data);
          if (_this.wrObj.pcs && _this.wrObj.pcs[oMsg.sender]) {
            // 已有PC，说明是主动呼叫，则向本机PC添加候选
            try {
              _this.wrObj.pcs[oMsg.sender].addIceCandidate(new RTCIceCandidate(oData)).catch(e => console.log('**', e));
            } catch (error) {
              console.log(error);
            }
          } else {
            // 无PC，则先将候选保存起来
            if (!_this.wrObj.candidateList[oMsg.sender]) {
              _this.wrObj.candidateList[oMsg.sender] = [];
            }
            _this.wrObj.candidateList[oMsg.sender].push(oData);
          }
        } else if (oMsg.type === 'OFFERED') {
          // 收到OFFER
          console.log('1')
          _this.wrRecipient(oMsg, false);
        } else if (oMsg.type === 'ADD_OFFERED') {
          console.log('2')
          // 收到OFFER
          _this.wrRecipient(oMsg, true);
        } else if (oMsg.type === 'ANSWERED') {
          // 收到应答 正常PC都是已经有了的
          if (_this.wrObj.pcs && _this.wrObj.pcs[oMsg.sender]) {
            let oData = null;
            try {
              oData = JSON.parse(oMsg.data);
            } catch (e) {console.log(e)}
            if (oData) {
              // 设置对方的Description
              _this.wrObj.pcs[oMsg.sender].setRemoteDescription(new RTCSessionDescription(oData));
              // 如果候选列表存在，则发送候选
              if (_this.wrObj.candidateList && _this.wrObj.candidateList[oMsg.sender] && _this.wrObj.candidateList[oMsg.sender].length > 0) {
                for (let i = 0; i < _this.wrObj.candidateList[oMsg.sender].length; i++) {
                  _this.wsSend(webrtcConfig.apis.candidate, {
                    type: 'CANDIDATE',
                    data: _this.wrObj.candidateList[oMsg.sender][i],
                    recipient: oMsg.sender,
                    recipientName: oMsg.senderName
                  });
                }
                delete _this.wrObj.candidateList[oMsg.sender];
              }
            }
          }
        } else if (oMsg.type === 'REFUSED') {
          // (房主)拒绝视频请求refuse信令
          console.log('wr >>>> REFUSED');
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'REMOVED') {
          // 房主移除成员remove信令
          console.log('wr >>>> REMOVED');
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'MEMBER_REFUSED') {
          // 成员拒绝视频请求
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'MEMBER_LEAVED') {
          // 频通信者离开房间信令 -> 成员离开聊天室
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'ROOM_DISSOLVED') {
          // 聊天室解散
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'ADD_MEMBER_REFUSED') {
          // 拒绝视频加入房间请求addrefuse信令  -> 房主拒绝成员加入?
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'DUPLICATE_CONNECTION') {
          // 账号已经在其它地方登录
          _this.wrOff(oMsg);
          // 断开连接 清除定时器
          _this.bReconnect = false;
          if (_this.wsObj.stompClient) {
            _this.wsObj.stompClient.disconnect();
          }
          if (_this.wsObj.pongInval) {
            window.clearInterval(this.wsObj.pongInval);
          }
          if (_this.wsObj.wsTimeout) {
            window.clearTimeout(this.wsObj.wsTimeout);
          }
          localStorage.setItem('as_vlink_user_info', '');
          _this.$router.push({name: 'login'});
        } else if (oMsg.type === 'SIGNAL_ROOM_FULL') {
          // 房间已满
          _this.wrOff(oMsg);
        } else if (oMsg.type === 'CHANGE') {
          // 切换
          console.log('切换')
          let _t = _this.aWRData.find(x => x.remoteId === oMsg.sender);
          if (_t && _t.type === '1') {
            _this.wrSwitchCall(_t)
          }
        }
      },
      // 接收通话请求
      wrRecipient (oMsg, isAddOffered) {
        let _this = this;
        _this.$confirm('收到' + oMsg.senderName + '的视频请求，确定接收吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let t = oMsg.audioFlag ? '2' : '1';
//        _this.wrAdd({
//          type: t,
//          remoteId: oMsg.sender,
//          remoteName: oMsg.sender
//        }, oMsg.data);
          // 把接受到的参数传给地图
          let eC = {
            type: t,
            remoteId: oMsg.sender,
            remoteName: oMsg.sender,
            oMsData: oMsg.data,
            isAddOffered: isAddOffered
          }
          _this.exceptCalling(eC)
        }).catch(() => {
          // 拒绝
          if (isAddOffered) {
            // 拒绝加入房间
            _this.wsSend(webrtcConfig.apis.addrefuse, {
              type: 'ADD_MEMBER_REFUSED',
              data: '对方已拒绝！',
              recipient: oMsg.sender,
              recipientName: oMsg.senderName
            });
          } else {
            // 拒绝
            _this.wsSend(webrtcConfig.apis.refuse, {
              type: 'REFUSED',
              data: '对方已拒绝！',
              recipient: oMsg.sender,
              recipientName: oMsg.senderName
            });
          }
        });
      },
      /*
       * 唤起音视频设备，成功则发送/接收通讯
       * @param {int} type: 1视频 2语音
       * @param {object} obj: 信息实体
       *     remoteId:   对方身份标识
       *     remoteName: 对方名称
       * @param {string} desc: 接收时收到的Description字符串，为空则是发送
       * */
      wrMediaStream (type, obj, desc) {
        let _this = this;
        if (!_this.wrObj.mediaStream) {
          // 设备还没被唤醒
          navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
          if (!navigator.getMedia) {
            _this.wrClose(obj);
            alert('对不起，您的浏览器不支持视频通话。');
            return;
          }
          console.log(type === '1' ? true : false)
          navigator.getMedia({
            'audio': true,
            'video': type === '1' ? true : false
          }, function (stream) {
            console.log('getUserMedia success');
            _this.aWRData.push(obj);
            // 将设备视频保存下来
            _this.wrObj.mediaStream = stream;
            // localVideo
//          _this.vedioHandler('localVideo', stream); // 本机视频
            _this.wrCreatConnection(type, obj, desc);
            _this.wrStateHandler({
              remoteId: obj.remoteId,
              state: 11, // 等待对方接听
              uid: obj.uid
            });
          }, function (error) {
            // 媒体流创建失败错误
            console.log('getUserMedia error: ' + error);
            navigator.getMedia({
              'audio': true,
              'video': false
            }, function (_stream) {
              _this.aWRData.push(obj);
              _this.wrObj.mediaStream = _stream;
              _this.wrCreatConnection(type, obj, desc);
              _this.wrStateHandler({
                remoteId: obj.remoteId,
                state: 11, // 等待对方接听
                uid: obj.uid
              });
            }, function (_error) {
              console.log(_error)
              _this.wrClose(obj);
              _this.$message.info('您的设备没有摄像头也没有麦，无法通话')
            })
          });
        } else {
          console.log('----------------222222')
          // 设备已经被唤醒
          _this.aWRData.push(obj);
          _this.wrCreatConnection(type, obj, desc);
          _this.wrStateHandler({
            remoteId: obj.remoteId,
            uid: obj.uid,
            state: 11 // 等待对方接听
          });
        }
      },
      /*
       * 建立连接（）
       * @param {int} type: 1语音 2视频
       * @param {object} obj: 实体
       * @param {string} desc: 接收时收到的Description字符串，为空则是发送
       * */
      wrCreatConnection (type, obj, desc) {
        let _this = this;
        // 获取PeerConnection
        let _pc = this.wrGetPeerConnectionWithTurn();
        // 收到iceconnectionstatechange事件时调用的事件处理器，当iceConnectionState改变时，这个事件被触发。
        _pc.oniceconnectionstatechange = function () {
          // console.log('====== iceConnectionState', _pc.iceConnectionState);
          let _state = _pc.iceConnectionState;
          if (_state === 'new') {
            // 新建连接
            console.log('wr >>>>> 新建连接');
            obj.state = 12;
          } else if (_state === 'connecting') {
            // 连接中
            console.log('wr >>>>> 连接中');
            obj.state = 13;
          } else if (_state === 'connected') {
            // 已连接
            console.log('wr >>>>> 已连接');
            obj.state = 20;
          } else if (_state === 'disconnected') {
            // 断开连接
            console.log('wr >>>>> 断开连接');
            obj.state = 32;
          } else if (_state === 'failed') {
            // 连接失败
            console.log('wr >>>>> 连接失败');
            obj.state = 31;
          } else if (_state === 'closed') {
            // 连接关闭
            obj.state = 33;
            console.log('wr >>>>> 连接关闭');
          }
          _this.wrStateHandler(obj);
        };
        // 候选
        _pc.onicecandidate = function (event) {
          if (event.candidate) {
            if (_pc.remoteDescription) {
              // 已经存在remote信息，则直接发送候选 （接收）
              _this.wsSend(webrtcConfig.apis.candidate, {
                type: 'CANDIDATE',
                data: JSON.stringify(event.candidate),
                recipient: obj.remoteId,
                recipientName: obj.remoteName
              });
            } else {
              // 不已经存在remote信息，先将候选储存起来，收到应答后才发送候选 （发送）
              if (!_this.wrObj.candidateList[obj.remoteId]) {
                _this.wrObj.candidateList[obj.remoteId] = [];
              }
              _this.wrObj.candidateList[obj.remoteId].push(JSON.stringify(event.candidate));
            }
          }
        };
        // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
        _pc.onaddstream = function (event) {
          console.log('终端流', event)
          _this.vedioHandler(_this.videoIdPre + obj.remoteId, event.stream);
        };
        // 向PeerConnection中加入需要发送的流
        _this.wrObj.mediaStream ? _pc.addStream(_this.wrObj.mediaStream) : _pc.addStream(new MediaStream());
        // 将PC存储起来
        _this.wrObj.pcs[obj.remoteId] = _pc;
        if (desc) {
          // 接收
          let oData = null;
          try {
            oData = JSON.parse(desc);
          } catch (e) { console.log('解析desc失败', e); }
          if (oData) {
            _pc.setRemoteDescription(new RTCSessionDescription(oData));
          }
          if (_this.wrObj.candidateList && _this.wrObj.candidateList[obj.remoteId] && _this.wrObj.candidateList[obj.remoteId].length > 0) {
            for (let i = 0; i < _this.wrObj.candidateList[obj.remoteId].length; i++) {
              try {
                _pc.addIceCandidate(new RTCIceCandidate(_this.wrObj.candidateList[obj.remoteId][i])).catch(e => console.log('**', e));
              } catch (error) {
                console.log(error);
              }
            }
            delete _this.wrObj.candidateList[obj.remoteId];
          }
          // 发送应答信令 ===========================
          _pc.createAnswer(function (desc) {
            _pc.setLocalDescription(desc);
            _this.wsSend(obj.isAddOffered ? webrtcConfig.apis.addanswer : webrtcConfig.apis.answer, {
              type: obj.isAddOffered ? 'ADDANSWERED' : 'ANSWERED',
              data: JSON.stringify(desc),
              recipient: obj.remoteId,
              recipientName: obj.remoteName
            });
          }, function (error) {
            console.log('Failure callback: ' + error);
          });
        } else {
          // 发送
          setTimeout(function () {
            _pc.createOffer(function (desc) {
              _pc.setLocalDescription(desc);
              _this.wsSend(webrtcConfig.apis.offer, {
                type: 'OFFERED',
                audioFlag: type === 2, // 音频标识，true不传false为视频
                extras: JSON.stringify({
                  // eventID: _this.eventObj.eventId,
                  // userPhone: obj.reporterPhone,
                  // userRole: obj.reporterRole
                }),
                data: JSON.stringify(desc),
                recipient: obj.remoteId,
                recipientName: obj.remoteName
              });
            }, function (error) {
              console.log('Failure callback: ' + error);
            });
          }, 100);
        }
      },
      /*
       * 获取PeerConnection
       * */
      wrGetPeerConnectionWithTurn () {
        // stun和turn服务器
        let iceServer = {
          iceServers: [
            { urls: 'stun:' + webrtcConfig.turnUrl },
            {
              urls: 'turn:' + webrtcConfig.turnUrl,
              username: webrtcConfig.turnUsername,
              credential: webrtcConfig.turnCredential
            }
          ]
        };
        // 创建PeerConnection实例 (参数为null则没有iceserver，即使没有stunserver和turnserver，仍可在局域网下通讯)
        let PeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        let pc = new PeerConnection(iceServer);
        return pc;
      },
      /*
       * 通讯断开连接
       * oMsg  sender&senderName & audioFlag
       * flag 主动挂断，则需要发送 remove/leave信令
       * */
      wrOff (oMsg, flag) {
        // 关闭PC
        if (this.wrObj.pcs && this.wrObj.pcs[oMsg.sender]) {
          this.wrObj.pcs[oMsg.sender].close();
          this.wrObj.pcs[oMsg.sender] = null;
          if (flag) {
            // 移除
            this.wsSend(webrtcConfig.apis.remove, {
              type: 'REMOVED',
              data: '',
              recipient: oMsg.sender,
              recipientName: oMsg.sender
            });
            console.log('关闭')
          }
          // MEMBER_LEAVED
          this.wsSend(webrtcConfig.apis.leave, {
            type: 'MEMBER_LEAVED',
            data: '',
            recipient: oMsg.sender,
            recipientName: oMsg.sender
          });
        }
        // 显示提示信息
        if (oMsg && oMsg.data) {
          this.$message(oMsg.data);
        }
        // 删除数据对象，删除窗口
        for (let i = 0; i < this.aWRData.length; i++) {
          let _o = this.aWRData[i];
          if (_o.remoteId === oMsg.sender) {
            this.aWRData.splice(i, 1);
            break;
          }
        }
        // 当没有通话的时候则关闭媒体设备
        if ((!this.aWRData || this.aWRData.length <=0) && this.wrObj.mediaStream) {
          let mediaStreamTracks = this.wrObj.mediaStream.getTracks();
          if (mediaStreamTracks) {
            for (let i = 0; i < mediaStreamTracks.length; i++) {
              mediaStreamTracks[i].stop();
            }
          }
          this.wrObj.mediaStream = null;
        }
      },
      /**
       * 通话状态处理器
       * obj
       * @param {string} remoteId 通讯方ID
       * @param {int} state 状态
       */
      wrStateHandler (obj) {
        console.log(obj)
        // 消息提示
        this.wrMsgHandler({
          remoteId: obj.remoteId,
          state: obj.state
        });
        // emmit
        /*
          通话状态改变emit
          remoteId: 通讯方ID remoteId
          state: 状态
          {}：其它信息
         */
        this.wrStateEmit(obj);
      },
      /**
       * 通话消息提示处理器 oWRMsgs
       * @param {object} obj  remoteId&state
       */
      wrMsgHandler (obj) {
        let $container = $('#' + this.videoContainerIdPre + obj.remoteId);
        // 通话窗口用户信息提示
        $container.find('.wr_dl_user_msg').text(oWRMsgs.dlUserMsgs[obj.state]);
      },
      /**
       * vedio处理器
       * @param {string} nid vedio的ID
       * @param {stream} stream 视频流，为空则是删除视频
       */
      vedioHandler (nid, stream) {
        let _node = document.getElementById(nid);
        if (_node) {
          if (typeof _node.srcObject !== 'undefined') {
            _node.srcObject = stream ? stream : null;
          } else if (typeof _node.mozSrcObject !== 'undefined') {
            _node.mozSrcObject = stream ? stream : null;
          } else if (typeof _node.src !== 'undefined') {
            _node.src = stream ? URL.createObjectURL(stream) : '';
          } else {
            console.log('Error attaching stream to element. ----> ' + nid);
          }
          if (!stream) {
            // $(_node).parent().html('<video id="' + nid + '" autoplay></video>');
          }
        }
      },
      // 切换语音
      wrSwitchCall (item) {
        item.type === '0' ? item.type = '1' : item.type = '0';
        this.$store.commit('SWITCH_CALL', Object.assign({}, item))
        this.wsSend(webrtcConfig.apis.change, {
          type: 'CHANGE',
          recipient: item.remoteId,
          recipientName: item.remoteName
        });
      },
      // 静音
      wrMute (item) {
        item.mute = !item.mute;
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
        // 自己构造 oMsg
        this.wrOff({
          sender: data.remoteId
        }, true);
      },
      // 收到手机端发送的视频请求
      exceptCalling (data) {
        // 增加通话对象到webrtc ，先查询到该来点用户信息，
        let params = {
          areaUid: '431224'
        }
        MapGETmonitorList(params).then( res => {
          if (res) {
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
            console.log(_obj)
            this.$store.commit('ADD_WEBRTC', {oAdd: cObj})
          }
        })
      }
    },
    beforeDestroy () {
      this.bReconnect = false;
      if (this.wsObj.stompClient) {
        this.wsObj.stompClient.disconnect();
      }
      if (this.wsObj.pongInval) {
        window.clearInterval(this.wsObj.pongInval);
      }
      if (this.wsObj.wsTimeout) {
        window.clearTimeout(this.wsObj.wsTimeout);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .wr_main {
    position: absolute; left: 260px; bottom: 0px;
    z-index: 2;
    > ul {
      overflow: hidden;
      > li {
        float: left;
        padding: 10px;
        min-width: 120px;
        > div.wr_video_container {
          position: relative;
          width: 254px; height: 400px;
          background-color: #000;
          color: #fff;
          > video { width: 100%; height: 100%; }
          > div {
            z-index: 4;
          }
          > .wr_video_mask {
            z-index: 3;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: #000000;
          }
        }
        > div.wr_video_mini {
          position: absolute;
          bottom: -50px;
          width: 100px;
          height: 100px;
          background: #0C70F8;
          color: #ffffff;
          border-radius: 50%;
          padding-top: 19px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background: #409eff;
          }
        }
      }
    }
  }
  .wr_video_scale {
    display: none;
    position: absolute; top: 15px; right: 8px; z-index: 2;
    cursor: pointer;
    animation: fadeIn .4s ease-out;
  }
  .wr_video_user {
    position: absolute; top: 15px; left: 10px; z-index: 2;
    > img {
      position: absolute; top: 4px; left: 0;
      width: 46px; height: 46px;
    }
    > div {
      padding-left: 52px;
      > h3 { font-size: 22px; color: #fff; }
      > p { padding-top: 5px; font-size: 12px; color: #f6f6f6; }
    }
  }
  .wr_video_opts {
    position: absolute; bottom: 15px; left: 0; z-index: 2;
    width: 100%;
    text-align: center;
    > .wr_video_opts_l {
      > span {
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
        vertical-align: top;
        > span {
          &:hover {
            background-color: rgba(255, 255, 255, .2);
          }
          -webkit-border-radius: 24px;
          -moz-border-radius: 24px;
          border-radius: 24px;
          font-size: 30px;
          padding: 8px;
        }
        > p {
          color: #fff;
          font-size: 12px;
        }
      }
      > .wr_video_on_connect {
        position: absolute;
        top: -80px;
        left: 87px;
        > span {
          border-color: #000000;
          border-width: 5px;
          &:hover {
            background-color: rgba(255, 255, 255, 0);
          }
        }
      }
    }
  }
  .wr_video_container:hover {
    .wr_video_scale { display: block; }
  }
</style>
