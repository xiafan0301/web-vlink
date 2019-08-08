<template>
  <div class="relay_new">
    <div class="">
      <div class="relay_task_t">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span style="cursor: pointer;" @click="xjClose(false)">视频接力</span></el-breadcrumb-item>
          <el-breadcrumb-item>新建任务</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="relay_task_m">
        <div>
          <div class="relay_task_mt">
            <div class="relay_task_mtl">
              <div class="task_mtl_t">
                <el-radio-group v-model="xjType" @change="xjTypeChanged">
                  <el-radio :label="1">人员</el-radio>
                  <el-radio :label="2">车辆</el-radio>
                </el-radio-group>
              </div>
              <div class="task_mtl_m">
                <i>*</i>
                <template v-if="xjType === 2 && xjVechicleType === 2">
                  车牌号码：
                </template>
                <template v-else>
                  目标图片：
                </template>
                <span @click="xjVechicleType = 2" v-show="xjType === 2 && xjVechicleType ===1">输入车牌号</span>
                <span @click="xjVechicleType = 1" v-show="xjType === 2 && xjVechicleType ===2">上传车辆图片</span>
              </div>
              <div class="task_mtl_u" v-if="xjType === 2 && xjVechicleType === 2">
                <el-input v-model="xjPlateNo" placeholder="请输入车牌号码"></el-input>
              </div>
              <div class="task_mtl_u" v-else>
                <div is="vlUpload" :imgData="imgData" :clear="uploadClear" @uploadEmit="uploadEmit"></div>
              </div>
            </div>
            <div class="relay_task_mtr">
              <div class="task_mtr_ld" v-if="(xjType === 1 || (xjType === 2 && xjVechicleType === 1)) && picSearchLoading">
                <i class="el-icon-loading"></i>正在分析图片，请稍后...
              </div>
              <div v-else-if="xjType === 1 && uploadPersonObj">
                <h3>图片信息：</h3>
                <ul>
                  <li><span>性别：</span>{{uploadPersonObj.sex ? uploadPersonObj.sex : '--'}}</li>
                  <li><span>年龄段：</span>{{uploadPersonObj.age ? uploadPersonObj.age : '--'}}</li>
                  <li><span>发型：</span>{{uploadPersonObj.hair ? uploadPersonObj.hair : '--'}}</li>
                  <li><span>戴眼镜：</span>{{uploadPersonObj.glasses ? uploadPersonObj.glasses : '--'}}</li>
                  <li><span>戴帽子：</span>{{uploadPersonObj.hat ? uploadPersonObj.hat : '--'}}</li>
                  <li><span>戴口罩：</span>{{uploadPersonObj.mask ? uploadPersonObj.mask : '--'}}</li>
                  <li><span>抱小孩：</span>{{uploadPersonObj.baby ? uploadPersonObj.baby : '--'}}</li>
                  <li><span>拎东西：</span>{{uploadPersonObj.bag ? uploadPersonObj.bag : '--'}}</li>
                  <li><span>上身款式：</span>{{uploadPersonObj.upperType ? uploadPersonObj.upperType : '--'}}</li>
                  <li><span>上身颜色：</span>{{uploadPersonObj.upperColor ? uploadPersonObj.upperColor : '--'}}</li>
                  <li><span>下身款式：</span>{{uploadPersonObj.bottomType ? uploadPersonObj.bottomType : '--'}}</li>
                  <li><span>下身颜色：</span>{{uploadPersonObj.bottomColor ? uploadPersonObj.bottomColor : '--'}}</li>
                </ul>
              </div>
              <div v-else-if="xjType === 2 && xjVechicleType === 1 && uploadVehicleObj">
                <h3>图片信息：</h3>
                <ul>
                  <li style="width: 50%;"><span>车牌号码：</span>{{uploadVehicleObj.plateNo ? uploadVehicleObj.plateNo : '--'}}</li>
                  <li style="width: 50%;"><span>车辆分组：</span>{{(uploadVehicleObj.vehicleType && uploadVehicleObj.vehicleType.length > 0) ? uploadVehicleObj.vehicleType.join(',') : '--'}}</li>
                  <li style="width: 50%;"><span>车牌颜色：</span>{{uploadVehicleObj.plateColor ? uploadVehicleObj.plateColor : '--'}}</li>
                  <li style="width: 50%;"><span>车辆型号：</span>{{uploadVehicleObj.vehicleModel ? uploadVehicleObj.vehicleModel : '--'}}</li>
                  <li style="width: 50%;"><span>车辆颜色：</span>{{uploadVehicleObj.vehicleColor ? uploadVehicleObj.vehicleColor : '--'}}</li>
                  <li style="width: 50%;"><span>车辆类型：</span>{{uploadVehicleObj.vehicleClass ? uploadVehicleObj.vehicleClass : '--'}}</li>
                  <li style="width: 50%;"><span>车牌类型：</span>{{uploadVehicleObj.baby ? dicFormater(45, uploadVehicleObj.plateClass) : '--'}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="relay_task_mm">
            <span @click="xjMoreInfo = !xjMoreInfo">
              更多设置<i class="el-icon-arrow-down" :class="{'relay_task_mm_d2': xjMoreInfo}"></i>
            </span>
          </div>
          <div class="relay_task_mb" v-show="xjMoreInfo">
            <h3>选择设备：</h3>
            <div class="task_mb_map">
              <ul class="task_mb_mt">
                <li @click="xjSelType = 1" :class="{'task_mb_mt_sed': xjSelType === 1}">地图选择</li>
                <li @click="xjSelType = 2" :class="{'task_mb_mt_sed': xjSelType === 2}">列表选择</li>
              </ul>
              <div class="mb_map_map" v-show="xjSelType === 1">
                <div class="mb_map_map_l">
                  <div class="mb_map_map_lt">
                    已选设备（{{xjMapListSum}}）
                    <span :class="{'map_lt_sed': xjMapTreeChecked}" :title="xjMapTreeChecked ? '移除选择设备' : ''" v-if="xjMapTree && xjMapTree.length > 0" @click="xjMapTreeDel">移除设备</span>
                  </div>
                  <div class="mb_map_map_lb">
                    <el-tree
                      v-if="xjMapTree && xjMapTree.length > 0"
                      ref="xjMapTree"
                      :data="xjMapTree"
                      show-checkbox
                      node-key="id"
                      @check="xjMapTreeCheck"
                      :default-expand-all="true"
                      :props="xjMapTreeDefaultProps">
                    </el-tree>
                    <div style="color: #999; padding: 20px 0 0 20px;" v-else>暂无</div>
                  </div>
                </div>
                <div class="mb_map_map_r">
                  <h4>可选设备（{{xjMapListAllSum}}）</h4>
                  <div>
                    <div style="width: 100%; height: 100%;" id="video_relay_xj_map"></div>
                    <ul>
                      <li @click="xjMapSelChange" :class="{'vl_icon_sed': xjMapSelActive}">
                        <i class="vl_icon vl_icon_041"></i>
                        <p>选择区域</p>
                      </li>
                      <li>
                        <i class="el-icon-aim" @click="setMapStatus(3)"></i>
                      </li>
                      <li>
                        <i class="el-icon-plus" @click="setMapStatus(1)"></i>
                      </li>
                      <li>
                        <i class="el-icon-minus" @click="setMapStatus(2)"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="mb_map_list" v-show="xjSelType === 2">
                <el-tree
                  v-if="monitorListTreeData && monitorListTreeData.length > 0"
                  ref="monitorListTree"
                  :data="monitorListTreeData"
                  show-checkbox
                  node-key="id"
                  @check="xjMapTreeCheck"
                  :default-expand-all="false"
                  :props="xjMapTreeDefaultProps">
                </el-tree>
              </div>
            </div>
            <div class="task_mb_d">
              <span>备注说明：</span>
              <el-input v-model="xjDesVal" style="width: 500px;" size="small" maxlength="50" placeholder="请输入50字以内的备注说明"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="relay_task_b">
        <el-button size="small" @click="xjSubmit" :loading="submitLoading" type="primary">&nbsp;&nbsp;&nbsp;&nbsp;确&nbsp;&nbsp;定&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        <el-button size="small" @click="xjClose(false)">&nbsp;&nbsp;&nbsp;&nbsp;取&nbsp;&nbsp;消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {mapXupuxian} from '@/config/config.js';
import vlUpload from '@/components/common/upload.vue';
import {apiAreaServiceDeviceList, getAllMonitorList, getAllBayonetList, getDeviceByBayonetUids} from "@/views/index/api/api.base.js";
import {JtcGETAppendixInfoList, addPersonVideoContinue, addVhicleVideoContinue} from '@/views/index/api/api.judge.js';
import {getPhotoAnalysis} from "@/views/index/api/api.analysis.js"; // 车辆特征检索接口
import {getPicRecognize} from '../../api/api.structuring.js';
import {MapGETmonitorList} from '@/views/index/api/api.map.js'; // 获取设备树接口
export default {
  components: {vlUpload},
  data () {
    return {
      /* 新建任务 begin */
      xjType: 1, // 1人员 2车辆
      picSearchLoading: false,
      xjVechicleType: 1, // 1上传图片  2输入车牌号
      xjPlateNo: '',
      xjMoreInfo: false,
      xjSelType: 1, // 1地图选择  2列表选择

      xjMap: null,
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      xjMapSelActive: false,
      mouseTool: null,
      xjDrawPolygon: [],
      xjMapTree: [],
      xjMapTreeChecked: false,
      xjMapTreeDefaultProps: {
        children: 'children',
        label: 'name'
      },

      xjDesVal: '',

      submitLoading: false,

      uploadPersonObj: null,
      uploadVehicleObj: null,
      imgData: null,
      curImageUrl: '', // 当前上传的图片 人员
      curImageUrl2: '', // 当前上传的图片 车辆
      uploadClear: {},
      /* 新建任务 end */
      xjMapListAllSum: 0,
      monitorListDefault: null,
      monitorListTreeData: null

    }
  },
  watch: {
    xjMoreInfo (val) {
      if (val) {
        if (this.xjSelType === 1) {
          if (!this.xjMap) {
            window.setTimeout(() => {
              this.xjInitMap();
            }, 200);
          }
        }
      }
    },
    xjSelType (val) {
      if (val === 1) {
        if (!this.xjMap) {
          window.setTimeout(() => {
            this.xjInitMap();
          }, 200);
        }
      }
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    },
    xjMapListSum () {
      let iS = 0;
      for (let i = 0; i < this.xjMapTree.length; i++) {
        iS += this.xjMapTree[i].children.length;
      }
      return iS;
    }
  },
  created () {
    this.getMonitorList();
  },
  mounted () {
  },
  methods: {
    xjClose (flag) {
      this.$emit('closeNew', flag);
    },
    xjInitMap () {
      let _this = this;
      let _config = Object.assign({}, {
        zoom: 11,
        center: mapXupuxian.center,
        zooms: [2, 18]
      });
      // console.log('_config', _config)
      // 初始化地图
      let map = new window.AMap.Map('video_relay_xj_map', _config);
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      _this.xjMap = map;
      // 在地图中添加MouseTool插件
      this.mouseTool = new window.AMap.MouseTool(map);
      this.mouseTool.on('draw', (event) => {
        // event.obj 为绘制出来的覆盖物对象
        console.log('draw event', event);
        if (this.xjDrawPolygon && this.xjDrawPolygon[0]) {
          _this.xjMap.remove(this.xjDrawPolygon[0]);
        }
        this.xjDrawPolygon = [];
        this.xjDrawPolygon.push(event.obj);
        this.xjMapSelActive = false;
        this.mouseTool.close(false);
        this.xjMap.setDefaultCursor();
        this.xjDrawSelComp();
      });
      this.markMonitorList();
    },
    xjMapTreeDel () {
      let aL = this.$refs.xjMapTree.getCheckedNodes();
      for (let i = 0; i < aL.length; i++) {
        this.$refs.xjMapTree.setChecked(aL[i], false);
        this.$refs.xjMapTree.remove(aL[i]);
      }
      this.xjMapTreeChecked = false;
      // console.log('xjMapTree', this.xjMapTree);
    },
    xjMapTreeCheck (cData, sedData) {
      if (cData && sedData && sedData.checkedNodes && sedData.checkedNodes.length > 0) {
        this.xjMapTreeChecked = true;
      } else {
        this.xjMapTreeChecked = false;
      }
    },
    // 画完后处理数据
    xjDrawSelComp () {
      this.xjMapTreeChecked = false;
      let aDids = [], aBids = [];
      if (this.monitorListDefault && this.monitorListDefault.areaTreeList && this.monitorListDefault.areaTreeList.length > 0) {
        for (let i = 0; i < this.monitorListDefault.areaTreeList.length; i++) {
          let _o = this.monitorListDefault.areaTreeList[i];
          // 设备
          if (_o.deviceBasicList && _o.deviceBasicList.length > 0) {
            for (let j = 0; j < _o.deviceBasicList.length; j++) {
              let _d = _o.deviceBasicList[j];
              for (let k in this.xjDrawPolygon) {
                let so = this.xjDrawPolygon[k];
                if (so && so.contains(new window.AMap.LngLat(_d.longitude, _d.latitude))) {
                  aDids.push(_d.uid);
                }
              }
            }
          }
          // 卡口 
          if (_o.bayonetList && _o.bayonetList.length > 0) {
            for (let j = 0; j < _o.bayonetList.length; j++) {
              let _b = _o.bayonetList[j];
              for (let k in this.xjDrawPolygon) {
                let so = this.xjDrawPolygon[k];
                if (so && so.contains(new window.AMap.LngLat(_b.longitude, _b.latitude))) {
                  aBids.push(_b.uid);
                }
              }
            }
          }
        }
      }
      let oList = {};
      for (let i = 0; i < this.monitorListTreeData.length; i++) {
        let _o = this.monitorListTreeData[i];
        for (let j = 0; j < _o.children.length; j++) {
          let _c = _o.children[j];
          if (aDids.indexOf(_c.id) >= 0) {
            if (!oList[_o.id]) {
              oList[_o.id] = {
                id: _o.id,
                name: _o.name,
                children: []
              };
            }
            oList[_o.id].children.push(Object.assign({}, _c));
          } else if (aBids.indexOf(_c.id) >= 0) {
            if (!oList[_o.id]) {
              oList[_o.id] = {
                id: _o.id,
                name: _o.name,
                children: []
              };
            }
            oList[_o.id].children.push(Object.assign({}, _c));
          }
        }
      }
      let aRst = [];
      for (let k in oList) {
        aRst.push(oList[k]);
      }
      this.xjMapTree = aRst;
    },
    xjMapSelChange () {
      if (this.xjDrawPolygon && this.xjDrawPolygon[0]) {
        this.xjMap.remove(this.xjDrawPolygon[0]);
      }
      if (!this.xjMapSelActive) {
        this.xjMapSelActive = true;
        this.xjMap.setDefaultCursor("crosshair");
        this.mouseTool.polygon({
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          bubble: true,
          strokeWeight: 1,
          fillColor: "#FA453A",
          fillOpacity: 0.2,
          isRing: false,
          zIndex: 10
        });
      }
    },
    setMapStatus (status) {
      if (this.xjMap) {
        if (status === 1) {
          this.xjMap.setZoom(this.xjMap.getZoom() + 1);
        } else if (status === 2) {
          this.xjMap.setZoom(this.xjMap.getZoom() - 1);
        } else if (status === 3) {
          this.xjMap.setFitView();
        }
      }
    },
    // 获取设备
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          this.monitorListDefault = res.data;
          this.setMonitorListTreeData();
          // monitorListTreeData
          /* let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.cameraTree = this.getTreeList(camera);
          this.getLeafCountTree(this.cameraTree);
          this.initCheckTree(); // 初始化全选树节点 */
        }
      });
    },
    setMonitorListTreeData () {
      if (this.monitorListDefault && this.monitorListDefault.areaTreeList && this.monitorListDefault.areaTreeList.length > 0) {
        let aTreeList = [];
        for (let i = 0; i < this.monitorListDefault.areaTreeList.length; i++) {
          let _o = this.monitorListDefault.areaTreeList[i];
          let _t = {
            id: _o.areaId,
            name: _o.areaName,
            children: []
          }
          // 设备
          if (_o.deviceBasicList && _o.deviceBasicList.length > 0) {
            this.xjMapListAllSum += _o.deviceBasicList.length;
            for (let j = 0; j < _o.deviceBasicList.length; j++) {
              let _d = _o.deviceBasicList[j];
              _t.children.push({
                id: _d.uid,
                name: _d.deviceName,
                type: 1 // 1设备 2卡口
              });
            }
          }
          // 卡口 
          if (_o.bayonetList && _o.bayonetList.length > 0) {
            this.xjMapListAllSum += _o.bayonetList.length;
            for (let j = 0; j < _o.bayonetList.length; j++) {
              let _b = _o.bayonetList[j];
              _t.children.push({
                id: _b.uid,
                name: _b.bayonetName,
                type: 2 // 1设备 2卡口
              });
            }
          }
          aTreeList.push(_t);
        }
        this.monitorListTreeData = aTreeList;
        // console.log('this.monitorListTreeData', this.monitorListTreeData);
      }
    },
    // 标记设备/卡口
    markMonitorList () {
      if (this.monitorListDefault && this.monitorListDefault.areaTreeList && this.monitorListDefault.areaTreeList.length > 0) {
        for (let i = 0; i < this.monitorListDefault.areaTreeList.length; i++) {
          let _o = this.monitorListDefault.areaTreeList[i];
          // 设备
          if (_o.deviceBasicList && _o.deviceBasicList.length > 0) {
            for (let j = 0; j < _o.deviceBasicList.length; j++) {
              let _d = _o.deviceBasicList[j];
              let sC = 'vl_icon_sxt';
              if (_d.deviceStatus !== 1) { sC = 'vl_icon_sxt_dis'; }
              this.doMark([_d.longitude, _d.latitude],
                _d.deviceName, 'vl_icon ' + sC);
            }
          }
          // 卡口 
          if (_o.bayonetList && _o.bayonetList.length > 0) {
            for (let j = 0; j < _o.bayonetList.length; j++) {
              let _b = _o.bayonetList[j];
              let sC = 'vl_icon_kk';
              if (!_b.isEnabled) { sC = 'vl_icon_kk_dis'; }
              this.doMark([_b.longitude, _b.latitude],
                _b.bayonetName, 'vl_icon ' + sC);
            }
          }
        }
        this.xjMap.setFitView();
      }
    },
    // 标记设备/卡口
    doMark (lnglat, title, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.xjMap,
        position: lnglat, // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div title="' + title + '" class="map_icons ' + sClass + '"></div>'
      });
    },

    /* 新建任务 */
    xjTypeChanged (type) {
      if (type === 1) {
        if (this.curImageUrl) {
          this.imgData = { path: this.curImageUrl };
        } else {
          this.imgData = {};
        }
      } else if (type === 2) {
        if (this.curImageUrl2) {
          this.imgData = { path: this.curImageUrl2 };
        } else {
          this.imgData = {};
        }
      }
    },
    uploadEmit (data) {
      if (data) {
        this.getPicInfo(data);
      } else {
        if (this.xjType === 1) {
          this.curImageUrl = '';
          this.uploadPersonObj = null;
        } else if (this.xjType === 2) {
          this.curImageUrl2 = '';
          this.uploadVehicleObj = null;
        }
      }
    },
    getPicInfo (data) {
      if (this.xjType === 1) {
        this.curImageUrl = data.path;
        this.picSearchLoading = true;
        getPicRecognize({
          bussType: 'person', // vehicle机动车、face人脸、person人体
          url: data.path
        }).then(jRes => {
          if (jRes && jRes.data) {
            this.uploadPersonObj = Object.assign(jRes.data, {
              img_path: data.path,
              img_thumbnailPath: data.thumbnailPath
            });
          }
          this.picSearchLoading = false;
        }).catch(() => {
          this.picSearchLoading = false;
        })
      }
      if (this.xjType === 2) {
        this.curImageUrl2 = data.path;
        this.picSearchLoading = true;
        getPhotoAnalysis(data.path).then(jRes => {
          if (jRes && jRes.data && jRes.data.length > 0) {
            this.uploadVehicleObj = Object.assign(jRes.data[0], {
              img_path: data.path,
              img_thumbnailPath: data.thumbnailPath
            });
          }
          this.picSearchLoading = false;
        }).catch(() => {
          this.picSearchLoading = false;
        })
      }
    },
    xjSubmit () {
      if (this.xjType === 1 && !this.uploadPersonObj) {
        this.msgTips('请设置目标对象'); // 人员  无图片
        return false;
      }
      if (this.xjType === 2 && this.xjVechicleType === 1 && !this.uploadVehicleObj) {
        this.msgTips('请设置目标对象'); // 车辆  无图片
        return false;
      }
      if (this.xjType === 2 && this.xjVechicleType === 2 && !this.xjPlateNo) {
        this.msgTips('请输入正确的车牌号码'); // 车辆-车牌号码  无车牌号码
        return false;
      }
      this.submitLoading = true;
      // 获取设备 xjMoreInfo  true/false
      let params = {};
      let dids = [], bids = [];
      if (this.xjMoreInfo) {
        // 更多设置
        params.remarks = this.xjDesVal;
        // id: "3" name: "长沙创谷广告园44" type: 1摄像头/2卡口
        // console.log('this.xjMapTree', this.xjMapTree);
        if (this.xjSelType === 1) {
          for (let i = 0; i < this.xjMapTree.length; i++) {
            if (this.xjMapTree[i] && this.xjMapTree[i].children && this.xjMapTree[i].children.length > 0) {
              for (let j = 0; j < this.xjMapTree[i].children.length; j++) {
                let oj = this.xjMapTree[i].children[j];
                if (oj.type === 1) {
                  dids.push(oj.id);
                } else if (oj.type === 2) {
                  bids.push(oj.id);
                }
              }
            }
          }
        } else if (this.xjSelType === 2) {
          let checkedNodes = this.$refs.monitorListTree.getCheckedNodes();
          console.log('checkedNodes', checkedNodes);
          for (let i = 0; i < checkedNodes.length; i++) {
            let _ot = checkedNodes[i];
            if (_ot.type === 1) {
              dids.push(_ot.id);
            } else if (_ot.type === 2) {
              bids.push(_ot.id);
            }
          }
        }
      } else {
        // 没设置更多，则是所有的设备/卡口
        if (this.monitorListDefault && this.monitorListDefault.areaTreeList && this.monitorListDefault.areaTreeList.length > 0) {
          for (let i = 0; i < this.monitorListDefault.areaTreeList.length; i++) {
            let _o = this.monitorListDefault.areaTreeList[i];
            // 设备
            if (_o.deviceBasicList && _o.deviceBasicList.length > 0) {
              for (let j = 0; j < _o.deviceBasicList.length; j++) {
                dids.push(_o.deviceBasicList[j].uid);
              }
            }
            // 卡口 
            if (_o.bayonetList && _o.bayonetList.length > 0) {
              for (let j = 0; j < _o.bayonetList.length; j++) {
                bids.push(_o.bayonetList[j].uid);
              }
            }
          }
        }
      }
      // console.log('dids', dids);
      // console.log('bids', bids);
      if (bids && bids.length > 0) {
        getDeviceByBayonetUids(bids).then(res => {
          if (res && res.data) {
            for (let i = 0; i < res.data.length; i++) {
              dids.push(res.data[i].uid);
            }
          }
          this.xjSubmitTh(params, dids);
        }).catch(() => {
          this.submitLoading = false;
        });
      } else {
        this.xjSubmitTh(params, dids);
      }
    },
    xjSubmitTh (params, dids) {
      if (dids && dids.length > 0) {
        dids = [...new Set(dids)];
        params.spotLists = dids.join(';'); // 监控点(集合形式‘;’号分隔)
      }
      if (!params.spotLists || params.spotLists.length <= 0) {
        this.msgTips('请选择设备！');
        this.submitLoading = false;
        return false;
      }
      // 验证通过，可以提交
      this.xjSubmitDo(params);
    },
    xjSubmitDo (params) {
      if (this.xjType === 1) {
        params = Object.assign(params, this.uploadPersonObj, {
          imgUrl: this.uploadPersonObj.img_path,
          subStoragePath: this.uploadPersonObj.img_thumbnailPath,
        });
        // console.log('addPersonVideoContinue', params);
        addPersonVideoContinue(params).then((res) => {
          if (res) {
            this.xjClose(true);
          }
          this.submitLoading = false;
        }).catch((error => {
          this.submitLoading = false;
        }));
      } else if (this.xjType === 2) {
        if (this.xjVechicleType === 1) {
          params = Object.assign(params, this.uploadVehicleObj, {
            imgUrl: this.uploadVehicleObj.img_path,
            subStoragePath: this.uploadVehicleObj.img_thumbnailPath,
          });
        } else if (this.xjVechicleType === 2) {
          params = Object.assign(params, {
            plateNo: this.xjPlateNo
          });
        }
        // console.log('addVhicleVideoContinue', params);
        addVhicleVideoContinue(params).then((res) => {
          if (res) {
            this.xjClose(true);
          }
          this.submitLoading = false;
        }).catch((error => {
          this.submitLoading = false;
        }));
      }
    },
    // 信息提示
    msgTips (smsg) {
      let nMsg = $('.el-message--info');
      if (nMsg && nMsg.length > 0) {
        nMsg.find('.el-message__content').text(smsg);
      } else {
        this.$message({
          message: smsg,
          type: 'info'
        });
      }
    }
  },
  destroyed () {
    if (this.xjMap) {
      this.xjMap.destroy();
    }
  }
}
</script>
<style lang="scss" scoped>
.relay_new {
  width: 100%; height: 100%;
  > div { width: 100%; height: 100%; position: relative; }
}
.mb_map_list {
  padding: 10px 0 10px 20px;
  height: 640px;
  overflow: auto;
}
.mb_map_map {
  overflow: hidden;
  .mb_map_map_l {
    float: left;
    width: 250px;
    > .mb_map_map_lt {
      height: 40px; line-height: 40px;
      padding: 0 10px 0 10px;
      border-bottom: 1px solid #f2f2f2;
      overflow: hidden;
      > span {
        cursor: default;
        float: right;
        color: #999;
        &.map_lt_sed { color: #186DFB; cursor: pointer; }
      }
    }
    > .mb_map_map_lb {
      width: 100%; height: 599px;
      overflow: auto;
    }
  }
  .mb_map_map_r {
    margin-left: 250px;
    border-left: 1px solid rgba(242,242,242,1);
    > h4 {
      height: 40px; line-height: 40px;
      padding-left: 20px;
    }
    > div {
      position: relative;
      height: 600px;
      > ul {
        position: absolute; bottom: 20px; right: 10px;
        > li {
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          background-color: #fff;
          padding: 10px 10px;
          text-align: center;
          cursor: pointer;
          > i { font-size: 24px; color: #0C70F8; }
          > p { font-size: 12px; position: relative; top: -2px; }
          &.vl_icon_sed {
            color: #0C70F8;
          }
        }
      }
    }
  }
}
.relay_task_mb {
  border-top: 1px solid #eee;
  > h3 {
    color: #666;
    padding-top: 10px;
  }
  > .task_mb_map {
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
    > .task_mb_mt {
      border-bottom: 1px solid #eee;
      overflow: hidden;
      background-color: #FAFAFA;
      > li {
        float: left;
        height: 40px; line-height: 40px;
        margin: 0 20px;
        border-bottom: 2px solid #FAFAFA;
        cursor: pointer;
        &.task_mb_mt_sed {
          color: #0C70F8;
          border-bottom-color: #0C70F8;
          cursor: default;
        }
      }
    }
  }
  > .task_mb_d {
    padding: 15px 0 8px 0;
    > span { color: #666; }
  }
}
.relay_task_mm {
  padding: 15px 0;
  color: #0C70F8;
  > span {
    display: inline-block;
    cursor: pointer;
    > i {
      padding-left: 5px;
      color: #0C70F8; font-size: 16px;
      transition: all .4s ease-out;
      &.relay_task_mm_d2 {
        transform: rotate(180deg);
      }
    }
  }
}
.relay_task_mtl {
  float: left;
  width: 260px;
  height: 330px;
  border-radius:4px 4px 0px 0px;
  border:1px solid rgba(211,211,211,1);
  > .task_mtl_t {
    padding: 14px 0 14px 20px;
    text-align: left;
    background-color: #F2F2F2;
  }
  > .task_mtl_m {
    padding: 12px 25px 12px 25px;
    color: #666;
    overflow: hidden;
    > i {
      display: inline-block;
      color: red;
      font-style: normal;
    }
    > span {
      float: right;
      color: #0C70F8;
      cursor: pointer;
    }
  }
  > .task_mtl_u {
    position: relative;
    margin: 0 auto;
    width: 200px; height: 200px;
    > p {
      display: none;
      position: absolute; bottom: 0; left: 0;
      text-align: center;
      width: 100%; height: .4rem; line-height: .4rem;
      color: #FFFFFF;
      border-radius: 0 0 10px 10px;
      background: #0C70F8;
      cursor: pointer;
    }
    > .del_icon {
      display: none;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      color: #FFFFFF;
    }
    &:hover {
      > p { display: block; }
      > .del_icon { display: block; }
    }
  }
}
.relay_task_mtr {
  margin-left: 270px;
  height: 330px;
  > div {
    width: 100%; height: 100%;
    padding: 10px 15px;
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
    > h3 { padding-top: 5px; }
    > ul {
      overflow: hidden;
      padding-top: 10px;
      > li {
        width: 25%; float: left;
        height: 40px; line-height: 40px;
        > span {
          display: inline-block;
          width: 95px; padding-right: 5px;
          text-align: right;
          color: #666;
        }
      }
    }
  }
  > .task_mtr_ld {
    border: 0;
    color: #999;
    > i {
      position: relative; top: 2px;
      font-size: 20px;
      margin-right: 5px;
    }
  }
}
.relay_task_t {
  position: absolute; top: 0; left: 0;
  width: 100%;
  padding: 20px 0 0 20px;
}
.relay_task_m {
  height: 100%;
  padding: 50px 10px 70px 10px;
  > div {
    height: 100%;
    padding: 10px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
  }
}
.relay_task_b {
  position: absolute; bottom: 0; left: 0; z-index: 20;
  width: 100%; height: 60px;
  padding: 14px 0 0 20px;
  background-color: #fff;
  border-left: 1px solid #ddd;
}
.relay_main { width: 100%; height: 100%; }
.relay_ul_list {
  height: 100%;
  padding-bottom: 50px;
  border-top: 1px solid #eee;
  > ul {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    > li {
      padding: 10px 10px 10px 20px;
      border-bottom: 1px solid #eee;
      > div {
        > .relay_ul_lit {
          position: relative;
          font-size: 12px; color: #333;
          margin-bottom: 5px;
          height: 22px; line-height: 22px;
          > span {
            position: absolute; top: 2px; right: 0;
            &.relay_ul_lit_t1 { color: #4FCB61; }
            &.relay_ul_lit_t2 { color: #FA453A; }
            &.relay_ul_lit_t3 {
              display: none;
              line-height: normal;
              padding: 2px 5px;
              background:rgba(12,112,248,1);
              border-radius:4px;
              color: #fff; font-size: 12px;
              cursor: pointer;
            }
          }
        }
        > .relay_ul_lii {
          height: 60px;
          text-align: center;
          margin-bottom: 5px;
          > img { max-height: 100%; max-width: 100%; text-align: center; }
        }
        > .relay_ul_lid {
          height: 20px; line-height: 20px;
          font-size: 12px; color: #999;
        }
        > .relay_ul_lim {
          padding: 5px 0;
          > ul {
            width: 76px;
            margin: 0 auto; padding: 8px 0;
            background:rgba(242,242,242,1);
            border:1px solid rgba(211, 211, 211, 0.97);
            border-radius:3px;
            > li {
              text-align: center;
              font-size: 12px;
            }
          }
        }
        &.relay_ul_list_active {
          > .relay_ul_lit { color: #999; }
        }
        &:hover {
          > .relay_ul_lit {
            > span {
              &.relay_ul_lit_t3 { display: block; }
            }
          }
        }
      }
    }
  }
}
.relay_ul_btn {
  position: absolute; bottom: 0; left: 0;
  border-top: 1px solid #eee;
  padding-bottom: 2px;
  width: 100%; height: 50px; line-height: 48px;
  text-align: center;
  background-color: #fff;
}
</style>
