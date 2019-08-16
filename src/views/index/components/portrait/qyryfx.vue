<template>
  <div class="qyryfx_wrap">
    <!-- 面包屑通用样式 -->
    <div
      is="vlBreadcrumb"
      :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
          {name: '区域人员分析'}]"
    ></div>
    <div class="qyryfx_content">
      <!-- 页面的左边 -->
      <div class="info_left" v-show="videoMenuStatus">
        <vue-scroll>
          <div class="left_top">
            <el-form :model="qyryfxFrom" ref="qyryfxFrom" class="qyryfx_from">
              <el-form-item class="select_type">
                <span>查询方式:</span>
                <el-radio-group v-model="selectType" class="select_radio">
                  <el-radio :label="1">在线查询</el-radio>
                  <el-radio :label="2">离线任务</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="taskName" v-if="selectType === 2" :rules="[{ required: true, message: '该项内容不能为空', trigger: 'blur' }]">
                <el-input placeholder="请设置任务名称" maxlength="20" v-model="qyryfxFrom.taskName"></el-input>
              </el-form-item>
              <el-form-item prop="personGroupId">
                <el-select
                  class="width232"
                  v-model="qyryfxFrom.personGroupId"
                  placeholder="选择分析人群"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in peopleGroupOptions"
                    :key="item.uid"
                    :label="item.groupName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="sex">
                <el-select class="width232" v-model="qyryfxFrom.sex" placeholder="选择性别">
                  <el-option
                    v-for="item in peopleSexOptions"
                    :key="item.enumField"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="age">
                <el-select
                  class="width232"
                  v-model="qyryfxFrom.age"
                  placeholder="选择年龄段"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in peopleAgeOptions"
                    :key="item.enumField"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="area_time" prop="startTime">
                <span>抓拍时间:</span>
                <el-date-picker
                  v-model="qyryfxFrom.startTime"
                  type="datetime"
                  :clearable="false"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startDateOptArr"
                  :time-arrow-control="true"
                  placeholder="开始时间"
                  class="width232 vl_date"
                ></el-date-picker>
                <el-date-picker
                  v-model="qyryfxFrom.endTime"
                  :clearable="false"
                  :picker-options="endDateOptArr"
                  :time-arrow-control="true"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  class="width232 vl_date vl_date_end"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="area_select">
                <span class="area_title">抓拍区域:</span>
                <span class="area_map_select" @click="showMapDialog">地图区域选择</span>
                <div class="divide"></div>
              </el-form-item>
              <div class="area_list">
                <ul>
                  <li v-for="(item, index) in selectAreaDataList" :key="index">
                    <div class="area_list_title">
                      <span>区域{{index + 1}}</span>
                      <div class="area_list_btn">
                        <i class="vl_icon vl_icon_position_1" @click="showCurrentMapArea(index)"></i>
                        <i class="vl_icon vl_icon_manage_8" @click="deleteSelectArea(index)"></i>
                      </div>
                    </div>
                    <div class="area_list_time">
                      <span>时间：</span>
                      <div>
                        <p>{{item.startTime}}</p>
                        <p>{{item.endTime}}</p>
                      </div>
                    </div>
                    <div class="area_list_device">
                      <span>设备：</span>
                      <div>{{item.allDeviceNameList && item.allDeviceNameList.join('、') }}</div>
                    </div>
                    <div class="divide"></div>
                  </li>
                </ul>
              </div>
              <el-form-item>
                <el-button style="width: 110px;" @click="resetLeftMenu('qyryfxFrom')">重置</el-button>
                <el-button type="primary" style="width: 110px;" :loading="submitLoading" @click="submitData('qyryfxFrom')">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </vue-scroll>
      </div>
      <!-- 展开按钮 -->
      <div v-show="!videoMenuStatus" class="close-menu-o" title="展开菜单" @click="openMenu">
        <i class="vl_icon vl_icon_vehicle_03"></i>
      </div>
      <!-- 页面的中部 -->
      <div class="info_center">
        <ul class="tab-menu">
          <li
            v-for="(item,index) in tabList"
            :key="index"
            :class="{'is-active': selectIndex === item.value}"
            @click="selectTab(item.value)"
          >{{item.label}}</li>
        </ul>
        <template  v-if="selectIndex === 2">
          <div class="map_center_container">
            <div class="close-menu-c" title="关闭菜单" v-show="videoMenuStatus" @click="closeMenu">
              <i class="vl_icon vl_icon_vehicle_02"></i>
            </div>
            <div class="gis_content" id="gis_content">
              <div class="map_rm" id="mapMap"></div>
              <div class="map_control">
                <div class="photo_count_level">
                  <div class="colors">
                    <div></div>
                    <p>&gt;500</p>
                  </div>
                  <div class="colors">
                    <div></div>
                    <p>201-500</p>
                  </div>
                  <div class="colors">
                    <div></div>
                    <p>101-200</p>
                  </div>
                  <div class="colors">
                    <div></div>
                    <p>51-100</p>
                  </div>
                  <div class="colors">
                    <div></div>
                    <p>20-50</p>
                  </div>
                  <div class="colors">
                    <div></div>
                    <p>&lt;20</p>
                  </div>
                </div>
                <ul class="map_rrt_u2">
                  <li @click="resetZoom">
                    <i class="el-icon-aim"></i>
                  </li>
                  <li>
                    <i class="el-icon-plus" @click="mapZoomSet(1)"></i>
                  </li>
                  <li>
                    <i class="el-icon-minus" @click="mapZoomSet(-1)"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- <div is="noResult" :isInitPage="isInitPage"></div> -->
        </template>
        <template v-else>
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
              <el-form-item label="任务名称:" prop="taskName">
                <el-input
                  style="width: 230px;"
                  type="text"
                  placeholder="请输入任务名称"
                  v-model="searchForm.taskName"
                />
              </el-form-item>
              <el-form-item label="创建时间:" prop="reportTime">
                <el-date-picker
                  class="vl_date"
                  v-model="searchForm.reportTime"
                  type="datetimerange"
                  :time-arrow-control="true"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="selectDataList">查询</el-button>
                <el-button @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
          <div class="divide"></div>
          </div>
          <div class="table_box">
            <el-table :data="taskList">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="区域数量" prop="taskWebParam" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="人群" prop="personGroupId" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.personGroupId ? scope.row.taskWebParam.personGroupId : '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="性别" prop="sex" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.sex ? scope.row.taskWebParam.sex : '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="年龄段" prop="age" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.age ? scope.row.taskWebParam.age : '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="200px">
                <template slot-scope="scope">
                  <span
                    class="operation_btn"
                    @click="skipResultPage(scope.row)"
                    v-if="selectIndex === 1"
                  >查看</span>
                  <span
                    class="operation_btn"
                    @click="showInterruptDialog(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 1"
                  >中断任务</span>
                  <span
                    class="operation_btn"
                    @click="recoveryTask(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"
                  >恢复任务</span>
                  <span
                    class="operation_btn"
                    @click="recoveryTask(scope.row)"  
                    v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 3"
                  >重启任务</span>
                  <span
                    class="operation_btn"
                    @click="showDeleteDialog(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus !== 4"
                  >删除任务</span>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="pagination.total > 0">
              <el-pagination
                class="cum_pagination"
                @current-change="handleCurrentChange"
                :current-page.sync="pagination.pageNum"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total"
              ></el-pagination>
            </template>
          </div>
        </template>
        <!-- 关闭按钮 -->
      </div>
      <!-- 页面的右边 -->
      <div class="info_right" v-show="infoRightShow">
        <div class="danger_people_wrap">
          <vue-scroll>
            <h3 class="camera_name">
              <span>{{ selectedDevice.deviceName }}</span>
              &nbsp;
              <span>{{'(' + currentClickDevice.shotNum + '次)'}}</span>
              <i class="el-icon-close" @click="infoRightShow = false;" title="关闭"></i>
            </h3>
            <div class="danger_people_list">
              <div
                class="people_item"
                v-for="(item, index) in cameraPhotoList"
                :key="'people_item' + index"
              >
                <div v-for="(sItem, sIndex) in item.detailList" :key="'my_swiper' + sIndex">
                  <div class="swiper_contents" v-if="item.currentIndex === sIndex">
                    <div class="shot_times">{{ item.detailList.length + '次'}}</div>
                    <div class="img_warp">
                      <img :src="sItem.upPhotoUrl" title="点击放大图片" class="bigImg" alt />
                    </div>
                    <div class="similarity">
                      <p class="similarity_count">{{sItem.semblance}}</p>
                      <p class="similarity_title">相似度</p>
                      <div class="select_time">
                        <el-select
                          v-model="item.currentIndex"
                          @change="slideToIndex(item.currentIndex, index)"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(gItem, gIndex) in item.detailList"
                            :key="gIndex"
                            :label="item.shotTimes[gIndex]"
                            :value="gIndex"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="img_warp">
                      <img :src="sItem.subStoragePath" title="点击放大图片" class="bigImg" alt />
                    </div>
                    <div class="people_message">
                      <h2 class="name">{{item.name}}</h2>
                      <div class="tips_wrap">
                        <p class="tip">{{item.sex}}</p>
                        <p class="tip">{{item.age}}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div @click="prev(index)" class="swiper-button-prev change_img"></div>
                <div @click="next(index)" class="swiper-button-next change_img"></div>
              </div>
            </div>
          </vue-scroll>
        </div>
        <div class="right_black"></div>
      </div>
    </div>
    <!--删除任务弹出框-->
    <el-dialog
      title="删除任务确认"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清除，任务不再可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDeleteTask">确认</el-button>
      </div>
    </el-dialog>
    <!--中断任务弹出框-->
    <el-dialog
      title="中断任务确认"
      :visible.sync="interruptDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interruptDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isInterruptLoading" @click="sureInterruptTask">确认</el-button>
      </div>
    </el-dialog>
    <div is="mapSelector" v-show="selectMapType === 1" :open="mapDialogVisible1" :showTypes="'DB'" :clear="clearMapSelect1" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" v-show="selectMapType === 2" :open="mapDialogVisible2" :showTypes="'DB'" :clear="clearMapSelect2" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" v-show="selectMapType === 3" :open="mapDialogVisible3" :showTypes="'DB'" :clear="clearMapSelect3" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" v-show="selectMapType === 4" :open="mapDialogVisible4" :showTypes="'DB'" :clear="clearMapSelect4" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" v-show="selectMapType === 5" :open="mapDialogVisible5" :showTypes="'DB'" :clear="clearMapSelect5" @mapSelectorEmit="mapPoint"></div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import mapSelector from '@/components/common/mapSelector.vue';
import noResult from '@/components/common/noResult.vue';
import swiper from "vue-awesome-swiper";
import { mapXupuxian } from "@/config/config.js";
import { formatDate, dateOrigin } from "@/utils/util.js";
// import {
//   getAllMonitorList,
//   getAllBayonetList
// } from "@/views/index/api/api.base.js";
import {
  getAreaRealTimeData,
  addAreaPersonTask
} from "@/views/index/api/api.judge.js";
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
import { getGroupAllList } from "@/views/index/api/api.control.js";
import { validatePersonNum, validateInteger } from "@/utils/validator.js";
import { random14, objDeepCopy } from "@/utils/util.js";
import { constants } from "crypto";

export default {
  components: { vlBreadcrumb, mapSelector, noResult },
  data() {
    return {
      deleteDialog: false, // 删除任务弹出框
      interruptDialog: false, // 中断任务弹出框
      isDeleteLoading: false, // 删除任务弹出框
      isInterruptLoading: false, // 中断任务弹出框
      selectMapType: 1, // 选择的第几个地图区域
      isInitPage: true,
      isShowMapAreaDialog: true, // 是否显示地图弹出框
      mapDialogVisible1: false, // 地图选择弹出框
      mapDialogVisible2: false, // 地图选择弹出框
      mapDialogVisible3: false, // 地图选择弹出框
      mapDialogVisible4: false, // 地图选择弹出框
      mapDialogVisible5: false, // 地图选择弹出框
      clearMapSelect1: null, // 清除地图选择
      clearMapSelect2: null, // 清除地图选择
      clearMapSelect3: null, // 清除地图选择
      clearMapSelect4: null, // 清除地图选择
      clearMapSelect5: null, // 清除地图选择
      selectType: 1, // 左侧查询方式
      selectIndex: 2, // 右侧tab默认选中
      tabList: [
        {
          label: "查询结果",
          value: 2
        },
        {
          label: "已完成任务",
          value: 1
        },
        {
          label: "未完成任务",
          value: 0
        }
      ],
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      /*左边搜索表单变量 */
      searchPlace: "",
      qyryfxFrom: {
        taskName: null, // 任务名称
        personGroupId: "", //分析人群
        sex: null, // 性别
        age: "", // 年龄段
        startTime: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), // 开始时间
        endTime: new Date(), // 结束时间
      },
      submitLoading: false, // 提交loading
      getDetailLoading: false,
      cameraPhotoList: [],
      startDateOptArr: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      endDateOptArr: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      peopleGroupOptions: [], // 分析人群下拉
      peopleSexOptions: [
        {
          enumField: null,
          enumValue: "全部"
        },
        {
          enumField: "男",
          enumValue: "男"
        },
        {
          enumField: "女",
          enumValue: "女"
        }
      ], // 性别下拉
      peopleAgeOptions: [
        {
          enumField: "儿童",
          enumValue: "儿童"
        },
        {
          enumField: "少年",
          enumValue: "少年"
        },
        {
          enumField: "青年",
          enumValue: "青年"
        },
        {
          enumField: "中年",
          enumValue: "中年"
        },
        {
          enumField: "老年",
          enumValue: "老年"
        }
      ], // 年龄段下拉
      isSearchResult: false, // 搜索框是否打开
      // searchResultList: [1, 2, 3, 4, 5, 6, 7, 8], // 搜索结果的列表
      infoRightShow: false, // 右边菜单状态
      videoMenuStatus: true, // 左边菜单状态
      amap: null, // 地图对象
      mapCenter: [110.594419, 27.908869], //地图中心位
      videoMenuStatus: true, // 菜单状态
      showTypes: "DB", //设备类型
      totalData: [],
      selectedDevice: {}, // 当前选中的设备信息
      currentClickDevice: {},
      swiper: null,
      selectAreaDataList: [], // 左侧选中的区域信息
      selectMapList: [], // 选中的设备数据
      taskList: [], // 任务列表
      taskId: null, // 要操作的任务id
    };
  },
  watch: {
    cameraPhotoList: {
      handler(newName, oldName) {
        // console.log("obj.a changed");
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    //获取数据
    // this.getTaskList();
    // this.mapEvents();
    //加载地图
    this.initMap();
    // 获取到监控人群分组
    getGroupAllList().then(res => {
      if (res) {
        this.peopleGroupOptions = [
          ...res.data.filter(item => item.uid !== null)
        ];
      }
    });
  },
  methods: {
    // 获取离线任务列表
    getTaskList () {
      const params = {
        'where.taskName': this.searchForm.taskName,
        'where.taskType': 7, // 7：区域人员分析
        'where.startTime': this.searchForm.reportTime[0],
        'where.endTime': this.searchForm.reportTime[1],
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getTaskInfosPage(params)
        .then(res => {
          if (res && res.data) {
            this.taskList = res.data.list;
            this.pagination.total = res.data.total;
            this.taskList.map(item => {
              item.taskWebParam = JSON.parse(item.taskWebParam);
            })
          }
        })
        .catch(() => {})
    },
    // 显示中断任务弹出框
    showInterruptDialog (obj) {
      this.interruptDialog = true;
      this.taskId = obj.uid;
    },
    // 显示删除任务弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.taskId = obj.uid;
    },
    // 确认中断任务
    sureInterruptTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 7, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 7：区域人员分析
          taskStatus: 4 // 1：处理中 2：处理成功 3：处理失败 4：处理中断
        };
        this.isInterruptLoading = true;
        putAnalysisTask(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '中断任务成功',
                customClass: 'request_tip'
              });
              this.interruptDialog = false;
              this.isInterruptLoading = false;
              this.getTaskList();
            } else {
              this.isInterruptLoading = false;
            }
          })
          .catch(() => {this.isInterruptLoading = false;})
      }
    },
    // 确认删除任务
    sureDeleteTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 7, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 7：区域人员分析
          delFlag: true
        };
        this.isDeleteLoading = true;
        putAnalysisTask(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除任务成功',
                customClass: 'request_tip'
              });
              this.deleteDialog = false;
              this.isDeleteLoading = false;
              this.getTaskList();
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 恢复任务 --- 重启任务
    recoveryTask (obj) {
      if (obj.uid) {
        putTaskInfosResume(obj.uid)
          .then(res => {
            if (res) {
              this.getTaskList();
            }
          })
      }
    },
    // 跳至分析结果页面
    skipResultPage (obj) {
      this.$router.push({name: 'portrait_qyryfx_result', query: { result: obj.taskResult, param: obj.taskWebParam }});
    },
    // 显示地图区域选择弹出框
    showMapDialog () {
      if (this.selectAreaDataList.length === this.selectMapType ) {
        if (this.selectMapType < 5) {
          this.selectMapType ++;
        }
      }
      this.handleSelectType(this.selectMapType);
    },
    // 显示相对应的地图框选区域
    showCurrentMapArea (index) {
      console.log(index)
      console.log('kkkkkkkkkkkkkkkkkkkkkk')
      this.isShowMapAreaDialog = true;
      if (this.isShowMapAreaDialog) {
        console.log('asdasdasdasdasd')
        switch ((index + 1)) {
          case 1:
            console.log('asdasdasd')
            this.selectMapType = 1;
            this.mapDialogVisible1 = !this.mapDialogVisible1;
            break;
          case 2:
            this.selectMapType = 2;
            this.mapDialogVisible2 = !this.mapDialogVisible2;
            break;
          case 3:
            this.selectMapType = 3;
            this.mapDialogVisible3 = !this.mapDialogVisible3;
            break;
          case 4:
            this.selectMapType = 4;
            this.mapDialogVisible4 = !this.mapDialogVisible4;
            break;
          case 5:
            this.selectMapType = 5;
            this.mapDialogVisible5 = !this.mapDialogVisible5;
            break;
          default:
            this.selectMapType = 0;
            break;
        }
      }
    },
    handleSelectType (index) {
      switch (index) {
        case 1:
          this.mapDialogVisible1 = !this.mapDialogVisible1;
          break;
        case 2:
          this.mapDialogVisible2 = !this.mapDialogVisible2;
          break;
        case 3:
          this.mapDialogVisible3 = !this.mapDialogVisible3;
          break;
        case 4:
          this.mapDialogVisible4 = !this.mapDialogVisible4;
          break;
        case 5:
          this.mapDialogVisible5 = !this.mapDialogVisible5;
          break;
        default:
          break;
      }
    },
    // 删除某个选中的区域
    deleteSelectArea (index) {
      console.log('mmmmmmmmmmmmmmmmmmm')
      this.selectAreaDataList.splice(index, 1);
      this.isShowMapAreaDialog = false;
      this.selectMapType--;
    },
    // 获取地图选择的数据
    mapPoint (data) {
      if (data) {
        let allDeviceNameList = [];
        if (data.deviceList.length > 0) {
          data.deviceList.map(item => {
            allDeviceNameList.push(item.deviceName);
          })
        }
        if (data.bayonetList.length > 0) {
          data.bayonetList.map(item => {
            allDeviceNameList.push(item.bayonetName);
          })
        }
        const obj = { 
          startTime: formatDate(this.qyryfxFrom.startTime),
          endTime: formatDate(this.qyryfxFrom.endTime),
          deviceList: data.deviceList,
          bayonetList: data.bayonetList,
          allDeviceNameList: allDeviceNameList.length > 0 ? allDeviceNameList : null
        }
        this.selectAreaDataList.push(obj);
      }
    },
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      this.getTaskList();
    },
    // 查询任务列表数据
    selectDataList () {
      this.getTaskList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getTaskList();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getTaskList();
    },
    // 日期控制
    timeChange(ind, type = "start") {
      this.$nextTick(() => {
        if (this.drawObj[ind].startTime && this.drawObj[ind].endTime) {
          if (
            new Date(this.drawObj[ind].endTime).getTime() -
              new Date(this.drawObj[ind].startTime).getTime() >
            3 * 24 * 3600 * 1000
          ) {
            this.$message.warning("最大选择时间段为三天");
            if (type === "start") {
              this.drawObj[ind].endTime = formatDate(
                new Date(this.drawObj[ind].startTime).getTime() +
                  3600 * 1000 * 24 * 3
              );
            } else {
              this.drawObj[ind].startTime = formatDate(
                new Date(this.drawObj[ind].endTime).getTime() -
                  3600 * 1000 * 24 * 3
              );
            }
          }
        }
      });
    },
    // 切换照片
    prev(val) {
      const ind = this.cameraPhotoList[val].detailList.length - 1;
      if (this.cameraPhotoList[val].currentIndex === 0) {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = ind;
        this.$set(this.cameraPhotoList, val, obj);
      } else {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = obj.currentIndex - 1;
        this.$set(this.cameraPhotoList, val, obj);
      }
    },
    next(val) {
      const ind = this.cameraPhotoList[val].detailList.length - 1;
      if (this.cameraPhotoList[val].currentIndex === ind) {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = 0;
        this.$set(this.cameraPhotoList, val, obj);
      } else {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = obj.currentIndex + 1;
        this.$set(this.cameraPhotoList, val, obj);
      }
    },
    slideToIndex(val, ind) {
      const obj = objDeepCopy(this.cameraPhotoList[ind]);
      obj.currentIndex = val;
      this.$set(this.cameraPhotoList, ind, obj);
    },
    /**重置左边菜单的方法 */
    resetLeftMenu(form) {
      this.$refs[form].resetFields();
      this.selectAreaDataList = [];
      this.selectMapType = 0;
      this.infoRightShow = false; // 关闭右边的菜单数据
    },
    /** 操作左边菜单方法 */
    openMenu() {
      this.videoMenuStatus = true;
    },
    closeMenu() {
      this.videoMenuStatus = false;
    },
    /** 提交搜索摄像头抓拍记录 */
    submitData(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let deviceAndTimeList = [];
          this.selectAreaDataList.map((item, index) => {
            if (item.deviceList.length <= 0 && item.bayonetList.length <= 0) {
               this.$message.warning(
                `您在第${index + 1}个选择区域未选中设备，请您重新选择`
              );
              return;
            } else {
              deviceAndTimeList = [
                ...deviceAndTimeList,
                {
                  deviceIds: item.deviceList.map(item => item.uid).join(),
                  bayonetIds: item.bayonetList.map(item => item.uid).join(),
                  deviceNames: item.allDeviceNameList.join('、'),
                  startTime: item.startTime,
                  endTime: item.endTime
                }
              ];
            }
          });
          const queryParams = {
            sex: this.qyryfxFrom.sex,
            age: this.qyryfxFrom.age !== "" ? this.qyryfxFrom.age.join() : "",
            personGroupId:
              this.qyryfxFrom.personGroupId !== ""
                ? this.qyryfxFrom.personGroupId.join()
                : "",
            deviceAndTimeList: deviceAndTimeList
          };
          console.log('queryParams', queryParams)

          this.submitLoading = true; // 打开加载效果
          getAreaRealTimeData(queryParams)
            .then(res => {
              if (res && res.data) {
                this.submitLoading = false; // 关闭加载效果
                if (res.data.length) {
                  this.clearMarkList(); // 清除地图标记
                  this.setMarks(res.data, false);
                } else {
                  this.clearMarkList(); // 清除地图标记
                  this.setMarks();
                  this.$message.warning("您选择的设备没有数据");
                }
              } else {
                this.submitLoading = false; // 关闭加载效果
                this.clearMarkList(); // 清除地图标记
                this.setMarks();
                this.$message.warning("您选择的设备没有数据");
              }
            })
            .catch(() => {
              this.clearMarkList(); // 清除地图标记
              this.setMarks();
              this.submitLoading = false; // 关闭加载效果
            });
        }
      })
    },
    /** 点击摄像头查看此摄像头抓拍详情信息 */
    clickGetCameraData(device) {
      // 点击设备获取到人员的信息
      let queryParams;
      if (this.drawObj.length === 1) {
        // 只有一个时间区域
        queryParams = {
          sex: this.qyryfxFrom.sex,
          age: this.qyryfxFrom.age !== "" ? this.qyryfxFrom.age.join() : "",
          personGroupId:
            this.qyryfxFrom.personGroupId !== ""
              ? this.qyryfxFrom.personGroupId.join()
              : "",
          deviceCode: device.viewClassCode,
          startTime: this.drawObj[0].startTime,
          endTime: this.drawObj[0].endTime
        };
      } else {
        // 根据设备的不同来查找时间段
        const timeArr = [];
        for (let i = 0; i < this.totalData.length; i++) {
          const dataItem = this.totalData[i];
          let isAd = false;
          if (dataItem.ad.length > 0) {
            for (let j = 0; j < dataItem.ad.length; j++) {
              if (dataItem.ad[j].viewClassCode === device.viewClassCode) {
                timeArr.push(i);
                isAd = true;
                break;
              }
            }
          }
          if (!isAd) {
            for (let j = 0; j < dataItem.ab.length; j++) {
              if (dataItem.ab[j].viewClassCode === device.viewClassCode) {
                timeArr.push(i);
                break;
              }
            }
          }
        }
        queryParams = {
          sex: this.qyryfxFrom.sex,
          age: this.qyryfxFrom.age !== "" ? this.qyryfxFrom.age.join() : "",
          personGroupId:
            this.qyryfxFrom.personGroupId !== ""
              ? this.qyryfxFrom.personGroupId.join()
              : "",
          deviceCode: device.viewClassCode,
          startTime: timeArr
            .map(item => {
              return this.drawObj[item].startTime;
            })
            .join(),
          endTime: timeArr
            .map(item => {
              return this.drawObj[item].endTime;
            })
            .join()
        };
      }

      const loading = this.$loading({
        lock: true,
        text: "获取摄像头信息中。。。",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getShotNumAreaDetail(queryParams)
        .then(res => {
          if (res && res.data) {
            this.infoRightShow = true;
            this.cameraPhotoList = res.data;
            for (let i = 0; i < this.cameraPhotoList.length; i++) {
              const item = this.cameraPhotoList[i];
              if (item.detailList.length) {
                item.currentIndex = item.detailList.length - 1;
                item.detailList = item.detailList.map(item => {
                  item.semblance = Number(item.semblance).toFixed(2); // 保留2位小数点
                  return item;
                });
              } else {
                item.currentIndex = 0;
              }
            }
            loading.close();
          } else {
            this.cameraPhotoList = [];
            loading.close();
          }
        })
        .catch(() => {
          this.cameraPhotoList = [];
          loading.close();
        });
    },
    
    // 地图定位
    resetZoom() {
      if (this.amap) {
        this.amap.setFitView();
      }
    },
    // 地图缩放
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    // 初始化地图
    initMap() {
      let _this = this;
      let map = new window.AMap.Map("mapMap", {
        zoom: 14, // 级别
        resizeEnable: true,
        center: _this.mapCenter // 中心点坐标
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
     
    },
    getTreeList() {
      if (this.showTypes.indexOf("D") >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf("B") >= 0) {
        this.getListBayonet();
      }
    },
    // 获取到设备数据
    getListDevice() {
      getAllMonitorList({ ccode: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listDevice = res.data;
          this.setMarks(); // 初始化设备
        }
      });
    },
    // 获取到卡口数据
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
          this.setMarks(); // 初始化卡口
        }
      });
    },
    // D设备 B卡口
    setMarks(deviceList = null, init = true) {
      // 展示设备和卡口
      if (init) {
        // 初始化的时候展示所有的设备
        for (let i = 0; i < this.listDevice.length; i++) {
          this.doMark(this.listDevice[i], deviceList, "vl_icon vl_icon_sxt");
        }
        for (let i = 0; i < this.listBayonet.length; i++) {
          this.doMark(this.listBayonet[i], deviceList, "vl_icon vl_icon_kk");
        }
        this.amap.setFitView();
      } else {
        for (let i = 0; i < this.listDevice.length; i++) {
          const listItem = this.listDevice[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_sxt", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listDevice[i], null, "vl_icon vl_icon_sxt");
          }
        }
        for (let i = 0; i < this.listBayonet.length; i++) {
          const listItem = this.listBayonet[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_kk", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listBayonet[i], null, "vl_icon vl_icon_kk");
          }
        }
      }
    },
    // 地图标记
    doMark(obj, device, sClass, init = true) {
      let marker;
      if (!init && device.shotNum > 0) {
        // 非初始化的状态
        let level;
        if (device.shotNum < 20) {
          level = "level6";
        } else if (device.shotNum <= 50 && device.shotNum >= 20) {
          level = "level5";
        } else if (device.shotNum <= 100 && device.shotNum >= 51) {
          level = "level4";
        } else if (device.shotNum <= 200 && device.shotNum >= 101) {
          level = "level3";
        } else if (device.shotNum <= 500 && device.shotNum >= 201) {
          level = "level2";
        } else if (device.shotNum > 500) {
          level = "level1";
        }
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div class='qyryfx_vl_icon_wrap' title="点击查询设备抓拍照片"> <div class="map_icons ${sClass}"></div> <div class='people_counts_l1 ${level}'> ${device.shotNum}人次 </div> </div>`
        });
        let _this = this;
        // 给标记绑定一个点击事件
        marker.on("click", function() {
          _this.currentClickDevice = device;
          _this.selectedDevice = obj;
          _this.clickGetCameraData(obj);
        });
        this.markerList = [...this.markerList, marker];
      } else {
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div style="cursor:not-allowed;" class="map_icons ${sClass}"></div>`
        });
        this.markerList = [...this.markerList, marker];
      }
    },
    clearMarkList() {
      for (let i = 0; i < this.markerList.length; i++) {
        this.amap.remove(this.markerList[i]);
      }
    }
  },
  beforeDestroy() {
    if (this.amap) {
      this.amap.destroy();
    }
  },
  
};
</script>
<style lang="scss" scoped>
@mixin close_menu {
  position: absolute;
  top: calc(50% - 81px);
  font-size: 24px;
  box-shadow: 0px 0px 4px 0px rgba (0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 99;
}

.qyryfx_wrap {
  position: relative;
  height: calc(100% - 49px);
  font-size: 14px;
  // 搜索结果展示
  .search_result {
    position: absolute;
    left: 26px;
    top: 123px;
    z-index: 100;
    width: 368px;
    height: 390px;
    background: #fff;
    box-shadow: 0px 5px 20px 0px rgba(169, 169, 169, 0.3);
    padding: 13px 0 13px 13px;
    font-size: 14px;
    .result_item {
      width: 341px;
      padding: 16px 12px 16px 39px;
      height: 120px;
      position: relative;
      &:hover {
        background: #f6f6f6;
      }
      .index_icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 20px;
        height: 26px;
        background: red;
      }
      .camera_icon {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 12px;
        height: 16px;
        background: red;
      }
      // 地址详情
      .address_content {
        overflow: hidden;
        .left {
          float: left;
          width: 206px;
          .add_name {
            color: #0c70f8;
            padding-bottom: 12px;
          }
          .add_detail {
            line-height: 20px;
            color: #999999;
          }
          .add_tel {
            padding-top: 12px;
            .key {
              color: #999999;
            }
            .value {
              color: #666666;
            }
          }
        }
        .add_img {
          float: left;
          width: 70px;
          height: 58px;
          margin-top: 18px;
          background: yellow;
          position: relative;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  // 搜索遮罩
  .search_comp {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: 0;
    z-index: 1;
  }
  .breadcrumb_heaer {
    background: #fff;
  }
  .qyryfx_content {
    position: relative;
    border-top: 1px solid #d3d3d3;
    height: 100%;
    // height: calc(100% - 60px);
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // 关闭展开菜单按钮
    // 页面左边
    .info_left {
      position: relative;
      height: 100%;
      width: 272px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      z-index: 100;
      .left_top {
        width: 252px;
        margin: 0 10px;
        padding-bottom: 20px;
        .qyryfx_from {
          .area_list {
            >ul {
              margin-bottom: 20px;
              >li {
                margin-top: 20px;
                // &:last-child {
                //   .divide {
                //     display: none;
                //   }
                // }
                .divide {
                  width: 100%;
                  height: 1px;
                  border: 1px solid #f2f2f2;
                }
                .area_list_title, .area_list_time, .area_list_device {
                  margin-bottom: 10px;
                  display: flex;
                  // align-items: center;
                }
                .area_list_title {
                  justify-content: space-between;
                  >span {
                    color: #333333;
                  }
                  >div {
                    display: flex;
                    align-items: center;
                    i {
                      margin: 0 5px;
                      cursor: pointer;
                      // &:last-child {
                      //   &:hover {
                      //     color: #FA453A;
                      //   }
                      // }
                    }
                  }
                }
                .area_list_time, .area_list_device {
                  >span {
                    width: 45px;
                  }
                  >div {
                    width: calc(100% - 45px);
                    color: #333333;
                  }
                }
              }
            }
          }
          // .add_area {
          //   width: 100%;
          //   margin: -10px 0 10px 0;
          //   .divide {
          //     width: 100%;
          //     height: 1px;
          //     margin-top: 10px;
          //     border: 1px dashed #F2F2F2;
          //   }
          //   .operation_area {
          //     margin-left: 25%;
          //     width: 100px;
          //     justify-content: center;
          //     display: flex;
          //     align-items: center;
          //     color: #0B6FF8;
          //     >i {
          //       font-size: 20px;
          //       cursor: pointer;
          //     }
          //     >span {
          //       margin-left:5px;
          //       cursor: pointer;
          //     }
          //   }
          //   // line-height: 20px;
          // }
          /deep/ .el-form-item {
            margin-bottom: 10px;
          }
          .select_type {
            margin-bottom: 0 !important;
            /deep/.el-form-item__content {
              display: flex;
              align-items: center;
              /deep/ .el-radio {
                margin-right: 20px;
              }
            }
            >span {
              width: 60px;
              display: inline-block;
            }
            .select_radio {
              margin-left: 5px;
              width: 160px;
              display: flex;
              align-items: center;
            }
          }
          .area_select {
            // margin-bottom: 0;
            /deep/ .el-form-item__content {
              line-height: 20px !important;
            }
            .area_map_select {
              color: #0C70F8;
              margin-left: 5px;
              cursor: pointer;
            }
            .divide {
              width: 100%;
              height: 1px;
              margin-top: 10px;
              border: 1px dashed #F2F2F2;
            }
          }
        }
        .area_time {
          margin-top: -10px;
          /deep/ .el-form-item__content {
            display: flex;
            flex-wrap: wrap;
            // >span {
            //   margin-bottom: 5px;
            // }
            .width232 {
              margin-bottom: 10px;
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
      .left_bottom {
        padding-left: 20px;
        background: #fafafa;
        position: relative;
        // 标题
        .add_area_title {
          color: #0c70f8;
          line-height: 46px;
          text-indent: 8px;
          cursor: pointer;
        }
        // 时间选择区域
        .area_item {
          // 删除按钮
          .del_icon {
            height: 38px;
            position: relative;
            > i {
              display: block;
              width: 14px;
              height: 16px;
              position: absolute;
              right: 30px;
              top: 10px;
              cursor: pointer;
              background: url("../../../../assets/img/icons.png") no-repeat;
              background-position: -695px -376px;
              &:hover {
                background-position: -695px -349px;
              }
            }
          }
          // 地图选择器
          .sd-opts {
            width: 232px;
            border: 1px solid #d3d3d3;
            .sd-opts-title {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              color: #333;
              background-color: #fafafa;
              border-bottom: 1px solid #d3d3d3;
              > i {
                cursor: pointer;
              }
              .cannot_click {
                cursor: not-allowed;
              }
            }
            > ul {
              padding: 22px 0 18px 0;
              overflow: hidden;
              > li {
                padding: 5px 0 5px 5px;
                float: left;
                > div {
                  &.sd-opts-sed {
                    background-color: #f2f9ff;
                    > .sd-opts-icon1 {
                      background-image: url(../../../../assets/img/vehicle/cut1m.png);
                    }
                    > .sd-opts-icon2 {
                      background-image: url(../../../../assets/img/vehicle/cut2m.png);
                    }
                    > .sd-opts-icon3 {
                      background-image: url(../../../../assets/img/vehicle/cut3m.png);
                    }
                    > .sd-opts-icon4 {
                      background-image: url(../../../../assets/img/vehicle/cut4m.png);
                    }
                    > .sd-opts-icon5 {
                      background-image: url(../../../../assets/img/vehicle/cut5m.png);
                    }
                  }
                }
              }
            }
            .tips {
              font-size: 14px;
              padding: 0 10px 10px 10px;
              color: #999;
              // margin: 0 auto;
            }
          }
          .sd-opts-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
            &.sd-opts-icon1 {
              background-image: url(../../../../assets/img/vehicle/cut1.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut1m.png);
              }
            }
            &.sd-opts-icon2 {
              background-image: url(../../../../assets/img/vehicle/cut2.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut2m.png);
              }
            }
            &.sd-opts-icon3 {
              background-image: url(../../../../assets/img/vehicle/cut3.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut3m.png);
              }
            }
            &.sd-opts-icon4 {
              background-image: url(../../../../assets/img/vehicle/cut4.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut4m.png);
              }
            }
            &.sd-opts-icon5 {
              background-image: url(../../../../assets/img/vehicle/cut5.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut5m.png);
              }
            }
          }
          .select_date {
            margin-top: 10px;
            .time-search {
              padding-bottom: 10px;
              display: flex;
              p {
                width: 20px;
              }
              .width212px {
                width: 212px;
              }
            }
          }
        }
      }
      .width232 {
        width: 100%;
      }
    }
    // 页面中部
    .info_center {
      height: 100%;
      width: 100%;
      background-color: #ffffff;
      .tab-menu {
        background-color: #fff;
        padding-top: 8px;
        overflow: hidden;
        border-bottom: 1px solid #f2f2f2;
        li {
          float: left;
          width: auto;
          font-size: 16px;
          margin: 0 20px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          color: #333;
          cursor: pointer;
        }
        .is-active {
          color: #0c70f8;
          border-bottom: 2px solid #0c70f8;
        }
      }
      .map_center_container {
        position: relative;
        overflow: hidden;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 100%;
        //关闭按钮
        .close-menu-c {
          @include close_menu;
          left: 0px;
        }
        //地图样式
        .gis_content {
          height: 100%;
          position: relative;
          overflow: hidden;
          .map_rm {
            width: 100%;
            height: 100%;
          }
          // 地图搜索
          .sd_search {
            position: absolute;
            top: 0.3rem;
            left: 0.3rem;
            z-index: 1000;
            background-color: #fff;
            overflow: hidden;
  
            > .sd_search_input {
              float: left;
              width: 360px;
              height: 36px;
              line-height: 36px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 10px 0px rgba(99, 99, 99, 0.39);
              border: 0;
              padding: 0 15px;
              border: none;
            }
            > span {
              float: left;
              width: 60px;
              height: 36px;
              line-height: 36px;
              background-color: #0c70f8;
              cursor: pointer;
              text-align: center;
              > i {
                position: relative;
                top: 2px;
                color: #fff;
                font-size: 20px;
              }
            }
          }
          //定位
          .map_control {
            position: absolute;
            bottom: 0.3rem;
            right: 0.2rem;
            transition: right 0.3s ease-out;
            animation: fadeInRight 0.4s ease-out 0.4s both;
            .photo_count_level {
              background: #fff;
              width: 0.68rem;
              padding: 0.1rem;
              font-size: 12px;
              text-align: center;
              margin-bottom: 0.2rem;
              .colors {
                padding-bottom: 0.1rem;
                > p {
                  color: #999999;
                }
                > div {
                  width: 0.48rem;
                  height: 0.1rem;
                  border-radius: 0.05rem;
                }
              }
              .colors:nth-of-type(1) > div {
                background: #fa453a;
              }
              .colors:nth-of-type(2) > div {
                background: #f4ba18;
              }
              .colors:nth-of-type(3) > div {
                background: #8949f3;
              }
              .colors:nth-of-type(4) > div {
                background: #6262ff;
              }
              .colors:nth-of-type(5) > div {
                background: #0c70f8;
              }
              .colors:nth-of-type(6) > div {
                background: #0d9df4;
              }
            }
            // 地图控制按钮
            .map_rrt_u2 {
              width: 0.68rem;
              text-align: center;
              padding: 0 0.1rem;
              font-size: 0.2rem;
              color: #1264f8;
              background-color: #fff;
              > li {
                line-height: 0.5rem;
                border-bottom: 1px solid #eee;
                padding: 0.1rem 0;
                cursor: pointer;
                &:last-child {
                  border-bottom: none;
                }
                > i {
                  margin-top: 0;
                  display: inline-block;
                }
              }
            }
          }
        }
      }
      .search_box {
        margin: 20px;
        .divide {
          border: 1px dashed #fafafa;
        }
      }
      .table_box {
        margin: 0 20px;
        .add_btn {
          margin-bottom: 10px;
        }
        .operation_btn {
          display: inline-block;
          padding: 0 10px;
          border-right: 1px solid #f2f2f2;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    .info_right {
      // 页面右边
      width: 496px;
      height: 100%;
      position: relative;
      background: white;
      > div {
        position: relative;
        height: 100%;
        float: left;
      }
      // 危险人物列表
      .danger_people_wrap {
        width: 476px;
        // margin-right: 28px;
        padding: 0 0px 20px 20px;
        // 摄像头名称
        .camera_name {
          font-size: 14px;
          line-height: 56px;
          height: 56px;
          color: #333333;
          border-bottom: 1px solid #d3d3d3;
          width: 428px;
          position: relative;
          > i {
            position: absolute;
            z-index: 10;
            right: 0;
            font-size: 16px;
            top: 20px;
            color: #999;
            cursor: pointer;
          }
        }
        .danger_people_list {
          padding-top: 28px;
          // 人员记录列表
          .people_item {
            width: 428px;
            position: relative;
            background: #fff;
            box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
            padding: 30px 0 30px 0px;
            overflow: hidden;
            margin-bottom: 25px;
            .swiper_contents {
              padding-left: 50px;
              position: relative;
              .shot_times {
                position: absolute;
                right: 0;
                top: -30px;
                padding: 0 16px;
                line-height: 20px;
                border-radius: 10px 0px 0px 10px;
                background: #e9e9e9;
                font-size: 12px;
                color: #555;
                text-align: center;
              }
            }
            .change_img {
              position: absolute;
              width: 12px;
              height: 26px;
              top: 80px;
              background: url("../../../../assets/img/icons.png") no-repeat;
              cursor: pointer;
            }
            // 点击变成上一张
            .swiper-button-prev {
              left: 22px;
              background-position: -990px -133px;
              &:hover {
                background-position: -972px -133px;
              }
            }
            // 点击下一张
            .swiper-button-next {
              right: 18px;
              background-position: -1038px -133px;
              &:hover {
                background-position: -1019px -133px;
              }
            }
            .img_warp {
              position: relative;
              width: 76px;
              height: 76px;
              float: left;
              border-radius: 3px;
              background: red;
              > img {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 3px;
              }
            }
            // 相似度
            .similarity {
              width: 88px;
              float: left;
              text-align: center;
              .similarity_count {
                font-size: 26px;
                line-height: 32px;
                // font-family:AuroraBT-BoldCondensed;
                color: #0c70f8;
              }
              .similarity_title {
                color: #333333;
                font-size: 12px;
                line-height: 18px;
                padding-bottom: 2px;
              }
            }
            // 人物信息
            .people_message {
              float: left;
              padding-left: 12px;
              .name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                line-height: 38px;
              }
              .tips_wrap {
                overflow: hidden;
                .tip {
                  float: left;
                  padding: 0 8px;
                  line-height: 30px;
                  background: #f2f2f2;
                  border: 1px solid #f2f2f2;
                  border-radius: 3px;
                }
                .tip + .tip {
                  margin-left: 8px;
                }
              }
            }
          }
        }
      }
      .right_black {
        width: 20px;
        background: #eaebed;
      }
    }
    .close-menu-o {
      @include close_menu;
      left: 0;
    }
  }
}
</style>

<style lang="scss">
.ms_marker_opt {
  > div {
    word-break: keep-all;
    white-space: nowrap;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 0 2px;
    > span {
      display: inline-block;
    }
    > i {
      display: inline-block;
      padding: 0 2px;
      font-size: 18px;
    }
    > .el-icon-check {
      display: none;
      color: #67c23a;
    }
    > .el-icon-close {
      color: #fa453a;
    }
    > .el-icon-edit {
      color: #e6a23c;
      font-size: 18px;
    }
  }
  &.ms_marker_rectang {
    left: 0px;
    bottom: 0px;
  }
  &.ms_marker_circle {
    left: 0;
    top: -10px;
  }
  &.ms_marker_polyline {
    left: -10px;
    top: -10px;
  }
  &.ms_marker_polygon {
    left: -10px;
    top: -10px;
  }
}
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {
  html {
    font-size: 60px !important;
  }
}
@media screen and (min-width: 1200px) and (max-width: 1439px) {
  html {
    font-size: 70px !important;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1679px) {
  html {
    font-size: 80px !important;
  }
}
@media screen and (min-width: 1680px) and (max-width: 1919px) {
  html {
    font-size: 90px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 100px !important;
  }
}
.qyryfx_wrap {
  // 搜索框
  .sd_search {
    .el-input__inner {
      border: none;
    }
  }
  //查询按钮
  .search_btn {
    padding-top: 10px;
    text-align: center;
    padding-bottom: 20px;
    .el-button {
      width: 110px;
    }
  }
  // 右边菜单
  .info_right {
    .similarity {
      .select_time {
        // position: relative;
        .el-input__inner {
          position: relative;
          height: 24px;
          border-radius: 12px;
          // width: 98px;
          // z-index: 10;
          // left: -5px;
        }
        .el-input__icon {
          line-height: normal;
        }
      }
    }
  }
  //弹窗
  .history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100% !important;
    }
    .el-dialog__title {
      font-size: 0.16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 0.76rem 0.3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem !important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: 0.02rem solid #ffffff;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .active {
        border-color: #0c70f8;
      }
    }
    .el-dialog__footer {
      button {
        width: 1.4rem !important;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
      }
    }
  }
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
  /* 地图标记 hover */
  .vl_map_hover {
    .vl_map_hover_main {
      width: 178px;
      text-align: center;
      padding: 20px 0;
      .name {
        color: #666;
        padding-bottom: 4px;
      }
      .num {
        color: #333;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}
</style>