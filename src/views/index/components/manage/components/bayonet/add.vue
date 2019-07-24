<template>
  <div class="bayonet_manage_add">
    <div is="vlBreadcrumb" :breadcrumbData="breadcrumbData"></div>
    <div class="add_form">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px" :label-position="labelPosition">
        <el-form-item prop="bayonetName" label="卡口名称">  
          <el-input show-word-limit maxlength="20" v-model="addForm.bayonetName" placeholder="请输入卡口名称，不超过20字"></el-input>
        </el-form-item>
        <el-form-item prop="bayonetNum" label="卡口编号">
          <el-input v-model="addForm.bayonetNum" placeholder="请输入卡口编号"></el-input>
        </el-form-item>
        <el-form-item prop="organ" label="所属机构">
          <el-select v-model="addForm.organ" placeholder="请搜索选择所属机构单位">
            <el-option
              v-for="item in organList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="use" label="卡口用途">
          <el-select v-model="addForm.use" placeholder="请输入用途">
            <el-option
              v-for="item in useList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度" required class="longlat">
          <el-form-item prop="longitude">
            <el-input v-model="addForm.longitude" placeholder="请输入经度"></el-input>
          </el-form-item>
          <span>(经度)</span>
          <el-form-item prop="Latitude">
            <el-input v-model="addForm.Latitude" placeholder="请输入纬度"></el-input>
          </el-form-item>
          <span>(纬度)</span>
          <span><i class="el-icon-circle-plus-outline"></i> 地图选择</span>
        </el-form-item>

        <el-form-item label="卡口地址" required class="bayonet_address">
          <el-form-item prop="county">
            <el-select v-model="addForm.county">
              <el-option
                v-for="item in countyList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="town">
            <el-select v-model="addForm.town">
              <el-option
                v-for="item in townList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="community">
            <el-select v-model="addForm.community">
              <el-option
                v-for="item in communityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address">
            <el-input v-model="addForm.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="describe" label="描述">
          <el-input show-word-limit maxlength="150" type="textarea" v-model="addForm.describe" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="卡口设备" required>
          <div class="bayonet_tab">
            <el-button class="select_btn btn_100">地图选择</el-button>
            <el-button class="select_btn btn_100">列表选择</el-button>
          </div>

        </el-form-item>
      </el-form>
      <div id="mapBox"></div>
      <div class="operate_btn">
        <el-button class="reset_btn">取消</el-button>
        <el-button class="select_btn">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import {mapXupuxian} from '@/config/config.js';
export default {
  components: {vlBreadcrumb},
  data () {
    return {
      breadcrumbData: [{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}],
      pageType: null,// 1为新增，2为编辑
      labelPosition: 'right',
      // 表单参数
      addForm: {
        bayonetName: null,
        bayonetNum: null,
        organ: null,
        use: null,
        longitude: null,
        Latitude: null,
        county: null,
        town: null,
        community: null,
        address: null,
        describe: null
      },
      // 表单列表参数
      organList: [],// 机构列表
      useList: [],// 用途列表
      countyList: [],// 县列表
      townList: [],// 镇列表
      communityList: [],// 社区列表
      // 表单验证规则
      addFormRules: {
        bayonetName: [{required: true, message: '请填写姓名', trigger: 'blur'}],
        bayonetNum: [{required: true, message: '请选择证件类型', trigger: 'blur'}],
        organ: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        use: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        longitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        Latitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        county: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        town: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        community: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        address: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        describe: [{required: true, message: '请填写证件号码', trigger: 'blur'}]
      },
      // 地图参数
      map: null,
      zoomLevel: 10,
      lngLat: null,//经纬度
      autoComplete: null,
      marker: null,
    }
  },
  mounted () {
    this.pageType = parseInt(this.$route.query.type);
    if (this.pageType === 1) {
      this.breadcrumbData.push({name: '新增卡口'});
    } else {
      this.breadcrumbData.push({name: '编辑卡口'});
    }
    this.resetMap();
  },
  methods: {
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      map.on('click', function (e) {
        console.log(e, 'eeee')
        new window.AMap.service('AMap.Geocoder',function(){//回调函数
            let geocoder = null;
            //实例化Geocoder
            geocoder = new window.AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
            var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标
            _this.addForm.longitude = lnglatXY[0];
            _this.addForm.Latitude = lnglatXY[1];
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    //获得了有效的地址信息:
                    //即，result.regeocode.formattedAddress
                    _this.markLocation(e.lnglat.getLng(), e.lnglat.getLat(), result.regeocode.formattedAddress);

                }else{
                    //获取地址失败
                    _this.$message.error('没有获取到地址');
                }
            });
        })

      })
      _this.map = map;
    },
    // 输入追踪点定位圆形覆盖物的中心点
    markLocation(lng, lat, address) {
      let _this = this;
      if (_this.marker) {
        _this.map.remove(_this.marker);
      }
      _this.lngLat = [lng, lat];
      // 追踪点标记
      let offSet = [-20.5, -48], _hoverWindow = null;
      if (lng > 0 && lat > 0) {
        _this.marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [lng, lat],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: '',
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_message_7"></div>'
        });
        // hover
        _this.marker.on('mouseover', function () {
          let _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main"><ul>
              <li><span>事发地点：</span><span>${address}</span></li>
            </ul></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
        });
        _this.marker.on('mouseout', function () {
          if (_hoverWindow) { _hoverWindow.close(); }
        });
        _this.map.setCenter([lng, lat]);
        _this.marker.setMap(_this.map);
      }
    },
   
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_add{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .add_form{
    padding: 20px;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
    #mapBox{
      width: 100%;
      height: 500px;
    }
  }
  .operate_btn{
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    border-top: 1px solid #e6e6e6;
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
<style lang="scss">
.bayonet_manage_add{
  .add_form{
    .longlat > .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
    }
    .bayonet_address > .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
    }
  }
}
</style>

