<template>
  <div>
    <div class="control_manage_d" v-if="!isShowVideoRelay">
      <!-- 面包屑 -->
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>布控</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="skip(1)" class="con_back">布控管理</el-breadcrumb-item>
          <el-breadcrumb-item>布控详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 详情 -->
      <div class="manage_d_box">
        <div class="manage_d_title">
          <div class="vl_f_16 vl_f_333">基本信息</div>
          <div class="vl_f_12 vl_f_666">创建于{{controlDetail.createTime}} ；更新于{{controlDetail.updateTime}}</div>
        </div>
        <div class="manage_d_content" :style="{'margin-bottom': controlState === 2 ? '80px' : '20px'}">
          <!-- 布控信息 -->
          <ul>
            <li style="width: 34%;">
              <div><span class="vl_f_666">布控名称：</span><span class="vl_f_333">{{controlDetail.surveillanceName}}</span></div>
              <div><span class="vl_f_666">有效期限：</span><span class="vl_f_333">{{controlDetail.surveillanceDateStart}} 至 {{controlDetail.surveillanceDateEnd}}</span></div>
              <div>
                <span class="vl_f_666">短信联动：</span>
                <template v-if="controlDetail.contactList.length > 0">
                  <span class="vl_f_333" v-for="(item, index) in controlDetail.contactList" :key="index">{{item.contact}}&nbsp;&nbsp;{{item.mobile}}<span v-if="index + 1 < controlDetail.contactList.length">&nbsp;&nbsp;|&nbsp;&nbsp;</span></span>
                </template>
                <span v-else>无</span>
              </div>
            </li>
            <li style="width: 34%;">
              <div><span class="vl_f_666">关联事件：</span><span class="vl_f_333">{{controlDetail.eventCode || '无'}}</span></div>
              <div class="control_time"><span class="vl_f_666">布控时间段：</span><span class="vl_f_333">{{controlDetail.time}}</span></div>
            </li>
            <li style="width: 34%;">
              <div><span class="vl_f_666">告警级别：</span><span class="vl_f_333" v-if="controlDetail.alarmLevel">{{controlDetail.alarmLevel}}</span></div>
            </li>
          </ul>
          <ul style="padding-top: 14px;">
            <li style="width: 34%;"><span class="vl_f_666">是否级联：</span><span class="vl_f_333">{{controlDetail.cascadePlatform ? '是' : '无'}}</span></li>
            <li style="width: 34%;" v-if="controlDetail.cascadePlatform"><span class="vl_f_666">级联对象：</span><span class="vl_f_333">{{controlDetail.cascadePlatform}}</span></li>
          </ul>
          <ul>
            <li style="width: 34%;"><div><span class="vl_f_666">共享布控：</span><span class="vl_f_333">{{controlDetail.shareDept ? '是' : '无'}}</span></div></li>
            <li style="width: 34%;" v-if="controlDetail.shareDept"><div><span class="vl_f_666">共享对象：</span><span class="vl_f_333">{{controlDetail.shareDept}}</span></div></li>
          </ul>
          <ul>
            <li><div><span class="vl_f_666">布控原因：</span><span class="vl_f_333">{{controlDetail.surveillanceReason || '无'}}</span></div></li>
          </ul>
          <div :class="['vl_icon con_state', controlState === 2 ? 'vl_control_s' : controlState === 1 ? 'vl_control_o' : 'vl_control_e']"></div>
          <h1>分析模型：</h1>
          <div class="manage_model">
            <div class="model_name" @click="dpOne = !dpOne">
              <div>{{transcoding(controlDetail.modelType)}}</div>
              <i class="el-icon-arrow-up" v-show="dpOne"></i>
              <i class="el-icon-arrow-down" v-show="!dpOne"></i>
            </div>
            <el-collapse-transition>
              <div v-show="dpOne">
                <ul class="model_info" v-if="controlDetail.modelType === 1">
                  <li>失踪人员信息：</li>
                  <li>
                    <span>人脸照片：</span><img class="bigImg" :src="controlDetail.missingUrl" alt="">
                  </li>
                  <li><span>人员姓名：</span><span>{{controlDetail.name}}</span></li>
                  <li><span>人员性别：</span><span>{{controlDetail.sex}}</span></li>
                  <li><span>失踪时间：</span><span>{{controlDetail.lostTime}}</span></li>
                  <li><span>失踪地址：</span><span>{{controlDetail.lostAddress}}</span></li>
                  <li><span>家庭地址：</span><span>{{controlDetail.homeAddress || '无'}}</span></li>
                
                  <li class="img_list">
                    <span style="padding-left: 0;">嫌疑人照片：</span>
                    <div v-if="getBigImgList().length > 0">
                      <img v-for="(item, index) in getBigImgList()" :key="index" class="bigImg" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                  <li>
                    <span>嫌疑车辆：</span>
                    <template v-if="filterObj(controlDetail.objectList, 2, 4).length > 0">
                      <template v-for="(item, index) in filterObj(controlDetail.objectList, 2, 4)">
                        <span style="flex: none;" :key="index">{{item.name}}<span v-if="index < filterObj(controlDetail.objectList, 2, 4).length - 1">&nbsp;|&nbsp;</span></span>
                      </template>
                    </template>
                    <span v-else>无</span>
                  </li>
                </ul>
                <ul class="model_info" v-if="controlDetail.modelType === 2">
                  <li>布防信息：</li>
                  <li><span>布防地址：</span><span>{{controlDetail.address}}</span></li>
                  <li><span>布防范围：</span><span>{{controlDetail.radius}}千米</span></li>
                  <li>
                    <span>禁入人员：</span>
                    <div v-if="filterObj(controlDetail.objectList, 1).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 1)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                  <li>
                    <span>禁入车辆：</span>
                    <div v-if="filterObj(controlDetail.objectList, 2).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 2)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                </ul>
                <ul class="model_info" v-if="controlDetail.modelType === 3">
                  <li>
                    <span>上访人员照片：</span>
                    <div v-if="filterObj(controlDetail.objectList, 1, 3).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 1, 3)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                  <li>
                    <span>上访车辆：</span>
                    <template v-if="filterObj(controlDetail.objectList, 2, 4).length > 0">
                      <template v-for="(item, index) in filterObj(controlDetail.objectList, 2, 4)">
                        <span style="flex: none;" :key="index">{{item.name}}<span v-if="index < filterObj(controlDetail.objectList, 2, 4).length - 1">&nbsp;|&nbsp;</span></span>
                      </template>
                    </template>
                    <span v-else>无</span>
                  </li>
                </ul>
                <ul class="model_info" v-if="controlDetail.modelType === 4">
                  <li>
                    <span>禁入人员：</span>
                    <div v-if="filterObj(controlDetail.objectList, 1).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 1)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                  <li>
                    <span>禁入车辆：</span>
                    <div v-if="filterObj(controlDetail.objectList, 2).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 2)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                </ul>
                <ul class="model_info" v-if="controlDetail.modelType === 5">
                  <li>
                    <span>布防场所：</span><span>{{controlDetail.locations && controlDetail.locations.join(',')}}</span>
                  </li>
                  <li>
                    <span>停留时长：</span><span>{{controlDetail.stayTime}}分钟</span>
                  </li>
                  <li>
                    <span>布控车辆：</span>
                    <div>
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 2)" :key="index" :src="item.path" alt="">
                    </div>
                  </li>
                </ul>
                <ul class="model_info" v-if="controlDetail.modelType === 9">
                  <li>
                    <span>布控人员信息：</span>
                    <div v-if="filterObj(controlDetail.objectList, 1, 3).length > 0">
                      <img class="bigImg" v-for="(item, index) in filterObj(controlDetail.objectList, 1, 3)" :key="index" :src="item.path" alt="">
                    </div>
                    <div v-else>无</div>
                  </li>
                  <li>
                    <span>布控车辆：</span>
                    <template v-if="filterObj(controlDetail.objectList, 2, 4).length > 0">
                      <template v-for="(item, index) in filterObj(controlDetail.objectList, 2, 4)">
                        <span style="flex: none;" :key="index">{{item.name}}<span v-if="index < filterObj(controlDetail.objectList, 2, 4).length - 1">&nbsp;|&nbsp;</span></span>
                      </template>
                    </template>
                    <span v-else>无</span>
                  </li>
                </ul>
                <!-- 布控设备 -->
                <div class="dev_box">
                  <div class="tab">
                    <span>布控设备</span>
                  </div>
                  <div class="sel_dev">
                    <div class="title">
                      <span>已选设备（{{devNum + bayonetNum}}）</span>
                      <i class="el-icon-arrow-up" v-show="isShowTree" @click="isShowTree = false"></i>
                      <i class="el-icon-arrow-down" v-show="!isShowTree" @click="isShowTree = true"></i>
                    </div>
                    <div :class="{'active': isShowTree}">
                      <div class="sel_tab">
                        <div @click="bayOrdev = 1" :class="{'active': bayOrdev === 1}">摄像头</div>
                        <div @click="bayOrdev = 2" :class="{'active': bayOrdev === 2}">卡口</div>
                      </div>
                      <vue-scroll style="height: 352px;">
                        <div class="tree_box">
                          <el-tree
                            v-show="bayOrdev === 1"
                            ref="to-tree1" 
                            icon-class="el-icon-arrow-right"
                            :data="toLeftDevList"
                            :node-key="node_key"
                            :props="defaultProps"
                          >
                          </el-tree>
                          <el-tree
                            v-show="bayOrdev === 2"
                            ref="to-tree2" 
                            icon-class="el-icon-arrow-right"
                            :data="toLeftBayList"
                            :node-key="node_key"
                            :props="defaultProps"
                          >
                          </el-tree>
                        </div>
                      </vue-scroll>
                    </div>
                  </div>
                  <div class="dev_map" id="devMap"></div>
                  <div class="map_zoom">
                    <div class="top"><i class="el-icon-aim" @click="resetZoom()"></i></div>
                    <ul class="bottom">
                      <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                      <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 运行情况 -->
        <div class="manage_d_c_situ" v-if="controlState !== 2">
          <div class="situ_title">运行情况</div>
          <div class="situ_time">
            <div><span>开始时间：</span><span>{{controlDetail.runningStartTime}}</span></div>
            <div v-if="controlState === 3"><span>结束时间：</span><span>{{controlDetail.runningEndTime}}</span></div>
            <div><span>持续时间：</span><span>{{controlDetail.duration}}</span></div>
            <div v-if="controlDetail.terminationReason" class="termination_reason"><span>终止原因：</span><span>{{controlDetail.terminationReason}}</span></div>
          </div>
          <div class="situ_box" v-if="controlState === 1">
            <div class="situ_top" @click="controlArea(2)">
              <div>实时监控</div>
              <i class="el-icon-arrow-down" v-show="!dpTwo"></i>
              <i class="el-icon-arrow-up" v-show="dpTwo"></i>
            </div>
            <el-collapse-transition>
              <div class="situ_content" v-show="dpTwo">
                  <div class="situ_left">
                    <div style="padding-left: 20px;">布控设备</div>
                    <div class="equ_m">
                      <div @click="tabTypeBySituation = '0'" :class="{'active': tabTypeBySituation === '0'}">摄像头（{{devNum}}）</div>
                      <div @click="tabTypeBySituation = '1'" :class="{'active': tabTypeBySituation === '1'}">卡口（{{bayonetNum}}）</div>
                    </div>
                    <!-- 摄像头 -->
                    <el-collapse-transition>
                      <ul v-if="tabTypeBySituation === '0' && situList.length > 0">
                        <vue-scroll>
                          <li
                            v-for="(item, index) in situList"
                            :key="item.uid"
                            @dragstart="dragstart($event, index, item)"
                            @dragover="dragover"
                            :draggable="true"
                          >
                            <span :title="item.deviceName">{{item.deviceName | strCutWithLen(25)}}</span><i class="vl_icon vl_icon_control_05"></i>
                          </li>
                        </vue-scroll>
                      </ul>
                      <ul v-if="tabTypeBySituation === '0' && situList.length === 0">
                        <li>范围内无设备</li>
                      </ul>
                    </el-collapse-transition>
                    <!-- 卡口 -->
                    <el-collapse-transition>
                      <div v-if="tabTypeBySituation === '1' && bayList.length > 0" class="bayone_list">
                        <vue-scroll>
                          <div v-for="bay in bayList" :key="bay.uid">
                            <div class="bayone_name" :class="{'active': bay.isDropdown}" @click="dropdownBay(bay)">
                              <i class="el-icon-arrow-down" v-show="bay.isDropdown"></i><i class="el-icon-arrow-right" v-show="!bay.isDropdown"></i><span :title="bay.bayonetName">{{bay.bayonetName | strCutWithLen(25)}}</span>
                            </div>
                            <el-collapse-transition>
                              <ul style="max-height: 346px;" v-if="bay.isDropdown && bay.devList.length > 0">
                                <li
                                  v-for="(dev, index) in bay.devList"
                                  :key="dev.uid"
                                  @dragstart="dragstart($event, index, dev)"
                                  @dragover="dragover"
                                  :draggable="true"
                                >
                                  <span :title="dev.deviceName">{{dev.deviceName | strCutWithLen(25)}}</span><i class="vl_icon vl_icon_control_05"></i>
                                </li>
                              </ul>
                              <ul v-if="bay.isDropdown && bay.devList.length === 0">
                                <li>卡口内无设备</li>
                              </ul>
                            </el-collapse-transition>
                          </div>
                        </vue-scroll>
                      </div>
                      <div v-if="tabTypeBySituation === '1' && bayList.length === 0" class="bayone_list">
                        <ul>
                          <li>范围内无卡口</li>
                        </ul>
                      </div>
                    </el-collapse-transition>
                  </div>
                <div class="situ_right">
                  <div class="situ_r_video" v-for="(item, index) in rightVideoList" :key="item.uid"
                    @dragend="dragend"
                    @dragover="dragover"
                    @drop="drop($event, index)"
                    >
                    <div class="situ_r_box" v-if="!item.isShowVideo">
                      <img src="../../../../../assets/img/video/vi_101.png" alt="">
                      <div>拖拽设备列表图标至此</div>
                    </div>
                    <div v-if="item.isShowVideo" is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :bResize="bResize"
                      :oConfig="{sign: true}">
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 布控结果 -->
        <div class="manage_d_c_result" v-if="controlState !== 2 ">
          <div class="result_title">
            <div>布控结果（{{controlResList && controlResList.total}}个）</div>
            <div>
              <el-date-picker
                style="width: 230px;margin: 6px 10px 0 0;"
                @change="getAlarmSnap"
                placeholder="请选择起止时间"
                v-model="controlTimeIsKey"
                type="daterange"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-select
                class="select_box"
                value-key="value"
                v-model="devNameIsKey"
                filterable
                remote
                placeholder="请输入设备名搜索"
                size="small"
                clearable
                @clear="devListIsKey = []"
                @change="getAlarmSnap"
                :remote-method="getControlDevice"
                :loading="loading">
                <el-option
                  v-for="item in devListIsKey"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="result_content_box" v-if="controlResList">
            <div class="result_content">
              <div>
                <h1>布控对象列表</h1>
                <vue-scroll>
                  <ul>
                    <li class="img" :class="{'active': controlObjId === 1}" v-show="false">
                      <div>
                        <img src="" alt="">
                      </div>
                    </li>
                    <li class="plate" :class="{'active': controlObjId === 1}" v-for="item in '123456'" :key="item.uid">
                      <div>
                        <h1>车牌号码</h1>
                        <span>湘N12485</span>
                      </div>
                    </li>
                  </ul>
                </vue-scroll>
              </div>
              <div>
                <div class="result_img_box" v-for="(item, index) in controlResList.list" :key="index">
                  <div @mouseenter="item.curVideoTool = true;" @mouseleave="item.curVideoTool = false;">
                    <img :src="item.path" alt="" v-show="!item.isShowCurImg" class="bigImg">
                    <video  v-show="item.isShowCurImg" :id='"controlResult" + index' :src="item.snapVideo" style="object-fit: fill;" width="100%" height="239px" @click="showLargeVideo(item, 1)"></video>
                    <div class="result_tool" v-show="item.curVideoTool">
                      <div>{{item.deviceName}}</div>
                      <div>
                        <i class="vl_icon vl_icon_judge_01" v-if="item.curVideoPlay" @click="pauseVideo(item, index)"></i>
                        <i class="vl_icon vl_icon_control_09" v-else @click="playVideo(item, index)"></i>
                        <a download="视频" :href="item.snapVideo" class="el-icon-download download"></a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p><i class="vl_icon vl_icon_control_26" style="margin-top: -4px;"></i><span class="vl_f_333">疑似目标：{{item.objName}}</span></p>
                    <p><i class="vl_icon vl_icon_control_27" style="margin-top: -4px;"></i><span class="vl_f_999">{{item.snapTime}}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="pagination_box">
              <div>
                <el-button type="primary" style="width: 124px;padding-left: 6px;">查看全部布控结果</el-button>
                <el-button class="btn_100" type="primary" @click="checkVideoRelay">视频接力</el-button>
              </div>
              <el-pagination
                class="cum_pagination"
                style="align-self: flex-start;padding-top: 0;"
                @current-change="handleCurrentChangeRes"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="controlResList.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="controlResList.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
        <video id="controlResultLarge" style="object-fit: fill;" :src="videoObj.snapVideo"></video>
        <div @click="closeLargeVideo" class="close_btn el-icon-error"></div>
        <div class="control_bottom">
          <div>{{videoObj.deviceName}}</div>
          <div>
            <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="largeVideoPlay"></span>
            <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
            <span><a download="视频" :href="videoObj.snapVideo" class="el-icon-download"></a></span>
            <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
          </div>
        </div>
      </div>
      <div style="width: 0; height: 0;" v-show="showCut"  :class="{vl_j_cutscreen: showCut}">
        <img :src="demoImg" alt="">
        <i @click="showCut = false" class="close_btn el-icon-error"></i>
        <a download="截图" :href="demoImg" id="controlResultCutImg" ></a>
      </div>
      <!-- 底部操作按钮 -->
      <!-- 待开始 -->
      <div class="manage_f_box" v-if="controlState === 2">
        <el-button class="btn_100" type="primary" @click="skip(3)">编辑</el-button>
        <el-button class="btn_100" @click="showDialog('delDialog')">删除</el-button>
      </div>
      <!-- 进行中 -->
      <div class="manage_f_box" v-if="controlState === 1">
        <el-button class="btn_100" type="primary" @click="showDialog('stopDialog')">终止</el-button>
      </div>
      <!-- 已结束 -->
      <div class="manage_f_box" v-if="controlState === 3">
        <el-button class="btn_100" type="primary" @click="skipIsCreate">复用</el-button>
        <el-button class="btn_100" @click="showDialog('delDialog')">删除</el-button>
      </div>
      <div is="delDialog" ref="delDialog" :controlId="controlId" @getControlList="getControlList"></div>
      <div is="stopDialog" ref="stopDialog" :controlId="controlId" @getControlList="getControlList"></div>
    </div>
    <!-- 视频接力 -->
    <div is="flvplayer" class="video_relay" v-if="isShowVideoRelay" @playerClose="playerCloseRelay" :oData="videoRelayObj" 
        :oConfig="{fit: false, sign: false, tape: false, download: false}"></div>
  </div>
</template>
<script>
import {unique, addCluster} from '@/utils/util.js';
import delDialog from './delDialog.vue';
import stopDialog from './stopDialog.vue';
import {dataList} from '@/utils/data.js';
import {conDetail} from '../testData.js';
import flvplayer from '@/components/common/flvplayer.vue';
import {getControlDetail, getControlObjList, controlArea, getControlDevice, getAlarmSnap} from '@/views/index/api/api.control.js';
// import {getEventDetail} from '@/views/index/api/api.event.js';
import {getAllMonitorList, getAllBayonetList} from '@/views/index/api/api.base.js';
import {selectVideoContinue} from '@/views/index/api/api.judge.js'
import {mapXupuxian} from '@/config/config.js';
export default {
  components: {delDialog, stopDialog, flvplayer},
  props: ['controlId'],
  data () {
    return {
      controlState: null,//布控详情状态
      controlDetail: conDetail,//布控详情
      // eventDetail: null,//事件详情
      eventVideoTool: false,
      // 地图参数
      map: null,
      zoomLevel: 10,
      // 布控设备参数
      devNum: null,//摄像头数量
      bayonetNum: null,//卡口数量
      devList: [], //设备列表
      tabTypeBySituation : '0',// 设备类型-运行情况
      dpOne: true,//展开布控范围
      dpTwo: false,//展开实时监控

      isShowTree: false,
      bayOrdev: 1,
      toLeftDevList: [],
      toLeftBayList: [],
      node_key: 'uid',
      defaultProps: { label: 'name', children: 'areaTreeList' },
      markerList: [],

      // 翻页数据
      currentPage: 1,
      pageSizeObj: 18,
      pageNumObj: 1,
      pageSizeRes: 8,
      pageNumObjRes: 1,
      
      bResize: {},
      situList: [],// 实时监控设备列表
      bayList: [],// 实时监控卡口列表
      // rVList: [{},{},{},{}],//用于操作的右边视频列表
      rightVideoList: [
        {isShowVideo: false}, 
        {isShowVideo: false}, 
        {isShowVideo: false}, 
        {isShowVideo: false}
      ],//右边已拖过去的视频,默认展示4个
      dragstartIndex: null,//左边列表下标
      eventDetailDialog: false,//事件详情弹窗
      lastIndex: null,
      dragActiveObj: null,
      // 布控结果筛选参数
      controlTimeIsKey: null,//布控时间
      devListIsKey: null,//设备列表
      devNameIsKey: null,//设备名称
      // 布控结果视频参数
      loading: false,
      controlResList: null,//布控抓拍结果列表
      showLarge: false,
      showCut: false,
      demoImg: null,
      largeVideoPlay: false,
      videoObj: {},
      curVideoUrl: null,
      dataList_: dataList,
      // 2.0参数
      controlObjId: null,//当前点击的布控对象id
      isShowVideoRelay: false,
      videoRelayObj: {},
      relayList: []
    }
  },
  mounted () {
    this.getControlDetail();
  },
  methods: {
    getRelayList () {
      let params = {
        beginTime: "2019-11-05 00:00:00",
        endTime: "2019-11-07 23:59:59",
        isFinished: 0,
        type: "0"
      }
      selectVideoContinue(params).then((res) => {
        if (res && res.data) {
          this.relayList = res.data;
          this.isShowVideoRelay = true;
          this.videoRelayObj = {
            type: 5,
            title: ' ',
            record: false,
            video: Object.assign({}, this.relayList[0])
          }
          // 播放中的视频处理
          // this.relayPlayingHandler();
        }
      }).catch((() => {

      }));
    },
    // 查看视频接力
    checkVideoRelay () {
      this.getRelayList();
      
    },
    // 关闭视频接力
    playerCloseRelay (iIndex, oData) {
      // console.log(iIndex);
      // console.log(oData);
      this.$confirm('确定结束该接力任务吗?', '提示', {  
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isShowVideoRelay = false;
        // this.videoList.splice(iIndex, 1, {});
        // this.relayModify(oData.video.uid, oData.video.type, 1, 1);
      }).catch(() => {
        this.isShowVideoRelay = false;
        // this.videoList.splice(iIndex, 1, {});
      });
    },
    // 获取嫌疑人像列表
    getBigImgList () {
      return this.controlDetail.objectList.filter(f => f.photoUrl !== this.controlDetail.missingUrl && (f.type === 1 || f.type === 3)).map(m => {return {path: m.photoUrl}}) || [];
    },
    // 过滤布控对象类型
    filterObj(list, type, _type) {
      return list.filter(f => f.type === type || f.type === _type).map(m => {return {path: m.photoUrl, name: m.name}}) || [];
    },
    // 布控模型类型名称转码
    transcoding (type) {
      const obj = {
        1: '人员失踪',
        2: '重大活动布防',
        3: '上访人员拦截',
        4: '重点区域布防',
        5: '公务车辆监管',
        6: '自定义'
      }
      return obj[type];
    },
    /* ************布控结果********* */
    // 停止播放
    pauseVideo (item, index) {
      item.curVideoPlay = false;
      document.getElementById('controlResult' + index).pause();
    } ,
    // 开始播放
    playVideo (item, index) {
      item.curVideoPlay = true;
      for (let f of this.controlResList.list) {
        if (item.uid === f.uid && !f.isShowCurImg) {
          f.isShowCurImg = true;
          break;
        }
      }
      document.getElementById('controlResult' + index).play();
    },
    // 开始播放
    _playVideo (item) {
      item.curVideoPlay = true;
      document.getElementById('eventVideo').play();
    },
    // 停止播放
    _pauseVideo (item) {
      item.curVideoPlay = false;
      document.getElementById('eventVideo').pause();
    } ,
    // 显示大屏
    showLargeVideo (item, type) {
      this.videoObj = {};
      if (type === 1) {
        this.videoObj = item;
      } else {
        const {path} = item;
        this.videoObj.snapVideo = path;
        this.videoObj.curVideoPlay = false;
      }
      this.showLarge = true;
      this.playLargeVideo();
    },
    // 关闭大屏
    closeLargeVideo () {
      this.showLarge = false;
      this.pauseLargeVideo();
    },
    // 大屏播放
    playLargeVideo () {
      this.largeVideoPlay = true;
      this.$nextTick(() => {
        document.getElementById('controlResultLarge').play();
      })
    },
    // 停止大屏播放
    pauseLargeVideo () {
      this.largeVideoPlay = false;
      document.getElementById('controlResultLarge').pause();
    },
    // 截屏
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('controlResultLarge'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('controlResultCutImg').click();
      }, 200)
    },
    skip (type) {
      this.$emit('changePageType', type);
    },
    // 跳转至新建布控页-复用
    skipIsCreate () {
      this.$router.push({ name: 'control_create', query: {controlId: this.controlId, createType: 3} });
    },
      // 显示弹出框
      showDialog (formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].reset();
        }
      },
    getControlList () {
      this.$emit('getControlList');
    },
    // 获取布控详情
    getControlDetail () {
      getControlDetail(this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail = res.data;
          this.controlState = this.controlDetail.surveillanceStatus === '待开始' ? 2 : this.controlDetail.surveillanceStatus === '进行中' ? 1 : 3;
          this.$nextTick(() => {
            this.resetMap();
            this.getDevAndBayList();
          })
          if (this.controlState !== 2) {
            this.getAlarmSnap();
          }
        }
      })
    },
    // 获取事件详情
    // getEventDetail () {
    //   this.eventDetailDialog = true;
    //   getEventDetail(this.controlDetail.eventId).then(res => {
    //     if (res && res.data) {
    //       this.eventDetail = res.data;
    //     }
    //   })
    // },
    // 设置marker的显示图标
    setMarkContent (obj, operate) {
      let sDataType, uContent;
      if (obj.dataType === 1 && obj.deviceStatus !== 1) {
        sDataType = 6;
      } else if (obj.dataType === 2 && !obj.isEnabled) {
        sDataType = 9
      } else {
        sDataType = obj.dataType === 1 ? 0 : 1;
      }
      uContent = '<div id="' + obj.uid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
      if (operate === 'change') {
        sDataType = obj.dataType === 1 ? 0 : 1;
        let sClass = 'vl_icon_map_sxt_in_area' + sDataType;
        uContent = '<div id="' + obj.uid + '" class="map_icons vl_icon ' + sClass +'"></div>';
      }
      return uContent;
    },
    // 改造数据成树结构公共方法
    getTreeData (data, type) {
      const hash = {};
      data.forEach(f => {
        if (!hash[f.areaName]) {
          hash[f.areaName] = [];
          hash[f.areaName].push(f);
        } else {
          hash[f.areaName].push(f);
        }
      })
      const areaList = [];
      for (let key in hash) {
        areaList.push({name: key, uid: hash[key][0].areaUid, areaUid: 1, areaTreeList: hash[key]});
      }
      if (type === 1) {
        this.toLeftDevList = areaList;
      } else {
        this.toLeftBayList = areaList;
      }
    },
    // 新增或编辑时，点标记变色和变为树结构数据公共方法
    changeColorAndGetTreeData (array, type) {
      let list = [];
      this.markerList.forEach(f => {
        const obj = f.getExtData();
        if (array.some(s => s === obj.uid && obj.dataType === type)) {
          list.push(obj);
          const uContent = this.setMarkContent(obj, 'change')
          f.setContent(uContent);
        }
      })
      this.getTreeData(list, type);
    },
    // 获取布控范围和运行情况，因为是同一接口，所以写在了一起
    controlArea (isShowType) {
      // 展开关闭运行情况
      isShowType === 2 && (this.dpTwo = !this.dpTwo);
      if (this.dpOne || this.dpTwo) {
        controlArea(this.controlId).then(res => {
          if (res && res.data) {
            this.devNum = res.data.devNum;
            this.bayonetNum = res.data.bayonetNum;
            const trackingPointList = res.data.trackingPointList;
            // 布控范围
            if (isShowType === 1) {
              let _devList = []
              trackingPointList.forEach(f => {
                f.devList && _devList.push(...f.devList.map(m => m.uid));
              })
              let _bayList = []
              trackingPointList.forEach(f => {
                f.bayonetList && _bayList.push(...f.bayonetList.map(m => m.uid));
              })
              this.changeColorAndGetTreeData(_devList, 1);
              this.changeColorAndGetTreeData(_bayList, 2);
            // 运行情况
            } else {
              // 组装摄像头列表数据
              let devList = [];
              trackingPointList.forEach(f => {
                if (f.devList) {
                  devList = devList.concat(f.devList);
                }
              })
              this.situList = unique(devList, 'uid');//去重
              // 组装卡口列表数据
              let bayList = [];
              trackingPointList.forEach(f => {
                if (f.bayonetList) {
                  bayList = bayList.concat(f.bayonetList);
                }
              })
              this.bayList = bayList;
              this.bayList.forEach(f => {
                this.$set(f, 'isDropdown', false);
              })
            }
           
          }
          
        })
      }
    },
    dropdownBay (data) {
      this.bayList.forEach(f => {
        if (f.uid === data.uid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
      })
    },
    // 布控对象列表分页查询
    getControlObjList () {
      const params = {
        pageNum: this.pageNumObj,
        pageSize: this.pageSizeObj,
        orderBy: null,
        order: null
      }
      getControlObjList(params, this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail.objectList = res.data.list;
        }
      })
    },
    // 布控对象列表分页
    handleCurrentChangeObj (page) {
      this.pageNumObj = page;
      this.getControlObjList();
    },
    // 获取所有布控设备
    getControlDevice (query) {
      const _query = this.Trim(query, 'g');
      if (_query) {
        const params = {
          name: _query,
          uid: this.controlId
        }
        getControlDevice(params).then(res => {
          if (res && res.data) {
            this.devListIsKey = res.data.map(m => {
              return {
                value: m.uid,
                label: m.name
              }
            });
          }
        })
      }
    },
    // 获取布控抓拍结果列表
    getAlarmSnap () {
      let params = {
        pageNum: this.pageNumObjRes,
        pageSize: this.pageSizeRes,
        'where.surveillanceId': this.controlId,
        'where.dateStart': this.controlTimeIsKey && this.controlTimeIsKey[0],
        'where.dateEnd': this.controlTimeIsKey && this.controlTimeIsKey[1]
      }
      this.devNameIsKey && (params['where.deviceName'] = this.devNameIsKey);
      getAlarmSnap(params).then(res => {
        if (res && res.data) {
          this.controlResList = res.data;
          this.controlResList.list.forEach(f => {
            this.$set(f, 'curVideoPlay', false);
            this.$set(f, 'curVideoTool', false);
            this.$set(f, 'isShowCurImg', false);
            f.path = f.snapPhoto;
            delete f.snapPhoto;
          })
        }
      })
    },
    // 布控结果列表分页
    handleCurrentChangeRes (page) {
      this.pageNumObjRes = page;
      this.getAlarmSnap();
    },
    /* ************运行情况********* */
    // 关闭播放器
    playerClose (index) {
      this.rightVideoList.splice(index, 1, {isShowVideo: false});
    },
    // 拖拽
    dragstart (e, index, item) {
      this.dragstartIndex = index;
      this.dragActiveObj = item;
       // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!e) { e = window.event; }
      e.dataTransfer.setData('name', 'ouyang');
    },
  
    dragend () {
      this.dragActiveObj = null;
    },
    dragover (e) {
      // 阻止默认动作
      e.preventDefault();
    },
    drop (e, index) {
      // 阻止默认动作（如打开一些元素的链接）
      e.preventDefault();
      e.stopPropagation();
      if (this.dragActiveObj) {
        this.rightVideoList.splice(index, 1, {
          isShowVideo: true,
          type: 1,
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj)
        });
      }
    }, 
    // 获取地图上的设备和卡口数据
    getDevAndBayList () {
      Promise.all([getAllMonitorList({ccode: mapXupuxian.adcode}), 
        getAllBayonetList({areaId: mapXupuxian.adcode})])
        .then(res => {
          if (res) {
            const [{data: devList}, {data: bayList}] = res;
            devList.forEach(f => {f.dataType = 1;f.name = f.deviceName})
            bayList.forEach(f => {f.dataType = 2;f.name = f.bayonetName})
            this.mapMark(devList, bayList);
          }
        })
    },
    mapMark (devs, bays) {
      const data = [...devs, ...bays];
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -70];
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: this.setMarkContent(obj)
          });
          // mouseover
          marker.on('mouseover', () => {
            let _hoverWindow = null;
            let _sContent = `<div class="vl_map_hover">
              <div class="vl_map_hover_main"><ul>`;
              if (obj.dataType === 1) {
                _sContent += `<li><span>设备名称：</span><span>${obj.deviceName}</span></li>
                <li><span>设备地址：</span><span>${obj.address}</span></li>`;
              } else {
                _sContent += `<li><span>卡口名称：</span><span>${obj.bayonetName}</span></li>
                <li><span>卡口编号：</span><span>${obj.bayonetNo}</span></li>
                <li><span>地理位置：</span><span>${obj.bayonetAddress}</span></li>
                <li><span>设备数量：</span><span>${obj.devNum}</span></li>`;
              }
              _sContent += '</ul></div>';
            _hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, -20), // 相对于基点的偏移位置
              content: _sContent
            });
            _hoverWindow.open(this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          });
          this.markerList.push(marker);
        }
      }
      this.map.setFitView();
      addCluster(this.map, this.markerList);
      this.controlArea(1);//回填已选设备

      // 把地图定位到已选设备位置
      if (bays.length > 0) {
        this.positionMap(bays);
      } else if (devs.length > 0) {
        this.positionMap(devs);
      }
    },
    // 把地图定位到已选设备位置
    positionMap (array) {
      for (let item of this.markerList) {
        const obj = item.getExtData();
        let key = null;
        array[0].hasOwnProperty('uid') && (key = 'uid');
        array[0].hasOwnProperty('deviceId') && (key = 'deviceId');
        array[0].hasOwnProperty('bayonetId') && (key = 'bayonetId');
        if (array.some(s => s[key] === obj.uid)) {
          this.setViewingArea(item.getPosition());
          break;
        }
      }
    },
    // 把地图的可视区域设置在选中设备或卡口的区域
    setViewingArea (obj) {
      this.map.setZoomAndCenter(14, obj);
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoom(this.zoomLevel);
      }
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 初始化地图
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('devMap', {
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/light');
      _this.map = map;
    }
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy();
    }
  }
}
</script>
<style lang="scss" scoped>
.control_manage_d{
  width: 100%;
  min-height: 100vh;
  position: absolute;
  animation: fadeIn .4s ease-out both;
  .manage_d_box{
    width: calc(100% - 40px);
    // min-height: 783px;
    margin-left: 20px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .manage_d_title{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      line-height: 50px;
      background: #fff;
    }
    .manage_d_content{
      padding-left: 20px;
      padding-bottom: 20px;
      border-top: 1px solid #F2F2F2;
      background: #fff;
      position: relative;
      > ul{
        display: flex;
        flex-wrap: nowrap;
        li{
          width: 28%;
          div{
            margin-top: 15px;
          }
          .control_time{
            display: flex;
            > span:nth-child(2){
              flex: 1;
            }
          }
        }
      }
      .manage_d_c_e{
        display: flex;
        flex-wrap: nowrap;
        margin-top: 15px;
        line-height: 20px;
        div:nth-child(2){
          flex: 0 0 58%;
          padding-right: 120px;
          word-break: break-all;
          span{
            white-space: nowrap;
            color: #0C70F8;
            cursor: pointer;
          }
        }
      }
      .manage_d_c_o{
        margin-right: 20px;
        margin-top: 30px;
        border:1px solid rgba(242,242,242,1);
        border-radius:4px 4px 0px 0px;
        >div:nth-child(1){
          height:44px;
          line-height: 44px;
          padding-left: 20px;
          padding-top: 10px;
          background:rgba(250,250,250,1);
          border-radius:4px 4px 0px 0px;
        }
        >div:nth-child(2){
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          padding: 0 0.5% 20px 0.5%;
          .manage_d_c_o_i{
            height: 200px;
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
            flex: 0 0 162px;
            margin: 0 0.5%;
            margin-top: 15px;
            > p{
              padding-left: 10px;
              margin-top: 4px;
              i{
                vertical-align: middle;
                margin-bottom: 2px;
              }
            }
            > img{
              width: 100%;
              height: 160px;
            }
            .manage_not_img{
              width: 100%;
              height: 160px;
              padding-top: 50px;
              border-radius: 4px 4px 0 0;
              text-align: center;
              background: #E6E6E6;
              font-size: 16px;
              color: #999;
            }
          }
        }
      }
      .con_state{
        position: absolute;
        right: -1px;
        top: -2px;
      }
      > h1{
        margin-top: 10px;
        color: #666666;
      }
      .manage_model{
        margin-top: 4px;
        margin-right: 20px;
        border-radius:4px 4px 0px 0px;
        border:1px solid rgba(211,211,211,1);
        .model_name{
          width: 100%;
          height: 44px;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          line-height: 44px;
          background:rgba(250,250,250,1);
          border-radius:5px 5px 0px 0px;
          cursor: pointer;
          > i{
            margin-top: 10px;
          }
        }
        .model_info{
          padding: 20px 20px 0;
          > li{
            display: flex;
            padding-bottom: 10px;
            > span:nth-child(1){
              padding-left: 20px;
              color: #666666;
            }
            > span:nth-child(2){
              flex: 1;
              color: #333333;
            }
            img{
              width: 104px;
              height: 104px;
              margin: 5px;
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
              cursor: pointer;
            }
          }
          .img_list{
            > span{
              width: 86px;
            }
            > div{
              width: calc(100% - 86px);
              display: flex;
              flex-wrap: wrap;
            }
          }
        }
        .dev_box{
          border-radius:4px 4px 0px 0px;
          border:1px solid #D3D3D3;
          position: relative;
          margin: 0 20px 20px;
          .tab{
            width: 100%;
            height: 42px;
            line-height: 42px;
            padding-left: 20px;
            background: #FAFAFA;
            border-bottom: 1px solid #D3D3D3;
          }
          .dev_map{
            width: 100%;
            height: 500px;
          }
          .map_zoom{
            position: absolute;
            right: 20px;
            bottom: 20px;
            .top, .bottom > li{
              width: 78px;
              height: 70px;
              line-height: 70px;
              background: #fff;
              text-align: center;
              cursor: pointer;
              i{
                margin-top: 16px;
                font-size: 20px;
                color: #999999;
              }
              &:hover{
                i{
                  color: #0C70F8;
                }
              }
            }
            .top{
              margin-bottom: 10px;
              p.active{
                color: #0C70F8;
              }
            }
            .top, .bottom{
              box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
            }
            .bottom > li:nth-child(1){
              border-bottom: 1px solid #F1F1F1;
            }
          }
          .sel_dev{
            position: absolute;
            z-index: 999;
            left: 20px;
            top: 62px;
            width:260px;
            box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39),0px 0px 9px 0px rgba(255,255,255,0.55); 
            .title{
              width: 100%;
              height: 40px;
              line-height: 40px;
              padding: 0 20px;
              border-bottom: 1px solid #F2F2F2;
              display: flex;
              justify-content: space-between;
              background: #fff;
              > span{
                color: #0C70F8;
                font-size: 16px;
              }
              > i{
                margin-top: 12px;
                color: #0C70F8;
                cursor: pointer;
              }
            }
            > div:nth-child(2){
              width: 100%;
              height: 0;
              background:rgba(255,255,255,1);
              transition: all .3s linear;
              overflow: hidden;
              &.active{
                height: 420px;
                padding-bottom: 20px;
              }
              .sel_tab{
                display: flex;
                width:220px;
                height:28px;
                margin-left: 20px;
                margin-top: 20px;
                border-radius:4px;
                border:1px solid rgba(211,211,211,1);
                > div{
                  width: 50%;
                  text-align: center;
                  line-height: 28px;
                  &.active, &:hover{
                    background: #E0F2FF;
                    color: #0C70F8;
                    cursor: pointer;
                  }
                
                }
              }
              .tree_box{
                width: 100%;
                padding: 12px;
                height: 352px;
              }
            }
          }
        }
      }
    }
    .manage_d_c_situ{
      margin-top: 20px;
      padding-bottom: 1px;
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .situ_title{
        line-height: 44px;
        padding-left: 15px;
        border-bottom: 1px solid #F2F2F2;
      }
      .situ_time{
        line-height: 44px;
        padding-left: 15px;
        padding-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        > div{
          width: 33%;
        }
        .termination_reason{
          width: 100%;
          line-height: 20px;
          display: flex;
          > span:nth-child(2){
            flex: 1;
          }
        }
      }
      .situ_box{
        margin: 0 20px 20px 20px;
        border-radius:4px 4px 0px 0px;
        border:1px solid #F2F2F2;
        .situ_top{
          display: flex;
          justify-content: space-between;
          line-height: 44px;
          padding: 0 15px;
          border-bottom: 1px solid #f2f2f2;
          background:rgba(250,250,250,1);
          cursor: pointer;
          i{
            vertical-align: middle;
            margin-top: 10px;
            font-size: 18px;
          }
        }
        .situ_content{
          display: flex;
          flex-wrap: nowrap;
          height: 812px;
          .situ_left{
            width: 258px;
            min-width: 258px;
            height: 100%;
            border-right: 1px solid #F2F2F2;
            > div{
              height: 50px;
              line-height: 50px;
            }
            .equ_m{
              margin: 0 20px;
              height: 28px;
              line-height: 28px;
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
              display: flex;
              overflow: hidden;
              >div{
                width: 50%;
                height: 100%;
                text-align: center;
                background: #fff;
                color: #666;
                cursor: pointer;
                &.active{
                  background: #E0F2FF;
                  color: #0C70F8;
                }
                &:hover{
                  background: #E0F2FF;
                  color: #0C70F8;
                }
              }
            }
            ul{
              margin-top: 6px;
              width: 100%;
              height: calc(100% - 82px);
              li{
                width: 100%;
                height: 36px;
                line-height: 36px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                padding: 0 15px 0 35px;
                color: #666666;
                cursor: move;
                > i{
                  vertical-align: middle;
                  margin-top: 10px;
                }
                &:hover{
                  color: #B2B2B2;
                }
                &:active{
                  background:rgba(250,250,250,1);
                  color: #666666;
                }
              }
            }
            .bayone_list{
              height: calc(100% - 82px);
              > li{
                display: block!important;
                > div{
                  cursor: pointer;
                }
              }
              .bayone_name{
                line-height: 30px;
                padding-left: 22px;
                padding-top: 6px;
                cursor: pointer;
                &.active{
                  i, span{
                    color: #0C70F8;
                  }
                }
                i{
                  margin-right: 10px;
                }
                i, span{
                  color: #666;
                } 
                &~ul{
                  margin-top: 0px; 
                }
              }
            }
          }
          .situ_right{
            width: calc(100% - 258px);
            height: 100%;
            display: flex;
            flex-flow: row wrap;
            align-content: space-between;
            justify-content: space-between;
            padding: 0.8%;
            background: #fafafa;
            .situ_r_video{
              width: 49.5%;
              height: 49.2%;
              position: relative;
              overflow: hidden;
              .situ_r_box{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: #fff;
                > img{
                  width: 50%;
                }
              }
            }
          }
        }
        
      }
    }
    .manage_d_c_result{
      height: 100%;
      margin: 20px 0 80px 0;
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .result_title{
        line-height: 44px;
        padding: 0 15px;
        border-bottom: 1px solid #F2F2F2;
        display: flex;
        justify-content: space-between;
        > div:nth-child(2){
          display: flex;
          .el-input{
            margin-left: 50px;
          }
        }
      }
      .result_content_box{
        width: 100%;
        height: 100%;
        > .result_content{
          display: flex;
          flex-wrap: nowrap;
          > div:nth-child(1){
            width: 140px;
            padding-bottom: 40px;
            border-right: 1px solid #F2F2F2;
            border-bottom: 1px solid #F2F2F2;
            > h1{
              padding: 10px 0;
              text-align: center;
              border-bottom: 1px solid #F2F2F2;
            }
            ul{
              padding: 10px 0;
              > li{
                width: 100%;
                height: 120px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
              > li.plate{
                &:hover, &.active{
                  background: #E0F2FF;
                }
                > div{
                  width: 100px;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  background:rgba(242,242,242,1);
                  border-radius:4px;
                  border:1px solid rgba(211,211,211,1);
                }
              }
              > li.img{
                &:hover, &.active{
                  background: #E0F2FF;
                }
              }
            }
          }
          > div:nth-child(2){
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            padding-top: 20px;
            padding-right: 1%;
            .result_img_box{
              flex: 0 0 24%;
              height: 100%;
              margin-left: 1%;
              margin-bottom: 20px;
              position: relative;
              overflow: hidden;
              background:rgba(255,255,255,1);
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
              img{
                width: 100%;
                height: 239px;
              }
              video{
                object-fit: fill;
              }
              .result_tool{
                width: 100%;
                height: 36px;
                line-height: 36px;
                background: rgba(0,0,0,.4);
                display: flex;
                justify-content: space-between;
                padding-left: 15px;
                position: absolute;
                bottom: 48px;
                left: 0;
                > div{
                  color: #fff;
                }
                i{
                  margin-top: 6px;
                  margin-right: 5px;
                  cursor: pointer;
                }
                .download{
                  margin-top: 6px;
                  margin-right: 10px;
                  text-decoration: none;
                  color: #fff;
                  font-size: 20px;
                  vertical-align: top;
                }
              }
              > div:nth-child(1){
                width: 100%;
                height: 239px;
                cursor: pointer;
                background: #000;
              }
              > div:nth-child(2){
                p{
                  padding-left: 10px;
                  line-height: 24px;
                  i{
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
        .pagination_box{
          display: flex;
          justify-content: space-between;
          > div:nth-child(1){
            padding-left: 8px;
            > .el-button{
              height: 32px;
              line-height: 7px;
            }
          }
        }
      }
    }
  }
  .manage_f_box{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height:60px;
    line-height: 60px;
    padding: 0 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
    .el-button{
      width: 100px;
      height: 40px;
    }
  }
  .event_detail_dialog{
    .detail_list{
      line-height: 30px;
    }
    .detail_list:nth-child(1){
      display: flex;
      justify-content: flex-start;
      > div{
        width: 33%;
        > div{
          line-height: 30px;
        }
      }
    }
    .detail_list:nth-child(4){
      display: flex;
      > span:nth-child(2){
        flex: 1;
        line-height: 20px;
        margin-top: 5px;
      }
    }
    .detail_img_box{
      width: 64%;
      height: 276px;
      padding: 20px 0 0 70px;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      > div{
        width: 117px;
        height: 117px;
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        img{
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        > div{
          width: 100%;
          height: 100%;
          .result_tool{
            width: 50px;
            height: 50px;
            background: rgba(0,0,0,.4);
            border-radius: 50%;
            position: absolute;
            bottom: 50%;
            left: 50%;
            margin-left: -25px;
            margin-bottom: -25px;
            cursor: pointer;
            > div{
              width: 100%;
              height:100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
  .close_btn{
    font-size: .3rem;
  }
  .vl_icon{
    transition: none;
  }
}
.video_relay{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
@media (min-width: 1400px) {
  .control_manage_d{
    .result_content_box .result_content{
      > div:nth-child(1){
        height: 618px!important;
      }
    }
  }
} 
@media (max-width: 1400px) {
  .control_manage_d{
    .situ_content{
      height: 500px!important;
    }
    .result_img_box{
      height: 208px!important;
      >div{
        height: 160px!important;
        >img{
          height: 160px!important;
        }
        >video{
          height: 160px!important;
        }
        .result_tool{
          bottom: 46px!important;
        }
      }
    }
    .result_content_box .result_content{
      > div:nth-child(1){
        height: 456px!important;
      }
    }
  }
} 

</style>
<style lang="scss">
.control_manage_d{
  .situ_right{
    .situ_r_video{
      > div {
        width: 100%;
        video{
          width: 100%;
        }
      }
    }
  }
  .vl_map_hover_main{
    li{
      display: flex;
      > span{
        width: auto;
        text-align: left;
        &:nth-child(2){
          flex: 1;
        }
      }
     
    }
  }
  .select_box .el-input__suffix-inner{
    position: relative;
    bottom: 3px;
  }
}
</style>
