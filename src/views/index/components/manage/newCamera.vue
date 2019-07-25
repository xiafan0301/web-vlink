<template>
    <div class="new-camera">
        <vue-scroll>
            <div class="new-camera-content">
                <!-- tab切换 -->
                <div class="tab-menu">
                    <a v-for="(item,index) in tabMenu" :key="index" @click="selectTab(item.value)" :class="{'is-active': selectIndex === item.value}">{{item.label}}</a>
                </div>
                <!-- 表单 -->
                <div class="new-from-comp">
                <div v-show="selectIndex === 0">
                <el-form :model="cameraForm" :rules="rules" ref="cameraForm" label-width="122px" class="new-camera-form">
                    <el-form-item label="摄像头编码：" v-show="uid">
                        <p>{{12338487478497585}}</p>
                    </el-form-item>
                    <el-form-item label="所属机构：" prop="organ">
                        <el-select
                            v-model="cameraForm.organ"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请搜索选择所属机构单位"
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <el-option
                            v-for="item in organList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像头编号：" prop="cameraId">
                        <el-input v-model="cameraForm.cameraId" placeholder="请输入摄像头编号"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像头名称：" prop="cameraName">
                        <el-input v-model="cameraForm.cameraName" placeholder="请输入摄像头名称"></el-input>
                    </el-form-item>
                    <el-form-item label="厂家：" prop="factory">
                        <el-select v-model="cameraForm.factory" placeholder="请选择厂家">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像头序列号：" prop="serialNumber">
                        <el-input v-model="cameraForm.serialNumber" placeholder="请输入摄像头序列号"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像头类型：" prop="cameraType">
                        <el-select v-model="cameraForm.cameraType" placeholder="请选择摄像头类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最大像素：" prop="pixel">
                        <el-select v-model="cameraForm.pixel" placeholder="请选择最大像素">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="智能特性：" prop="features">
                        <el-select v-model="cameraForm.features" multiple collapse-tags placeholder="请选择摄像头类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    </el-form> 
                </div>
                <div v-show="selectIndex === 1" class="internet-info">
                    <el-form :model="InternetForm" :rules="InternetRules" ref="InternetForm" label-width="122px" class="new-camera-form">
                    <el-form-item label="SIP编号：" prop="SIPNo">
                        <el-input v-model="InternetForm.SIPNo" placeholder="请输入SIP编号"></el-input>
                    </el-form-item>
                    <el-form-item label="IP："  prop="ipAdress">
                        <ul class="ip-adress">
                            <li v-for="(item,index) in InternetForm.ipAdress" :key="index">
                                <el-input v-model="item.value" @change="checkIpVal(item,index)" @blur="setDefaultVal(item)" placeholder="255"></el-input>
                                <div class="dot"></div>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="重要级别：" prop="importanceLevel">
                        <el-select v-model="InternetForm.importanceLevel" placeholder="请选择重要级别">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="经纬度：" prop="lngLat">
                        <ul class="lng-lat">
                            <li>
                                <el-input v-model="InternetForm.lngLat.lng" placeholder="请输入经度"></el-input>
                                <span class="lng-tip">(经度)</span>
                            </li>
                            <li>
                                <el-input v-model="InternetForm.lngLat.lat" placeholder="请输入纬度"></el-input>
                                <span class="lat-tip">(纬度)</span>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="所在位置：" prop="location">
                        <el-cascader v-model="InternetForm.location" :options="options" ref="cascaderAddr" @change="handleChange" clearable placeholder="请选择省/市/县/乡"></el-cascader>
                    </el-form-item>
                    <el-form-item label="" prop="address">
                        <el-input v-model="InternetForm.address" placeholder="请输入详细地址" @blur="markAddress(InternetForm.address)"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：" prop="userName">
                        <el-input v-model="InternetForm.userName" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="InternetForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="RTSP端口：" prop="RTSPPort">
                        <el-input v-model="InternetForm.RTSPPort" placeholder="请输入RTSP端口"></el-input>
                    </el-form-item>
                    </el-form> 
                    <!-- 地图信息 -->
                    <div class="gis_content" id="gis_content">
                    
                    <div class="map" id="mapMap">
                        <!-- 地图控制按钮（放大，缩小，定位） -->
                        <div class="map_control">
                        <el-tooltip class="item" effect="dark" content="定位您的位置" placement="left">
                            <div class="btn_top" @click="Location"></div>
                        </el-tooltip>
                        <ul class="btn_bottom">
                            <li class="ad" title="放大地图" @click="mapZoomSet(1)"></li>
                            <li class="re" title="缩放地图" @click="mapZoomSet(-1)"></li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
                </div> 
            </div>
            <!-- 页面底部 -->
            <vlinkFooter></vlinkFooter>
        </vue-scroll>
        <!-- 工具条 -->
        <div class="util_bar" v-if="selectIndex === 0">
            <el-button  @click="back">返回</el-button>
            <el-button type="primary" @click="submitForm()">确定</el-button>
            <el-button type="primary" @click="goToNext(1)">下一步</el-button>
        </div>
        <!-- 工具条 -->
        <div class="util_bar" v-if="selectIndex === 1">
            <el-button  @click="back">返回</el-button>
            <el-button type="primary" @click="goToNext(-1)">上一步</el-button>
            <el-button type="primary" @click="submitInternetForm()">确定</el-button>
        </div>
    </div>
</template>

<script>
import vlinkFooter from "_com/footer.vue"; // 引入底部
import mapData from '../../../../config/mapdata.json';
export default {
    components: { vlinkFooter },
    data() {
        var checkIp = (rule, value, callback) => {
            let isIp = value.every(item => item.value !== "")
            console.log("------------",value,isIp)
            if (!isIp) {
                return callback(new Error('IP填写不完整'));
            }else {
                callback();
            }
        };
        return {
            optionProps: {
                value: 'value',
                label: 'label',
                children: 'children'
            },
            tabMenu: [{
                label: '基本信息',
                value: 0,
            },{
                label: '联网信息',
                value: 1,
            }],
            organList: [],       //机构列表
            list: [],
            loading: false,
            selectIndex: 0,     //tab选择
            uid: '',           //摄像头uid
            cameraDetail: {},       //摄像头详情
            cameraForm: {            //表单
                organ: [],
                cameraId: '',
                cameraName: '',
                factory: '',
                serialNumber: '',
                cameraType: '',
                pixel: '',
                features: '',
            },
            rules: {                 //规则
                organ: [
                    { required: true, message: '所属机构单位不能为空', trigger: 'change' }
                ],
                cameraId: [
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                cameraName: [
                    { required: true, message: '摄像头名称不能为空', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ], 
                factory: [],
                serialNumber: [
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            InternetForm: {
                SIPNo: '',
                ipAdress: [{value: ''}, {value: ''}, {value: ''}, {value: ''}],               //ip
                importanceLevel: '',
                lngLat: {lng: '',lat: ''},
                location: [],
                address: '',
                userName: '',
                password: '',
                RTSPPort: '',
            },
            InternetRules:{
                SIPNo: [
                    { required: true, message: 'SIP编号不能为空', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                ipAdress: [
                    { required: true, message: 'IP地址不能为空', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
                ],
                lngLat: [
                    { required: true, message: '经度和纬度不能为空', trigger: 'blur' },
                ],
                location: [
                    { required: true, message: '省市区不能为空', trigger: 'change' },
                ],
                address: [
                    { required: true, message: '详细地址不能为空', trigger: 'blur' },
                    { min: 3, max: 1000,message: '长度在 3 到 1000 个字符', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ],
                RTSPPort: [
                    { required: true, message: 'RTSP端口不能为空', trigger: 'blur' },
                ]},
            map: null, // 地图对象
            geolocation: null, // 地图定位对象
            t: 1,
            locationName: '',      //省市区
            states: ["Alabama", "Alaska", "Arizona",
                    "Arkansas", "California", "Colorado",
                    "Connecticut", "Delaware", "Florida",
                    "Georgia", "Hawaii", "Idaho", "Illinois",
                    "Indiana", "Iowa", "Kansas", "Kentucky",
                    "Louisiana", "Maine", "Maryland",
                    "Massachusetts", "Michigan", "Minnesota",
                    "Mississippi", "Missouri", "Montana",
                    "Nebraska", "Nevada", "New Hampshire",
                    "New Jersey", "New Mexico", "New York",
                    "North Carolina", "North Dakota", "Ohio",
                    "Oklahoma", "Oregon", "Pennsylvania",
                    "Rhode Island", "South Carolina",
                    "South Dakota", "Tennessee", "Texas",
                    "Utah", "Vermont", "Virginia",
                    "Washington", "West Virginia", "Wisconsin",
                    "Wyoming"],
            options: mapData,
        }
    },
    mounted() {
        console.log("666666")
        this.$parent.breadArr = [
        {
            title: '设备',
            name: 'camera'
        },
        {
            title: '摄像头',
            name: 'camera'
        },
        {
            title: '摄像头',
            name: 'camera_new'
        }];
        this.$parent.level = 1;
        this.list = this.states.map(item => {
            return { value: item, label: item };
        });

        this.initMap();

        this.uid = this.$route.query.uid;
        if(this.uid) {
            this.cameraForm = {            //表单
                organ: ['beijing'],
                cameraId: '121232323244',
                cameraName: '摄像头1',
                factory: 'shanghai',
                serialNumber: '1111111111111111',
                cameraType: 'beijing',
                pixel: 'beijing',
                features: ['shanghai','beijing'],
            };
            this.InternetForm = {
                SIPNo: '13223234444',
                ipAdress: [{value: '168'}, {value: '244'}, {value: '45'}, {value: '2'}],               //ip
                importanceLevel: 'shanghai',
                lngLat: {lng: 111,lat: 111},
                location: ['zujian','form','switch'],
                address: '雀园路口39号',
                userName: '用户1',
                password: '123144',
                RTSPPort: '8081',
            };
        }
    },
    methods: {
        //tab切换
        selectTab(val) {
            this.selectIndex = val;
        },
        //提交
        submitForm(formName) {
            console.log("=======submitForm=======",this.cameraForm)
            this.$refs['cameraForm'].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        submitInternetForm(formName) {
            console.log("=======submitInternetForm=======",this.InternetForm)
            this.$refs['InternetForm'].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        // 返回
        back () {
            this.$router.back(-1);
        },
        //机构数据获取
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.organList = this.list.filter(item => {
                    return item.label.toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.organList = [];
            }
        },
        //下一步&上一步
        goToNext(val) {
            if(val === 1) {
                this.selectIndex = 1;
            }else if(val === -1) {
                this.selectIndex = 0;
            }
        },
        //input
        checkIpVal(item, index) {
            console.log("===========",item,index)
            let self = this;
            //确保每个值都处于0-255
            let val = item.value;
            //当输入的是空格时，值赋为空
            val = val.trim();
            val = parseInt(val, 10);
            if(isNaN(val)) {
                val = ''
            } else {
                val = val < 0 ? 0 : val;
                val = val > 255 ? 255 : val;
            }
            item.value = val;
        },
        setDefaultVal(item) {
            //当input失去焦点，而ip没有赋值时，会自动赋值为0
            let self = this;
            let val = item.value;
            if(val == '') {
                item.value = '0';
            }
        },
        // 初始化地图
        initMap() {
            let _this = this;
            let map = new window.AMap.Map("mapMap", {
                zoom: 18, // 级别
                resizeEnable: true,
                /* center: [112.974691, 28.093846] */ // 中心点坐标
                // viewMode: '3D' // 使用3D视图
            });
            map.plugin("AMap.Geolocation", function() {
                let geolocation = new window.AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonDom: '<input hidden="true" >',
                    buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new window.AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                _this.geolocation = geolocation;
                window.AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
                function onError(data) {
                    this.$message.error(data.message);
                }
            });

            let geocoder;
            window.AMap.service('AMap.Geocoder',function(){//回调函数
                //实例化Geocoder
                geocoder = new window.AMap.Geocoder({
                    city: "全国", //城市，默认：“全国”
                    radius: 500 //范围，默认：500
                })
                //TODO: 使用geocoder 对象完成相关功能
            })

            map.setMapStyle("amap://styles/whitesmoke");
            this.map = map;
            // 在地图中添加MouseTool插件
            let mouseTool = new window.AMap.MouseTool(map);
            _this.mouseTool = mouseTool;
            // 添加事件
            /* window.AMap.event.addListener(mouseTool, "draw", function(e) {
            // _this.drawPaths = e.obj.getPath();
            console.log("drawPaths e", e); // 获取路径/范围
            console.log("drawPaths", e.obj.getPath()); // 获取路径/范围
            setTimeout(() => {
                // _this.editForm.areaData = null;
                // _this.dialogVisible = true;
                // _this.amap.setDefaultCursor(_this.defaultCursor);
                _this.selAreaRest(true);
                let polygon = new window.AMap.Polygon({
                map: map,
                strokeColor: "#FA453A",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#FA453A",
                fillOpacity: 0.2,
                path: e.obj.getPath(),
                zIndex: 12
                });
                _this.selAreaPolygon = polygon;
                _this.selAreaAble = true;
                _this.mapMarkHandler();
            }, 100);
            }); */

            //为地图注册click事件获取鼠标点击出的经纬度坐标
            this.map.on('click', function(e) {
                console.log("e.lnglat.getLng() + ',' + e.lnglat.getLat()",e.lnglat.getLng() + ',' + e.lnglat.getLat());
                _this.$set(_this.InternetForm.lngLat,'lng',e.lnglat.getLng());
                _this.$set(_this.InternetForm.lngLat,'lat',e.lnglat.getLat());
                // 填写地址
                _this.writeAddress([e.lnglat.getLng(),e.lnglat.getLat()]);
                _this.mapsearch(e.lnglat.getLng(),e.lnglat.getLat());
            });
            let auto = new AMap.Autocomplete(map);
            window.AMap.event.addListener(auto, "select", _this.select);//注册监听，当选中某条记录时会触发
        },

        select(e) {
            if (e.poi && e.poi.location) {
                /* map.setZoom(15); */
                map.setCenter(e.poi.location);
            }
        },
        // 填写地址
        writeAddress(lnglatXY){
            let _this = this;
            let geocoder = new window.AMap.Geocoder({
                city : "全国", //城市，默认：“全国”
                radius : 1000 //范围，默认：500
            });
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    _this.geocoder_CallBack(result);
                }
            });
        },
        // 地址回调
        geocoder_CallBack(data) {
            let address = data.regeocode.formattedAddress; //返回地址描述
            this.$set(this.InternetForm,'address',address);
            let addressComponent = data.regeocode.addressComponent;
            //this.locaBackfill(addressComponent.province,addressComponent.city,addressComponent.district,addressComponent.township);
            console.log("==========",data,address)
        },
        //省市区数据回填
        /* locaBackfill(province,city,district,township) {
            let data = []
            for(let item of mapData){
                if(province == item.label) {
                    data.push(item.value)
                    if(item.children && item.children.length > 0) {
                        for(let data1 of item.children) {
                            if(city == data1.label) {
                                data.push(data1.value)
                                if(data1.children && data1.children.length > 0) {
                                    for(let data2 of data1.children) {
                                        if(district == data2.label) {
                                            data.push(data2.value)
                                            if(data2.children && data2.children.length > 0) {
                                                for(let data3 of data2.children) {
                                                    if(township == data3.label) {
                                                        data.push(data3.value)  
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }   
                    }
                }
            }
            
            console.log("----------",data)
        }, */
        getData(key,locationList) {
            for(let item of locationList){
                if(key == item.label) {
                    data.push(item.value)
                }
            }
        },
        //地图搜索
        mapsearch(lng,lat){
            this.myMapViewLocation(lng, lat);
        },
        // 回显
        myMapViewLocation(mlon, mlat){
            //console.log("回显坐标");
            if(mlon&&mlat){
                this.removeMarkers(lnglatXY);
                let lnglatXY = [mlon,mlat];
                this.addMarker(lnglatXY);
            }
        },
        addMarker(lnglatXY) {
            let hoverWindow = null;
            let _this = this;
            _this.removeAllOverlay();
            let content = '<i class="vl_icon vl_icon_gis_default"></i>';
            let marker = new window.AMap.Marker({
                    // 添加自定义点标记
                    map: _this.map,
                    position: lnglatXY,
                    offset: new window.AMap.Pixel(-23, -56),
                    // 设置是否可以拖拽
                    draggable: false,
                    // 自定义点标记覆盖物内容
                    content: content,
            });
            if(_this.t == 1) {
                console.log(lnglatXY);
                _this.map.add(marker);
                marker.setMap(_this.map);
                _this.map.setFitView();// 执行定位
                _this.t++;
            }
            
            //修改标点位置
            if(_this.t != 1){
                _this.map.add(marker);
                marker.setPosition(lnglatXY);
                _this.map.setCenter(lnglatXY);
                _this.map.setZoom(18);
                marker.setMap(_this.map);
                _this.map.setFitView();// 执行定位
            }  
            // hover
            marker.on("mouseover", function() {
              let sContent =
                '<div class="vl_map_hover vl_map_device">' +
                '<div class="vl_map_hover_main">' +
                _this.mapHoverInfo(lnglatXY[0],lnglatXY[1]) +
                "</div>";
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(54, 0), // 相对于基点的偏移位置
                content: sContent
              });
              // aCenter = mEvent.target.F.position
              hoverWindow.open(
                _this.map,
                new window.AMap.LngLat(lnglatXY[0],lnglatXY[1])
              );
              hoverWindow.on("close", function() {
                console.log("infoWindow close");
              });
            });
            marker.on("mouseout", function() {
              if (hoverWindow) {
                hoverWindow.close();
              }
            }); 
        },
        // 地图图标移入方法
        mapHoverInfo(lng, lat) {
            let str = `<ul class="device_param_list">
                <li class="param_item">
                    <p>经度：<span>${lng}</span></p>
                    <p>纬度：<span>${lat}</span></p>
                </li>
            </ul>
            `;
            return str;
        },
        removeAllOverlay(){
            // 清除地图上所有添加的覆盖物
            this.map.clearMap();
        },
        //移除之前的标点
        removeMarkers(lnglatXY){
            let marker = new window.AMap.Marker({
                map: this.map,
                position: lnglatXY,
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                offset: new window.AMap.Pixel(-13, -30)
            });
            let markers = [];
            markers.push(marker);
            this.map.remove(markers);
        },
        //详细地址查询
        markAddress(val) {
            if(val) {
                this.markLocation(this.locationName + val)
            }
        },
        //根据地址搜索
        markLocation(address) {
            let _this = this;
            _this.map.plugin('AMap.Geocoder', function() {
                let geocoder = new window.AMap.Geocoder();            
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // 经纬度                      
                        let lon = result.geocodes[0].location.lng;
                        let lat = result.geocodes[0].location.lat;
                        
                        _this.$set(_this.InternetForm.lngLat,'lng',lon);
                        _this.$set(_this.InternetForm.lngLat,'lat',lat);
                        
                        let lnglatXY = [lon, lat];
                        _this.addMarker(lnglatXY);
                    } else {
                        console.log('定位失败！');
                    }
                });
            });
        },
        //省市区
        handleChange (value) {
            this.$set(this.InternetForm,'address','');
            let labels = this.$refs['cascaderAddr'].currentLabels;
            console.log(labels,value)
            if(labels && labels.length > 0) {
                this.locationName = labels.join('');
                this.markLocation(this.locationName)
            } 
        },
        Location() {
            // 地图定位
            this.geolocation.getCurrentPosition();
        },
        mapZoomSet(val) {
            // 地图缩放
            if (this.map) {
                this.map.setZoom(this.map.getZoom() + val);
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.new-camera {
    height: calc(100% - 62px);
    padding-top: 24px;
    .new-camera-content {
        padding: 0 24px 24px;
        margin: 0 24px;
        background-color: #fff;
        //tab切换
        .tab-menu {
            height: 54px;
            line-height: 54px;
            border-bottom: 1px solid $border_c_separate;
            a {
                width: 64px;
                display: inline-block;
                margin-right: 40px;
                font-size: 16px;
                cursor: pointer;
                &:hover {
                    text-decoration: none;
                }
            }
            .is-active {
                color: $main_color;
                border-bottom: 1px solid $main_color;
            }
        }
        //联网信息样式
        .internet-info {
            display: flex;
            .new-camera-form {
                margin-top: 24px;
                margin-right: 20px;
                //IP地址样式
                .ip-adress{
                    display: flex;
                    align-items: center;
                    border: 1px solid $border_c_main;
                    width: 368px;
                    height: 40px;
                    border-radius: 4px;
                    margin-right: 10px;
                    &:hover, &:focus {
                        border-color: $main_color;
                    }
                    li {
                        position: relative;
                        &:last-child .dot {
                            display: none;
                        }
                        .el-input {
                            width: 55px;
                        }
                        .dot{
                            position: absolute;
                            bottom: 15px;
                            right: 0;
                            border-radius: 50%;
                            background: $font_c_666;
                            width: 2px;
                            height: 2px;
                        }
                    }
                }
                //经纬度地址
                .lng-lat {
                    display: flex;
                    li {
                        margin-right: 30px;
                        &:last-child {
                            margin-right: 0;
                        }
                        .lng-tip, .lat-tip {
                            margin-left: 8px;
                            color: $border_c_main;
                        }
                    }
                    
                }
            }
            //地图样式
            > .gis_content {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                flex: 1;
                height: 736px;
                overflow: hidden;
                position: relative;
                // 地图样式
                .map {
                width: 100%;
                height: 100%;
                // 地图控制板
                .map_control {
                    position: absolute;
                    bottom: 24px;
                    right: 24px;
                    z-index: 100;
                    .btn_top {
                    width: 48px;
                    height: 48px;
                    padding: 23px;
                    background: url(../../../../assets/img/sprite.png) no-repeat #fff;
                    background-position: -404px -119px;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                    border: 1px solid $border_c_main;
                    cursor: pointer;
                    @include gis_map_filter_shadow;
                    }
                    .btn_bottom {
                    width: 48px;
                    box-sizing: border-box;
                    border: 1px solid $border_c_main;
                    background: #fff;
                    @include gis_map_filter_shadow;
                    li {
                        height: 48px;
                        cursor: pointer;
                    }
                    .ad {
                        background: url(../../../../assets/img/sprite.png) no-repeat;
                        background-position: -444px -119px;
                        position: relative;
                    }
                    .ad::before {
                        content: "";
                        position: absolute;
                        width: 28px;
                        height: 1px;
                        bottom: 0px;
                        left: 8px;
                        background: $border_c_separate;
                    }
                    .re {
                        background: url(../../../../assets/img/sprite.png) no-repeat;
                        background-position: -480px -119px;
                    }
                    }
                }
                // 智能箱，摄像头状态过滤器
                .video_filter,
                .video_filter_two {
                    z-index: 10;
                    width: 605px;
                    position: absolute;
                    top: 24px;
                    left: 50%;
                    margin-left: -302px;
                    font-size: $font_size_14;
                    color: $font_c_333;
                    overflow: hidden;
                    // 左边样式
                    .filter_left {
                    @include gis_map_filter_shadow;
                    background: $gis_map_filter_back1;
                    float: left;
                    padding: 16px 24px;
                    overflow: hidden;
                    li:nth-of-type(2),
                    li:nth-of-type(3),
                    li:nth-of-type(4) {
                        width: 88px;
                        position: relative;
                    }
                    li {
                        float: left;
                        line-height: 16px;
                        height: 16px;
                        .ischecked,
                        .status,
                        .desc {
                        position: absolute;
                        }
                        .ischecked {
                        width: 16px;
                        height: 16px;
                        background: url(../../../../assets/img/sprite.png) no-repeat;
                        background-position: -342px -168px;
                        left: 16px;
                        top: 0;
                        cursor: pointer;
                        }
                        .checked {
                        background-position: -378px -168px;
                        }
                        .status {
                        width: 6px;
                        height: 6px;
                        left: 43px;
                        top: 5px;
                        border-radius: 50%;
                        }
                        .status_color1 {
                        background: $gis_map_filter_color1;
                        }
                        .status_color2 {
                        background: $gis_map_filter_color2;
                        }
                        .status_color3 {
                        background: $gis_map_filter_color3;
                        }
                        .desc {
                        top: 0px;
                        left: 59px;
                        }
                    }
                    }
                    .filter_right {
                    @include gis_map_filter_shadow;
                    width: 156px;
                    padding: 16px 24px;
                    float: left;
                    background: $gis_map_filter_back1;
                    margin-left: 10px;
                    box-sizing: border-box;
                    position: relative;
                    > div {
                        float: left;
                    }
                    .ischecked {
                        width: 16px;
                        height: 16px;
                        background: url(../../../../assets/img/sprite.png) no-repeat;
                        background-position: -342px -168px;
                        left: 16px;
                        top: 0;
                        cursor: pointer;
                    }
                    .checked {
                        background-position: -378px -168px;
                    }
                    .common_name {
                        line-height: 16px;
                        height: 16px;
                        text-indent: 6px;
                    }
                    }
                }
                .video_filter_two {
                    width: 300px;
                    margin-left: -150px;
                }
                }
            }
        }
    }
    // 工具条
    .util_bar {
      position: absolute;
      bottom: 0;
      background: $gis_del_back;
      height: 64px;
      line-height: 64px;
      width: 100%;
      z-index: 101;
      padding: 0 24px;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
      .el-button {
        width: 100px;
      }
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
}
</style>

<style lang="scss">
/* 表单样式 */
.new-from-comp {
    .new-camera-form {
        margin-top: 24px;
        .el-form-item {
            margin-bottom: 24px;
        }
        .el-input {
            width: 368px;
        }
    }
    .ip-adress {
        .el-input__inner {
            border: none;
            height: 38px;
            text-align: center;
        }
    }
    .lng-lat {
        .el-input {
            display: inline-block;
            width: 120px;
        }
    }
}
</style>



