<template>
  <div class="vl_map">
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
                      clearable
                      v-model="mapInfoVal">
              </el-input>
              <el-button type="primary" @click="filterMapTree" icon="el-input__icon el-icon-search" style="font-size: .2rem;line-height: .32rem;cursor:pointer;"></el-button>
            </div>
            <div class="map_lc_dc">
              <vue-scroll>
                <ul class="db_tree" :id="dbId">
                  <li :id="'db_area_' + item.areaId" v-for="(item, index) in mapTreeData" :key="'tl_' + index">
                    <i class="el-icon-arrow-right" @click="selFirstEvent(item.areaId)"></i>
                    <span @click="selFirstEvent(item.areaId)">{{item.areaName}}</span>
                    <ul class="db_tree_s">
                      <li :id="'db_area_' + sitem.areaId" v-for="(sitem, sindex) in getCurList(item.infoList)" :key="'stl_' + sindex">
                        <i class="el-icon-arrow-right" @click="selSecondEvent(sitem.areaId, item.areaId)"></i>
                        <span @click="selSecondEvent(sitem.areaId, item.areaId)">{{sitem.infoName}}</span>
                        <!--车辆-->
                        <div class="db_tree_c"  v-if="sitem.infoName === '车辆' && getCurTypeData(sitem).length">
                          <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                            <li :title="ditem.infoName" @click="signListTap(ditem, 'InfoWindow')" v-for="(ditem, dindex) in getCurTypeData(sitem)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                              {{ditem.infoName}}
                            </li>
                          </ul>
                        </div>
                        <!--非车辆-->
                        <ul class="db_tree_s db_tree_c db_tree_s_s" v-else>
                          <li :id="'db_area_' + sitem.areaId + '000001'" v-show="getCurTypeData(sitem, 0).length">
                            <i class="el-icon-arrow-right" @click="selSecondEvent(sitem.areaId + '000001')"></i>
                            <span @click="selSecondEvent(sitem.areaId + '000001')">摄像头</span>
                            <div class="db_tree_c">
                              <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                                <li :title="ditem.infoName" @click="signListTap(ditem, 'InfoWindow')" v-for="(ditem, dindex) in getCurTypeData(sitem, 0)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                                  {{ditem.infoName}}
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li :id="'db_area_' + sitem.areaId + '000002'" v-show="getCurTypeData(sitem, 1).length">
                            <i class="el-icon-arrow-right" @click="selSecondEvent(sitem.areaId + '000002')"></i>
                            <span @click="selSecondEvent(sitem.areaId + '000002')">卡口</span>
                            <div class="db_tree_c">
                              <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                                <li :title="ditem.infoName" @click="signListTap(ditem, 'InfoWindow')" v-for="(ditem, dindex) in getCurTypeData(sitem, 1)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                                  {{ditem.infoName}}
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li :id="'db_area_' + sitem.areaId + '000004'"  v-show="getCurTypeData(sitem, 3).length">
                            <i class="el-icon-arrow-right" @click="selSecondEvent(sitem.areaId + '000004')"></i>
                            <span @click="selSecondEvent(sitem.areaId + '000004')">人员</span>
                            <div class="db_tree_c">
                              <ul class="db_tree_cul db_tree_cd db_tree_cul_open">
                                <li :title="ditem.infoName" @click="signListTap(ditem, 'InfoWindow')" v-for="(ditem, dindex) in getCurTypeData(sitem, 3)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                                  {{ditem.infoName}}
                                </li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div class="map_search_list" v-if="showSearchList">
                  <div  v-for="(item, index) in mapTreeData" :key="'tls_' + index">
                    <template v-if="getCurList(item.infoList).length">
                      <ul v-for="(sitem, sindex) in getCurList(item.infoList)" :key="'stls_' + sindex">
                        <li :title="ditem.infoName" @click="signListTap(ditem, 'InfoWindow')" v-for="(ditem, dindex) in getCurTypeData(sitem)" :key="'dl_' + index + '_' + sindex + '_' + dindex">
                          {{ditem.infoName}}
                          <i v-show="ditem.dataType === 0" class="vl_icon vl_icon_v11"></i>
                        </li>
                      </ul>
                    </template>
                    <template v-else><p>没有匹配的数据</p></template>
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
          <!-- 标注列表 -->
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
                <div class="map_lc_dc_mark" @click="signListTap(item, 'InfoWindow')" v-for="item in markList" :key="item.id" v-if="item.isShow">
                  <div class="dc_mark_c">{{item.markContent}}</div>
                  <p><span>{{item.opUserName}}</span><span>{{item.createTime | fmTimestamp('yy-MM-dd HH:mm')}}</span></p>
                  <div class="dc_mark_b"><i class="el-icon-location-outline"></i><span>{{item.position}}</span> <span v-if="item.mineFlag" class="el-icon-delete" @click.stop="delMark('这条', item)"></span></div>
                </div>
                <p v-show="markList.length === 0 || signEmpty" style="text-indent: 20px;">无相关数据</p>
              </vue-scroll>
            </div>
            <el-button class="dc_clear_mark" type="primary" @click="delMark('所有', 0)">清空标注</el-button>
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
        <el-checkbox-group v-model="mapTypeList" class="vl_map_rt_cks">
          <el-dropdown :split-button="index !== 1" trigger="click" v-for="(item, index) in constObj" :key="item.id" :hide-on-click="false">
            <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll"  :label="index">
              {{item.name}}<span class="map_rt_ck_num">&nbsp;{{(mapTreeData[0] ? mapTreeData[0][item._key] : 0) | fmTenThousand}}</span>
            </el-checkbox>
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="item.supTypeList" class="vl_map_rt_cks" @change="supCheckedTypeChange(item, index)">
                <el-dropdown-item v-for="(sItem, sIndex) in item.supOptions" :key="sItem.id">
                  <el-checkbox :label="sIndex">{{sItem.name}}</el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </el-checkbox-group>
      </div>
      <!--<div class="map_rt">-->
      <!--<el-tree-->
      <!--class="test_tree"-->
      <!--:data="testObj"-->
      <!--show-checkbox-->
      <!--node-key="id"-->
      <!--:default-expanded-keys="[10]"-->
      <!--:default-checked-keys="[10]"-->
      <!--&gt;</el-tree>-->
      <!--</div>-->
      <!-- 右侧工具栏 -->
      <div class="map_rrt">
        <ul class="map_rrt_u1">
          <li :class="{'vl_icon_sed': activeType ===  1}" @click="selArea">
            <i class="vl_icon vl_icon_041"></i>
            <el-popover
                    placement="left"
                    trigger="hover"
                    content="单击选择范围，双击完成">
              <span slot="reference">选择区域</span>
            </el-popover>
          </li>
          <li :class="{'vl_icon_sed': activeType ===  2}" @click="ranging">
            <i class="vl_icon vl_icon_042"></i>
            <el-popover
                    placement="left"
                    trigger="hover">
              <p>点击×删除当前测距点，点击<span class="el-icon-delete"></span>删除全部测距点</p>
              <span slot="reference">测距</span>
            </el-popover>
          </li>
          <li :class="{'vl_icon_sed': activeType ===  4}" @click="mark">
            <i class="vl_icon vl_icon_044"></i>
            <span>标注</span>
          </li>
          <li @click="resetTools(0)">
            <i class="vl_icon vl_icon_045"></i>
            <span>恢复默认</span>
          </li>
        </ul>
        <ul class="map_rrt_u2">
          <li @click="resetZoom"><i class="el-icon-aim"></i></li>
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
    <!--删除标注确定弹窗-->
    <el-dialog
            title="提示"
            :visible.sync="deleteMarkDialog"
            :show-close="false"
            width="400px">
      <span>确定清除{{delMessage}}标注吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="delLoading" @click="deleteMarkDialog = false">取 消</el-button>
        <el-button :loading="delLoading" type="primary" @click="comfirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <!--全屏视频监控-->
    <div v-if="showBigVideo" is="flvplayer" class="vl_map_full_video"  @playerClose="playerClose" :index="0" :oData="oData" :showFullScreen="true" :bResize="bResize" :oConfig="{sign: true}"></div>
    <!--通话时长-->
    <p :class="'vl_map_time_' + item._id" v-for="item in isCalling"  :key="item.id">
      {{item.minute &lt; 10 ? '0' + item.minute : item.minute}}:{{item.second &lt; 10 ? '0' + item.second : item.second}}
    </p>
  </div>
</template>
<script>
  import {testData} from './testData'
  import flvplayer from '@/components/common/flvplayer.vue';
  import {formatDate, objDeepCopy, random14} from '../../../../utils/util.js';
  import {MapGETmonitorList, MapGETsignList, MapDELETEmapSign, MapDELETEmapSigns, MapUPDATEEmapSign, MapPOSTmapSign, MapGetBayonetInfo} from '../../api/api.map.js';
  import {apiVideoPlay} from "@/views/index/api/api.video.js";
  import {getAlarmListByDev} from '@/views/index/api/api.control.js';
  export default {
    components: {flvplayer},
    data () {
      return {
        showSearchList: false,
        dbId: 'db_tree_' + random14(),
        mapCenter: [110.594419,27.908869],
        graspRoad: null,
        key2Type: {
          0: 'deviceBasicList',
          1:  'bayonetList',
          2:'carList',
          3: 'sysUserExtendList'
        },
        hideClass: 'vl_map_selarea_hide',
        findType: {
          0: 'deviceStatus', // 1为部门范围，2 基本范围
          2: 'vehicleType', // 1 执勤车、2 公交车、3 出租车、4 客运车、5 校车、6 危化车
          3: 'userSex'  // 1为部门成员，2 普通民众
        },
        showBigVideo: false,
        signEmpty: false,
        oData: null,
        bResize: null,
        timer: null,
        constObj: [
          {name:'摄像头', _key: 'deviceBasicListNum', supOptions: [{name: '部门范围'},{name: '其他范围'}], isIndeterminate: false, checkAll: true, supTypeList: [0, 1], supTypeListAll: [0, 1]},
          {name:'卡口', _key: 'bayonetListNum', isIndeterminate: false, checkAll: true},
          {name: '车辆', _key: 'carListNum', supOptions: [{name: '公交车'},{name: '出租车'}, {name: '客运车'}, {name: '校车'}, {name: '危化车'}], isIndeterminate: false, checkAll: true, supTypeList: [0, 1, 2, 3, 4], supTypeListAll: [0, 1, 2, 3, 4]},
          {name: '人员', _key: 'sysUserExtendListNum', supOptions: [{name: '部门成员'},{name: '普通民众'}], isIndeterminate: false, checkAll: true, supTypeList: [0, 1], supTypeListAll: [0, 1]}
        ],
        car2Name: {
          1: '公交车',
          2: '出租车',
          3: '客运车',
          4: '校车',
          5: '危化车'
        },
        map: null, // 地图对象
        mapTypeList: [0, 1, 2, 3],
        mapTypeListAll: [0, 1, 2, 3],
        tabType: 1, // 1地图信息 2标注历史
        mapInfoVal: '', // 地图信息查询值
        mapTreeData: [],
        mapTreeProps: {
          children: 'infoList',
          label: 'infoName'
        },
        markInfoVal: '', // 标注列表查询值
        markList: [], // 标注列表
        vehicleTimer: null, // 查询车辆数据定时器
        deleteMarkDialog: false,
        delMessage: '',
        curSignObj: {},
        delLoading: false,
        marks: [[], [], [], [], []], // 地图上的覆盖物集合
        // 车辆相关
        carMarks: null, // 车辆路径起点mark跟路径line集合

        videoMarker: {curObj: [], marks: [], players: []}, // 摄像头播放视频对象集合
        bayonetOpened: [], // 点开过的卡口
        signInfoWin: null, // 标注信息窗口对象
        addSignInfoWin: null, // 新增标注对象
        showInfoWin: false, // 信息窗体显示状态
        activeType: 0, // 右侧工具激活索引
        hoverWindow: null,// 全局信息窗口
        geocoder: null,
        // 选择区域
        mouseTool: null,
        selAreaPolygon: null,
        delSelAreaIcon: null,
        // 标注
        markListener: null,
        markEditMarker: null,
        markEditWindow: null,

        // 测距
        dbListener: null,
        rightListener: null,
        // 报警
        snapMarks: [],
        // 视频通话
//      isPc: false,
//      telNo: null,
//      curCall: {}
//      oAdd: {},
//      oDel: {},
//      callingList: [] // 通话状态下的人员列表，{}包含
      }
    },
    computed: {
      isCalling () {
        return this.$store.state.callingList.filter(x => x.isTime)
      },
      oAdd () {
        return this.$store.state.oAdd;
      },
      oDel () {
        return this.$store.state.oDel;
      },
      callingList () {
        return this.$store.state.callingList;
      },
      stateHandler () {
        return this.$store.state.stateHandler;
      },
      switchCall () {
        return this.$store.state.switchCall;
      }
    },
    created () {
    },
    watch: {
      mapInfoVal (val) {
        if (!val) {
          this.showSearchList = false;
          this.mapTreeData[0].infoList.forEach(x => {
            x.infoList.forEach(y => {
              this.isInAreaAndCheckBox(y)
            })
          })
          console.log(this.mapTreeData[0].infoList)
          this.operClassToEL();
          this.updateNumberss();
        }
      },
      markInfoVal (val) {
        if (val) {
          this.markList.forEach(x => x.isShow = false);
          this.markList.filter(x => {
            return x.opUserName.indexOf(val) !== -1 || x.markContent.indexOf(val) !== -1
          }).forEach(y => y.isShow = true)
          if(this.markList.findIndex(z => z.isShow) === -1) {
            this.signEmpty = true;
          } else {
            this.signEmpty = false;
          }
        } else {
          this.markList.forEach(x => x.isShow = true)
        }
      },
      showInfoWin (e) {
        if (!e) {
          $('.sign_text').unbind('keyup')
        }
      },
      mapTypeList (newValue, oldValue) {
        console.log(newValue, oldValue);
        let arr = [], bool = false;
        if (oldValue.length > newValue.length) { // 隐藏
          arr = oldValue.filter(x => !newValue.includes(x))
          bool = false;
        } else { // 显示
          arr = newValue.filter(x => !oldValue.includes(x))
          bool = true;
        }
        // 更新子菜单勾选状态
        arr.forEach(x => {
          this.constObj[x].isIndeterminate = false;
          if (bool) {
            this.constObj[x].supTypeList = this.constObj[x].supTypeListAll;
          } else {
            this.constObj[x].supTypeList = [];
          }
        })
        // 更新地图Top栏 跟
        this.mapTreeData[0].infoList.forEach(x => {
          x.infoList.forEach(y => {
            this.isInAreaAndCheckBox(y)
          })
        })
        console.log(this.mapTreeData[0].infoList)
        this.operClassToEL();
        this.updateNumberss();
      },
      // 视频通话相关
      stateHandler (oData) {
        console.log('----------------------------->', oData)
        if (oData.state > 20) {
          if (oData.mark) {
            this.map.remove(oData.mark);
          }
          $('#' + oData._mid).removeClass('vl_icon_map_mark_calling');
        } else if (oData.state === 20) {
          let domT = document.getElementsByClassName('vl_map_time_' + oData._id)
          setTimeout(() => {
            $('#' + oData._id).append(domT[0])
          }, 1000)
        }
      },
      switchCall (data) {
        let _sclass = data.type === '0' ? 'vl_icon_map_calling1' : 'vl_icon_map_calling0'
        $('#' + data._id + ' div').removeClass(_sclass);
        $('#' + data._id + ' div').addClass('vl_icon_map_calling' + data.type);
      },
      oAdd () {
        this.watchCalling();
      }
    },
    mounted () {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 14, // 级别
        center: _this.mapCenter, // 中心点坐标
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) {
        console.log(e)
        if(!e.obj.B.isRing) {
          if (_this.selAreaPolygon) {_this.map.remove(_this.selAreaPolygon);}
          if (_this.delSelAreaIcon) {_this.map.remove(_this.delSelAreaIcon);}
          _this.selAreaPolygon = e.obj;
          // delete icon
          _this.delSelAreaIcon = new window.AMap.Marker({
            map: _this.map,
            position: e.obj.getPath()[e.obj.getPath().length - 1],
            offset: new window.AMap.Pixel(-15, -16),
            draggable: false, // 是否可拖动
            content: '<div  class="vl_map_hover"><span class="del_area_icon el-icon-circle-close"></span></div>'
          })
          // 给范围内外的元素添加isInArea,原始数据也同样设置
          let m;
          _this.mapTreeData[0].infoList.forEach(x => {
            x.infoList.forEach(y => {
              if (y.longitude && y.latitude) {
                m = new window.AMap.Marker({
                  position: [y.longitude, y.latitude]
                })
                let point = m.getPosition();
                if (window.AMap.GeometryUtil.isPointInRing(point, _this.selAreaPolygon.getPath()) && y.isShow) {
                  y['isInArea'] = true;
                } else {
                  y['isInArea'] = false;
                }
                m = null;
              }
            })
            // 原始数据也加上isInArea
            _this.mapTypeList.forEach(z => {
              x[_this.key2Type[z]].forEach(y => {
                if (y.longitude && y.latitude) {
                  m = new window.AMap.Marker({
                    position: [y.longitude, y.latitude]
                  })
                  let point = m.getPosition();
                  if (window.AMap.GeometryUtil.isPointInRing(point, _this.selAreaPolygon.getPath())) {
                    y['isInArea'] = true;
                  } else {
                    y['isInArea'] = false;
                  }
                  m = null;
                }
              })
            })
          })
          console.log(_this.mapTreeData[0])
          _this.updateNumberss(false, '', false, true);
          setTimeout(() => {
            let allNode = _this.$refs.mapLeftTree.store._getAllNodes();
            _this.objSetItem(allNode, {expanded: true})
          }, 30)
          // 给范围内的marker加class
          _this.mapTypeList.forEach(u => {
            _this.operClassToEL(_this.marks[u], _this.hideClass, false, true, _this.selAreaPolygon ? _this.selAreaPolygon.getPath() : null)
          })
          _this.activeType = 0;
          _this.resetTools(1)
        }
      });
      this.getMonitorList();
      this.getMarkHistory();
      // map click event
      _this.mapMarkerEvents();
      setTimeout(() => {
        this.getAlarmListByDev();
      }, 12000);
    },
    methods: {
      getCurList (list) {
        // 过滤出list下对象的infoList，有isShow的元素
        return list.filter(x => x.infoList.find(y => y.isShow))
      },
      getCurTypeData (data, type) {
        if (type) {
          return data.infoList.filter(x => x.dataType === type && x.isShow);
        } else {
          return data.infoList.filter(x => x.isShow);
        }
      },
      changeType (areaId, type) {
        let $li = $('#' + this.dbId).find('#db_area_' + areaId);
        if ($li && $li.length > 0) {
          if (type === 1) { // 摄像头
            $li.find('.db_tree_ct_b').removeClass('db_tree_ct_sed');
            $li.find('.db_tree_ct_d').addClass('db_tree_ct_sed');
            $li.find('.db_tree_cb').removeClass('db_tree_cul_open');
            $li.find('.db_tree_cd').addClass('db_tree_cul_open');
          } else {
            $li.find('.db_tree_ct_d').removeClass('db_tree_ct_sed');
            $li.find('.db_tree_ct_b').addClass('db_tree_ct_sed');
            $li.find('.db_tree_cd').removeClass('db_tree_cul_open');
            $li.find('.db_tree_cb').addClass('db_tree_cul_open');
          }
        }
      },
      selFirstEvent (areaId) {
        let $li = $('#' + this.dbId).find('#db_area_' + areaId);
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
      // areaId, pareaId
      selSecondEvent (areaId) {
        let $li = $('#' + this.dbId).find('#db_area_' + areaId);
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
      },

      filterMapTree () {
        if (this.mapInfoVal) {
          this.showSearchList = true;
          this.mapTreeData[0].infoList.forEach(x => {
            x.infoList.forEach(y => {
              if (y.infoName.indexOf(this.mapInfoVal) === -1) {
                y.isShow = false;
              }
            })
          })
          this.updateNumberss();
          this.operClassToEL()
        }
      },
      // 获取标注列表
      getMarkHistory () {
        MapGETsignList().then(res => {
          if (res) {
            this.markList = res.data;
            this.markList = this.objSetItem(this.markList, {dataType: 4, isShow: true});
            let obj = {}
            obj['infoList'] = this.markList;
            this.mapMark([obj])
          }
        })
      },
      delMark (mes, curSign) {
        this.delMessage = mes;
        this.curSignObj = curSign
        this.deleteMarkDialog = true;
      },
      comfirmDel () {
        this.delLoading = true;
        if (this.delMessage === '这条') {
          let params = {
            id: this.curSignObj.uid
          }
          MapDELETEmapSign(params).then(res => {
            if (res) {
              this.$message.success('删除成功');
              // clear current marker form map
              let _i = this.markList.findIndex(x => {
                return x.uid === this.curSignObj.uid;
              })
              console.log(this.curSignObj.dataType, _i)
              this.clearSign(false, this.curSignObj.dataType, _i);
              if (this.hoverWindow ){this.hoverWindow.close()}
              this.markList = this.markList.filter(x => x.uid !== this.curSignObj.uid);
              this.marks[4].forEach(x => {
                if (x.getExtData().uid === this.curSignObj.uid) {
                  this.map.remove(x)
                }
              })
            }
            this.delLoading = false;
            this.deleteMarkDialog = false;
          })
        } else {
          MapDELETEmapSigns().then(res => {
            if (res) {
              this.$message.success('列表中自建标注已全部删除')
              this.markList = this.markList.filter(x => !x.mineFlag)
              this.clearSign(true, 4)
            }
            this.delLoading = false;
            this.deleteMarkDialog = false;
          })
        }
      },
      // 根据点击类型，地图响应
      signListTap (objList, classType, originObj) {
        if (originObj) {
          let newObj, _id = 'flv' + random14(), _indexList = [];
          if (objList.length > 1) {
            this.map.setZoomAndCenter(16, [originObj.longitude, originObj.latitude])
          }
          objList.forEach((x, _i) => {
            let _index = this.videoMarker.curObj.findIndex(y => y.uid === x.uid);
            if (_index !== -1){
              _indexList.push(_index);
              let offsetXY = this.getXY(_i)
              $('#' + this.videoMarker.curObj[_index]._id).show();
              this.videoMarker.marks[_index].setPosition([originObj.longitude + offsetXY.x, originObj.latitude + offsetXY.y])
              this.videoMarker.players[_index].play();
            }
            x['_id'] = _id + _i;
            x['_index'] = this.videoMarker.curObj.length + _i;
          })
          if (_indexList.length) {
            if (_indexList.length === 1) {
              if (!document.getElementById(this.videoMarker.curObj[_indexList[0]]._id).parentNode.classList.contains('vl_map_hover0')) {
                document.getElementById(this.videoMarker.curObj[_indexList[0]]._id).parentNode.classList.add('vl_map_hover0')
              }
            } else {
              _indexList.forEach(z => {
                if (document.getElementById(this.videoMarker.curObj[_indexList[z]]._id).parentNode.classList.contains('vl_map_hover0')) {
                  document.getElementById(this.videoMarker.curObj[_indexList[z]]._id).parentNode.classList.remove('vl_map_hover0')
                }
              })
            }
            return false;
          }
          newObj = objDeepCopy(objList);
          this.objSetItem(newObj, {dataType: 5})
          newObj.forEach((x, _i) => {
            let _pClass = 'vl_map_hover', offsetXY;
            setTimeout(() => {
              // _pClass += _i
              // 计算卡口每个视频的偏移量，来修改mark可移动的区域
              offsetXY = this.getXY(_i)
              let sContent = '<div class="vl_map_hover ' + _pClass + '" >' + this.mapHoverInfo(x) + '</div>';
              let options = {
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                content: sContent,
                position: [originObj.longitude + offsetXY.x, originObj.latitude + offsetXY.y], topWhenClick: true,draggable: true, map: this.map
              }
              let marker = new window.AMap[classType](options);
              this.videoMarker.curObj.push(x)
              this.videoMarker.marks.push(marker)
              setTimeout(() => {
                this.$_showLoading({target: '#' + x._id})
                this.initPlayer(x);
              }, 300)
            }, 1000 * _i)
          })
        } else {
          let sysIndex = this.callingList.findIndex(j => j.uid === objList.uid + '');
          let _cMark = this.marks[objList.dataType].find(x => x.getExtData().uid === objList.uid);
          if (!_cMark) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('没有发现该目标的经纬度');
            }
            return false;
          }
          let _cMarkPos = _cMark.getPosition();
          if (sysIndex === -1) {
            let sContent = '<div class="vl_map_hover" >' + this.mapHoverInfo(objList) + '</div>';
            let _px;
            if (objList.dataType === 2) {
              _px = -40;
            } else {
              _px = 0
            }
            let options = {
              offset: new window.AMap.Pixel(0, _px), // 相对于基点的偏移位置
              content: sContent,
              closeWhenClickMap: true,isCustom: true
            }
            this.hoverWindow = new window.AMap[classType](options);
            this.hoverWindow.on('open', function () { this.showInfoWin = true; })
            this.hoverWindow.on('close', function () { this.showInfoWin = false; })
            this.hoverWindow.open(this.map, new window.AMap.LngLat(_cMarkPos.lng, _cMarkPos.lat));
          }
          this.map.setZoomAndCenter(16, [_cMarkPos.lng, _cMarkPos.lat])
        }
      },
      getXY (i) {
        let obj = {x: 0, y: 0}
        switch (i) {
          case 1:
            obj.x = 0.0047;
            obj.y = -0.0025;
            break;
          case 2:
            obj.y = -0.0051
            break;
          case 3:
            obj.x = -0.0047;
            obj.y = -0.0025;
            break;
          case 4:
            obj.x = -0.0047;
            break;
          case 5:
            obj.x = 0.0047;
            break;
          case 6:
            obj.x = 0.0047;
            obj.y = -0.0051;
            break;
          case 7:
            obj.x = -0.0047;
            obj.y = -0.0051
            break;
        }
        return obj;
      },
      //获取地图信息列表
      getMonitorList () {
        this.$_showLoading({target: '.vl_map'})
        let params = {
          areaUid: '431224'
        }
        MapGETmonitorList(params)
            .then(res => {
              if (res) {
                // 根据当前登录部门，做车辆组对象
                let __obj = {
                  areaName: '车辆',
                  areaType: '4',
                  bayonetList: [], carList: [], deviceBasicList: [], sysUserExtendList: []
                }
                // 获取车辆数据
                this.getVehicel().then(vData => {
                  vData.forEach(x => {
                    x['lineArr'] = [
                      [x.gpsLongitude, x.gpsLatitude]
                    ];
                    x['longitude'] = x.gpsLongitude;
                    x['latitude'] = x.gpsLatitude;
                    x['isDrawLine'] = false;
                  })
                  __obj.carList = vData;
                  res.data.areaTreeList.push(__obj);
//                  this.mapTreeData = this.switchData(res.data);
                  this.mapTreeData = testData;
                  console.log('树的数据', this.mapTreeData);
                  this.$_hideLoading();
                  this.mapMark(this.mapTreeData[0].infoList);
                  // 定时查询车辆数据
                  this.updateNumberss();// 假数据用的
//                  this.carLoop();
//                  this.watchCalling();
                })
              }
            })
      },
      carLoop () {
        this.vehicleTimer = setTimeout(() => {
          this.getVehicel().then(_supData => {
            let _carL = this.mapTreeData[0].infoList.find(x => x.infoName === '车辆');
            _supData = this.objSetItem(_supData, {infoName: 'vehicleNumber', areaType: '5', dataType: 2, isShow: true, longitude: 'gpsLongitude', latitude: 'gpsLatitude', isDrawLine: false});
            _supData.forEach(x => {
              // 说明最新的该车辆在原来数据里有
              let oldDIndex = _carL.carList.findIndex(y => y.uid === x.uid);
              if (oldDIndex !== -1) {
                x['isDrawLine'] = _carL.carList[oldDIndex]['isDrawLine'];
                let moveMark = this.marks[2].find(y => y.getExtData().uid === x.uid);
                let _s = moveMark.getPosition();
                // x['lineArr'] = this.drivingPath([[_s.lng, _s.lat], [x.gpsLongitude, x.gpsLatitude]]); // 路线纠偏
                x['lineArr'] = [[_s.lng, _s.lat], [x.gpsLongitude, x.gpsLatitude]];
                // 判断车辆是否在画轨迹
                new window.AMap.Polyline({
                  map: this.map,
                  path: x.lineArr,
//                        showDir:true,
                  strokeColor: "#28F",  //线颜色
                  strokeOpacity: 0,     //线透明度
                  strokeWeight: 6,      //线宽
                  bubble: true
                  // strokeStyle: "solid"  //线样式
                });
                // console.log('line------------', x, _carL.carList[oldDIndex])
                moveMark.moveAlong(x.lineArr, x.speed);
                if (x.isDrawLine) {
                  // 把前一次跑的路线更换成已完成的线
                  let _path = [];
                  if (_carL.carList[oldDIndex].lineArr[0].lng && _carL.carList[oldDIndex].lineArr[0].lat) {
                    _path = [[_carL.carList[oldDIndex].lineArr[0].lng, _carL.carList[oldDIndex].lineArr[0].lat], [_s.lng, _s.lat]]
                  } else {
                    _path = [[_carL.carList[oldDIndex].lineArr[0][0], _carL.carList[oldDIndex].lineArr[0][1]], [_s.lng, _s.lat]]
                  }
                  let passedLine = new window.AMap.Polyline({
                    map: this.map,
                    path: _path,
//                          path: _carL.carList[oldDIndex].lineArr,
                    strokeColor: "#61C772",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    lineCap: 'round',
                    bubble: true
                    // strokeStyle: "solid"  //线样式
                  });
                  this.carMarks.passedLine.push(passedLine);
                }
                _carL.carList.splice(oldDIndex, 1);
              } else {
                x['lineArr'] = [[x.gpsLongitude, x.gpsLatitude]];
                // 把新增的车放入地图
                this.mapMark([{infoList:[x]}], true)
              }
            })
            // _carL.carList里剩下的是，消失的车子,移除掉
            if (_carL.carList.length) {
              _carL.carList.forEach(x => {
                let rMarkIndex = this.marks[2].findIndex(y => y.getExtData().uid === x.uid);
                this.map.remove(this.marks[2][rMarkIndex]);
                this.marks[2].splice(rMarkIndex, 1);
                // 如果在画轨迹的车没有了，则清除轨迹路线
                if (this.carMarks && this.carMarks.uid === x.uid) {
                  this.clearCarLine();
                }
              })
            }
            // _carL.carList = objDeepCopy(_supData);
            _carL.carList = _supData;
            // 判断顶部车辆有没有勾选
            if (this.mapTypeList.includes(2)) {
              _carL.infoList = [];
              // 判断有没有搜索条件
              _supData.forEach(d => {
                if (this.mapInfoVal) {
                  if (d.infoName.indexOf(this.mapInfoVal) !== -1 || '车辆'.indexOf(this.mapInfoVal) !== -1) {
                    _carL.infoList.push(d);
                  }
                } else {
                  _carL.infoList.push(d);
                }
              })
            }
            this.updateNumberss();
          })
          this.carLoop();
        }, 5000)
      },

      // 路线纠偏
      drivingPath (path) {
        let newPath = [];
        if (!this.graspRoad) {
          window.AMap.plugin('AMap.GraspRoad', () => {
            this.graspRoad = new window.AMap.GraspRoad()
          })
        }
        this.graspRoad.driving(path, function (error, result) {
          if (!error) {
            let _p = result.data.points;
            for (let i = 0; i < _p.length; i++) {
              newPath.push([_p[i].x, _p[i].y])
            }
          }
        })
        if (newPath.length) {
          return newPath;
        } else {
          return path;
        }
      },
      // keys的各个props 代表接口返回的摄像头，人物，车辆，卡口的list的字段名及list里面元素name;;allKey
      switchData(data) {
        let numObj= {'deviceBasicListNum': 0, 'carListNum': 0, 'bayonetListNum': 0, 'sysUserExtendListNum': 0};
        data['infoList'] = data.areaTreeList;
        data['infoName'] = data.areaName;
        data['infoList'].map(x => {
          // 假的卡口，车辆
          let carList;
          carList = [
          ];
          x['infoName'] = x.areaName;
          // dataType = 0 摄像头，2车辆，1卡口，3人员,
          x['deviceBasicList'] = this.objSetItem(x['deviceBasicList'], {infoName: 'deviceName', areaType: '5', dataType: 0, isShow: true});
          if (x['carList']) {
            x['carList'] = this.objSetItem(x['carList'], {infoName: 'vehicleNumber', areaType: '5', dataType: 2, areaUid: x.areaId, isShow: true});
          } else {
            x['carList'] = this.objSetItem(carList, {infoName: 'name', areaType: '5', dataType: 2, areaUid: x.areaId, isShow: true});
          }
          x['bayonetList'] = this.objSetItem(x['bayonetList'], {infoName: 'bayonetName', areaType: '5', dataType: 1, areaUid: x.areaId, isShow: true});
          x['sysUserExtendList'] = this.objSetItem(x['sysUserExtendList'], {infoName: 'userName', areaType: '5', dataType: 3, areaUid: x.areaId, isShow: true});

          let oldArr = [...x['deviceBasicList'],...x['carList'], ...x['bayonetList'], ...x['sysUserExtendList']];
          let newArr = objDeepCopy(oldArr)
          x['infoList'] = newArr;
          // 给第一个元素加识别号
          if (x['infoList'].length) {
            x['isShow'] = true;
          } else {
            x['isShow'] = false;
          }
          // 设置一个数组，判断当前map_tree_tab点了哪几个
          // 计算各个类型的数量，
          for (let _num in numObj) {
            numObj[_num] += x[_num.slice(0, -3)].length
          }
          return x;
        })
        this.objSetItem([data], numObj)
        return [data];
      },
      objSetItem (list, obj) {
        list.map(z => {
          for (let key in obj) {
            z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
          }
          // 都加上markSid , 方便处理移动端发起的通话
          if (!z['markSid']) {
            z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
          }
          return z;
        })
        return list;
      },
      // 地图标记
      mapMark (data) {
        if (data && data.length > 0) {
          let _this = this;
          for (let i = 0; i < data.length; i++) {
            data[i].infoList.forEach(obj => {
              if (obj.longitude > 0 && obj.latitude > 0) {
                let offSet = {0: [-15, -16],1: [-15, -16],2: [-15, -60],3: [-15, -16], 4: [-15, -16],5: [-15, -16]}, sDataType;
                if (obj.dataType === 0 && obj.deviceStatus !== 1) {
                  sDataType = 6;
                }else if (obj.dataType === 2) {
                  sDataType = '2' + obj.vehicleType
                } else {
                  sDataType = obj.dataType;
                }
                let uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
                if (_this.mapTypeList.includes(obj.dataType) || obj.dataType === 4) {
                  if (obj.dataType === 2 && !_this.constObj[obj.dataType].supTypeList.includes(obj.vehicleType - 1)) {
                    uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + ' '+ _this.hideClass +'"></div>'
                  }
                } else {
                  uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + ' '+ _this.hideClass +'"></div>'
                }
                let marker = new window.AMap.Marker({ // 添加自定义点标记
                  map: _this.map,
                  position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                  offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                  draggable: false, // 是否可拖动
                  extData: obj,
                  // 自定义点标记覆盖物内容
                  content: uContent
                });
                _this.marks[obj.dataType].push(marker);
                // 点击地图上的摄像头播放视频
                if (obj.dataType === 0) {
                  marker.on('click', function () {
                    if (_this.activeType) {
                      return false;
                    }
                    if (obj.deviceStatus === 1) {
                      _this.signListTap([obj], 'Marker', obj);
                    } else {
                      _this.$message.warning('该设备异常')
                    }
                  })
                }
                // 卡口视频
                if (obj.dataType === 1) {
                  marker.on('click', function () {
                    if (_this.activeType) {
                      return false;
                    }
                    let bayIndex = _this.bayonetOpened.findIndex(j => j.uid === obj.uid)
                    if (bayIndex === -1) {
                      _this.$_showLoading({target: '.vl_map'})
                      MapGetBayonetInfo({id: obj.uid})
                          .then(res => {
                            if (res) {
                              _this.$_hideLoading();
                              if (res.data.deviceBasicInfoList.length) {
                                let deviceList = res.data.deviceBasicInfoList.filter(s => s.deviceStatus === 1);
                                let badDeviceList = res.data.deviceBasicInfoList.filter(s => s.deviceStatus !== 1);
                                if (deviceList.length) {
                                  _this.signListTap(deviceList, 'Marker', obj);
                                  let _bay = {uid: obj.uid, deviceList: deviceList}
                                  _this.bayonetOpened.push(_bay)
                                }
                                if (badDeviceList.length) {
                                  let badName = badDeviceList.map(n => {return n.deviceName})
                                  _this.$message.warning('该卡口里设备' + badName.jion(',') + '异常')
                                }
                              } else {
                                _this.$message.warning('该卡口没有关联设备')
                              }
                            }
                          })
                    } else {
                      _this.signListTap(_this.bayonetOpened[bayIndex].deviceList, 'Marker', obj);
                    }
                  })
                }
                // 车辆路劲
                if (obj.dataType === 2) {
                  marker.on('click', function () {
                    if (_this.activeType) {
                      return false;
                    }
                    _this.mapTreeData[0].infoList.find(x => x.infoName === '车辆').carList.forEach(x => {x.isDrawLine = false;})
                    let curObjData = _this.mapTreeData[0].infoList.find(x => x.infoName === '车辆').carList.find(y => y.uid === obj.uid);
                    curObjData['isDrawLine'] = true;
                    let passedPolyline = new window.AMap.Polyline({
                      map: _this.map,
                      strokeColor: "#61C772",  //线颜色
                      // strokeOpacity: 1,     //线透明度
                      strokeWeight: 6,      //线宽
                      bubble: true
                      // strokeStyle: "solid"  //线样式
                    });
                    let curP = marker.getPosition();
                    _this.map.setZoomAndCenter(18, [curP.lng, curP.lat])
                    let carMark = new window.AMap.Marker({ // 添加自定义点标记
                      map: _this.map,
                      position: [curP.lng, curP.lat], // 基点位置 [116.397428, 39.90923]
                      offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                      draggable: false, // 是否可拖动
                      extData: obj,
                      // 自定义点标记覆盖物内容
                      content: '<div  class="map_icons vl_icon vl_icon_map_car0"><span class="el-icon-delete"></span></div>'
                    });
                    carMark.on('click', function () {
                      _this.mapTreeData[0].infoList.find(x => x.infoName === '车辆').carList.forEach(x => {x.isDrawLine = false;})
                      _this.clearCarLine();
                    })
                    _this.clearCarLine();
                    // 把mark,line放入carMarks
                    let moveObj = {};
                    moveObj.uid = curObjData.uid;
                    moveObj.mark = carMark;
                    moveObj.moveLine = passedPolyline;
                    moveObj.passedLine = [];
                    _this.carMarks = moveObj;
                    // 把起点设为当前点击位置
                    curObjData.lineArr.splice(0, 1, [curP.lng, curP.lat]);
                    marker.on('moving', function (e) {
                      passedPolyline.setPath(e.passedPath)
                    })
                  })
                }
                // hover
                marker.on('mouseover', function () {
                  let curP = marker.getPosition();
                  // 判断是否已经打开视频
                  $('#' + obj.markSid).addClass('vl_icon_map_hover_mark' + obj.dataType)
                  if (obj.dataType === 0) {
                    let _index = _this.videoMarker.curObj.findIndex(x => x.uid === obj.uid);
                    if (_index !== -1 && !$('#' + _this.videoMarker.curObj[_index]._id).is(':hidden')) {
                      document.getElementById(_this.videoMarker.curObj[_index]._id).style.border = '2px solid #FA453A'
                      return false
                    }
                  } else if (obj.dataType === 1) {
                    let bayIndex = _this.bayonetOpened.findIndex(j => j.uid === obj.uid)
                    if (bayIndex !== -1) {
                      let _return = false;
                      _this.bayonetOpened[bayIndex].deviceList.forEach(g => {
                        let _index = _this.videoMarker.curObj.findIndex(x => x.uid === g.uid);
                        if (_index !== -1 && !$('#' + _this.videoMarker.curObj[_index]._id).is(':hidden')) {
                          document.getElementById(_this.videoMarker.curObj[_index]._id).style.border = '2px solid #FA453A'
                          _return = true;
                        }
                      })
                      if (_return) {
                        return false;
                      }
                    }
                  } else if (obj.dataType === 3) {
                    let sysIndex = _this.callingList.findIndex(j => j.uid === obj.uid + '')
                    if (sysIndex !== -1) {
                      return false;
                    }
                  } else if (obj.dataType === 2) { // 从mapTreeData拿最新数据，获取最新车速
                    let __obj = _this.mapTreeData[0].infoList.find(x => x.infoName === '车辆');
                    obj.speed = __obj.carList.find(r => r.uid === obj.uid).speed;
                  }

                  let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
                  let _px;
                  if (obj.dataType === 2) {
                    _px = -40;
                  } else {
                    _px = 0
                  }
                  _this.hoverWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new window.AMap.Pixel(0, _px), // 相对于基点的偏移位置
                    content: sContent
                  });
                  _this.hoverWindow.on('open', function () { _this.showInfoWin = true; })
                  _this.hoverWindow.on('close', function () { _this.showInfoWin = false; })
                  _this.hoverWindow.open(_this.map, new window.AMap.LngLat(curP.lng, curP.lat));

                });
                marker.on('mouseout', function () {
                  // let curP = marker.getPosition();
                  if (obj.dataType === 0) {
                    let _index = _this.videoMarker.curObj.findIndex(x => x.uid === obj.uid);
                    if (_index !== -1 && !$('#' + _this.videoMarker.curObj[_index]._id).is(':hidden')) {
                      document.getElementById(_this.videoMarker.curObj[_index]._id).style.border = '1px solid #0C70F8'
                    }
                  } else if (obj.dataType === 1) {
                    let bayIndex = _this.bayonetOpened.findIndex(j => j.uid === obj.uid)
                    if (bayIndex !== -1) {
                      _this.bayonetOpened[bayIndex].deviceList.forEach(g => {
                        let _index = _this.videoMarker.curObj.findIndex(x => x.uid === g.uid);
                        if (_index !== -1 && !$('#' + _this.videoMarker.curObj[_index]._id).is(':hidden')) {
                          document.getElementById(_this.videoMarker.curObj[_index]._id).style.border = '1px solid #0C70F8'
                        }
                      })
                    }
                  }
                  $('#' + obj.markSid).removeClass('vl_icon_map_hover_mark' + obj.dataType)
                })
              }
            })
          }
          this.map.setFitView();
        }
      },
      // 清除车辆路线和图标
      clearCarLine () {
        // 判断carMarks里有没有数据，有的话，找到对应数据，将isDrawLine设为false,清除对应的mark,line
        if (this.carMarks) {
          for (let key in this.carMarks) {
            this.map.remove(this.carMarks[key]);
          }
        }
        this.carMarks = null;
      },
      mapHoverInfo (data) {
        let str = '<div class="vl_map_hover_main"><ul>';
        if (data.dataType === 0) {
          str += '<li><span>设备名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>设备地址：</span><p>' + data.address + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 1) {
          str += '<li><span>卡口名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>卡口编号：</span><p>' + data.bayonetNo + '</p></li>';
          str += '<li><span>地理位置：</span><p>' + data.bayonetAddress + '</p></li>';
          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 2) {
          str += '<li><span>车牌号码：</span>' + data.vehicleNumber + '</li>';
          str += '<li><span>车辆类型：</span>' + this.car2Name[data.vehicleType] + '</li>';
          str += '<li><span>时速：</span>' + data.speed + '码</li>';
          str += '<li><span>方向：</span>' + data.direction + '</li>';
          str += '</ul></div>'
        } else if (data.dataType === 3) {
          str += '<li><span>姓名：</span>' + data.infoName + '</li>';
          str += '<li><span>手机号码：</span>' + data.userMobile + '</li>';
          str += '<li style="text-align: center;">' +
              `<i dataId="${data.userMobile}" dataType="0" dataName="${data.infoName}" dataUid="${data.uid}" dataLng="${data.longitude}" dataLat="${data.latitude}" dataMid="${data.markSid}" class="vl_map_hover_btn hover_btn_voice">语音通话</i>` +
              `<i dataId="${data.userMobile}" dataType="1" dataName="${data.infoName}" dataUid="${data.uid}" dataLng="${data.longitude}" dataLat="${data.latitude}" dataMid="${data.markSid}" class="vl_map_hover_btn hover_btn_video">视频通话</i>` +
              '</li>';
          str += '</ul></div>'
        } else if (data.dataType === 4){
          this.signInfoWin = data;
          str = `<div class="vl_map_hover_main_sign">
          <div class="sign_info">
            <span>标注人：${data.opUserName}</span><span>${data.createTime ? formatDate(data.createTime) : '无具体时间'}</span>
          </div>
          <div class="sign_content" style="word-wrap: break-word;">${data.markContent}</div>
          <div class="sign_show_edit">
            <textarea class="sign_text" maxlength="50" cols="30" rows="4"></textarea>
            <div class="byte_num"><span class="sign_text_num">${data.markContent.length}</span>/50</div>
          </div>`
          if (data.mineFlag) {
            str += `<div class="sign_btn"><span class="sign_del">删除</span><span class="sign_edit">编辑</span></div>`;
          }
          str += `</div>`
        } else if (data.dataType === 5) {
          str = `<div id="${data._id}" class="vl_map_hover_main map_video_box">`;
          str += `<video  style="width: 100%; height: 100%; object-fit: fill;" autoplay="autoplay" muted></video>`
          str += `<p>${data.deviceName}</p>`
          str += `<span _index="${data._index}" class="close_small_video el-icon-error"></span><span  _index="${data._index}" class="show_big_video vl_icon vl_icon_control_08"></span>`
          str += '</div>'
        } else {
          this.addSignInfoWin = data;
          str = `<div class="add_vl_map_hover_main_sign">
        <div class="add_sign_info">
          <span>标注人：${data.opUserName}</span><span>${data.createTime ? formatDate(data.createTime) : '无具体时间'}</span>
        </div>
        <div class="add_sign_content"></div>
        <div class="add_sign_show_edit">
          <textarea placeholder="标注内容" class="add_sign_text" maxlength="50" cols="30" rows="4"></textarea>
          <div class="add_byte_num"><span class="add_sign_text_num">0</span>/50</div>
        </div>
        <div class="add_sign_btn"><span class="add_sign_del">取消</span><span class="add_sign_edit">提交</span></div>
      </div>`
        }
        return str;
      },
      // 监听事件
      mapMarkerEvents () {
        let _this = this;
        $('body').on('click', '.vl_map_hover', function (e) {
          if (e.target.classList.contains('vl_map_hover_btn')) {
            let _obj = {
              uid: e.target.getAttribute('dataUid'),
              longitude: e.target.getAttribute('dataLng'),
              latitude: e.target.getAttribute('dataLat'),
              remoteId: e.target.getAttribute('dataUid'),
              remoteName: e.target.getAttribute('dataName'),
              type: e.target.getAttribute('dataType'),
              _id: 'mapCall' + random14(),
              _mid: e.target.getAttribute('dataMid'),
              isTime: false,
              minute: 0,
              second: 0,
              timer: null,
              mark: null,
              mute: false
            }
            _this.addCalling(objDeepCopy(_obj))
          }
          // textarea tap event
          $('.sign_text').bind('keyup', function () {
            _this.setElementText($('.sign_text_num'), $('.sign_text').val().length)
          })
          $('.add_sign_text').bind('keyup', function () {
            _this.setElementText($('.add_sign_text_num'), $('.add_sign_text').val().length)
          })
          // delete btn tap event
          if (e.target.classList.contains('sign_del')) {
            _this.delMark('这条', _this.signInfoWin)
          }
          // edit btn tap event
          if (e.target.classList.contains('sign_edit')) {
            if ($('.sign_edit').eq(0).text() === '编辑') {
              _this.setElementText($('.sign_edit').eq(0), '确定')
              $('.sign_content').hide();
              $('.sign_show_edit').show();
              $('.sign_text').val($('.sign_content').eq(0).text())
            } else {
              if ($('.sign_text').val().replace(/\s/g, '') === '') {
                _this.$message.error('标注内容不能为空');
                return false;
              }
              _this.$_showLoading({target: '.vl_map_hover_main_sign'})
              _this.signInfoWin.markContent = $('.sign_text').val();
              MapUPDATEEmapSign(_this.signInfoWin).then(res => {
                if (res) {
                  _this.$message.success('修改成功');
                  _this.$nextTick(() => {
                    _this.signInfoWin.markContent = $('.sign_text').val();
                  })
                }
                _this.$_hideLoading();
                $('.sign_content').show();
                $('.sign_show_edit').hide();
                _this.setElementText($('.sign_content').eq(0), $('.sign_text').val())
                _this.setElementText($('.sign_edit').eq(0), '编辑')
              }).catch(err => {
                console.log(err)
                _this.$_hideLoading();
              })
            }
          }
          // cancel add sign
          if (e.target.classList.contains('add_sign_del')) {
            _this.markRest()
            _this.activeType = 0;
            _this.resetTools(4);
          }
          // confirm add sign
          if (e.target.classList.contains('add_sign_edit')) {
            if ($('.add_sign_text').val().replace(/\s/g, '') === '') {
              _this.$message.error('标注内容不能为空');
              return false;
            }
            _this.$_showLoading({target: '.add_vl_map_hover_main_sign'})
            _this.addSignInfoWin.markContent = $('.add_sign_text').val();
            MapPOSTmapSign(_this.addSignInfoWin).then(res => {
              if (res) {
                _this.$message.success('标注成功')
                _this.$_hideLoading();
                _this.addSignInfoWin['uid'] = res.data;
                _this.addSignInfoWin['dataType'] = 4;
                _this.addSignInfoWin['mineFlag'] = true;
                // 根据当前搜索条件判断是否该显示在左侧列表中
                if (_this.markInfoVal) {
                  _this.addSignInfoWin.opUserName.indexOf(_this.markInfoVal) !== -1 ||_this.addSignInfoWin.markContent.indexOf(_this.markInfoVal) !== -1 ?
                      _this.addSignInfoWin['isShow'] = true :
                      _this.addSignInfoWin['isShow'] = false;
                } else {
                  _this.addSignInfoWin['isShow'] = true;
                }
                _this.markList.unshift(_this.addSignInfoWin);
                let obj = {}
                obj['infoList'] = [_this.addSignInfoWin];
                _this.markRest();
                _this.activeType = 0;
                _this.resetTools(4);
                _this.mapMark([obj], true);
              }
            }).catch(err => {
              console.log(err)
              _this.$_hideLoading();
            })
          }
          // remove Selected area
          if (e.target.classList.contains('del_area_icon')) {
            if (_this.delSelAreaIcon) {
              _this.map.remove(_this.delSelAreaIcon);
            }
            if (_this.selAreaPolygon) {
              _this.map.remove(_this.selAreaPolygon);
            }
            _this.map.emit('rightclick');
            _this.selAreaPolygon = null;
            _this.updateNumberss(false, '', false, true);
            _this.mapTypeList.forEach(x => {
              _this.operClassToEL(_this.marks[x], _this.hideClass, true, false, _this.selAreaPolygon ? _this.selAreaPolygon.getPath() : null)
            })
          }
          // close small video
          if (e.target.classList.contains('close_small_video')) {
            let _index = e.target.getAttribute('_index');
            let el = _this.videoMarker.curObj[_index]._id;
            $('#' + el).hide();
            _this.videoMarker.players[_index].pause();
//          _this.videoMarker.players[_index].unload();
          }
          // show big video
          if (e.target.classList.contains('show_big_video')) {
            let _index = e.target.getAttribute('_index')
            _this.showBigVideo = true;
            _this.oData = {type: 1, title: _this.videoMarker.curObj[_index].deviceName, video: _this.videoMarker.curObj[_index]}
          }
        })
      },
      setElementText (el, content) {
        el.text(content)
      },

      markCalling (obj) {
        let _this = this, marker;
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-15, -16];
          let content = `<div id="${obj._id}" class="vl_map_call">`
          content += '<div class="vl_icon vl_icon_map_calling' + obj.type + '"></div>'
          content += '<p></p>'
          content += '</div>'
          marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // 自定义点标记覆盖物内容
            content: content
          });
        }
        return marker;
      },
      // 清除地图标注
      clearSign (isAll, dataType, _index) {
        if (isAll) {
          this.marks[dataType].forEach(x => {
            if (x.C.extData.mineFlag) {
              this.map.remove(x)
            }
          })
          this.marks[dataType] = [];
        } else {
          this.map.remove(this.marks[dataType].splice(_index, 1)[0])
        }
      },
      // 重置
      resetTools (type) {
        switch (type) {
          case 0: // clear all tap event
            this.activeType = 0;
            if (this.map) {
              this.map.setZoomAndCenter(14, this.mapCenter);
            }
            this.markRest();
            if (this.markListener) {window.AMap.event.removeListener(this.markListener);}
            if (this.delSelAreaIcon) {this.map.remove(this.delSelAreaIcon);}
            this.selAreaPolygon = null;
            this.mouseTool.close(true);
            this.updateNumberss(false, '', false, true);
            this.mapTypeList.forEach(x => {
              this.operClassToEL(this.marks[x], this.hideClass, true, false, this.selAreaPolygon ? this.selAreaPolygon.getPath() : null)
            })
            break;
          case 1: // clear all tap event but selArea
            this.mouseTool.close(false);
            if (this.markListener) {window.AMap.event.removeListener(this.markListener);}
            break;
          case 2: // clear all tap event but ranging
            this.mouseTool.close(false);
            if (this.markListener) {window.AMap.event.removeListener(this.markListener);}
            if (this.dbListener) {window.AMap.event.removeListener(this.dbListener); this.dbListener = null;}
            if (this.rightListener) {window.AMap.event.removeListener(this.rightListener); this.rightListener = null;}
            break;
          case 3: // clear all tap event but cutscreen
            this.mouseTool.close(false);
            if (this.markListener) {window.AMap.event.removeListener(this.markListener);}
            break;
          case 4: // clear all tap event but sign
            this.mouseTool.close(false);
            break;
        }
        this.map.setDefaultCursor('');
      },
//      判断是否在区域跟checkBox里
      isInAreaAndCheckBox (y) {
        if (this.selAreaPolygon) {
          if (y.longitude && y.latitude) {
            let m = new window.AMap.Marker({
              position: [y.longitude, y.latitude]
            })
            let point = m.getPosition();
            if (window.AMap.GeometryUtil.isPointInRing(point, this.selAreaPolygon.getPath())) {
              // 判断是不是卡口
              if (y.dataType === 1) {
                if (this.mapTypeList.includes(1)) {
                  y.isShow = true;
                } else{
                  y.isShow = false;
                }
              } else { // 说明不是卡口，判断子checkbox里的勾选状态
                if(this.constObj[y.dataType].supTypeList.includes(parseInt(y[this.findType[y.dataType]]))) {
                  y.isShow = true;
                } else {
                  y.isShow = false;
                }
              }
            } else {
              y['isShow'] = false;
            }
            m = null;
          }
        } else {
          // 判断是不是卡口
          if (y.dataType === 1) {
            if (this.mapTypeList.includes(1)) {
              y.isShow = true;
            } else{
              y.isShow = false;
            }
          } else { // 说明不是卡口，判断子checkbox里的勾选状态
            console.log(this.constObj[y.dataType].supTypeList, (parseInt(y[this.findType[y.dataType]])))
            if(this.constObj[y.dataType].supTypeList.includes(parseInt(y[this.findType[y.dataType]]))) {
              y.isShow = true;
            } else {
              y.isShow = false;
            }
          }
        }
      },
      // 更新maptreeData[0]下，各个设备的数量值,以及刷新地图元素,boolean true代表是左侧搜索或者顶部type勾选
      updateNumberss (boolean, key, isAdd, isSetArea) {
        let newNum = [{deviceBasicListNum: 0}, {bayonetListNum: 0}, {carListNum: 0}, {sysUserExtendListNum: 0}];
        this.mapTreeData[0].infoList.forEach(x => {
          x.infoList.forEach(y => {
            if (y.isShow) {
              newNum[y.dataType][this.constObj[y.dataType]._key] += 1;
            }
          })
        })
        newNum.forEach((x, _index) => {
          this.mapTreeData[0][this.constObj[_index]._key] = x[this.constObj[_index]._key];
        })
        console.log(this.mapTreeData[0])
      },
      // boolean 为 true时 显示, false 隐藏.  operLeft 存在的话，说明是操作了左侧地图信息树，
      operClassToEL () {
        this.marks.forEach((elList, _index) => {
          if (_index < 4) {
            elList.forEach(y => {
              let _curObj = document.getElementById('mapMark' + y.getExtData().dataType + y.getExtData().uid).classList, point = y.getPosition();
              let b = this.updateMarkVisible(y.getExtData());
              if (!b){
                if (!_curObj.contains(this.hideClass)) {
                  _curObj.add(this.hideClass)
                }
              } else {
                _curObj.remove(this.hideClass)
              }
            })
          }
        })
      },
      // 找到设备当前显示状态，更新地图mark的extData里的状态
      updateMarkVisible(obj) {
        let bool = false, arr = this.mapTreeData[0].infoList;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].infoList.find(x => x.uid === obj.uid)) {
            bool = arr[i].infoList.find(x => x.uid === obj.uid).isShow;
            break;
          }
        }
        return bool;
      },
      // 选择区域
      selArea () {
        this.activeType === 1 ? this.activeType = 0 : this.activeType = 1;
        this.resetTools(1);
        if (this.activeType === 0) {
          return false;
        }
        this.map.setDefaultCursor('crosshair');
        this.mouseTool.polygon({
          zIndex: 13,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          bubble: true,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2,
          isRing: false
        });
      },
      // 标注
      mark () {
        this.activeType === 4 ? this.activeType = 0 : this.activeType = 4;
        this.resetTools(4);
        if (this.activeType === 0) {
          this.markRest();
          return false;
        }
        this.map.setDefaultCursor('crosshair');
        let _this = this;
        $('.add_sign_text').unbind('keyup');
        this.markListener = window.AMap.event.addListener(this.map, 'click', function (e) {
          console.log('222')
          if (_this.markEditMarker) {return false;}
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: e.lnglat,
            offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // 自定义点标记覆盖物内容
            content: '<div class="vl_icon vl_icon_051"></div>'
          });
          _this.markEditMarker = marker;
          _this.getPosition(e.lnglat);
          let obj = {position: '', markContent: '', opUserName: _this.$store.state.loginUser.userName, unit: '美国情报局', longitude: e.lnglat.lng, latitude: e.lnglat.lat, createTime: new Date().getTime()}
          let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
          let infoWindow = new window.AMap.Marker({
            map: _this.map,
            position: e.lnglat,
            zIndex: 111,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          _this.markEditWindow = infoWindow;
        });
      },
      markRest (isEditing) {
        // flag 控制是否在编辑中
        if (!isEditing) {
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
      // 根据经纬度获取地址
      getPosition (lnglat) {
        let address = '';
        if (!this.geocoder) {
          window.AMap.plugin('AMap.Geocoder', () => {
            this.geocoder = new window.AMap.Geocoder()
          })
        }
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            address = result.regeocode.formattedAddress;
          } else {
            address = '未知地址'
          }
          this.addSignInfoWin.position = address;
        })
      },
      // 测距
      ranging () {
        let _this = this;
        this.activeType === 2 ? this.activeType = 0 : this.activeType = 2;
        this.resetTools(2);
        if (this.activeType === 0) {
          return false;
        }
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
          strokeWeight: 8,
          isRing: true
        };
        let rulerOptions = {
          startMarkerOptions: startMarkerOptions,
          midMarkerOptions:midMarkerOptions,
          endMarkerOptions: endMarkerOptions,
          lineOptions: lineOptions
        };
        this.mouseTool.rule(rulerOptions);
        if (!this.dbListener) {
          this.dbListener = window.AMap.event.addListener(this.map, 'dblclick', function () {
            _this.activeType = 0;
            setTimeout(() => {
              _this.mouseTool.close(false);
            }, 0)
          })
        }
        if (!this.rightListener) {
          this.rightListener = window.AMap.event.addListener(this.map, 'rightclick', function () {
            _this.activeType = 0;
            setTimeout(() => {
              _this.mouseTool.close(false);
            }, 0)
          })
        }
      },

      mapZoomSet (val) {
        if (this.map) {
          this.map.setZoom(this.map.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.map) {
          this.map.setZoomAndCenter(14, this.mapCenter);
        }
      },
      supCheckedTypeChange (item, index) {
        item.checkAll = item.supTypeList.length === item.supTypeListAll.length;
        item.isIndeterminate = item.supTypeList.length > 0 && item.supTypeList.length < item.supTypeListAll.length;
        let _i = this.constObj.findIndex(x => x === item);
        let _j = this.mapTypeList.findIndex(x => x === _i);
        if (item.supTypeList.length === 0 && _j !== -1) {
          let _arr = this.mapTypeList.filter((x, index) => index !== _j)
          this.mapTypeList = Object.assign([], _arr);
        }
        if (item.checkAll) {
          if (_j !== -1) {
            this.mapTypeList = this.mapTypeList.includes(_j) ? this.mapTypeList.concat([]) : this.mapTypeList.concat([_j])
          } else {
            this.mapTypeList = this.mapTypeList.includes(_i) ? this.mapTypeList.concat([]) : this.mapTypeList.concat([_i])
          }
        }
        console.log(item, index);
        // 类型字段伪造
        this.mapTreeData[0].infoList.forEach(x => {
          x.infoList.forEach(y => {
            if (y.dataType === index) {
              console.log(item.supTypeList.includes(parseFloat(y[this.findType[index]]) - 1))
              if (item.supTypeList.includes(parseFloat(y[this.findType[index]]) - 1)) {
                y.isShow = true;
              } else {
                y.isShow = false;
              }
            }
          })
        })
        console.log(this.mapTreeData[0])
        this.operClassToEL(this.marks[index], this.hideClass, false, null, this.selAreaPolygon ? this.selAreaPolygon.getPath() : null);
        let addMark = this.marks[index].filter(x => item.supTypeList.includes(parseFloat(x.getExtData()[this.findType[index]]) - 1))
        console.log(addMark, this.marks[index])
        this.operClassToEL(addMark, this.hideClass, true, null, this.selAreaPolygon ? this.selAreaPolygon.getPath() : null);
      },

      // 视频播放
      initPlayer (curV) {
        this.videoLoadingFailed = false;
        // let curV = this.videoMarker.curObj[this.videoMarker.curObj.length - 1];
        let obj = {deviceId: curV.uid};
        apiVideoPlay(obj).then(res => {
          if (res && res.data) {
            this.initPlayerDo(res.data.liveFlvUrl, curV._id);
          } else {
            // 未获取到视频
            console.log('未获取到视频');
            this.videoLoadingFailed = true;
          }
        }).catch(error => {
          console.log("apiVideoPlay error：", error);
        });
      },
      initPlayerDo (surl, id) {
        if (window.flvjs.isSupported()) {
          let videoElement = document.getElementById(id).firstChild;
          let flvPlayer = window.flvjs.createPlayer({
            type: 'flv',
            url: surl,
            isLive: true
          }, {
            enableWorker: true,
            enableStashBuffer: false,
            stashInitialSize: 128
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
          videoElement.onplaying = () => {
            this.$_hideLoading();
          }
          this.videoMarker.players.push(flvPlayer)
        }
      },
      playerClose () {
        this.showBigVideo = false;
      },
      // 获得设备报警列表
      getAlarmListByDev () {
        let params = {
          interval: 12
        }
        let _this = this;
        getAlarmListByDev(params).then(res => {
          if (res.data && res.data.length) {
            res.data.forEach(x => {
              let c = '<div class="vl_map_hover" ><div class="vl_map_hover_main map_video_box map_warning_snap">';
              c += `<img src="${x.snapPhoto}" />`;
              c += '</div></div>';
              let marker = new window.AMap.Marker({ // 添加自定义点标记
                map: _this.map,
                position: [x.addLongitude, x.addLatitude], // 基点位置 [116.397428, 39.90923]
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                draggable: true, // 是否可拖动
                zIndex: 9999,
                // 自定义点标记覆盖物内容
                content: c
              });
              _this.snapMarks.push(marker);
              _this.marks[0].forEach(y => {
                if (y.getExtData().uid === x.deviceId) {
                  document.getElementById('mapMark' + y.getExtData().dataType + y.getExtData().uid).classList.add('vl_icon_map_sxt_error')
                }
              })
            })
            _this.timer = setTimeout(() => {
              _this.map.remove(_this.snapMarks);
              _this.marks[0].forEach(y => {
                if (document.getElementById('mapMark' + y.getExtData().dataType + y.getExtData().uid).classList.contains('vl_icon_map_sxt_error')) {
                  document.getElementById('mapMark' + y.getExtData().dataType + y.getExtData().uid).classList.remove('vl_icon_map_sxt_error')
                }
              })
              _this.snapMarks = [];
              _this.$once('hook:beforeDestroy', () => {
                clearTimeout(_this.timer);
                return false;
              })
              _this.getAlarmListByDev();
            }, 12000)
          }
        })
      },


      // 语音视频通话
      addCalling (_obj) {
        if (this.hoverWindow ){this.hoverWindow.close()}
        // let _m = this.markCalling(_obj);
        // _obj.mark = _m;
        this.$store.commit('ADD_WEBRTC', {oAdd: _obj})
        /// $('#' + _obj._mid).addClass('vl_icon_map_mark_calling')
      },
      // 检测到视频通话
      watchCalling () {
        // 视频通话相关,初次进入地图，判断是否有在通话中的人员
        this.callingList.forEach(x => {
          let _m = this.markCalling(x);
          x.mark = _m;
          console.log($('#' + x._mid))
          this.map.setZoomAndCenter(16, [x.longitude, x.latitude])
          setTimeout(() => {
            $('#' + x._mid).addClass('vl_icon_map_mark_calling');
            let domT = document.getElementsByClassName('vl_map_time_' + x._id)
            $('#' + x._id).append(domT[0])
          }, 30)
        })
      },

      // 模拟假车辆数据
      getVehicel () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let arr = [];
//          let _i = parseInt(Math.random()  * 50);
            let _i = 5;
            for(let i = 0; i < _i; i++) {
              let _obj = {
                uid: i + 1,
                vehicleType: i + 1,
                areaType: "5",
                dataType: 2,
                vehicleNumber: '湘N·2T52' + i,
                direction: '东南',
                speed: parseFloat(Math.random().toString().slice(2, 4)),
                gpsLongitude: 110.60105 + Math.random() / 30,
                gpsLatitude: 27.888218 + Math.random() / 30
              }
              arr.push(_obj)
            }
            resolve(arr)
          }, 1000)
        })
      },
      getRandomNo () {
        let testCarNo = 'ABCDEFGH1234567890QRSTUVWXYZ1234567890ABCDEFGH1234567890QRSTUVWXYZ1234567890', str = '';
        for (let i = 0; i < 5; i++) {
          str += testCarNo[parseInt(Math.random()  * 72)]
        }
        return str
      }
    },
    beforeDestroy () {
      if (this.vehicleTimer) {
        window.clearTimeout(this.vehicleTimer);
        this.vehicleTimer = null;
      }
      if (this.map) {
        this.map.destroy();
        this.geocoder = null
      }
      $('body').unbind('click');
      this.videoMarker.players.forEach(x => {
        x.unload();
        x.detachMediaElement();
        x.destroy();
      })
    }
  }
</script>
<style lang="scss" scoped>
  .map_search_list{
    position: absolute;
    top: 0;
    width: 100%;
    min-height: 100%;
    background: #ffffff;
    li {
      position: relative;
      height: 36px;
      line-height: 36px;
      padding: 0 30px 0 40px;
      color: #666;
      cursor: pointer;
      overflow: hidden;
      &:hover {
        background: #F2F2F2;
      }
      i {
        position: absolute;
        top: 9px;
        right: 10px;
      }
    }
    p {
      color: #666;
      text-align: center;
    }
  }
  textarea {
    overflow: hidden;
  }
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
  .vl_map_hover_main_sign , .add_vl_map_hover_main_sign{
    background: #ffffff;
    position: absolute;
    left: 30px;
    top: -49px;
    width: 300px;
    -webkit-box-shadow: 0px 12px 14px 0px rgba(148, 148, 148, 0.4);
    -moz-box-shadow: 0px 12px 14px 0px rgba(148, 148, 148, 0.4);
    box-shadow: 0px 12px 14px 0px rgba(148, 148, 148, 0.4);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    padding: 18px 28px 20px 28px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      background: #ffffff;
      border-radius: 2px;
      left: -6px;
      top: 43px;
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    .sign_info, .add_sign_info {
      color: #666666;
      font-size: 12px;
      margin-bottom: 20px;
      span {
        &:last-child {
          float: right;
        }
      }
    }
    .sign_btn, .add_sign_btn {
      margin-top: 14px;
      span{
        display: inline-block;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 110px;
        height: 40px;
        cursor: pointer;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        line-height: 40px;
        text-align: center;
        color: #333333;
        border: 1px solid #dcdfe6;
        &:first-child {
          &:hover {
            color: #0C70F8;
            border-color: #0C70F8;
          }
        }
        &:last-child {
          float: right;
          background: #0C70F8;
          color: #ffffff;
          border-color: #0C70F8;
          &:hover {
            background: #409eff;
            border-color: #409eff;
          }
        }
      }
    }
    .sign_show_edit, .add_sign_show_edit {
      display: none;
      .sign_text, .add_sign_text {
        border: none;
        resize: none;
        width: 100%;
        border-bottom: 1px solid #93B1E0;
      }
      .byte_num, .add_byte_num {
        position: absolute;
        bottom: 82px;
        right: 29px;
        color: #B2B2B2;
      }
    }
  }
  .add_vl_map_hover_main_sign{
    top: -50px;
    .add_sign_info, .add_sign_content {
      display: none;
    }
    .add_sign_show_edit {
      display: block;
    }
  }
  .del_area_icon {
    position: absolute;
    font-size: 20px;
    color: red;
    cursor: pointer;
    top: 9px;
    left: 3px;
  }
  .map_video_box {
    width: 220px;
    height: 134px;
    border: 1px solid #0C70F8;
    &:before {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 66px;
      cursor: move;
      z-index: 7;
    }
    &:after {
      display: none;
    }
    > p {
      position: absolute;
      bottom: 0px;
      width: calc(100% - 30px);
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      color: #ffffff;
      text-indent: 10px;
      z-index: 8;
      cursor: move;
      overflow: hidden;
      white-space: nowrap;
    }
    > .show_big_video {
      position: absolute;
      bottom: 2px;
      right: 2px;
      cursor: pointer;
      z-index: 8;
    }
    > .close_small_video {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 20px;
      cursor: pointer;
      background: #ffffff;
      border-radius: 13px;
      z-index: 2001;
    }
  }
  .vl_map_full_video {
    position: fixed!important;
    width: 100%;
    height: 100%;
    top: 0!important;
    z-index: 9;
  }
  .map_warning_snap {
    img{
      width: 100%;
      height: 100%;
    }
  }
  .vl_map_call {
    background: #0C70F8;
    width: 60px;
    height: 64px;
    position: absolute;
    top: -79px;
    left: -5px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      left: 42%;
      margin-left: -5px;
      bottom: -10px;
      border-top: 10px solid #0C70F8;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    > div {
      display: block;
      margin: 7px auto;
    }
    > p {
      color: #FFFFFF;
      text-align: center;
    }
  }
  .test_tree {
    > .el-tree-node {
      > .el-tree-node__content {
        > .el-tree-node__expand-icon{
          display: none;
        }
      }
    }
  }
  .vl_icon_map_car0 {
    > span {
      position: absolute;
      font-size: 20px;
      top: 10px;
      left: 12px;
      width: 30px;
      height: 30px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      background: #0C70F8;
      color: #ffffff;
      /*display: none;*/
      cursor: pointer;
    }
    /*&:hover{*/
    /*>span {*/
    /*display: block;*/
    /*}*/
    /*}*/
  }
  /* 设备/卡口 树样式 */
  .db_tree {
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
        .db_tree_s_s {
          padding-left: 20px;
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
          overflow: hidden;
          &:hover {
            background-color: #f2f2f2;
          }
          &.db_li_empty { color: #999; }
          &.db_li_empty:hover { background-color: #fff; }
          > i {
            position: absolute; top: 9px; right: 10px;
          }
          &.bd_tree_dbli_sed {
            background-color: #ddd;
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
