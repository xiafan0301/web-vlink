<template>
  <div class="identy_container">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[
          {name: '人像侦查', routerName: 'portrait_menu'},
          {name: '身份核实'}]">
      </div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <div class="upload_box">
            <div @drop="dropImg($event)" @dragover="allowDrop($event)">
              <el-upload
                :disabled="isAddImgDisabled"
                ref="uploadPic"
                accept="image/*"
                :limit="3"
                :action="uploadUrl"
                list-type="picture-card"
                :show-file-list="false"
                :on-success="uploadPicSuccess"
                :on-exceed="uploadPicExceed"
                :before-upload="beforeAvatarUpload"
                :file-list="fileList">
                <i v-if="uploading" class="el-icon-loading"></i>
                <img v-else-if="curImageUrl" :src="curImageUrl">
                <i v-else class="vl_icon vl_icon_vehicle_01"></i>
                <p class="upload_text" v-show="!curImageUrl">点击上传图片</p>
                <p class="history" @click="showHistoryPic($event)" v-show="fileList.length < 3">从上传记录中选择</p>
              </el-upload>
            </div>
            <div class="img_list">
              <div class="img_box" v-for="(item, index) in fileList" :key="index">
                <img :src="item.path ? item.path : ''" alt="">
                <div class="delete_box" v-show="item.path">
                  <i class="vl_icon vl_icon_manage_8" @click="deleteImg(index)"></i>
                </div>
              </div>
            </div>
            <div class="divide"></div>
          </div>
          <el-form class="left_form" :model="searchForm" ref="searchForm" :rules="searchRules">
            <el-form-item prop="similarity">
              <el-input placeholder="填写相似度(数字)" v-model="searchForm.similarity" style="width: 80%" type="text"></el-input>
              <span style="margin-left: 10px;">- 100</span>
            </el-form-item>
            <el-form-item prop="idNo">
              <el-input placeholder=" 请填写证件号码" v-model="searchForm.idNo" type="text"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
              <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData('searchForm')">查询</el-button>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="right">
        <template v-if="dataList && dataList.length > 0">
          <vue-scroll>
            <div class="content_top">
              <p>
                <span>检索结果</span>
                <span>({{dataList.length}})</span>
                <span style="color: #999999;font-size: 12px; margin-left: 10px;">tip：可拖动下方图片上传至左侧检索区进行检索</span>
              </p>
            </div>
            <div class="result_detail">
              <ul class="clearfix">
                <li v-for="(item, index) in dataList" :key="index" @click="showStrucInfo(item, index)">
                  <div class="de_left">
                    <img :src="item.photoUrl" draggable="true" @dragstart="dragImg($event)" title="可以试着把我拖拽到左侧上传图片处">
                  </div>
                  <div class="de_right">
                    <span class="title">检索资料</span>
                    <p class="user_name">
                      <span>{{item.name}}</span>
                    </p>
                    <p class="similarity" v-show="item.semblance">
                      <i class="vl_icon_retrieval_03 vl_icon"></i>
                      <span>{{item.semblance.toFixed(2)}}<span class="percent">%</span></span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
          </vue-scroll>
        </template>
        <template v-else>
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div>
    <!--历史记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog dialog_comp"
      width="1000px"
      :close-on-click-modal="false"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
          <img :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer" v-show="historyPicList.length">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
    <!--身份核实详情弹窗-->
    <el-dialog
      :visible.sync="identyDetailDialog"
      class="struc_detail_idendty_dialog"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span>检索详情</span>
        <i class="el-icon-close" @click="identyDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.upPhotoUrl" alt="" class="bigImg">
            <!-- <img src="../../../../../assets/img/666.jpg" alt=""> -->
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.photoUrl" alt="" class="bigImg">
              <!-- <img src="../../../../../assets/img/temp/video_pic.png" alt=""> -->
            </div>
            <div class="struc_c_d_info">
              <h2>{{sturcDetail.name}}
                <div class="vl_jfo_sim" v-show="sturcDetail.semblance">
                  <i class="vl_icon vl_icon_retrieval_03"></i>
                  {{sturcDetail.semblance ? sturcDetail.semblance.toFixed(2) : 98.32}}
                  <span style="font-size: 12px;">%</span>
                </div>
              </h2>
              <div class="struc_cdi_line">
                <span v-show="sturcDetail.birthDate">{{sturcDetail.birthDate && sturcDetail.birthDate.split(' ')[0]}}</span>
                <span v-show="sturcDetail.sex">{{sturcDetail.sex}}性</span>
                <span v-show="sturcDetail.nation">{{sturcDetail.nation}}</span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.idNo">
                <span>{{sturcDetail.idNo}}<i class="vl_icon vl_icon_retrieval_08"></i></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.group">
                <span>{{sturcDetail.group}}</span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.repertory">
                <span>{{sturcDetail.repertory}}</span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.remarks">
                <span :title="sturcDetail.remarks" style="height: auto;white-space: normal">{{sturcDetail.remarks ? sturcDetail.remarks.length > 74 ? (sturcDetail.remarks.slice(0, 74) + '...') : sturcDetail.remarks : ''}}</span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>来源库信息</span>
          </div>
        </div>
      </div>
      <div class="struc-list" v-show="dataList.length > 1">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in dataList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.upPhotoUrl" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.photoUrl" alt="">
              <div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05"  :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance.toFixed(2) : 92}}<span style="font-size: 12px;">%</span></div>
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
import { ajaxCtx } from '@/config/config.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import { checkIdCard } from '@/utils/validator.js';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcPUTAppendixsOrder, getIdNoList} from '@/views/index/api/api.judge.js';
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    const validateSimilar = (rule, val, callback) => {
      if (val) {
        let reg = /^[0-9]+$/;
        if (!reg.test(val) || parseInt(val) < 0 || parseInt(val) > 100) {
          callback(new Error('请正确输入0-100之间的整数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      isInitPage: true, // 是否是初始化页面
      identyDetailDialog: false, // 身份核实详情弹出框
      loadingHis: false, // 获取历史图片加载中
      historyPicDialog: false, // 历史图片弹出框
      uploading: false, // 是否正在上传
      curImageUrl: null, // 正在上传的照片
      fileList: [],
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      isAddImgDisabled: false,
      searchForm: {
        similarity: 85, // 相似度
        idNo: null // 身份证
      },
      searchRules: {
        idNo: [
          { validator: checkIdCard, trigger: 'blur' }
        ],
        similarity: [
          { validator: validateSimilar, trigger: 'blur' }
        ]
      },
      // dataList: [],
      historyPicList: [], // 历史图片列表
      // choosedHisPic: [], // 选择了的图片
      curImgNum: 0, // 图片数量
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 10,
        slidesPerGroup: 5,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      curImgIndex: 0,
      sturcDetail: {}, // 身份核实详情
      dataList: [],
      queryImgPath: null, // 从其他模块传过来的图片
      isSearchLoading: false, // 搜索条件加载中
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  created () {
    const imgPath = this.$route.query.path;
    const similarity = this.$route.query.semblance;
    if (imgPath) {
      this.queryImgPath = imgPath;
      this.fileList.push({path: imgPath});
      this.curImageUrl = imgPath;
      this.curImgNum = 1;
    }
    if (similarity) {
      this.searchForm.similarity = similarity;
    }
  },
  methods: {
    // 图片拖拽
    dragImg (e) {
      e.dataTransfer.setData("imgSrc", e.target.currentSrc);
    },
    // 当图片正在被拖拽时
    dropImg (e) {
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: '拖拽图片' + Math.random(),
        filePathName: '拖拽图片' + Math.random(),
        path: e.dataTransfer.getData("imgSrc")
      }
      if (this.curImgNum >= 3) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('最多可同时对比三张图片');
        }
        return;
      }
      this.curImgNum ++;
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x['uid'] = jRes.data;
        }
      })
      this.curImageUrl = x.path;
      this.fileList.push(x);
    },
    // 当图片在有效拖放目标上正在被拖拽时
    allowDrop (e) {
      e.preventDefault();
    },
    // 显示上传图片历史弹框
    showHistoryPic (e) {
      e.stopPropagation();
      this.historyPicDialog = true;

      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      }
      JtcGETAppendixInfoList(params).then(res => {
        if (res) {
          this.loadingHis = false;
          res.data.forEach(x => x.checked = false);
          this.historyPicList = res.data;
        }
      }).catch(() => {
        this.historyPicDialog = false;
      })
    },
    // 选择历史图片
    chooseHisPic (item) {
      if ((this.choosedHisPic.length + this.curImgNum) === 3 && !item.checked) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('最多上传3张照片');
        }
      } else {
        item.checked = !item.checked;
      }
    },
    // 确定选择历史图片
    addHisToImg () {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        this.curImgNum ++;
        _ids.push(x.uid);

        this.curImageUrl = x.path;
        this.fileList.push(x);

      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);
    },
    // 删除图片
    deleteImg (index) {
      this.curImgNum --;
      this.fileList.splice(index, 1);
      if (this.fileList.length > 0) {
        this.curImageUrl = this.fileList[0].path;
      } else {
        this.curImageUrl = null;
      }
    },
    // 上传图片
    uploadPicExceed () {
      if (!document.querySelector('.el-message--info')) {
        this.$message.info('最多可同时对比三张图片');
      }
    },
    uploadPicSuccess (res) {
      this.uploading = true;
      if (res && res.data) {
        let oRes = res.data;

        if (this.curImgNum >= 3) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('最多可同时对比三张图片');
          }
          return;
        }
        this.curImgNum ++;

        this.uploading = false;

        this.curImageUrl = oRes.fileFullPath;

        // if (oRes) {
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
            x['uid'] = jRes.data;
          }
        })
        this.fileList.push(x);
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('上传图片只能是 jpeg、jpg、png 格式!');
        }
      }
      if (!isLt4M) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('上传图片大小不能超过 4MB!');
        }
      }
      return isJPG && isLt4M;
    },
    // 重置查询条件
    resetData (form) {
      this.isInitPage = false;
      this.fileList = [];
      this.curImageUrl = null;
      this.$refs[form].resetFields();
      this.dataList = [];
    },
    // 根据搜索条件进行查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.curImgNum === 0 && !this.searchForm.idNo) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请先选择要上传的图片或填写身份证信息');
            }
            return false;
          }
          const params = {
            'where.idNo': this.searchForm.idNo,
            'where.minSemblance': this.searchForm.similarity,
            'where.uploadImgUrls': this.queryImgPath,
            pageNum: this.pagination.pageNum,
            pageSize: this.pagination.pageSize
          };

          let _ids = [];
          this.fileList.forEach(x => {
            if (x) {
              _ids.push(x.uid);
            }
          })
          if (_ids.length) {
            params['where.appendixIds'] = _ids.join(',');
          }
          this.isSearchLoading = true;
          getIdNoList(params).then(res => {
            if (res && res.data) {
              this.isSearchLoading = false;
              if (res.data.list && res.data.list.length > 0) {
                this.dataList = res.data.list;
                this.pagination.pageNum = res.data.pageNum;
                this.pagination.total = res.data.total;
              } else {
                this.isInitPage = false;
              }
            }
          })
        }
      })
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    },
    imgListTap (data, index) {
      this.curImgIndex = index;
      this.sturcDetail = data;
    },
    // 显示身份核实详情
    showStrucInfo (data, index) {
      this.curImgIndex = index;
      this.identyDetailDialog = true;
      this.sturcDetail = data;
    },
  }
}
</script>

<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.identy_container {
  height: 100%;
  .content_box {
    display: flex;
    height: 100%;
    padding-top: 50px;
    .left {
      width: 265px;
      box-shadow: 2px 0px 5px 0px rgba(131,131,131,0.28);
      background-color: #ffffff;
      .upload_box {
        padding: 15px 20px;
         .img_list {
           display: flex;
           margin-top: 10px;
           .img_box {
            width: 70px;
            height: 70px;
            background:rgba(255,255,255,1);
            border:1px dashed rgba(211,211,211,1);
            border-radius:1px;
            position: relative;
            &:hover {
              .delete_box {
                display: block;
              }
            }
            .delete_box {
              display: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: #000;
              opacity: 0.7;
              text-align: center;
              i {
                margin-top: 35%;
                cursor: pointer; 
              }
            }
            &:not(:last-child) {
              margin-right: 5px;
            }
            img {
              width: 100%;
              height: 100%;
            }
           }
         }
         .divide {
           height: 1px;
           border-bottom: 1px solid #D3D3D3;
           margin-top: 20px;
         }
         /deep/ .el-upload {
          width: 225px;
          height: 225px;
          position: relative;
          .upload_text {
            line-height: 0;
            color: #999999;
            margin-top: -60px;
          }
          >img {
            width: 100%;
            height: 100%;
          }
          .history {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 30px;
            line-height: 30px;
            width: 100%;
            color: #FFFFFF;
            font-size: 12px;
            background:rgba(12,112,248,1);
            border-radius:0px 0px 5px 5px;
            display: none;
          }
          i {
            margin-top: 40px;
            margin-left: 15px;
            width: 120px;
            height: 120px;
          }
          &:hover {
            background: #2981F8;
            // i.vl_icon_control_14{
            //   background-position: -228px -570px;
            // }
            .upload_text {
              color: #ffffff;
            }
            .history {
              display: block;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card {
          display: none!important;
        }
      }
      .left_form {
        width: 100%;
        padding: 15px 20px;
        font-size: 12px !important;
        /deep/ .el-form-item {
          margin-bottom: 20px;
        }
        .date_time {
          /deep/ .el-form-item__label {
            line-height: 20px;
            color: #999999;
          }
        }
      }
    }
    .right {
      width: calc(100% - 265px);
      padding: 10px 15px;
      .content_top {
        display: flex;
        justify-content: space-between;
        >p {
          span:first-child {
            color: #333333;
          }
          span:last-child {
            color: #666666;
          }
        }
      }
      .result_detail {
        width: 100%;
        >ul {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-top: 15px;
          >li {
            background-color: #ffffff;
            height: 180px;
            width: 375px;
            max-width: 32%;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            margin-right: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 5px 16px 0px #A9A9A9;
            .de_left {
              width: 50%;
              img {
                width: 140px;
                height: 140px;
                cursor: move;
                // cursor: pointer;
              }
            }
            .de_right {
              width: 50%;
              line-height: 30px;
              .title {
                color: #999999;
              }
              .similarity {
                margin-top: 15px;
                >span {
                  font-family:AuroraBT-BoldCondensed;
                  font-weight: bold;
                  margin-left: 10px;
                  color: #0C70F8;
                  font-size: 36px;
                }
                .percent {
                  font-size: 16px;
                  font-weight: normal;
                }
              }
              .user_name {
                >span {
                  background-color: #FAFAFA;
                  color: #333333;
                  font-size: 12px;
                  margin-right: 5px;
                  border-radius:3px;
                  padding: 0 3px;
                  max-width: 50px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  border: 1px solid #F2F2F2;
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
  .reset_btn, .select_btn {
    width: 100px;
  }
}
.history-pic-dialog {
  .his-pic-box {
    width: 100%;
    height: 500px !important;
    .his-pic-item {
      float: left;
      width: 142px;
      height: 142px;
      border: 2px solid #FFFFFF;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .active {
      border-color: #0C70F8;
    }
  }
}
.struc_detail_idendty_dialog {
  // width: 1000px;
  /deep/ .el-dialog {
    max-width: 13.06rem;
    width: 100%;
  }
  .el-dialog__header {
    display: none;
  }
  .struc_tab {
    height: 1.16rem;
    // padding: .3rem 0;
    position: relative;
    color: #999999;
    span {
      display: inline-block;
      margin-right: .55rem;
      padding-bottom: .1rem;
      cursor: pointer;
    }
    .active {
      color: #0C70F8;
      border-bottom: 2px solid #0C70F8;
    }
    i {
      display: block;
      position: absolute;
      top: 0;
      right: 0px;
      cursor: pointer;
    }
  }
  .struc_main {
    width: 11.46rem;
    height: 4.4rem;
    margin: 0 auto;
    // border-bottom: 1px solid #F2F2F2;
    .struc_c_detail {
      width:  100%;
      height: 3.6rem;
      >div {
        float: left;
      }
      .struc_c_d_img {
        width: 3.6rem;
        height: 3.6rem;
        background: #EAEAEA;
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
          top: .1rem;
          right: .1rem;
          line-height: .26rem;
          height: .26rem;
          background: rgba(255, 255, 255, .8);
          border-radius: .13rem;
          font-style: normal;
          color: #0C70F8;
          font-size: 12px;
          padding: 0 .1rem;
        }
      }
      .struc_c_d_qj {
        margin-right: .3rem;
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.5rem;
          left: -.5rem;
          transform: rotate(-45deg);
          border: .5rem solid #0c70f8;
          border-color: transparent transparent #0C70F8;
          z-index: 9;
        }
        span {
          display: block;
          position: absolute;
          top: .1rem;
          left: .1rem;
          width: .6rem;
          height: .6rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
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
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        border-radius:1px;
        position: relative;
        overflow: hidden;
        >div {
          float: left;
        }
        .struc_c_d_info {
          width: calc(100% - 3.6rem);
          padding-left: .24rem;
          color: #333333;
          h2 {
            font-weight: bold;
            line-height: .74rem;
            padding-right: 1rem;
            .vl_jfo_sim {
              color: #0C70F8;
              font-weight: bold;
              font-size: .24rem;
              float: right;
              i {
                vertical-align: text-bottom;
                margin-right: .1rem;
              }
              span {
                font-weight: normal;
              }
            }
          }
          .struc_cdi_line {
            span {
              max-width: 100%;
              display: inline-block;
              height: .3rem;
              line-height: .3rem;
              margin-bottom: .08rem;
              border: 1px solid #F2F2F2;
              background: #FAFAFA;
              color: #333333;
              white-space: nowrap;
              text-overflow: ellipsis;
              border-radius:3px;
              font-size: 12px;
              overflow: hidden;
              padding: 0 .1rem;
              margin-right: .08rem;
              > i {
                vertical-align: middle;
                margin-left: .1rem;
              }
            }
          }
        }
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.7rem;
          right: -.7rem;
          transform: rotate(-46deg);
          border: .7rem solid #0c70f8;
          border-color: transparent transparent transparent #0C70F8;
        }
        &:after {
          display: block;
          content: '';
          position: absolute;
          top: -.4rem;
          right: -.4rem;
          transform: rotate(-45deg);
          border: .4rem solid #FFFFFF;
          border-color: transparent transparent transparent #FFFFFF;
        }
        >span {
          display: block;
          position: absolute;
          top: .19rem;
          right: .19rem;
          width: 1rem;
          height: 1rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
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
        width:  100%;
        height: 100%;
      }
    }
  }
  .struc-list {
    width: 12.46rem;
    margin: 0 auto;
    padding: .44rem 0 .34rem 0;
    .swiper-container {
      padding: .02rem .5rem;
      &:before {
        display: block;
        content: '';
        width: .5rem;
        height: 110%;
        background: #FFFFFF;
        position: absolute;
        left: 0;
        z-index: 9;
        border: 1px solid #FFFFFF;
      }
      &:after {
        display: block;
        content: '';
        width: .5rem;
        height: 110%;
        background: #FFFFFF;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
        border: 1px solid #FFFFFF;
      }
      .swiper-button-next {
        right:  0;
      }
      .swiper-button-prev {
        left: 0;
      }
      .swiper-slide {
        .swiper_img_item {
          cursor: pointer;
          border: 1px solid #FFFFFF;
          padding: 2px;
          .vl_jfo_sim {
            font-size: .14rem;
            height: .3rem;
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
          border-color: #0C70F8;
          .vl_jfo_sim {
            color: #0C70F8;
          }
        }
      }
    }
  }
}
</style>

