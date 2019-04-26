<template>
  <div class="vl_map" :class="{'vl_map_selarea_ctl': selAreaAble}">
    <!-- 左侧导航 -->
    <div class="map_l">
      <div>
        <div class="map_lt">
          <ul>
            <li :class="{'map_lt_ul_sed': tabType === 1}" @click="tabType = 1">地图信息</li>
            <li :class="{'map_lt_ul_sed': tabType === 2}" @click="tabType = 2">标注列表</li>
          </ul>
          <div :style="{'left': tabType === 1 ? 0 : '50%'}"></div>
        </div>
        <div class="map_lc">
          <!-- 地图信息 -->
          <div class="map_lc_d" v-show="tabType === 1">
            <div class="map_lc_dt">
                <el-input
                  size="small"
                  placeholder="搜索"
                  v-model="mapInfoVal">
                </el-input>
            </div>
            <div class="map_lc_dc">
              <vue-scroll>
                <el-tree
                  ref="mapLeftTree"
                  :data="mapTreeData"
                  :render-after-expand="false"
                  node-key="infoName"
                  :filter-node-method="filterNode"
                  :props="mapTreeProps">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span v-if="data.areaType === '5' && data.dataType === 0" class="vl_icon vl_icon_map_002 change_node_pos" style="vertical-align: middle;" :class="{'vl_icon_map_001': data.deviceStatus === 1}"></span>
                    <span class="change_node_pos" v-else-if="!data.infoList"></span>
                    <div class="map_tree_tab" v-if="data['isFirst']">
                      <span @click.stop="switchTab(data, 0, $event)">{{constCamera}}</span>
                      <span @click.stop="switchTab(data, 1, $event)">{{constCard}}</span>
                      <span @click.stop="switchTab(data, 2, $event)">{{constCar}}</span>
                      <span @click.stop="switchTab(data, 3, $event)">{{constPerson}}</span>
                    </div>
                  </span>
                </el-tree>
              </vue-scroll>
            </div>
          </div>
          <!-- 标注历史 -->
          <div class="map_lc_d" v-show="tabType === 2">
            <div class="map_lc_dt">
              <el-input
                size="small"
                placeholder="搜索"
                v-model="markInfoVal">
              </el-input>
            </div>
            <div class="map_lc_dc" style="padding-bottom: .8rem;">
              <vue-scroll>
                <div class="map_lc_dc_mark" v-for="item in computedMarkList" :key="item.id">
                  <div class="dc_mark_c">{{item.markContent}}</div>
                  <p><span>{{item.opUserName}}</span><span>{{item.createTime ? item.time : '未知标注时间'}}</span></p>
                  <div class="dc_mark_b"><i class="el-icon-location-outline"></i><span>{{item.position}}</span> <span class="el-icon-delete" @click="delMark('这条', item.uid)"></span></div>
                </div>
              </vue-scroll>
            </div>
            <el-button class="dc_clear_mark" type="primary" @click="delMark('清除所有', 0)">清空标注</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧地图 -->
    <div class="map_r">
      <!-- 地图容器 -->
      <div class="map_rm" id="mapMap"></div>
      <!-- 头部统计 -->
      <div class="map_rt">
        <el-checkbox :indeterminate="isIndeterminate" v-model="mapTypeCheckAll" @change="mapTypeCheckAllChange">全部
          <span class="map_rt_ck_num" style="padding-right: 30px;">&nbsp;{{(sxtList.length + kkList.length + clList.length + ryList.length) | fmTenThousand}}</span></el-checkbox>
        <el-checkbox-group v-model="mapTypeList" class="vl_map_rt_cks">
          <el-checkbox label="sxt">{{constCamera}}<span class="map_rt_ck_num">&nbsp;{{sxtList.length | fmTenThousand}}</span></el-checkbox>
          <el-checkbox label="kk">{{constCard}}<span class="map_rt_ck_num">&nbsp;{{kkList.length | fmTenThousand}}</span></el-checkbox>
          <el-checkbox label="cl">{{constCar}}<span class="map_rt_ck_num">&nbsp;{{clList.length | fmTenThousand}}</span></el-checkbox>
          <el-checkbox label="ry">{{constPerson}}<span class="map_rt_ck_num">&nbsp;{{ryList.length | fmTenThousand}}</span></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 右侧工具栏 -->
      <div class="map_rrt" :class="{'map_rrt2': rightSxtList && rightSxtList.length > 0}">
        <ul class="map_rrt_u1">
          <li :class="{'vl_icon_sed': selAreaAcitve}" @click="selArea">
            <i class="vl_icon vl_icon_041"></i>
            <span>选择区域</span>
          </li>
          <li :class="{'vl_icon_sed': rangingAcitve}" @click="ranging">
            <i class="vl_icon vl_icon_042"></i>
            <span>测距</span>
          </li>
          <li style="cursor: not-allowed;">
            <i class="vl_icon vl_icon_043"></i>
            <span>截屏</span>
          </li>
          <li :class="{'vl_icon_sed': markAcitve}" @click="mark">
            <i class="vl_icon vl_icon_044"></i>
            <span>标注</span>
          </li>
          <li @click="resetTools">
            <i class="vl_icon vl_icon_045"></i>
            <span>恢复默认</span>
          </li>
        </ul>
        <ul class="map_rrt_u2">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
      <!-- 右侧摄像头列表 -->
      <ul :style="{'margin-top': (-rightSxtList.length * 154 / 2 ) + 'px'}" class="map_rrc" v-if="rightSxtList && rightSxtList.length > 0">
        <li v-for="(item, index) in rightSxtList" :key="'sxt_' + index">
          <div>
            <video class="com_trans50_t" src="../../../../assets/video/video.mp4" autoplay loop></video>
            <i class="el-icon-error" @click="videoRemove(index)"></i>
            <div>
              <div>摄像头001 2018-09-23</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--删除标注确定弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="deleteMarkDialog"
      :show-close="false"
      width="400px">
      <span>确定删除{{delMessage}}标注吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="delLoading" @click="deleteMarkDialog = false">取 消</el-button>
        <el-button :loading="delLoading" type="primary" @click="comfirmDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {testData} from './testData.js';
import {random14, objDeepCopy} from '../../../../utils/util.js';
import {MapGETmonitorList, MapGETsignList, MapDELETEmapSign, MapDELETEmapSigns} from '../../api/api.map.js';
export default {
  data () {
    return {
      constCar: '车辆',
      constCard: '卡口',
      constPerson: '人员',
      constCamera: '摄像头',
      map: null, // 地图对象
      sxtList: [],
      sxtMapMarkers: [],
      kkList: [], // 卡口
      kkMapMarkers: [],
      clList: [], // 车辆
      clMapMarkers: [],
      ryList: [],  // 人员
      ryMapMarkers: [],
      rightSxtList: [], // 右侧摄像头列表
      rightSxtLimit: 4, // 右侧摄像头数量限制
      // 选择区域
      mouseTool: null,
      selAreaAcitve: false,
      selAreaAble: false,
      selAreaPolygon: null,
      // 标注
      marksList: [],
      marksMarkers: [],
      markListener: null,
      markAcitve: false,
      markEditMarker: null,
      markEditWindow: null,
      // 测距
      rangingAcitve: false,
      rangingObj: null,
      isIndeterminate: false,
      mapTypeCheckAll: true,
      mapTypeList: ['sxt', 'kk', 'cl', 'ry'],
      mapTypeListAll: ['sxt', 'kk', 'cl', 'ry'],
      tabType: 1, // 1地图信息 2标注历史
      mapInfoVal: '', // 地图信息查询值
      mapTreeData: [],
      mapTreeProps: {
        children: 'infoList',
        label: 'infoName'
      },
      markInfoVal: '', // 标注列表查询值
      markList: [], // 标注列表
      computedMarkList: [],
      deleteMarkDialog: false,
      delMessage: '',
      curSignId: '',
      delLoading: false
    }
  },
  watch: {
    mapInfoVal (val) {
      this.$refs.mapLeftTree.filter(val);
    },
    markInfoVal (val) {
      let arr = [];
      if (val) {
        arr = this.markList.filter(x => {
          return x.opUserName.indexOf(val) !== -1 || x.markContent.indexOf(val) !== -1
        })
      } else {
        arr = this.markList;
      }
      this.computedMarkList = arr;
    },
    mapTypeList () {
      if (this.mapTypeList.length === 0) {
        this.mapTypeCheckAll = false;
        this.isIndeterminate = false;
      } else if (this.mapTypeList.length > 0 && this.mapTypeList.length < this.mapTypeListAll.length) {
        this.isIndeterminate = true;
      } else {
        this.mapTypeCheckAll = true;
        this.isIndeterminate = false;
      }
      this.mapMarkHandler();
    }
  },
  mounted () {
    let _this = this;
    let map = new window.AMap.Map('mapMap', {
      zoom: 18, // 级别
      center: [112.974691, 28.093846], // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
    // 在地图中添加MouseTool插件
    let mouseTool = new window.AMap.MouseTool(map);
    _this.mouseTool = mouseTool;
    // 添加事件
    window.AMap.event.addListener(mouseTool, 'draw', function (e) {
      // _this.drawPaths = e.obj.getPath();
      console.log('drawPaths e', e); // 获取路径/范围
      console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
      setTimeout(() => {
        // _this.editForm.areaData = null;
        // _this.dialogVisible = true;
        // _this.amap.setDefaultCursor(_this.defaultCursor);
        _this.selAreaRest(true);
        let polygon = new window.AMap.Polygon({
          map: map,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2,
          path: e.obj.getPath(),
          zIndex: 12
        });
        _this.selAreaPolygon = polygon;
        _this.selAreaAble = true;
        _this.mapMarkHandler();
      }, 100);
    });
    this.getMonitorList();
    this.getMarkHistory();
    // 地图标记事件
    _this.mapMarkerEvents();
  },
  methods: {
    // 获取标注历史
    getMarkHistory () {
      MapGETsignList().then(res => {
        if (res) {
          this.markList = res.data;
          this.copyObject(this.markList, this.computedMarkList)
        }
      })
    },
    delMark (mes, curSignId) {
      this.delMessage = mes;
      curSignId ? this.curSignId = curSignId : '';
      this.deleteMarkDialog = true;
    },
    // 确定删除标注
    comfirmDel () {
      this.delLoading = true;
      if (this.delMessage === '这条') {
        let params = {
          id: this.curSignId
        }
        MapDELETEmapSign(params).then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.computedMarkList = this.computedMarkList.filter(x => x.uid !== this.curSignId)
            this.markList = this.markList.filter(x => x.uid !== this.curSignId)
          } else {
            this.$message.success('删除异常')
          }
          this.delLoading = false;
          this.deleteMarkDialog = false;
        })
      } else {
        MapDELETEmapSigns().then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.computedMarkList = [];
            this.markList = [];
          } else {
            this.$message.success('删除异常')
          }
          this.delLoading = false;
          this.deleteMarkDialog = false;
        })
      }
    },
    //获取地图信息列表
    getMonitorList () {
      let params = {
        areaUid: '431224'
      }
      MapGETmonitorList(params)
        .then(res => {
          if (res) {
            this.mapTreeData = this.switchData(res.data);
            this.updateDom();
            this.moveDom();
          }
        })
    },
    // keys的各个props 代表接口返回的摄像头，人物，车辆，卡口的list的字段名及list里面元素name;;allKey
    switchData(data) {
      data['infoList'] = data.areaTreeList;
      data['infoName'] = data.areaName;
      data['infoList'].map(x => {
        // 假的卡口，车辆
        let carList, cardList;
        carList = [
          {
            name: '我是假车辆11',
            addr: '长沙市天心区',
            latitude: 28.094869,
            longitude: 112.975227
          }, {
            name: '我是假车辆22',
            addr: '创谷广告园',
            latitude: 28.093596,
            longitude: 112.97623
          }
        ];
        cardList = [
          {
            name: '我是假卡口11',
            addr: '长沙市天心区',
            latitude: 28.093222,
            longitude: 112.974718
          }, {
            name: '我是假卡口22',
            addr: '创谷广告园',
            latitude: 28.093537,
            longitude: 112.975628
          }
        ]
        x['infoName'] = x.areaName;
        // dataType = 0 摄像头，1车辆，2卡口，3人员,
        x['deviceBasicList'] = this.objSetItem(x['deviceBasicList'], {infoName: 'deviceName', areaType: '5', dataType: 0});
        x['carList'] = this.objSetItem(carList, {infoName: 'name', areaType: '5', dataType: 2, areaUid: x.areaId});
        x['cardList'] = this.objSetItem(cardList, {infoName: 'name', areaType: '5', dataType: 1, areaUid: x.areaId});
        x['sysUserExtendList'] = this.objSetItem(x['sysUserExtendList'], {infoName: 'userName', areaType: '5', dataType: 3, areaUid: x.areaId});
        let oldArr = [...x['deviceBasicList'], ...x['carList'], ...x['cardList'], ...x['sysUserExtendList']];
        let newArr = [];
        this.copyObject(oldArr, newArr)
        x['infoList'] = newArr;
        // 给第一个元素加识别号
        if (x['infoList'].length) {
          x['infoList'][0]['isFirst'] = true;
        } else {
          x['infoList'].push({infoName: '无相关数据'})
        }
        // 设置一个数组，判断当前map_tree_tab点了哪几个
        x['tabActiveList'] = []; // 为空时，全显示，不为空时显示数组内的项，里面的值就是dataType
        return x;
      })
      console.log(data);
      return [data];
    },
    objSetItem (list, obj) {
      list.map(z => {
        for (let key in obj) {
          z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
        }
        return z;
      })
      return list;
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if (data.infoName.indexOf(value) !== -1) {
        return true;
      } else {
        if (node.parent.data.infoName) {
          return node.parent.data.infoName.indexOf(value) !== -1;
        } else {
          return false;
        }
      }
    },
    updateDom () {
      this.$nextTick(() => {
        let ss = document.getElementsByClassName('change_node_pos');
        ss = Array.from(ss);
        ss.forEach(x => {
          $(x).parent().siblings().css('display', 'none');
          $(x).parent().parent().css('padding-left', '26px');
        })
      })
    },
    moveDom () {
      this.$nextTick(() => {
        let tabDom = document.getElementsByClassName('map_tree_tab');
        tabDom = Array.from(tabDom);
        tabDom.forEach(dom => {
          let parent = dom.parentNode.parentNode.parentNode.parentNode;
          parent.insertBefore(dom, parent.childNodes[0])
        })
      })
    },
    switchTab (node, dataType, event) {
      if (event.target.classList.contains('active')) {
       event.target.classList.remove('active')
      } else {
        event.target.classList.add('active')
      }
      // 判断dataType 是否在tabActiveList,决定是个node的parent的data的infoList里移除还是添加
      let key;
      // 找到父级的数据;
      switch (dataType) {
        case 0:
          key = 'deviceBasicList'
          break;
        case 1:
          key = 'cardList'
          break;
        case 2:
          key = 'carList'
          break;
        case 3:
          key = 'sysUserExtendList'
          break;
      }
      let curData = {};
      curData = this.findParentData(node)
      if (curData.tabActiveList.includes(dataType)) {
        // 'delete'
        curData.tabActiveList.splice(curData.tabActiveList.indexOf(dataType), 1);
        if (curData.tabActiveList.length) {
          curData.infoList = curData.infoList.filter(u => u.dataType !== dataType)
        } else {
          // '重置'
          let oldArr = [...curData['deviceBasicList'], ...curData['carList'], ...curData['cardList'], ...curData['sysUserExtendList']];
          let ss = [];
          this.copyObject(oldArr, ss);
          curData.infoList = ss;
        }
      } else {
        // 'add'
        curData.tabActiveList.push(dataType);
        if (curData.tabActiveList.length === 1) {
          // '第一次'
          let _ar = [];
          if (curData[key].length) {
            this.copyObject(curData[key], _ar)
            _ar.forEach(k => {
              k.infoName += ' ';
            })
          } else {
            _ar.push({infoName: '无相关数据'})
          }
          curData.infoList = [..._ar]
        } else {
          // '已经有了再添加'
          let _arr3 = [];
          // 判断目前显示的是不是 无相关数据
          if (curData.infoList[0].infoName === '无相关数据') {
            if (curData[key].length) {
              curData.infoList = [];
              this.copyObject(curData[key], _arr3);
              _arr3.forEach(m => {
                curData.infoList.unshift(m)
              })
            }
          } else {
            this.copyObject(curData[key], _arr3);
            _arr3.forEach(m => {
              curData.infoList.unshift(m)
            })
          }
        }
      }
      this.updateDom();
    },
    findParentData (node) {
      let obj;
      this.mapTreeData.forEach(item => {
        item.infoList.forEach(x => {
          if (x.areaId === node.areaUid) {
            obj = x;
          }
        })
      })
      return obj;
    },
    copyObject (obj, newObj) {
      if (typeof obj === 'object' && obj) {
        if (Object.prototype.toString.call(obj).slice(8, 14) === 'Object') {
          for (let key in obj) {
            if (typeof obj[key] === 'object') {
              newObj[key] = {};
              this.copyObject(obj[key], newObj[key])
            } else {
              newObj[key] = obj[key];
            }
          }
        } else {
          for (let i = 0; i < obj.length; i ++) {
            if (typeof obj[i] === 'object') {
              if (Object.prototype.toString.call(obj[i]).slice(8, 14) === 'Object') {
                newObj[i] = {}
                this.copyObject(obj[i], newObj[i])
              } else {
                newObj[i] = [];
                this.copyObject(obj[i], newObj[i])
              }
            } else {
              newObj[i] = obj[i]
            }
          }
        }
      } else {
        return obj;
      }
    },
    // 获取地图数据
    getMapData () {
      setTimeout(() => {
        this.sxtList = testData.sxt;
        this.kkList = testData.kakou;
        this.clList = testData.cheliang;
        this.ryList = testData.renyuan;
        this.mapMarkHandler();
      }, 200);
    },
    // 地图标记处理
    mapMarkHandler () {
      // 摄像头
      this.mapClearMarkers(this.sxtMapMarkers);
      if (this.mapTypeList.indexOf('sxt') >= 0) {
        this.mapMark(this.sxtList, this.sxtMapMarkers, 'sxt');
      }
      // 卡口
      this.mapClearMarkers(this.kkMapMarkers);
      if (this.mapTypeList.indexOf('kk') >= 0) {
        this.mapMark(this.kkList, this.kkMapMarkers, 'kk');
      }
      // 车辆
      this.mapClearMarkers(this.clMapMarkers);
      if (this.mapTypeList.indexOf('cl') >= 0) {
        this.mapMark(this.clList, this.clMapMarkers, 'cl');
      }
      // 人员
      this.mapClearMarkers(this.ryMapMarkers);
      if (this.mapTypeList.indexOf('ry') >= 0) {
        this.mapMark(this.ryList, this.ryMapMarkers, 'ry');
      }
    },
    // 地图标记
    mapMark (data, aMarkers, keyWord) {
      if (data && data.length > 0) {
        let hoverWindow = null;
        let _this = this;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = keyWord + '_' + i + '_' + random14();
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20.5, -48], selClass = '';
            if (_this.selAreaPolygon && !_this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
              // 多边形存在且不在多边形之中
              selClass = "vl_map_selarea_hide";
            }
            let marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.map,
              // 110.601394, 27.909162
              position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
              // position: [110.601394, 27.909162], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_' + keyWord + ' ' + selClass + '"></div>'
            });
            // myAMap.hoverMarkerHandler(map, marker, obj);
            if (!aMarkers) { aMarkers = []; }
            aMarkers.push(marker);

            // 点击地图上的摄像头/卡口播放视频
            if (keyWord === 'sxt' || keyWord === 'kk') {
              marker.on('click', function () {
                _this.testAddSxt();
              });
            }
            // hover
            marker.on('mouseover', function () {
              // let iW = Math.round($(window).width() * 0.15);
              // let extD = mEvent.target.F.extData;
              let sContent = '<div class="vl_map_hover">' +
                '<div class="vl_map_hover_main">' + _this.mapHoverInfo(obj, keyWord) + '</div>';
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                content: sContent
              });
              // aCenter = mEvent.target.F.position
              hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
              hoverWindow.on('close', function () {
                // console.log('infoWindow close')
              });
            });
            marker.on('mouseout', function () {
               // if (hoverWindow) { hoverWindow.close(); }
            });
          }
        }
      }
    },
    mapHoverInfo (data, type) {
      let str = '<ul>';
      if (type === 'sxt') {
        str += '<li><span>设备名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'kk') {
        str += '<li><span>卡口名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'cl') {
        str += '<li><span>车辆名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'ry') {
        str += '<li><span>人员名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
        str += '<li style="text-align: center;">' +
            `<i dataId="${data.name}" dataType="${data.addr}" class="vl_map_hover_btn hover_btn_voice">语音通话</i>` +
            `<i dataId="${data.name}" dataType="${data.addr}" class="vl_map_hover_btn hover_btn_video">视频通话</i>` +
          '</li>';
      } else {
        str += '<li>未知数据</li>';
      }
      str += '</ul>';
      return str;
    },
    // 地图标记事件
    mapMarkerEvents () {
      let _this = this;
      // 1语音/2视频通话
      $('body').on('click', '.vl_map_hover_btn', function (e) {
        let url = _this.$router.resolve({
          name: 'map_communication',
          query: {
            userId: e.target.getAttribute('dataId'),
            type: e.target.getAttribute('dataType')
          }
        })
        window.open(url.href, '_blank')
      })
    },
    // 清除地图标记
    mapClearMarkers (aMarkers) {
      if (this.map && aMarkers && aMarkers.length > 0) {
        this.map.remove(aMarkers);
        aMarkers = [];
      }
    },
    // 清除所有
    resetTools () {
      this.selAreaRest();
      this.markRest();
      this.rangingRest();
    },
    // 选择区域
    selArea () {
      if (this.selAreaAcitve) {
        this.resetTools();
        return false;
      }
      this.resetTools();
      if (this.map && this.mouseTool) {
        this.selAreaAcitve = true;
        this.mouseTool.close(true);
        this.map.setDefaultCursor('crosshair');
        this.mouseTool.polygon({
          zIndex: 13,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2
        });
      }
    },
    // 重置选择区域
    selAreaRest (notClearPolygon) {
      this.selAreaAcitve = false;
      this.mouseTool.close(true);
      this.map.setDefaultCursor('');
      if (!notClearPolygon && this.selAreaPolygon) {
        this.map.remove(this.selAreaPolygon);
        this.selAreaPolygon = null;
        this.selAreaAble = false;
      }
    },
    // 标注
    mark () {
      if (this.markAcitve) {
        this.resetTools();
        return false;
      }
      this.resetTools();
      this.markAcitve = true;
      this.map.setDefaultCursor('crosshair');
      let _this = this;
      this.markListener = window.AMap.event.addListener(this.map, 'click', function (e) {
        if (_this.markEditMarker) {
          // 表示存在编辑中的标记，则需先完成编辑中的标记
          return false;
        }
        // console.log('mark event', e);
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: e.lnglat,
          offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_051"></div>'
        });
        _this.markEditMarker = marker;
        let sid = 'mk_' + random14();
        let infoWindow = new window.AMap.Marker({
          map: _this.map,
          position: e.lnglat,
          zIndex: 111,
          offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
          content: '<div class="vl_map_mk" id="' + sid + '"><div class="vl_map_mk_main">' +
            '<textarea placeholder="标注内容" rows="4"></textarea>' +
            '<div>' +
              '<p></p>' +
              '<input type="button" value="取消" class="vl_map_mk_btn vl_map_mk_btn1"></input>&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<input type="button" value="确认" class="vl_map_mk_btn vl_map_mk_btn2"></input></div>' +
            '</div></div>'
        });
        // aCenter = mEvent.target.F.position
        // infoWindow.open(_this.map, e.lnglat);
        _this.markEditWindow = infoWindow;
        setTimeout(() => {
          let $iw = $('#' + sid);
          let $btn1 = $iw.find('.vl_map_mk_btn1'), $btn2 = $iw.find('.vl_map_mk_btn2'), $msg = $iw.find('p');
          $btn1.on('click', function () {
            _this.markRest(true);
          });
          $btn2.on('click', function () {
            let sval = $iw.find('textarea').val();
            if (!sval || sval.length <= 0) {
              $msg.text('请输入标注内容').show();
            } else {
              $msg.hide();
              $btn1.attr('disabled', true);
              $btn2.val('提交中...');
              $btn2.attr('disabled', true);
              setTimeout(() => {
                _this.$message({
                  message: '标注添加成功',
                  type: 'success'
                });
                _this.markRest(true);
                console.log('e', e);
                _this.markMark({
                  author: '管理员',
                  time: new Date().getTime(),
                  content: sval,
                  latitude: e.lnglat.lat,
                  longitude: e.lnglat.lng
                });
              }, 2000);
            }
          });
        }, 400);
      });
    },
    markMark (data) {
      let _this = this;
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: _this.map,
        position: new window.AMap.LngLat(data.longitude, data.latitude),
        offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: '<div class="vl_icon vl_icon_051"></div>'
      });
      console.log(marker);
    },
    markRest (isEditing) {
      // flag 控制是否在编辑中
      if (!isEditing) {
        this.markAcitve = false;
        this.map.setDefaultCursor('');
        if (this.markListener) {
          window.AMap.event.removeListener(this.markListener); // 移除事件，以绑定时返回的对象作为参数
        }
      }
      if (this.markEditMarker) {
        this.map.remove([this.markEditMarker]);
        this.markEditMarker = null;
      }
      if (this.markEditWindow) {
        this.map.remove([this.markEditWindow]);
        this.markEditWindow = null;
      }
    },
    // 测距
    ranging () {
      if (this.rangingAcitve) {
        this.rangingRest();
        return false;
      }
      this.resetTools();
      this.rangingAcitve = true;
      // 自定义样式
      let startMarkerOptions= {
        content: '<div class="vl_map_ranging vl_map_ranging_s"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let endMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_e"><div>终</div></div>',
        offset: new window.AMap.Pixel(-17, -17)
      };
      let midMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_m"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let lineOptions = {
          strokeStyle: "solid",
          strokeColor: "#61C772",
          strokeOpacity: 1,
          strokeWeight: 8
      };
      let rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions:midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      };
      let ruler2 = new window.AMap.RangingTool(this.map, rulerOptions);
      ruler2.turnOn();
      this.rangingObj = ruler2;
    },
    rangingRest () {
      this.rangingAcitve = false;
      if (this.rangingObj) {
        this.rangingObj.turnOff();
      }
    },
    // 视频操作
    videoRemove (_index) {
      // rightSxtList
      this.rightSxtList.splice(_index, 1);
    },
    testAddSxt () {
      if ( this.rightSxtList.length < this.rightSxtLimit) {
        this.rightSxtList.push(new Date().getTime());
      } else {
        this.$message({
          message: '您最多只能打开' + this.rightSxtLimit + '个摄像头',
          type: 'warning'
        });
      }
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    mapTypeCheckAllChange (val) {
      console.log(val)
      this.isIndeterminate = false;
      if (val) {
        this.mapTypeList = this.mapTypeListAll;
      } else {
        this.mapTypeList = [];
      }
    }
  },
  destroyed () {
    if (this.map) {
      this.map.destroy();
    }
  }
}
</script>
<style lang="scss" scoped>
  .change_node_pos {
    vertical-align: middle;
  }
  .custom-tree-node {
    font-size: .14rem;
    width: 100%;
    >span {
      &:first-child {
        width: calc(100% - .4rem);
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
<style lang="scss">
</style>
