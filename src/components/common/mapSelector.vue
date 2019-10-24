<template>
  <div>
    <el-dialog
        v-if="isDialog"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="15.10rem"
        class="public_map_selector_dialog">
      <div class="map_sd_content" :class="{'map_sd_edit_false': !bEdit}" :id="sid">
        <div class="sd_type_tab" v-if="showDeviceList">
          <span :class="{'active': curTabType === 0}" @click="curTabType = 0">地图选择</span>
          <span :class="{'active': curTabType === 1}" @click="curTabType = 1">列表选择</span>
        </div>
        <div class="sd_type_tab" v-else>
          <span>选择设备</span>
        </div>
        <div class="sd_device_list" :class="{'sd_device_list_close': slideClose}">
          <div class="sdd_title" @click="slideClose = !slideClose"><span>已选设备 （{{dbNum}}）</span> <i class="el-icon-arrow-up"></i></div>
          <vue-scroll>
            <div v-show="dbNum > 0" class="sdd_content" is="dbTreeS" :treeList="treeList" :showTypes="showTypes" @delOne="delOne"></div>
          </vue-scroll>
        </div>
        <div class="sd_search">
          <el-autocomplete
                  class="inline-input"
                  v-model="input3"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入地名，快速定位地址"
                  value-key="name"
                  :trigger-on-focus="false"
                  @select="handleSelect"
          ></el-autocomplete>
          <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
        </div>
        <div class="sd_opts">
          <ul>
            <li>
              <div title="选择矩形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 1 }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span>框选</div>
            </li>
            <li>
              <div title="选择圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 2 }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span>圈选</div>
            </li>
            <li v-if="pointC">
              <div title="点击一个设备图标选择" :class="{'sd_opts_sed': drawActiveType === 5 }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span>点选</div>
            </li>
            <li style="width: 1.12rem;">
              <div title="选择多边形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 4 }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span>自定义</div>
            </li>
            <li>
              <div title="清除"  @click="delDialog = true"><span class="sd_opts_icon sd_opts_icon3"></span>清除</div>
            </li>
          </ul>
        </div>
        <div class="sd_checkbox">
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="checkOptions[0].value" v-if="showTypes.indexOf('D') >= 0"><span>{{checkOptions[0].label}} {{listDevice.length | fmTenThousand}}</span></el-checkbox>
            <el-checkbox :label="checkOptions[1].value" v-if="showTypes.indexOf('B') >= 0"><span>{{checkOptions[1].label}} {{listBayonet.length | fmTenThousand}}</span></el-checkbox>
          </el-checkbox-group>
        </div>
        <ul class="sd_fs">
          <li @click="setMapStatus(1)"><i class="el-icon-plus"></i></li>
          <li @click="setMapStatus(2)"><i class="el-icon-minus"></i></li>
        </ul>
        <div style="width: 100%; height: 100%;" :id="sid + '_container'"></div>
        <!--列表选择-->
        <div class="sd_list_choose" v-show="curTabType === 1">
          <div class="sd_list_l">
            <div class="sd_list_lt">
              <p>已选设备（{{dbNum}}）</p>
              <el-checkbox :indeterminate="leftIsIndeterminate" v-model="DBleftAll" v-show="dbNum > 0">全选</el-checkbox>
            </div>
            <div class="sd_list_lc">
              <vue-scroll>
                <div v-show="dbNum > 0" :DBleftAll="DBleftAll" :inIndeterKey="'leftIsIndeterminate'" class="sd_list_l_tree" showCheckBox is="dbTreeS" :treeList="treeList" @changeAll="changeLeftAll" :showTypes="showTypes"></div>
              </vue-scroll>
            </div>
          </div>
          <div class="sd_list_m">
            <span @click="addDB"><i class="el-icon-arrow-left"></i>添加</span>
            <span @click="removeDB">移出<i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="sd_list_r sd_list_l">
            <div class="sd_list_lt">
              <p>可选设备（{{curNum}}）</p>
              <div class="sd_lt_search">
                <el-input
                        placeholder="请输入设备搜索"
                        v-model="filterKey">
                </el-input>
                <i class="el-icon-search" @click="filterTree"></i>
              </div>
              <el-checkbox :indeterminate="rightIsIndeterminate" v-model="DBrightAll" v-show="curNum > 0">全选</el-checkbox>
            </div>
            <div class="sd_list_lc">
              <vue-scroll>
                <div v-show="curNum > 0" :DBrightAll="DBrightAll" :filterable="isFilterData" :inIndeterKey="'rightIsIndeterminate'" class="sd_list_l_tree" showCheckBox is="dbTreeS" :treeList="remainTreeList" @changeAll="changeRightAll" :showTypes="showTypes"></div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
              title="清除确认"
              :visible.sync="delDialog"
              :append-to-body="true"
              width="30%">
        <span>是否要清除全部区域？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmClear">确 定</el-button>
      </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button :loading="submitLoading" :disabled="dbNum === 0" type="primary" @click="selSubmit(false)" size="small">确 定</el-button>
    </span>
    </el-dialog>
    <div class="public_map_selector_dialog" v-else>
      <div class="map_sd_content" :class="{'map_sd_edit_false': !bEdit, 'map_sd_has_slot': hasFilter}" :id="sid">
        <div class="sd_type_tab" v-if="showDeviceList">
          <span :class="{'active': curTabType === 0}" @click="curTabType = 0">地图选择</span>
          <span :class="{'active': curTabType === 1}" @click="curTabType = 1">列表选择</span>
        </div>
        <div class="sd_type_tab" v-else>
          <span>选择设备</span>
        </div>
        <div class="rlcx_search_box" v-if="hasFilter">
          <el-form :inline="true" :model="areaSeachForm" class="search_form" ref="areaSeachForm">
            <el-form-item prop="intelCharac">
              <el-select  style="width: 240px;" v-model="areaSeachForm.intelCharac" placeholder="智能特性">
                <el-option label="全部特性" :value="0"></el-option>
                <el-option
                        v-for="(item, index) in intelCharacList"
                        :key="index"
                        :label="item.enumValue"
                        :value="item.enumField"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="groupId" v-if="hasGroupFilter">
              <el-select  style="width: 240px;" v-model="areaSeachForm.groupId" placeholder="自定义组">
                <el-option label="全部分组" :value="0"></el-option>
                <el-option
                  v-for="(item, index) in groupsList"
                  :key="index"
                  :label="item.groupName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="dutyOrganId">
              <el-select style="width: 240px;" v-model="areaSeachForm.dutyOrganId" placeholder="责任部门">
                <el-option label="全部部门" :value="0"></el-option>
                <el-option
                        v-for="(item, index) in allDepartmentData"
                        :key="index"
                        :label="item.organName"
                        :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="select_btn" @click="getNewData">查询</el-button>
              <el-button class="reset_btn" @click="resetForm('areaSeachForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="sd_device_list" :class="{'sd_device_list_close': slideClose}">
          <div class="sdd_title" @click="slideClose = !slideClose"><span>已选设备 （{{dbNum}}）</span> <i class="el-icon-arrow-up"></i></div>
          <vue-scroll>
            <div v-show="dbNum > 0" class="sdd_content" is="dbTreeS" :treeList="treeList" :showTypes="showTypes" @delOne="delOne"></div>
          </vue-scroll>
        </div>
        <div class="sd_search">
          <el-autocomplete
                  class="inline-input"
                  v-model="input3"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入地名，快速定位地址"
                  value-key="name"
                  :trigger-on-focus="false"
                  @select="handleSelect"
          ></el-autocomplete>
          <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
        </div>
        <div class="sd_opts">
          <ul>
            <li>
              <div title="选择矩形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 1 }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span>框选</div>
            </li>
            <li>
              <div title="选择圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 2 }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span>圈选</div>
            </li>
            <li v-if="pointC">
              <div title="点击一个设备图标选择" :class="{'sd_opts_sed': drawActiveType === 5 }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span>点选</div>
            </li>
            <li style="width: 1.12rem;">
              <div title="选择多边形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 4 }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span>自定义</div>
            </li>
            <li>
              <div title="清除"  @click="delDialog = true"><span class="sd_opts_icon sd_opts_icon3"></span>清除</div>
            </li>
          </ul>
        </div>
        <div class="sd_checkbox">
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="checkOptions[0].value" v-if="showTypes.indexOf('D') >= 0"><span>{{checkOptions[0].label}} {{listDevice.length | fmTenThousand}}</span></el-checkbox>
            <el-checkbox :label="checkOptions[1].value" v-if="showTypes.indexOf('B') >= 0"><span>{{checkOptions[1].label}} {{listBayonet.length | fmTenThousand}}</span></el-checkbox>
          </el-checkbox-group>
        </div>
        <ul class="sd_fs">
          <li @click="setMapStatus(1)"><i class="el-icon-plus"></i></li>
          <li @click="setMapStatus(2)"><i class="el-icon-minus"></i></li>
        </ul>
        <div style="width: 100%; height: 100%;" :id="sid + '_container'"></div>
        <!--列表选择-->
        <div class="sd_list_choose" v-show="curTabType === 1">
          <div class="sd_list_l">
            <div class="sd_list_lt">
              <p>已选设备（{{dbNum}}）</p>
              <el-checkbox :indeterminate="leftIsIndeterminate" v-model="DBleftAll" v-show="dbNum > 0">全选</el-checkbox>
            </div>
            <div class="sd_list_lc">
              <vue-scroll>
                <div v-show="dbNum > 0" :DBleftAll="DBleftAll" :inIndeterKey="'leftIsIndeterminate'" class="sd_list_l_tree" showCheckBox is="dbTreeS" :treeList="treeList" @changeAll="changeLeftAll" :showTypes="showTypes"></div>
              </vue-scroll>
            </div>
          </div>
          <div class="sd_list_m">
            <span @click="addDB"><i class="el-icon-arrow-left"></i>添加</span>
            <span @click="removeDB">移出<i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="sd_list_r sd_list_l">
            <div class="sd_list_lt">
              <p>可选设备（{{curNum}}）</p>
              <div class="sd_lt_search">
                <el-input
                        placeholder="请输入设备搜索"
                        v-model="filterKey">
                </el-input>
                <i class="el-icon-search" @click="filterTree"></i>
              </div>
              <el-checkbox :indeterminate="rightIsIndeterminate" v-model="DBrightAll" v-show="curNum > 0">全选</el-checkbox>
            </div>
            <div class="sd_list_lc">
              <vue-scroll>
                <div v-show="curNum > 0" :DBrightAll="DBrightAll" :filterable="isFilterData" :inIndeterKey="'rightIsIndeterminate'" class="sd_list_l_tree" showCheckBox is="dbTreeS" :treeList="remainTreeList" @changeAll="changeRightAll" :showTypes="showTypes"></div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
              title="清除确认"
              :visible.sync="delDialog"
              :append-to-body="true"
              width="30%">
        <span>是否要清除全部区域？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmClear">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { dataList } from '@/utils/data.js';
  import { getDiciData } from '@/views/index/api/api.js';
  import { getDepartmentList, getCusGroup } from '@/views/index/api/api.manage.js';
  import {getAllMonitorList, getBayonetList, getDeviceByBayonetUids} from '@/views/index/api/api.base.js';
  import {mapXupuxian} from '@/config/config.js';
  import {random14, addCluster, objDeepCopy} from '@/utils/util.js';
  import dbTreeS from '@/components/common/dbTree_single.vue';
  export default {
    /* 提交成功后通过在父组件 emit mapSelectorEmit 事件获取所框选的东西 */
    /*里面用到isInChecked表示使用查询模块更新地图记录已选的。checked表示checkbox已选，isChecked表示当前为已选，避免重复选择*/
    /*
      open  改变open值则打开窗口
      showTypes  需要操作的东西 D设备 B卡口
      oConfig   初始化地图配置参数
      clear  改变clear值则会清空已绘制的图形
      editAble 可编辑，默认为true,
      singleArea 是否为单选，区域碰撞，区域徘徊，频繁出没，区域人员分析为单选, 为单选，则默认没有点选
      activeDeviceList 打开弹窗是已经激活了的设备
      hideDBlist 是否隐藏列表选择, 默认有
      isNotDialog 是不是dialog， 默认是
      filter 带查询过滤 1--有自定义分组的查询条件  2---没有自定义分组的查询条件
      this.$refs[yourRef].getCheckedIds() // 通过这个方法获取当前的已选设备
    */
    props: ['open', 'clear', 'showTypes', 'oConfig', 'editAble', 'singleArea', 'activeDeviceList', 'hideDBlist', 'isNotDialog', 'filter'],
    components: {dbTreeS},
    data () {
      return {
        dutyUnitId: '', // 当前用来作为条件的部门id
        intelligentCharac: '', // 当前用来作为条件的特性id
        groupId: '', // 当前用来作为条件的自定义分组id
        areaSeachForm: {
          intelCharac: 0, // 智能特性
          dutyOrganId: 0, // 责任部门id
          groupId: 0, // 自定义分组id
        },
        allDepartmentData: [], // 部门列表
        intelCharacList: [], // 智能特性列表
        groupsList: [], // 自定义分组列表
        hasFilter: false,// 默认没有搜索
        hasGroupFilter: false, // 默认没有自定义分组的搜索

        isFilterData: '',
        filterKey: '',
        rightIsIndeterminate: false, // 列表选择右侧不确定状态
        leftIsIndeterminate: false, // 列表选择左侧不确定状态
        DBleftAll: false, // 列表选择左侧全选
        DBrightAll: false, // 列表选择右侧全选
        curTabType: 0, // 当前激活的tab
        showDeviceList: true, // 默认显示列表选择
        activeDBList: [], // 等待初始化的设备
        isDialog: true, // 是不是弹窗
        delDialog: false,
        confirmIcon: null, // 选择区域之后的小弹窗
        curAddSearch: {
          area: null,
          curPointData: [],
          curMarks: []
        }, // 单选区域时使用
        curAddSearchWait: {
          area: null, // 需要对比area，判断当前的区域还是不是勾选前的区域
          curPointData: [],
          curMarks: []
        },// 选择区域未点完成时，用户点了摄像头，卡口的checkbox，从curAddSearch里抽离出对象。
        searchData: [], // 多选区域时使用
        pointSelect: {
          curPointData: [],
          curMarks: []
        }, // 点选集合
        marks: [], // mark
        originMarks: [[], []],
        input3: null, // 地图搜索
        checkList: [0, 1],
        checkOptions: [{label: '摄像头', value: 0}, {label: '卡口', value: 1}],
        slideClose: true, // 已选设备下拉，默认关闭
        sid: 'map_selector_' + random14(),
        bEdit: true, // 默认可编辑
        pointC: true, // 默认可点选
        sArea: false, // 默认为多区域选择
        // selectorId: 'db_tree_' + random14(),
        amap: null,
        config: {
          _name: '',
          zoom: 11,
          center: [110.596015, 27.907662],
          zooms: [2, 18]
        },
        searchVal: '',

        listDevice: [], // 设备
        listBayonet: [], // 卡口

        mouseTool: null,
        drawType: 0,

        mapEventActive: false,

        drawActiveType: null, //
        drawObj: {
          rectangle: {
            /* 'id': {
              marker: null, // 标记对象 (编辑、完成、删除等)
              obj: null // 矩形图层对象
              edtor: null // 编辑对象
            } */
          },
          circle: {},
          polyline: {},
          polygon: {},
          circle10km: {}
        },
        zIndex: 50,

        dialogVisible: false,
        submitLoading: false,
      }
    },
    watch: {
      DBleftAll () {
        this.leftIsIndeterminate = false;
      },
      DBrightAll () {
        this.rightIsIndeterminate = false;
      },
      activeDeviceList (val) {
        console.log('val', val);
        
        this.activeDBList = val;
      },
      checkList (newValue, oldValue) {
        let arr = [], bool = false;
        if (oldValue.length > newValue.length) { // 隐藏
          arr = oldValue.filter(x => !newValue.includes(x))
          bool = false;
        } else { // 显示
          arr = newValue.filter(x => !oldValue.includes(x))
          bool = true;
        }
        this.operClusterIO(bool, arr[0])
      },
      editAble (val) {
        this.bEdit = val;
      },
      open () {
        this.dialogVisible = true;
        if (this.amap) {
        } else {
          this.$nextTick(() => {
            setTimeout(() => {
              this.initMap();
              if (!this.mapEventActive) {
                this.mapEvents();
              }
            }, 100);
          });
        }
      },
      clear () {
        console.log('watch clear');
        this.delAllArea();
      },
      oConfig () {
        // console.log('oConfig', this.oConfig)
        setTimeout(() => {
          // this.setMap(this.oConfig);
        }, 300)
      },
    },
    mounted () {
      
      this.showDeviceList = this.hideDBlist === undefined ? true : false;
      this.sArea = this.singleArea === undefined ? false : true;
      this.pointC = this.singleArea === undefined ? true : false;
      this.isDialog = this.isNotDialog === undefined ? true : false;
      this.hasFilter = this.filter === undefined ? false : true;
      if (this.filter === 1) {
        this.hasGroupFilter = true;
      } else if (this.filter === 2) {
        this.hasGroupFilter = false;
      }
      this.getTreeList();
      // 判断有插入查询就先获取字典数据
      if (this.hasFilter) {
        this.getIntelCharacList();
        this.getAllDepartList();
      }
      if (this.hasGroupFilter) {
        this.getGroups();
      }
    },
    computed: {
      mapAllList () {
        return this.listDevice.concat(this.listBayonet)
      },
      treeList () {
        return this.operData();
      },
      remainTreeList () {
        return this.remainData();
      },
      dbNum () {
        let n = 0;
        if (this.searchData.length > 0) {
          this.searchData.forEach(x => {
            n += x.curPointData.length;
          })
        }
        return this.pointSelect.curPointData.length + n;
      },
      curNum () {
        return this.listBayonet.length + this.listDevice.length - this.dbNum;
      }
    },
    methods: {
      // 插入的查询搜索模块
      getNewData () {
        this.$_showLoading({target: '.public_map_selector_dialog'})
        this.intelligentCharac = this.areaSeachForm.intelCharac ? parseInt(this.areaSeachForm.intelCharac) : '';
        this.dutyUnitId = this.areaSeachForm.dutyOrganId ? this.areaSeachForm.dutyOrganId : '';
        this.groupId = this.areaSeachForm.groupId ? this.areaSeachForm.groupId : '';
        this.getTreeList(true);
      },
      resetForm (form) {
        this.$refs[form].resetFields();
      },
      // 获取所有的分组
      getGroups () {
        getCusGroup()
          .then(res => {
            if (res) {
              this.groupsList = res.data;
            }
          })
          .catch(() => {})
      },
      // 获取智能特性列表
      getIntelCharacList () {
        const intelCharacId = dataList.intelCharac;
        getDiciData(intelCharacId)
            .then(res => {
              if (res) {
                this.intelCharacList = res.data;
              }
            })
      },
      // 获取部门列表
      getAllDepartList () {
        const params = {
          'where.proKey': this.$store.state.loginUser.proKey,
          pageSize: 0,
        };
        getDepartmentList(params)
            .then(res => {
              if (res && res.data.list) {
                this.allDepartmentData = res.data.list;
              }
            })
      },

      // 过滤
      filterTree () {
        let curKey = this.filterKey.replace(/\s+|\s+$/g, '');
        if (curKey) {
          this.isFilterData = curKey;
        } else {
          this.isFilterData = '';
        }
      },
      addDB () {
        this.DBleftAll = false;
        this.DBrightAll =false;
        // 添加的时候丢进pointSelect集合，treeList自动更新
        let _ar = [];
        this.remainTreeList.forEach(x => {
          // 判断当前右侧列表是不是搜索出来的结果,如果是通过isFilterData 过滤
          _ar = [];
          _ar = x.childList.filter(y => y.checked && y.infoName.includes(this.isFilterData)).map(z => {return z.uid})
          this.activeDBList.push(..._ar)
        })
        this.waitInitDB();
//        this.activeDBList = [];
      },
      // 判断有checked的丢进delOne
      removeDB () {
        this.DBleftAll = false;
        this.DBrightAll =false;
        this.treeList.forEach(x => {
          x.childList.filter(y => y.checked).forEach(z => this.delOne(z));
        })
      },
      changeLeftAll (key, bool, allB) {
        if (allB !== undefined) {
          this.DBleftAll = allB;
        }
        this[key] = bool;
      },
      changeRightAll (key, bool, allB) {
        if (allB !== undefined) {
          this.DBrightAll = allB;
        }
        this[key] = bool;
      },
      // 有需要初始化变色的设备，但需要等待mark加载完毕
      waitInitDB () {
        // 因为objSetItem的时候过滤了没有经纬度的数据，所以index就是markIndex
        this.mapAllList.forEach((x, index) => {
          if (this.activeDBList.includes(x.uid)) {
            // 给默认已选择的加上isChecked
            x['isChecked'] = true;
            this.putSelectColor([this.marks[index]]);
            this.pointSelect.curPointData.push(x);
            this.pointSelect.curMarks.push(this.marks[index]);
          }
        })
        // this.activeDBList = []; 暂时不清除，如果画新区域的时候再清除
        this.activeDBList = [];
      },
      delOne (item) {
        this.markColorChange(item)
      },
      // 右侧剩余数据
      remainData () {
        let obj = [], remainL = [], cObj = {};
        this.mapAllList.forEach(x => {
          let b = true;
          for (let i = 0; i < this.treeList.length; i++) {
            if (this.treeList[i].childList.includes(x)) {
              b = false;
              break;
            }
          }
          if (b) {
            remainL.push(x);
          }
        })
        this.createTreeData(remainL, cObj);
        for(let key in cObj) {
          let _o = {}
          _o['childList'] = cObj[key];
          _o['areaName'] = key;
          _o['areaUid'] = random14();
          this.$set(_o, 'checkAll', false)
          obj.push(_o)
        }
        return obj;
      },
      // 左侧列表数据
      operData () {
        let obj = [];
        let cObj = {};
        if (this.pointSelect.curPointData && this.pointSelect.curPointData.length > 0) {
          this.createTreeData(this.pointSelect.curPointData, cObj);
        }
        if (this.searchData.length > 0) {
          this.searchData.forEach(x => {
            this.createTreeData(x.curPointData, cObj);
          })
        }
        for(let key in cObj) {
          let _o = {}
          _o['childList'] = cObj[key];
          _o['areaName'] = key;
          _o['areaUid'] = random14();
          this.$set(_o, 'checkAll', false)
          obj.push(_o)
        }
        return obj;
      },
      createTreeData (list, cObj) {
        list.forEach(x => {
          this.$set(x, 'checked', false)
          if (cObj[x.areaName]) {
            cObj[x.areaName].push(x);
          }else {
            cObj[x.areaName] = [];
            cObj[x.areaName].push(x);
          }
        })
      },
      operClusterIO (bool, index) {
        // 需要判断下当前是不是有未完成的区域选择，做相应的应对。
        if (bool) {
          if (this.curAddSearch.area && this.curAddSearchWait.area === this.curAddSearch.area) {
            this.curAddSearch.curPointData = this.curAddSearch.curPointData.concat(this.curAddSearchWait.curPointData)
            this.curAddSearchWait.curPointData = [];
            this.curAddSearch.curMarks = this.curAddSearch.curMarks.concat(this.curAddSearchWait.curMarks)
            this.curAddSearchWait.curMarks = [];
          } else {// 说明现在已经点了完成按钮，或者已经重新画区域了，把curAddSearchWait里的数据重置，放入地图
            this.curAddSearchWait.curPointData = this.objSetItem(this.curAddSearchWait.curPointData, {isChecked: false});
            this.curAddSearchWait.curPointData = [];
            this.recoverSXTcolor(this.curAddSearchWait.curMarks)
          }
          this.amap.cluster.addMarkers(this.originMarks[index])
        } else {
          if (this.curAddSearch.curPointData.length) {
            this.curAddSearchWait.curPointData = this.curAddSearch.curPointData.filter(x => x.dataType === index);
            this.curAddSearchWait.curMarks = this.curAddSearch.curMarks.filter(x => x.getExtData().dataType === index);
            this.curAddSearch.curPointData = this.curAddSearch.curPointData.filter(x => x.dataType !== index);
            this.curAddSearch.curMarks = this.curAddSearch.curMarks.filter(x => x.getExtData().dataType !== index);
            this.curAddSearchWait.area = this.curAddSearch.area;
          }
          this.amap.cluster.removeMarkers(this.originMarks[index])
        }
      },
      confirmClear () {
        this.delDialog = false;
        this.delAllArea();
      },
      delAllArea(bool) {
        // 只能单选的时候，也已使用了这个方法清除，传bool，则不取消当前新增的区域
        if (!bool) {
          this.cancelAddArea();
        }
        this.curAddSearch = {
          area: null,
          curPointData: [],
          curMarks: []
        };
//        this.pointSelect.curPointData.forEach(x => {
//          this.markColorChange(x);
//        })
        this.recoverSXTcolor(this.pointSelect.curMarks);
        this.pointSelect.curPointData = this.objSetItem(this.pointSelect.curPointData, {isChecked: false})
        this.pointSelect.curPointData = [];
        this.pointSelect.curMarks = [];
        this.searchData.forEach(x => {
          if (x.area) {
            this.amap.remove(x.area);
            x.area = null;
            this.recoverSXTcolor(x.curMarks);
            x.curPointData = this.objSetItem(x.curPointData, {isChecked: false})
            x.curPointData = [];
          }
        })
        this.searchData = [];
        this.drawActiveType = 0;
        if (this.mouseTool) {
          this.mouseTool.close(false);
        }
      },
      showInfoMes(mes) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info(mes);
        }
      },
      cancelAddArea () {
        if (this.curAddSearch.area) {this.amap.remove(this.curAddSearch.area);}
        if (this.confirmIcon) {this.amap.remove(this.confirmIcon)};
        // 先判断你选择的区域有没有设备,没有就不用做处理
        if (this.curAddSearch.curPointData.length) {
          this.recoverSXTcolor(this.curAddSearch.curMarks);
        }
        this.curAddSearch.area = null;
        this.curAddSearch.curMarks = [];
        this.curAddSearch.curPointData = this.objSetItem(this.curAddSearch.curPointData, {isChecked: false});
        this.curAddSearch.curPointData = [];
      },
      // 摄像头恢复原始颜色
      recoverSXTcolor (mks, bool) {
        mks.forEach(x => {
          let b = true;
          if (bool && this.curAddSearch.curPointData.includes(x.getExtData())) {
            b = false;
          }
          if (b) {
            let uContent = this.setMarkContent(x.getExtData())
            x.setContent(uContent);
          }
        })
      },
      setMarkContent (obj, type) {
        let sDataType, uContent;
        if (obj.dataType === 0 && obj.deviceStatus !== 1) {
          sDataType = 6;
        } else if (obj.dataType === 1 && !obj.isEnabled) {
          sDataType = 9
        } else {
          sDataType = obj.dataType;
        }
        uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
        if (type === 'error') {
          let sClass = 'vl_icon_map_sxt_in_area' + obj.dataType;
          uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon ' + sClass +'"></div>';
        }
        return uContent;
      },
      // 创建确定，取消区域的小marker
      createConfirmMark (path) {
        let m = new window.AMap.Marker({
          map: this.amap,
          position: path,
          offset: new window.AMap.Pixel(-15, -16),
          draggable: false, // 是否可拖动
          zIndex: 200,
          bubble: false,
          content: '<div  class="vl_map_area_confirm"><span class="vl_area_cancel"><i class="el-icon-close"></i></span><span class="vl_area_complete el-icon-check">完成</span></div>'
        })
        this.confirmIcon = m;
      },
      // 给选中的设备上色
      putSelectColor (mks) {
        mks.forEach(y => {
          let uContent = this.setMarkContent(y.getExtData(), 'error')
          y.setContent(uContent);
        })
      },
      // 地图搜索选择
      querySearch(queryString, cb) {
        //this.seacher(queryString)

        this.$nextTick(() => {
          this.seacher(queryString).then(v => {
            //console.log(v);
            var restaurants = v;
            //  console.log(restaurants)
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // console.log(results)
            cb(results);
            // 调用 callback 返回建议列表的数据
            // clearTimeout(this.timeout);
            //   this.timeout = setTimeout(() => {
            //     cb(results);
            //   }, 3000 * Math.random());
            // cb(results);
          });
        });
      },
      handleSelect(item) {
        // console.log(item);
        let new_center = item.location;
        this.amap.setZoomAndCenter(16, new_center);
      },
      createFilter(queryString) {
        return restaurant => {
          // console.log(restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()));

          return (
              restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );
        };
      },
      seacher(v) {
        var placeSearch = new window.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: "湖南"
        });

        if (!!v) {
          let _this = this;
          return new Promise((resolve) => {
            placeSearch.search(v, (status, result) => {
              // 查询成功时，result即对应匹配的POI信息
              let pois = result.poiList.pois;
              _this.restaurants = pois;
              resolve(pois);
            });
          });
        }
        //return pois
      },
      setCenter(){
        var _this=this
        // console.log(this.input3);
        var placeSearch = new window.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '021'
        })
        placeSearch.search(this.input3, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
          //  console.log(result)
          var pois = result.poiList.pois;
          if(pois.length>0){
            let new_center=pois[0].location
            _this.amap.setZoomAndCenter(16, new_center);
          }

          // for(var i = 0; i < pois.length; i++){
          //     var poi = pois[i];
          //     var marker = [];
          //     marker[i] = new AMap.Marker({
          //         position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //         title: poi.name
          //     });
          //     // 将创建的点标记添加到已有的地图实例：
          //     _this.amap.add(marker[i]);
          // }
          // _this.amap.setFitView();

        })

      },
      initMap () {
        if (this.amap) { return; }
        let _this = this;
        let _config = this.oConfig;
        if (!_config) { _config = {}; }
        _config = Object.assign({}, _config, _this.config);
        // console.log('_config', _config)
        // 初始化地图
        let map = new window.AMap.Map(this.sid + '_container', Object.assign({}, _config));
        map.setMapStyle('amap://styles/light');
        // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
        // console.log('_config', _config)
        _this.amap = map;
        /* _this.$nextTick(() => {
          _this.setMap(_config);
        }); */
        // 在地图中添加MouseTool插件
        this.mouseTool = new window.AMap.MouseTool(map);
        this.mouseTool.on('draw', (e) => {
          if (_this.curAddSearch.area) {_this.amap.remove(_this.curAddSearch.area);}
          if (_this.confirmIcon) {_this.amap.remove(_this.confirmIcon);}
          // event.obj 为绘制出来的覆盖物对象
          console.log('draw event', e);
          //  return
          _this.curAddSearch.area = e.obj;
          // 画完区域取消地图工具激活状态
          _this.amap.setDefaultCursor();
          _this.mouseTool.close(false);
          _this.createConfirmMark(e.obj.getPath()[e.obj.getPath().length - 1]);

          let a=e.obj;
          let t=e.obj.CLASS_NAME
          _this.checkout(a,t);
          console.log(_this.curAddSearch.curPointData)
          // 判断如果当前curAddSearch.curMarks有数据的话，先加入点聚合
          if (_this.curAddSearch.curMarks.length) {
            _this.recoverSXTcolor(_this.curAddSearch.curMarks)
          }
          // 判断如果初始化的时候带了数据，就清除了， 暂时取消清除，看后面需求
//          if (_this.activeDBList.length) {
//            _this.recoverSXTcolor(_this.pointSelect.curMarks);
//            _this.activeDBList = [];
//            _this.pointSelect.curPointData = [];
//          }

          _this.curAddSearch.curMarks = [];
          _this.curAddSearch.curPointData.forEach(j => {
            _this.curAddSearch.curMarks.push(_this.marks[j.markIndex]);
          })
          _this.putSelectColor(_this.curAddSearch.curMarks)
          this.resetMapDraw();
        });

        _this.mapMark(this.mapAllList);
      },
      checkout(obj){
        this.curAddSearch.curPointData = [];
        this.mapAllList.forEach(el=>{
          // 先判断checkbox是否有勾选
          if (this.checkList.includes(el.dataType)) {
            let myLngLat=new window.AMap.LngLat(el.longitude,el.latitude);
            //  var isPointInRing = window.AMap.GeometryUtil.isPointInRing(myLngLat,obj.C.path);
            let isPointInRing = obj.contains(myLngLat);
            // console.log(marker.getPosition());
            if(isPointInRing){
              let id = this.curAddSearch.curPointData.findIndex(item=>item.uid==el.uid)
              if(id == -1 && !el['isChecked']){
                // 判断el是不是在pointSelect或者searchData里。没有则加入curAddSearch
                el['isChecked'] = true;
                this.curAddSearch.curPointData.push(el)
              }
            }
          }
        })
      },
      resetMapDraw () {
        this.mouseTool.close(false);
        this.amap.setDefaultCursor();
        this.drawActiveType = 0;
      },
      // 编辑 删除 完成事件
      mapEvents () {
        let that = this;
        $('body').on('click', '.vl_map_area_confirm', function (e) {
          event.stopPropagation();
          if (e.target.classList.contains('el-icon-close')) {
            that.cancelAddArea();
          }
          if (e.target.classList.contains('vl_area_complete')) {
            if (that.curAddSearch.curPointData.length) {
              let addObj = {};
              addObj.area = that.curAddSearch.area;
              addObj.curPointData = that.curAddSearch.curPointData;
              addObj.curMarks = that.curAddSearch.curMarks;
              that.addCompleteData(addObj);
              that.amap.remove(that.confirmIcon);
            } else {
              that.showInfoMes('所选区域没有设备信息或者所选区域设备全都已选了')
            }
          }
        })
        this.mapEventActive = true;
      },
      // 画完区域完成，将数据添加到searchData,右侧列表
      addCompleteData (obj) {
        // 判断是不是只能有一个选择区域
        if (this.sArea && this.searchData[0]) {
          this.delAllArea(true);
        }
        this.searchData.push(obj);
        this.putSelectColor(obj.curMarks)
        // 重置curAddSearch
        this.curAddSearch = {
          area: null,
          curPointData: [],
          curMarks: []
        };
      },
      selDrawType (drawType) {
        // 选择的时候存在未完成的区域，直接删除
        if (this.curAddSearch.area) {this.amap.remove(this.curAddSearch.area);}
        if (this.confirmIcon) {this.amap.remove(this.confirmIcon);}
        if (this.curAddSearch.curMarks.length) {
          this.recoverSXTcolor(this.curAddSearch.curMarks)
        }
        this.curAddSearch.curMarks = [];
        this.curAddSearch.curPointData = [];
        if (this.drawActiveType === drawType) {
          this.drawActiveType = 0;
          this.resetMapDraw();
          return false;
        }
        this.drawType = drawType;
        this.drawActiveType = drawType;
        if (drawType === 1) { // 矩形
          this.drawRectangle();
        } else if (drawType === 2) { // 圆形
          this.drawCircle();
        }else if (drawType === 4) { // 多边形
          this.drawPolygon();
        } else if (drawType === 5) { // 多边形
        }
      },
      // 矩形
      drawRectangle () {
        this.amap.setDefaultCursor("crosshair");
        this.mouseTool.rectangle({
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          strokeWeight: 1,
          fillOpacity: 0.2,
          fillColor: '#FA453A',
          cursor:'pointer',
          strokeStyle: "solid",
          zIndex: this.zIndex
        });
        this.zIndex += 1;
      },
      // 圆形
      drawCircle () {
        this.amap.setDefaultCursor("crosshair");
        this.mouseTool.circle({
          borderWeight: 3,
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          strokeWeight: 1,
          // strokeOpacity: 0.2,
          fillOpacity: 0.2,
          // strokeStyle: 'dashed',
          // strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: '#FA453A',
          zIndex: this.zIndex
        });
        this.zIndex += 1;
      },
      // 多边形
      drawPolygon () {
        this.amap.setDefaultCursor("crosshair");
        this.mouseTool.polygon({
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          bubble: true,
          strokeWeight: 1,
          fillColor: "#FA453A",
          fillOpacity: 0.2,
          isRing: false,
          zIndex: this.zIndex,
        });
        this.zIndex += 1;
      },
      // 获取当前框选的数据
      getCheckedIds () {
        return this.selSubmit(true);
      },
      // 加bool，是为了适应没有确定按钮的场景，直接获取结果无需emit。
      selSubmit (bool) {
        // this.drawObj.circle10km
        // rectangle circle polyline polygon circle10km
        this.submitLoading = true;
        // 把pointSelect,跟searchData下的数据拿出来
        let ad = [], ab = [], abIds = [], dNames = [], deviceNames = [];
        this.pointSelect.curPointData.forEach((x, index) => {
          // 直接把对应的mark放入当前对象，方面查询过滤的时候快速查找
          x['curMark'] = this.pointSelect.curMarks[index];
          dNames.push(x['infoName'])
          if (x.dataType === 0)  {
            ad.push(x)
          } else {
            ab.push(x);
            abIds.push(x.uid)
          }
        })
        this.searchData.forEach(x => {
          x.curPointData.forEach((y, index) => {
            dNames.push(x['infoName'])
            y['curMark'] = x.curMarks[index];
            if (y.dataType === 0) {
              ad.push(y)
            } else {
              ab.push(y)
              abIds.push(x.uid)
            }
          })
        })
        // 返回当前选中设备集合的缩略名称；
        if (dNames.length > 3) {
          deviceNames = dNames.splice(0, 2);
          deviceNames.push('等' + dNames.length + '个设备');
          deviceNames =  deviceNames.join(',')
        } else {
          deviceNames = dNames.join(',')
        }

        // 如果是直接获取结果的就不去计算卡口里的所包含的设备id了
        if (bool) {
          this.submitLoading = false;
          return { deviceList: ad, bayonetList: ab,deviceNames: deviceNames}
        } else {
          if (abIds && abIds.length > 0) {
            getDeviceByBayonetUids(abIds).then(res => {
              let bayonetDeviceList = [];
              if (res && res.data) {
                bayonetDeviceList = res.data;
              }
              this.$emit('mapSelectorEmit', {
                deviceList: ad,
                bayonetList: ab,
                bayonetDeviceList: bayonetDeviceList,
                deviceNames: deviceNames
              });
              this.submitLoading = false;
              this.dialogVisible = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          } else {
            this.$emit('mapSelectorEmit', {
              deviceList: ad,
              bayonetList: ab,
              bayonetDeviceList: [],
              deviceNames: deviceNames
            });
            this.submitLoading = false;
            this.dialogVisible = false;
          }
        }
        console.log('设备 ad', ad);
        console.log('卡口 ab', ab);
      },
      // bool说明为查询模块调用
      async getTreeList (bool) {
        let curIds = {bayonetList: [], deviceList: []};
        if (bool) {
          curIds = this.getCheckedIds();
        }
        if (this.showTypes.indexOf('D') >= 0) {
          await new Promise((resolve) => {
            this.getListDevice(resolve, curIds);
          })
        }
        if (this.showTypes.indexOf('B') >= 0) {
          await new Promise((resolve) => {
            this.getListBayonet(resolve, curIds);
          })
        }
        // 这里执行mapMark是，查询模块查询之后更新数据
        if (bool) {
          this.marks = [];
//          this.originMarks
          this.amap.cluster.clearMarkers();
          this.mapMark(this.mapAllList);
          this.$_hideLoading();
        }
        if (!this.isDialog && !this.mapEventActive) {
          this.initMap();
          this.mapEvents();
        }
      },
      // 设备
      getListDevice (resolve, curIds) {
        let params = {
          ccode: mapXupuxian.adcode,
        }
        if (this.dutyUnitId) {
          params.dutyOrganId = this.dutyUnitId;
        }
        if (this.intelligentCharac) {
          params.intelligentCharac = this.intelligentCharac;
        }
        if (this.groupId) {
          params.groupId = this.groupId;
        }
        getAllMonitorList(params).then(res => {
          if (res.data) {
            let dList = [];
            dList = this.objSetItem(res.data, {infoName: 'deviceName', dataType: 0, areaName: 'areaCname'});
            dList = dList.reduce((prev, next) => {
              if (!curIds.deviceList.find(x => x.uid === next.uid)) {
                prev.push(next)
              }
              return prev;
            }, [])
            curIds.deviceList = this.objSetItem(curIds.deviceList, {isInChecked: true})
            this.listDevice = dList.concat(curIds.deviceList);
          }
          resolve();
        }).catch(resolve);
      },
      // 卡口
      getListBayonet (resolve, curIds) {
        let params = {
          "where.areaId": mapXupuxian.adcode,
          'where.subAreaFlag': true,
          pageSize: 9999,
        }
        if (this.dutyUnitId) {
          params['where.dutyUnitId'] = this.dutyUnitId;
        }
        getBayonetList(params).then(res => {
          if (res.data) {
            let bList = [];
            bList = this.objSetItem(res.data.list, {infoName: 'bayonetName', dataType: 1});
            bList = bList.reduce((prev, next) => {
              if (!curIds.bayonetList.find(x => x.uid === next.uid)) {
                prev.push(next)
              }
              return prev;
            }, [])
            curIds.bayonetList = this.objSetItem(curIds.bayonetList, {isInChecked: true});
            this.listBayonet = bList.concat(curIds.bayonetList);
          }
          resolve()
        }).catch(resolve);
      },
      objSetItem (list, obj) {
        let result = [];
        list.forEach(z => {
          if (z.longitude && z.latitude) {
            for (let key in obj) {
              z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
            }
            // 都加上markSid , 方便处理移动端发起的通话
            if (!z['markSid']) {
              z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
            }
            result.push(z)
          } else {
            console.log('没有经纬度')
          }
        })
        return result;
      },
      // D设备 B卡口
      // 地图标记
      mapMark (data) {
        if (data && data.length > 0) {
          let _this = this;
          data.forEach((obj, _index) => {
            if (obj.longitude > 0 && obj.latitude > 0) {
              let offSet = {0: [-15, -16],1: [-15, -16],2: [-15, -60],3: [-15, -16], 4: [-15, -16],5: [-15, -16]};
              let uContent = _this.setMarkContent(obj);
              // 给obj设置markIndex ,为当前在marks集合中所处的位置，
//            obj['markIndex'] = _this.marks.length;
              obj['markIndex'] = _index;
              let marker = new window.AMap.Marker({ // 添加自定义点标记
//                  map: _this.map,
                position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                draggable: false, // 是否可拖动
                extData: obj,
                // 自定义点标记覆盖物内容
                content: uContent,
                bubble: true
              });
              marker.on('click', function () {
                if (_this.drawActiveType === 5) {
                  _this.markColorChange(obj, marker);
                }
              })
              // 判断是不是查询之后在已选设备里有了的,有就直接去取mark
              if (obj.isInChecked) {
                _this.marks.push(obj.curMark)
                _this.originMarks[obj.dataType].push(obj.curMark);
              } else {
                _this.marks.push(marker);
                _this.originMarks[obj.dataType].push(marker);
              }
              // hover
              marker.on('mouseover', function () {
//                  $('#' + obj.markSid).addClass('vl_icon_map_hover_mark' + obj.dataType)
                let curP = marker.getPosition();
                let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
                _this.hoverWindow = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(9, 34), // 相对于基点的偏移位置
                  content: sContent,
                  bubble: true
                });
                _this.hoverWindow.open(_this.amap, new window.AMap.LngLat(curP.lng, curP.lat));

              });
            }
          })
          if (_this.activeDBList.length) {
            _this.waitInitDB();
          }
          addCluster(_this.amap, _this.marks)
        }
      },
      markColorChange (obj, marker) {
        // 先判断有没有这个dom元素，如果没有说明在地聚合里没有加载.
        let $class = document.getElementById(obj.markSid);
        let _this = this;
        if ($class === null || $class.classList.contains('vl_icon_map_sxt_in_area' + obj.dataType)) {
          obj['isChecked'] = false;
          // 先查找pointSelect集合，这个集合比较小，速度快l
          let _l = _this.pointSelect.curPointData;
          if (_l.includes(obj)) {
            let _i = _l.findIndex(x => x === obj);
            _l.splice(_i, 1)
            _this.recoverSXTcolor([_this.pointSelect.curMarks[_i]])
            _this.pointSelect.curMarks.splice(_i, 1)
            return false;
          }
          // 再查searchData,查到数据立马break跳出循环
          for(let i = 0; i < _this.searchData.length; i++) {
            let _Sl = _this.searchData[i].curPointData;
            if (_Sl.includes(obj)) {
              let _si = _Sl.findIndex(x => x === obj);
              _Sl.splice(_si, 1)
              _this.recoverSXTcolor([_this.searchData[i].curMarks[_si]]);
              _this.searchData[i].curMarks.splice(_si, 1);
              break;
            }
          }
        } else {
          obj['isChecked'] = true;
          // 当前是未选中状态，直接加入pointSelect集合
          $class.classList.add('vl_icon_map_sxt_in_area' + obj.dataType);
          _this.pointSelect.curPointData.push(obj);
          _this.pointSelect.curMarks.push(marker);
        }
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
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      setMapStatus (status) {
        if (this.amap) {
          if (status === 1) {
            this.amap.setZoom(this.amap.getZoom() + 1);
          } else if (status === 2) {
            this.amap.setZoom(this.amap.getZoom() - 1);
          }
        }
      }
    },
    beforeDestroy () {
      $('body').unbind('click');
      if (this.amap) {
        this.amap.destroy();
      }
    }
  }
</script>
<style lang="scss" paged>
  // 框选区域之后小弹窗
  .vl_map_area_confirm {
    background: #FFFFFF;
    box-shadow:0px 12px 12px 0px rgba(2,10,62,0.36);
    padding: 5px 0px;
    width: 100px;
    height: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    display: flex;
    > span {
      display: block;
      height: 20px;
      text-align: center;
    }
    .vl_area_cancel {
      width: 30px;
      border-right: 1px solid #F2F2F2;
      i {
        color: #F95826;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .vl_area_complete {
      width: 70px;
      vertical-align: middle;
      &:before {
        color: #1264F8;
        font-size: 20px;
        font-weight: bold;
        vertical-align: middle;
        margin-right: 3px;
      }
      color: #666666;
    }
  }
  .sd_opts {
    /*width: 5.12rem;*/
    height: .5rem;
    > ul {
      height: 100%;
      overflow: hidden;
      > li {
        float: left;
        height: 100%;
        padding: .05rem;
        width: 1rem;
        &:first-child {
          >div {
            border-left: none;
          }
        }
        > div {
          color: #666666;
          height: 100%;
          display: flex;
          align-items:center;
          justify-content:center;
          border-left: 1px solid #F2F2F2;
          cursor: pointer;
          &.sd_opts_sed {
            /*background-color: #F2F9FF;*/
            > .sd_opts_icon1 { background-image: url(../../assets/img/vehicle/cut1m.png); }
            > .sd_opts_icon2 { background-image: url(../../assets/img/vehicle/cut2m.png); }
            > .sd_opts_icon3 { background-image: url(../../assets/img/vehicle/cut3m.png); }
            > .sd_opts_icon4 { background-image: url(../../assets/img/vehicle/cut4m.png); }
            > .sd_opts_icon5 { background-image: url(../../assets/img/vehicle/cut5m.png); }
          }
        }
      }
    }
    > p {
      max-width: 320px;
      padding: 0 10px 10px 10px;
      margin: 0 auto;
      > span {
        color: #999; font-size: 12px;
      }
    }
  }
  .sd_opts_icon {
    display: inline-block;
    width: .4rem; height: .4rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    &.sd_opts_icon1 {
      background-image: url(../../assets/img/vehicle/cut1.png);
      &:hover { background-image: url(../../assets/img/vehicle/cut1m.png); }
    }
    &.sd_opts_icon2 {
      background-image: url(../../assets/img/vehicle/cut2.png);
      &:hover { background-image: url(../../assets/img/vehicle/cut2m.png); }
    }
    &.sd_opts_icon3 {
      background-image: url(../../assets/img/vehicle/cut3.png);
      &:hover { background-image: url(../../assets/img/vehicle/cut3m.png); }
    }
    &.sd_opts_icon4 {
      background-image: url(../../assets/img/vehicle/cut4.png);
      &:hover { background-image: url(../../assets/img/vehicle/cut4m.png); }
    }
    &.sd_opts_icon5 {
      background-image: url(../../assets/img/vehicle/cut5.png);
      &:hover { background-image: url(../../assets/img/vehicle/cut5m.png); }
    }
  }
</style>
<style lang="scss">
  .rlcx_search_box {
    width: 100%;
    height: 60px;
    position: absolute;
    top: 40px;
    background: #FAFAFA;
    padding-top: 10px;
    padding-left: 20px;
    .search_form {
      width: 100%;
      .select_btn, .reset_btn {
        width: 80px;
      }
      .select_btn {
        background-color: #0C70F8;
        color: #ffffff;
      }
      .reset_btn {
        background-color: #ffffff;
        color: #666666;
        border-color: #DDDDDD;
      }
    }
    .divide {
      border: 1px dashed #fafafa;
    }
  }
  .map_sd_edit_false {
    .ms_marker_opt {
      display: none;
    }
    .sd_search { display: none; }
    .sd_opts { display: none; }
  }
  .public_map_selector_dialog {
    .el-dialog__header { display: none; }
    .el-dialog__body { padding: 0; }
    .map_sd_content {
      position: relative;
      width: 100%; height: 7.8rem;
      padding-top: 40px;
      > .sd_type_tab {
        position: absolute;
        top: 0;
        height: 40px;
        width: 100%;
        background: #FAFAFA;
        border-bottom: 1px solid #F2F2F2;
        z-index: 2;
        > span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          color: #333333;
          margin-left: 20px;
          cursor: pointer;
        }
        > .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
      }
      > .sd_device_list {
        position: absolute; top: 50px; left: .2rem; z-index: 1000;
        background-color: #fff;
        width: 2.6rem;
        height: 6rem;
        -webkit-transition: height .3s ease-in;
        -moz-transition: height .3s ease-in;
        -ms-transition: height .3s ease-in;
        -o-transition: height .3s ease-in;
        transition: height .3s ease-in;
        overflow: hidden;
        .sdd_title {
          padding: 0 20px;
          color: #0C70F8;
          height: .5rem;
          line-height: .5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 1px solid #F2F2F2;
          > i {
            -webkit-transition: all .3s ease-in;
            -moz-transition: all .3s ease-in;
            -ms-transition: all .3s ease-in;
            -o-transition: all .3s ease-in;
            transition: all .3s ease-in;
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
        }
        .sdd_content {
          padding: 0 20px;
          height: 6.1rem;
          width: 2.6rem;
        }
      }
      > .sd_device_list_close {
        height: .5rem;
        .sdd_title {
          color: #666666;
          > i {
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
          }
        }
      }
      > .sd_search {
        position: absolute; top: 50px; left: 3rem; z-index: 1000;
        background-color: #fff;
        overflow: hidden;
        .inline-input {
          width: 2.4rem;
          height: .5rem;
          /deep/ input {
            height: .5rem;
          }
        }
        .select_btn {
          background-color: #0c70f8;
          color: #ffffff;
          width: .6rem;
          position: absolute;
          right: 0;
          height: .5rem;
          padding: 0px;
        }
      }
      > .sd_opts {
        position: absolute; top: 50px; left: 6.2rem; z-index: 1000;
        background-color: #fff;
      }
      .sd_checkbox {
        position: absolute; top: 50px; left: 11.5rem; z-index: 1000;
        background: #ffffff;
        height: .5rem;
        padding: 0 .1rem;
        .el-checkbox-group {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
      }
      > .sd_fs {
        position: absolute; bottom: 20px; right: 20px; z-index: 1000;
        background-color: #fff;
        padding: 10px 5px;
        box-shadow:-12px 0px 14px 0px rgba(148,148,148,0.24);
        > li {
          padding: 10px;
          cursor: pointer;
          > i { font-size: 20px; color: #0C70F8; }
        }
      }
      // 列表选择
      > .sd_list_choose {
        height: calc(100% - 40px);
        width: 100%;
        position: absolute;
        top: 40px;
        z-index: 1001;
        background: #ffffff;
        border-bottom: 1px solid #F2F2F2;
        display: flex;
        > .sd_list_l {
          width: 260px;
          height: 100%;
          border-right: 1px solid #f2f2f2;
          .sd_list_lt {
            height: 86px;
            display: flex;
            flex-direction: column;
            > p {
              height: 50px;
              line-height: 50px;
              border-bottom: 1px solid #f2f2f2;
              padding-left: 20px;
            }
            >.el-checkbox {
              height: 20px;
              margin-top: 15px;
              padding-left: 20px;
            }
          }
          .sd_list_lc {
            height: calc(100% - 100px);
            .sd_list_l_tree {
              width: 258px;
              padding: 0 20px;
            }
          }
        }
        > .sd_list_m {
          width: 68px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          > span {
            display: block;
            width: 52px;
            height:24px;
            line-height: 24px;
            background: #F6F6F6;
            border: 1px solid #D3D3D3;
            color: #666666;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 8px;
            cursor: pointer;
            i {
              font-size: 14px;
              color: #B2B2B2;
            }
            &:hover {
              opacity: .8;
            }
            &:first-child {
              background: #0C70F8;
              border-color: #0C70F8;
              color: #ffffff;
              i {
                color: #ffffff;
              }
            }
          }
        }
        > .sd_list_r {
          width: 260px;
          height: 100%;
          border-left: 1px solid #f2f2f2;
          border-right: 1px solid #f2f2f2;
          .sd_list_lt {
            height: 121px;
            .sd_lt_search {
              position: relative;
              display: inline-block;
              height: 30px;
              padding: 0 20px;
              margin-top: 10px;
              input {
                height: 30px;
              }
              > .el-icon-search {
                display: block;
                position: absolute;
                top: 8px;
                right: 30px;
                cursor: pointer;
              }
            }
            >.el-checkbox {
              margin-top: 10px;
            }
          }
          .sd_list_lc {
            height: calc(100% - 121px);
          }
        }
      }
    }
    .map_sd_has_slot {
      padding-top: 100px;
      > .sd_list_choose {height: calc(100% - 100px);top: 100px;}
      > .sd_device_list {top: 110px;}
      > .sd_search {top: 110px;}
      > .sd_opts {top: 110px;}
      .sd_checkbox {top: 110px;}
    }
    .el-dialog__footer { padding: 10px 0; }
  }
  .amap-sug-result { z-index: 3000; display: none; }
</style>