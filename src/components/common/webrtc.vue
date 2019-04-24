<template>
  <div class="wr_main">
    <ul>
      <li v-for="(item, index) in aWRData" :key="'wr_list_' + index">
        <div>
          <video src="" :id="videoIdPre + item.remoteId" style="object-fit: fill;"></video>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {webrtcConfig} from '@/config/config.js';
import {random14} from '@/utils/util.js';
export default {
  /** 
   *  index: 视频序号（在列表页面的位置）
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
   */
  props: ['oInit', 'oAdd', 'oDel', 'oConfig'],
  data () {
    return {
      localId: 'aorise',
      aWRData: [{remoteId: 'a111'}, {remoteId: 'a222'}],
      max: 4, // 同时通话的最大数量
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
      videoIdPre: 'remoteVideo_'
    }
  },
  created () {
    if (this.oConfig && this.oConfig.localId) {
      this.localId = this.oConfig.localId;
    } else {
      this.localId = random14();
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
      stompClient.connect(stompHeaders, function (data) {
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
        // 重连ws
        _this.wsObj.wsTimeout = window.setTimeout(() => {
          _this.wsReInit(_data);
        }, 3000);
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
      this.wrWsMessageHandler(message);
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
          sender: this.localId,
          senderName: this.localId,
          senderImgurl: '',
          limit: this.wsObj.wsLimit
        }, obj)));
      }
    },
    /* =========== webrtc函数 =========== */
    /**
     * 接收到ws的消息后wr处理器
     * @param {object} message
     */
    wrWsMessageHandler (message) {
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
        navigator.getMedia({
          'audio': true,
          'video': true
        }, function (stream) {
          console.log('getUserMedia success');
          _this.wrObj.mediaStream = stream;
          // _this.vedioHandler(_this.videoIdPre + obj.remoteId, stream); // 本机视频
          _this.wrCreatConnection(type, obj, desc);
        }, function (error) {
          // 处理媒体流创建失败错误
          console.log('getUserMedia error: ' + error);
          alert('对不起，您的电脑上没有摄像头或摄像头不可用。');
        });
      } else {
        // 设备已经被唤醒
        _this.wrCreatConnection(type, obj, desc);
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
        } else if (_state === 'connecting') {
          // 连接中
          console.log('wr >>>>> 连接中');
        } else if (_state === 'connected') {
          // 已连接
          console.log('wr >>>>> 已连接');
        } else if (_state === 'disconnected') {
          // 断开连接
          console.log('wr >>>>> 断开连接');
        } else if (_state === 'failed') {
          // 连接失败
          console.log('wr >>>>> 连接失败');
        } else if (_state === 'closed') {
          // 连接关闭
          console.log('wr >>>>> 连接关闭');
        }
      };
      // 候选
      _pc.onicecandidate = function (event) {
        if (event.candidate) {
          if (_pc.remoteDescription) {
            // 已经存在remote信息，则直接发送候选 （接收）
            AS_WEBRTC.wsSend(AS_WEBRTC.options.apis.candidate, {
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
        _this.vedioHandler(_this.videoIdPre + obj.remoteId, event.stream);
      };
      // 向PeerConnection中加入需要发送的流
      _pc.addStream(_this.wrObj.mediaStream);
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
          _this.wsSend(webrtcConfig.apis.answer, {
              type: 'ANSWERED',
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
              audioFlag: type === 1, // 音频标识，true不传false为视频
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
          console.log('Error attaching stream to element. ----' + nid);
        }
        if (!stream) {
          // $(_node).parent().html('<video id="' + nid + '" autoplay></video>');
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wr_main {
  position: absolute; left: 10px; bottom: 10px;
  > ul {
    overflow: hidden;
    > li {
      float: left;
      padding: 10px;
      > div {
        width: 254px; height: 400px;
        background-color: #000;
        color: #fff;
        > video { width: 100%; height: 100%; }
      }
    }
  }
}
</style>
