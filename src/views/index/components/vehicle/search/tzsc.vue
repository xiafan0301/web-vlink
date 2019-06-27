<template>
  <!-- 特征搜车 -->
  <div class="tzsc_wrap">
    <!-- 面包屑通用样式 -->
    <div class="link_bread">
      <el-breadcrumb separator=">" class="bread_common">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>特征搜车</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sc_content">
      <!-- 通用的左边菜单 -->
      <div class="left_menu">
        <!-- 菜单表单 -->
        <vue-scroll>
          <div style="padding: 20px;">
            <!-- 选择搜车的类型 -->
            <div class="select_type">
              <el-radio-group v-model="selectType">
                <el-radio :label="1">从图片提取</el-radio>
                <el-radio :label="2">自定义特征</el-radio>
              </el-radio-group>
            </div>

            <div v-show="selectType === 1">
              <!-- 上传车像图片 -->
              <div class="upload_warp" @drop="drop($event)" @dragover="allowDrop($event)">
                <el-upload
                  @drop="drop($event)"
                  :class="{'vl_jtc_upload': true}"
                  :show-file-list="false"
                  accept="image/*"
                  :action="uploadAcion"
                  list-type="picture-card"
                  :before-upload="beforeAvatarUpload"
                  :on-success="uploadSucess"
                  :on-error="handleError"
                >
                  <i v-if="uploading" class="el-icon-loading"></i>
                  <img v-else-if="curImageUrl" :src="curImageUrl">
                  <div v-else>
                    <i
                      style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                      class="vl_icon vl_icon_vehicle_01"
                    ></i>
                    <span>点击上传图片</span>
                  </div>
                </el-upload>
                <p @click="showHistoryPic">从上传记录中选择</p>
                <div v-show="curImageUrl" class="del_icon">
                  <i class="el-icon-delete" @click="delPic"></i>
                </div>
              </div>
              <!-- 检索结果 -->
              <div class="characteristic">
                <div class="btn">获取特征</div>
                <div class="characteristic_list" v-if="characteristicList.length > 0">
                  <div
                    class="characteristic_item"
                    :title="item.isChecked ? '取消选择此特征': '选择此特征'"
                    :class="{ color_blue: item.isChecked }"
                    v-for="(item, index) in characteristicList"
                    :key="'characteristic_list' + index"
                    @click="item.isChecked = !item.isChecked;"
                  >{{item.desc}}</div>
                  <!-- 没有特征 -->
                </div>
              </div>
            </div>
            <!-- 表单 -->
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <!-- 自定义特征 -->
              <div v-show="selectType === 2">
                <el-form-item label="号牌类型" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.licenseType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="号牌颜色" label-width="90px" prop>
                  <el-select
                    v-model="tzscMenuForm.licenseColor"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆类型" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆颜色" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carColor" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆型号" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carModel" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="遮阳板" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.sunVisor" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年检标数量" label-width="90px" prop>
                  <el-select
                    v-model="tzscMenuForm.inspectionCount"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label prop="selectDate">
                <el-date-picker
                  v-model="tzscMenuForm.selectDate"
                  type="date"
                  class="width232"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>

              <!-- 选择设备 -->
              <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
              <div class="selected_device" @click="treeTabShow = true;">
                <i class="el-icon-arrow-down"></i>
                <!-- <i class="el-icon-arrow-up"></i> -->
                <div class="device_list" v-if="selectDeviceArr.length > 0">
                  <span>{{ selectDeviceArr[0]['name'] }}</span>
                  <span
                    v-show="selectDeviceArr.length > 1"
                    title="展开选中的设备"
                    class="device_count"
                  >+{{ selectDeviceArr.length - 1 }}</span>
                </div>
                <div class="no_device" v-else>选择设备</div>
                <!-- 树tab页面 -->
                <div class="device_tree_tab" v-show="treeTabShow">
                  <div style="overflow: hidden;">
                    <div
                      class="tab_title"
                      :class="{ 'current_title': index === selectedTreeTab }"
                      @click="selectedTreeTab = index;"
                      v-for="(item, index) in treeTabArr"
                      :key="'tab_title' + index"
                    >{{ item.name }}</div>
                  </div>
                  <!-- 视频树 -->
                  <div class="tree_content" v-show="selectedTreeTab === 0">
                    <vue-scroll>
                      <div class="checked_all">
                        <el-checkbox
                          :indeterminate="isIndeterminate"
                          v-model="checkAllTree"
                          @change="handleCheckedAll"
                        >全选</el-checkbox>
                      </div>
                      <el-tree
                        @check="listenChecked"
                        :data="videoTree"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="videotree"
                        highlight-current
                        :props="defaultProps"
                      ></el-tree>
                    </vue-scroll>
                  </div>
                  <!-- <div class="tree_content" v-show="selectedTreeTab === 1">
                    <vue-scroll>
                      <div class="checked_all">
                        <el-checkbox
                          :indeterminate="isIndeterminate"
                          v-model="checkAllTree"
                          @change="handleCheckedAll"
                        >全选</el-checkbox>
                      </div>
                      <el-tree
                        @check="listenChecked"
                        :data="bayonetTree"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                      ></el-tree>
                    </vue-scroll>
                  </div> -->
                </div>
              </div>
            </el-form>
            <!-- 按钮样式 -->
            <div class="btn_warp">
              <el-button class="reset_btn">重置</el-button>
              <el-button class="select_btn">确定</el-button>
            </div>
          </div>
        </vue-scroll>
      </div>
      <!-- 通用的右边列表 -->
      <div class="right_img_list">
        <!-- 排序和结果 -->
        <div class="result_sort">
          <h3 class="result">检索结果（{{ strucInfoList.length }}）</h3>
          <div class="sort">
            <div class="sort_item" :class="{ 'active_sort': sortType === 1 }" @click="clickTime">
              时间排序
              <i
                :class="{'el-icon-arrow-down': timeSortType, 'el-icon-arrow-up': !timeSortType }"
              ></i>
            </div>
            <div
              class="sort_item"
              :class="{ 'active_sort': sortType === 2 }"
              @click="clickVideo"
            >监控排序</div>
          </div>
        </div>
        <!-- 图片列表 -->
        <div class="img_list">
          <vue-scroll>
            <div
              class="img_item"
              @click="showStrucInfo"
              v-for="(item, index) in strucInfoList"
              :key="'img_list' + index"
            >
              <div class="img_wrap">
                <img
                  @dragstart="drag($event)"
                  title="拖动图片上传"
                  draggable="true"
                  src="../../../../../assets/img/not-content.png"
                >
              </div>
              <div class="text_wrap">
                <h3 class="text_name">检索资料</h3>
                <div class="text_message">
                  <i class="vl_icon vl_icon_retrieval_01"></i>
                  <span>{{item.time}}</span>
                </div>
                <div class="text_message">
                  <i class="vl_icon vl_icon_retrieval_02"></i>
                  <span>{{item.video}}</span>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!--上传记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片"
    >
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis">
        <i class="el-icon-loading"></i>
      </div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div
          class="his-pic-item"
          :class="{'active': item.checked}"
          v-for="item in historyPicList"
          :key="item.uid"
          @click="chooseHisPic(item)"
        >
          <img :src="item.path" alt>
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <!-- <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button> -->
      </div>
    </el-dialog>

    <!--检索详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false"
    >
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="showSim ? sturcDetail.uploadPath : sturcDetail.panoramaPath" alt>
            <span>{{showSim ? '上传图' : '全景图'}}</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.photoPath" alt>
              <i v-show="showSim">全景图</i>
            </div>
            <div class="struc_c_d_info">
              <h2>
                对比信息
                <div class="vl_jfo_sim" v-show="showSim">
                  <i class="vl_icon vl_icon_retrieval_03"></i>
                  {{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}
                  <span
                    style="font-size: 12px;"
                  >%</span>
                </div>
              </h2>
              <div class="struc_cdi_line">
                <span :title="sturcDetail.feature">{{sturcDetail.feature}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>
                  {{sturcDetail.shotTime}}
                  <i class="vl_icon vl_icon_retrieval_01"></i>
                </span>
              </div>
              <div class="struc_cdi_line">
                <span>
                  {{sturcDetail.deviceName}}
                  <i class="vl_icon vl_icon_retrieval_02"></i>
                </span>
              </div>
              <div class="struc_cdi_line">
                <span>
                  {{sturcDetail.address}}
                  <i class="vl_icon vl_icon_retrieval_04"></i>
                </span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>抓拍信息</span>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.photoPath" alt>
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn">
            <a download="视频" :href="videoUrl"></a>下载视频
          </div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div
              class="swiper_img_item"
              :class="{'active': index === curImgIndex}"
              @click="imgListTap(item, index)"
            >
              <img style="width: 100%; height: .88rem;" :src="item.photoPath" alt>
              <div class="vl_jfo_sim" v-show="showSim">
                <i
                  class="vl_icon vl_icon_retrieval_05"
                  :class="{'vl_icon_retrieval_06':  index === curImgIndex}"
                ></i>
                {{item.semblance ? item.semblance : 92}}
                <span
                  style="font-size: 12px;"
                >%</span>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ajaxCtx } from "@/config/config";
import BigImg from "@/components/common/bigImg.vue";
import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList
} from "../../../api/api.judge.js";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      selectType: 1,
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: true, // true为时间正序， false为时间倒序
      characteristicList: [
        // "湘H3A546", "红色", "有挂饰"
        {
          desc: "湘H3A546",
          isChecked: false
        },
        {
          desc: "红色",
          isChecked: false
        },
        {
          desc: "有挂饰",
          isChecked: false
        }
      ], // 车辆的特征数组
      // 菜单表单变量
      tzscMenuForm: {
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: "",
        sunVisor: "",
        inspectionCount: ""
      },
      rules: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      // 上传图片变量
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      uploadFileList: [],
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
      imgData: null,
      // 选择设备的数据
      isIndeterminate: false, // 是否处于全选与全不选之间
      checkAllTree: false, // 树是否全选
      bayonetTree: [
        {
          id: 1,
          label: "卡口一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        }
      ], // 卡口树
      videoTree: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        },
        {
          id: 13,
          label: "一级 4",
          children: [
            {
              id: 17,
              label: "二级 4-1"
            },
            {
              id: 18,
              label: "二级 4-2"
            }
          ]
        }
      ],
      videoTreeNodeCount: 0, // 摄像头节点数量
      bayonetTreeNodeCount: 0, // 卡口节点数量
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectDeviceArr: [
        // 选中的设备数组
        {
          name: "摄像头1"
        },
        {
          name: "摄像头2"
        }
      ],
      selectedTreeTab: 0, // 当前选中的
      treeTabArr: [
        {
          name: "摄像头"
        },
        {
          name: "卡口"
        }
      ],
      treeTabShow: false,
      // 检索详情弹窗变量
      strucInfoList: [
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002",
          id: ""
        }
      ], // 检索列表数据
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 18,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      strucDetailDialog: false, // 弹窗是否展示
      playing: false, // 视频播放是否
      strucCurTab: 1,
      showSim: false, // 展示相似度排序
      curImgIndex: 0, // 当前图片index
      sturcDetail: {},
      videoUrl: "" // 弹窗视频回放里的视频
    };
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
  },
  mounted() {
    this.getLeafCountTree(this.videoTree);
  },
  methods: {
    // 处理树全选时间
    handleCheckedAll(val) {
      this.isIndeterminate = false;
      if (val) {
        this.$refs.videotree.setCheckedNodes(this.videoTree);
      } else {
        this.$refs.videotree.setCheckedNodes([]);
      }
    },
    getLeafCountTree(json) { // 获取树节点的数量
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          this.videoTreeNodeCount++;
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTree(json[i].children);
        } else {
          continue;
        }
      }
    },
    listenChecked(val, val1) {
      if (val1.checkedNodes.length === this.videoTreeNodeCount) {
        this.isIndeterminate = false;
        this.checkAllTree = true;
      } else if (val1.checkedNodes.length < this.videoTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTree = false;
        this.isIndeterminate = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTree = false;
        this.isIndeterminate = false;
      }
    },
    // tab的方法
    chooseDevice() {
      // 选择了树的设备
      console.log(this.$refs.videotree.getCheckedNodes());
      this.treeTabShow = false;
    },
    clickTime() {
      if (this.sortType === 1) {
        this.timeSortType = !this.timeSortType;
      } else if (this.sortType === 2) {
        this.sortType = 1;
      }
    },
    clickVideo() {
      this.sortType = 2;
    },
    videoTap() {
      // 播放视频
      let vDom = document.getElementById("capVideo");
      if (this.playing) {
        vDom.pause();
      } else {
        vDom.play();
      }
      vDom.addEventListener("ended", e => {
        e.target.currentTime = 0;
        this.playing = false;
      });
      this.playing = !this.playing;
    },
    showStrucInfo(data, index) {
      this.curImgIndex = index;
      this.strucDetailDialog = true;
      // this.sturcDetail = data;
      // this.drawPoint(data);
    },
    imgListTap(data, index) {
      this.curImgIndex = index;
      this.sturcDetail = data;
      // this.drawPoint(data);
    },
    // 上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("只能上传 JPG / PNG 格式图片!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    //上传成功
    uploadSucess(response, file, fileList) {
      this.uploading = false;
      /* this.compSim = '';
      this.compSimWord = ''; */
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          JtcPOSTAppendixInfo(x).then(jRes => {
            if (jRes) {
              x["uid"] = jRes.data;
              console.log(x);
            }
          });
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
      this.uploadFileList = fileList;
    },
    //上传失败
    handleError() {
      this.uploading = false;
      this.$message.error("上传失败");
    },
    //获取上传记录
    showHistoryPic() {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      };
      JtcGETAppendixInfoList(params)
        .then(res => {
          if (res) {
            this.loadingHis = false;
            res.data.forEach(x => (x.checked = false));
            this.historyPicList = res.data;
          }
        })
        .catch(() => {
          this.historyPicDialog = false;
        });
    },
    //删除图片
    delPic() {
      this.uploadFileList.splice(0, 1);
      this.curImageUrl = "";
    },
    //选择最近上传的图片
    chooseHisPic(item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      });
      item.checked = true;
    },
    //从历史上传图片中上传
    // addHisToImg () {
    //   this.historyPicDialog = false;
    //   let _ids = [];
    //   this.choosedHisPic.forEach(x => {
    //     _ids.push(x.uid)
    //     this.curImageUrl = x.path;
    //     this.imgData = x;
    //   })
    //   let _obj = {
    //     appendixInfoIds: _ids.join(',')
    //   }
    //   JtcPUTAppendixsOrder(_obj);
    // },
    drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.currentSrc);
    },
    drop(e) {
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: "拖拽图片" + Math.random(),
        filePathName: "拖拽图片" + Math.random(),
        path: e.dataTransfer.getData("Text")
      };
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x["uid"] = jRes.data;
          console.log(x);
        }
      });
    },
    allowDrop(e) {
      e.preventDefault();
    }
  }
};
</script>
<style lang="scss" scoped>
.tzsc_wrap {
  height: 100%;
  position: relative;
  // 面包屑样式
  .link_bread {
    height: 60px;
    background: #fff;
    .bread_common {
      padding: 23px 0 0 20px;
    }
  }
  // 搜车主体页面
  .sc_content {
    height: calc(100% - 60px);
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // 左边菜单样式
    .left_menu {
      width: 272px;
      position: relative;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      height: 100%;
      // 菜单的表单
      .width232 {
        width: 232px;
      }
      .width132 {
        width: 132px;
      }
      // 选择搜车类型
      .select_type {
        padding-bottom: 20px;
      }
      // 特征
      .characteristic {
        margin: 10px 0 38px 0;
        .btn {
          line-height: 30px;
          height: 30px;
          background: #f2f2f2;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
          text-align: center;
          color: #666666;
          cursor: pointer;
        }
        .characteristic_list {
          min-height: 40px;
          padding-bottom: 20px;
          overflow: hidden;
          border-bottom: 1px solid #d3d3d3;
          .characteristic_item {
            float: left;
            padding: 8px 16px;
            font-size: 12px;
            background: #fafafa;
            border: 1px solid #f2f2f2;
            border-radius: 3px;
            margin: 10px 10px 0 0;
            cursor: pointer;
            color: #999;
          }
          .no_characteristic_list {
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: #999;
          }
          .color_blue {
            color: #0c70f8;
          }
        }
      }
      // 选择设备下拉
      .selected_device {
        margin-bottom: 20px;
        position: relative;
        width: 232px;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding-left: 12px;
        > i {
          position: absolute;
          right: 12px;
          top: 13px;
        }
        &:hover,
        &:focus {
          border-color: #0c70f8;
          cursor: pointer;
        }
        .device_list {
          line-height: 40px;
          font-size: 14px;
          color: #333;
          .device_count {
            color: #0c70f8;
            margin-left: 20px;
          }
        }
        .no_device {
          line-height: 40px;
          color: #999999;
        }
        // 树tab
        .device_tree_tab {
          position: absolute;
          top: 50px;
          left: -1px;
          z-index: 100;
          background: #fff;
          width: 232px;
          height: 350px;
          border-radius: 4px;
          border: 1px solid #d3d3d3;
          .tab_title {
            width: 50%;
            float: left;
            background: #f2f2f2;
            text-align: center;
            color: #666666;
            line-height: 30px;
            font-size: 12px;
          }
          .current_title {
            background: #fff;
          }
          // 树
          .tree_content {
            height: 310px;
            padding-top: 10px;
            .checked_all {
              padding: 0 0 8px 23px;
            }
          }
        }
      }
      // 关闭设备tab
      .selected_device_comp {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        opacity: 0;
        z-index: 10;
      }
      // 按钮
      .btn_warp {
        padding-bottom: 350px;
        .select_btn {
          background: #0c70f8;
          color: #ffffff;
          width: 110px;
        }
        .reset_btn {
          background: #ffffff;
          border: 1px solid #dddddd;
          color: #666666;
          width: 110px;
        }
      }
      // 上传
      .upload_warp {
        position: relative;
        height: 232px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        &:hover {
          background: #2981f8;
          > p {
            display: block;
          }
          .del_icon {
            display: block;
          }
        }
        .vl_jtc_upload {
          width: 100%;
          height: 100%;
          background: none;
        }
        > p {
          display: none;
          position: absolute;
          bottom: 0;
          text-align: center;
          width: 100%;
          color: #ffffff;
          height: 40px;
          line-height: 40px;
          -webkit-border-radius: 0 0 10px 10px;
          -moz-border-radius: 0 0 10px 10px;
          border-radius: 0 0 10px 10px;
          background: #0c70f8;
        }
        .vl_jtc_ic_input {
          position: absolute;
          top: 0.2rem;
          width: 3rem;
          height: 0.26rem;
          left: 0.2rem;
          border: 1px solid #d3d3d3;
          -webkit-border-radius: 0.13rem;
          -moz-border-radius: 0.13rem;
          border-radius: 0.13rem;
          padding: 0 0.02rem;
          background: #ffffff;
          .el-form-item__content {
            height: 0.23rem;
            line-height: 0.23rem;
          }
          input {
            border: none !important;
            height: 0.23rem;
            line-height: 0.23rem;
          }
        }
        .del_icon {
          display: none;
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          color: #ffffff;
        }
      }
    }
    // 右边图片列表
    .right_img_list {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
      padding: 24px 20px 20px 20px;
      // 检索结果与排序
      .result_sort {
        overflow: hidden;
        .result {
          font-size: 14px;
          color: #666;
          float: left;
        }
        .sort {
          font-size: 14px;
          width: 220px;
          height: 14px;
          margin: 0 auto;
          .sort_item {
            text-align: center;
            width: 110px;
            float: left;
            color: #999;
            cursor: pointer;
          }
          .active_sort {
            color: #2580fc;
            i {
              color: #2580fc;
            }
          }
        }
      }
      // 图片列表
      .img_list {
        height: calc(100% - 19px);
        .img_item {
          cursor: pointer;
          width: 380px;
          padding: 20px;
          margin: 20px 20px 0 0;
          background: #fff;
          overflow: hidden;
          float: left;
          // 图片包裹
          .img_wrap {
            width: 138px;
            height: 138px;
            float: left;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              display: block;
              cursor: move;
            }
          }
          // 文字的包裹
          .text_wrap {
            padding-left: 10px;
            float: left;
            // 标题
            .text_name {
              font-size: 14px;
              color: #999;
              padding-bottom: 5px;
            }
            // 检索的资料信息
            .text_message {
              margin-top: 8px;
              padding: 0 12px;
              font-size: 12px;
              background: #fafafa;
              border: 1px solid #f2f2f2;
              border-radius: 3px;
              overflow: hidden;
              > i {
                margin-top: 3px;
                float: left;
              }
              > span {
                line-height: 26px;
                float: left;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
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
.tzsc_wrap {
  // 上传
  .upload_warp .vl_jtc_upload {
    .el-upload {
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      border: none;
      span {
        color: #999;
      }
      img {
        width: 100%;
        height: 100%;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }
    }
  }
  // 抓拍详情弹窗
  .struc_detail_dialog {
    .el-dialog {
      max-width: 13.06rem;
      width: 100% !important;
    }
    .el-dialog__header {
      display: none;
    }
    .struc_tab {
      height: 1.16rem;
      padding: 0.3rem 0;
      position: relative;
      color: #999999;
      span {
        display: inline-block;
        margin-right: 0.55rem;
        padding-bottom: 0.1rem;
        cursor: pointer;
      }
      .active {
        color: #0c70f8;
        border-bottom: 2px solid #0c70f8;
      }
      i {
        display: block;
        position: absolute;
        top: 0.3rem;
        right: 0px;
        cursor: pointer;
      }
    }
    .struc_main {
      width: 11.46rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #f2f2f2;
      .struc_c_detail {
        width: 100%;
        height: 3.6rem;
        > div {
          float: left;
        }
        .struc_c_d_img {
          width: 3.6rem;
          height: 3.6rem;
          background: #eaeaea;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          i {
            display: block;
            position: absolute;
            top: 0.1rem;
            right: 0.1rem;
            line-height: 0.26rem;
            height: 0.26rem;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 0.13rem;
            font-style: normal;
            color: #0c70f8;
            font-size: 12px;
            padding: 0 0.1rem;
          }
        }
        .struc_c_d_qj {
          margin-right: 0.3rem;
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
            transform: rotate(-45deg);
            border: 0.5rem solid #0c70f8;
            border-color: transparent transparent #0c70f8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 0.6rem;
            height: 0.6rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
          box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          > div {
            float: left;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            padding-left: 0.24rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: 0.74rem;
              padding-right: 1rem;
              .vl_jfo_sim {
                color: #0c70f8;
                font-weight: bold;
                font-size: 0.24rem;
                float: right;
                i {
                  vertical-align: text-bottom;
                  margin-right: 0.1rem;
                }
                span {
                  font-weight: normal;
                }
              }
            }
            .struc_cdi_line {
              span {
                /*position: relative;*/
                max-width: 100%;
                display: inline-block;
                height: 0.3rem;
                line-height: 0.3rem;
                margin-bottom: 0.08rem;
                border: 1px solid #f2f2f2;
                background: #fafafa;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius: 3px;
                font-size: 12px;
                overflow: hidden;
                padding: 0 0.1rem;
                margin-right: 0.08rem;
                > i {
                  vertical-align: middle;
                  margin-left: 0.1rem;
                }
              }
            }
          }
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.7rem;
            right: -0.7rem;
            transform: rotate(-46deg);
            border: 0.7rem solid #0c70f8;
            border-color: transparent transparent transparent #0c70f8;
          }
          &:after {
            display: block;
            content: "";
            position: absolute;
            top: -0.4rem;
            right: -0.4rem;
            transform: rotate(-45deg);
            border: 0.4rem solid #ffffff;
            border-color: transparent transparent transparent #ffffff;
          }
          > span {
            display: block;
            position: absolute;
            top: 0.19rem;
            right: 0.19rem;
            width: 1rem;
            height: 1rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 99;
          }
        }
      }
      .struc_c_address {
        height: 100%;
        #capMap {
          width: 100%;
          height: 100%;
        }
      }
    }
    .struc-list {
      width: 12.46rem;
      margin: 0 auto;
      padding: 0.44rem 0 0.34rem 0;
      .swiper-container {
        padding: 0.02rem 0.5rem;
        &:before {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          left: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        &:after {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        .swiper-button-next {
          right: 0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-slide {
          .swiper_img_item {
            cursor: pointer;
            border: 1px solid #ffffff;
            padding: 2px;
            .vl_jfo_sim {
              font-size: 0.14rem;
              height: 0.3rem;
              margin-top: 0;
              /*display: inline-block;*/
              white-space: nowrap;
              text-align: center;
              color: #999999;
              i {
                margin-right: 0;
              }
            }
          }
          .active {
            border-color: #0c70f8;
            .vl_jfo_sim {
              color: #0c70f8;
            }
          }
        }
      }
    }
  }
  // 历史图片弹窗
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
}
</style>
