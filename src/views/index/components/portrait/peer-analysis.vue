<template>
  <div class="peer-analysis">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item>同行分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export-color">导出</el-button>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
        <div class="input-box">
          <vue-scroll>
            <div class="th-upload-box">
              <el-upload
                :class="{'vl_jtc_upload': true}"
                :show-file-list="false"
                accept="image/*"
                :action="uploadAcion"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSucess"
                :on-error="handleError">
                <i v-if="uploading" style="position: absolute;top: 108px;right: 108px;" class="el-icon-loading"></i>
                <div v-else>
                  <i style="width:100px;height: 85px;opacity: .5; position: absolute;top: -15px;left: 0;right: 0;bottom: 0;margin: auto;"
                    class="vl_icon vl_icon_vehicle_01"></i>
                  <span style="position: absolute;bottom: 15px;left: 79px;color: #999;">点击上传图片</span>
                </div>
              </el-upload>
            </div>
            <div class="input-box-line">
              <p class="title"><span>开</span><span>始</span></p>
              <el-date-picker align="right" :picker-options="pickerOptions1" v-model="startDate" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
            </div>
            <div class="input-box-line">
              <p class="title"><span>结</span><span>束</span></p>
              <el-date-picker v-model="endDate" :picker-options="pickerOptions2" :disabled="isSelect" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
            </div>

            <!-- 选择设备 -->
            <!-- treeTabShow 为展开 -->
            <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
            <div class="selected_device" @click="treeTabShow = true;">
              <i v-if="treeTabShow" class="el-icon-arrow-up"></i>
              <i v-else class="el-icon-arrow-down"></i>
              <div class="device_list" v-if="selectDeviceArr.length > 0">
                <span>{{ selectDeviceArr[0].label }}</span>
                <span v-show="selectDeviceArr.length > 1" title="展开选中的设备" class="device_count">+{{ selectDeviceArr.length - 1 }}</span>
              </div>
              <!-- placeholder -->
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
                        @change="handleCheckedAllVideo"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                      @check="listenCheckedVideo"
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
                <div class="tree_content" v-show="selectedTreeTab === 1">
                  <vue-scroll>
                    <div class="checked_all">
                      <el-checkbox
                        :indeterminate="isIndeterminateBayonet"
                        v-model="checkAllTreeBayonet"
                        @change="handleCheckedAllBayonet"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                      @check="listenCheckedBayonet"
                      :data="bayonetTree"
                      show-checkbox
                      default-expand-all
                      node-key="id"
                      ref="bayonetTree"
                      highlight-current
                      :props="defaultProps"
                    ></el-tree>
                  </vue-scroll>
                </div>
              </div>
            </div>

            <div class="input-box-line">
              <el-select v-model="filterObj.surveillanceId" placeholder="同行间隔" style="width: 100%;">
                <el-option
                  v-for="item in controlCarList"
                  :key="item.uid"
                  :label="item.name"
                  :value="item.uid">
                </el-option>
              </el-select>
            </div>

            <div class="left_num">
              <el-input class="left-none-border" v-model="filterObj.minShotTimes" maxlength="3">
                <template slot="prepend">同行次数不少于</template>
              </el-input>
              <span><b style="font-weight: normal;color: #333;">次</b>（2-100）</span>
            </div>
            <div class="left_btn">
              <el-button class="reset_btn" :loading="resetLoading" @click="onReset">重置</el-button>
              <el-button class="select_btn" :loading="searchLoading" @click="onSearch">查询</el-button>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="the-right-result">
        <div class="the-result-box-peer">
          <vue-scroll>
            <div class="list-box">
              <div class="list-item" v-for="item in '123123123123123'" :key="item.id">
                <img src="../../../../assets/img/666.jpg" alt="">
                <p class="time"><i></i>2018.-11-12  13:14:15</p>
                <p class="address"><i></i>抓拍设备:抓拍名称京广高速</p>
              </div>
              <el-pagination
                class="cum_pagination th-center-pagination"
                @current-change="onPageChange"
                :current-page.sync="currentPage"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="32">
              </el-pagination>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>                        
  </div>
</template>

<script>
import { ajaxCtx, mapXupuxian } from "@/config/config";
// import {
//   JtcPOSTAppendixInfo
// } from "@/views/index/api/api.judge.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { objDeepCopy } from "@/utils/util.js";
// formatDate
export default {
  data () {
    return {
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      exportLoadingbtn: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      isSelect: false,
      pagination: {
        pageNum: 1,
        pageSize: 15
      },
      currentPage: 1,
      controlCarList: [
        {
          uid: 0,
          name: '一分钟'
        }, {
          uid: 1,
          name: '三分钟'
        }, {
          uid: 2,
          name: '六分钟'
        }, {
          uid: 3,
          name: '九分钟'
        },
      ],
      filterObj: {
        startDate: null,
        endDate: null,
        surveillanceId: null,
        minShotTimes: null
      },
      startDate: new Date() - (24 * 60 * 60 * 1000),
      endDate: new Date() - (24 * 60 * 60 * 1000),
      resetLoading: false,
      searchLoading: false,
      // 选择设备的数据
      isIndeterminate: false, // 是否处于全选与全不选之间
      checkAllTree: false, // 树是否全选
      isIndeterminateBayonet: false, // 是否处于全选与全不选之间
      checkAllTreeBayonet: false, // 树是否全选
      bayonetTree: [], // 卡口树
      videoTree: [],
      videoTreeNodeCount: 0, // 摄像头节点数量
      bayonetTreeNodeCount: 0, // 卡口节点数量
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectDeviceArr: [], // 选中的设备数组
      selectVedioArr: [], // 选中的摄像头数组
      selectBayonetArr: [], // 选中的卡口数组
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
      uploading: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  watch: {
    startDate: {
      handler (val) {
        if (val) {
          this.isSelect = false
        } else {
          this.isSelect = true
        }
      },
      deep: true
    },
    endDate: {
      handler (val) {
        if (val && val - this.startDate > 2 * 24 * 60 *60 *1000) {
          this.$message.error("最大时间段为3天，超过开始时间3天（72小时）后的时间不可选择!")
          this.endDate = this.startDate + 2 * 24 * 60 *60 *1000
        }
        if (val && val - this.startDate < 0) {
          this.$message.error("结束时间必须大于开始时间！")
          this.endDate = this.startDate
        }
      },
      deep: true
    }
  },
  mounted() {
    //获取摄像头卡口数据
    this.getMonitorList()
  },
  methods: {
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
          // JtcPOSTAppendixInfo(x).then(jRes => {
          //   if (jRes) {
          //     x["uid"] = jRes.data;
          //     console.log(x);
          //   }
          // });
          console.log(x)
        }
      }
      this.uploadFileList = fileList;
    },
    //上传失败
    handleError() {
      this.uploading = false;
      this.$message.error("上传失败");
    },
    /**
     * 获取摄像头卡口信息列表
     */
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.videoTree = this.getTreeList(camera);
          this.bayonetTree = this.getBayTreeList(bayonet);
          this.getLeafCountTree(this.videoTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet');
        }
      });
    },
    /**
     * 获取摄像头数据
     */
    getTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.deviceBasicList && item.deviceBasicList.length > 0) {
          item['children'] = item.deviceBasicList
          delete(item.deviceBasicList)
          for(let key of item['children']) {
            key['label'] = key.deviceName
            key['id'] = key.uid
            key['treeType'] = 1
          }
        }
      }
      return data;
    },
    /**
     * 获取卡口数据
     */
    getBayTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.bayonetList && item.bayonetList.length > 0) {
          item['children'] = item.bayonetList
          delete(item.bayonetList)
          for(let key of item['children']) {
            key['label'] = key.bayonetName
            key['id'] = key.uid
            key['treeType'] = 2
          }
        }
      }
      return data;
    },
    /**
     * 摄像头树全选按钮点击
     */
    handleCheckedAllVideo(val) {
      this.isIndeterminate = false;
      if (val) {
        this.$refs.videotree.setCheckedNodes(this.videoTree);
      } else {
        this.$refs.videotree.setCheckedNodes([]);
      }
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理摄像头树全选按钮
     */
    listenCheckedVideo(val, val1) {
      console.log(val)
      // console.log(val1)
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
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
    /**
     * 卡口树全选按钮点击
     */
    handleCheckedAllBayonet(val) {
      this.isIndeterminateBayonet = false;
      if (val) {
        this.$refs.bayonetTree.setCheckedNodes(this.bayonetTree);
      } else {
        this.$refs.bayonetTree.setCheckedNodes([]);
      }
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理卡口树全选按钮
     */
    listenCheckedBayonet(val, val1) {
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.bayonetTreeNodeCount) {
        this.isIndeterminateBayonet = false;
        this.checkAllTreeBayonet = true;
      } else if (val1.checkedNodes.length < this.bayonetTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = false;
      }
    },
    /**
     * 获取摄像头树节点的数量
     */
    getLeafCountTree(json, type) {
      // 获取树节点的数量
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          if (type === "camera") {
            this.videoTreeNodeCount++;
          } else {
            this.bayonetTreeNodeCount++;
          }
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTree(json[i].children, type);
        } else {
          continue;
        }
      }
    },
    /**
     * 获取卡口树节点的数量
     */
    getLeafCountTreeBayonet(json) {
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          this.bayonetTreeNodeCount++;
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTreeBayonet(json[i].children);
        } else {
          continue;
        }
      }
    },
    // 选中的设备数量处理
    handleData() {
      this.selectDeviceArr = [...this.selectVedioArr, ...this.selectBayonetArr].filter(key => key.treeType);
      // console.log('选中的数据', this.selectDeviceArr);
    },
    /**
     * 树选择框关闭
     */
    chooseDevice() {
      this.treeTabShow = false
      console.log('选中的数据', this.selectDeviceArr)
    },
    /**
     * 导出按钮
     */
    onExport () {
      this.exportLoadingbtn = true
    },
    /**
     * 重置按钮
     */
    onReset () {
      this.resetLoading = true
      this.isSelect = true
      this.startDate = null
      this.endDate = null
      let obj = {
        startDate: null,
        endDate: null,
      }
      this.filterObj = Object.assign({}, obj)
      this.resetLoading = false
    },
    /**
     * 查询按钮
     */
    onSearch () {
      this.searchLoading = true
      this.searchLoading = false
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>

<style lang="scss" scoped>
.peer-analysis {
  width: 100%; height: 100%;
  .the-bottom {
    width: 100%;height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 0 20px 15px;
      position: relative;
      .input-box {
        width: 100%;
        height: calc(100% - 50px);
        overflow: hidden;
        // 选择设备下拉
        .selected_device {
          margin-bottom: 10px;
          position: relative;
          width: 240px;
          height: 40px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding-left: 15px;
          > i {
            position: absolute;
            right: 12px;
            top: 13px;
          }
          &:hover,
          &:focus {
            // border-color: #0c70f8;
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
            width: 240px;
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
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
        .left_num{
          display: flex;
          padding-bottom: 10px;
          .el-input{
            width: 175px;
          }
          > span{
            margin-left: 4px;
            line-height: 40px;
            color: #999;
            font-size: 12px;
          }
        }
        .add-vehicle-number {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #909399;
          cursor: pointer;
          i {
            font-size: 20px;
            vertical-align: text-top;
          }
        }
      }
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-result-box-peer {
        width: 100%; height: 100%;
        background: #F6F8F9;
        .list-box {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          flex-flow: row wrap;
          // height: calc(100% - 45px);
          .list-item {
            width: 24%;
            height: 344px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fff;
            margin-left: 1.3%;
            &:nth-child(4n - 3) {
              margin-left: 0;
            }
            img {
              display: inline-block;
              width: 100%;
              height: calc(100% - 70px);
            }
            p {
              font-size: 14px;
              font-family: 'MicrosoftYaHei';
              font-weight: 500;
              color: #333;
              i {
                color: #999;
                margin-right: 3px;
                display: block;
                width: 15px;
                height: 15px;
              }
            }
            .time {
              display: flex;
              align-items: center;
              padding: 10px 0 5px 0;
              i {
                background: url("../../../../assets/img/the-time.png") no-repeat;
                background-size: 15px 15px;
              }
            }
            .address {
              display: flex;
              align-items: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              i {
                background: url("../../../../assets/img/the-daynoint.png") no-repeat;
                background-size: 15px 15px;
              }
            }
          }
        }
        .th-center-pagination {
          width: 100%;
          text-align: center;
          padding: 0 0 20px 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.input-box-line {
  .el-input__inner::placeholder {
    color: #999999;
  }
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }
  .el-input-group__prepend {
    background: #fff;
    padding: 0 5px;
  }
  .el-date-editor {
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {right: 5px;left: auto;}
  }
}
.left_num {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6 !important;
  } 
  .left-none-border {
    .el-input__inner {
      border-left: none;
    }
    .el-input-group__prepend {
      background-color: #fff;
      color: #999;
      padding: 0 5px 0 10px;
    }
  }
}
.the-left-search {
  .left_btn{
    padding-top: 10px;
    padding-left: 10px;
    .select_btn, .reset_btn {
      width: 110px;
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
}
.th-upload-box {
  width: 242px;
  height: 242px;
  margin-bottom: 15px;
  .vl_jtc_upload {
    width: 100%;
    height: 100%;
    background: none;
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }
  .el-upload--picture-card:hover,
  .el-upload:focus {
    border-color: transparent;
    color: #999;
  }
}
</style>
