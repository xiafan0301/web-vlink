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
        <div :class="['upload_box', {'hidden': curImageUrl}]">
          <el-upload
            :disabled="isAddImgDisabled"
            ref="uploadPic"
            accept="image/*"
            :limit="1"
            :action="uploadUrl"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="uploadPicSuccess"
            :on-exceed="uploadPicExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            >
            <i v-if="uploading" class="el-icon-loading"></i>
            <i v-else class="vl_icon vl_icon_vehicle_01"></i>
            <p class="upload_text" v-show="!curImageUrl">点击上传图片</p>
            <p class="history" @click="showHistoryPic($event)" v-show="!curImageUrl">从上传记录中选择</p>
          </el-upload>
        </div>
        <div class="divide"></div>
        <el-form class="left_form" :model="searchForm" ref="searchForm" :rules="searchRules">
          <el-form-item prop="idNo">
            <el-input placeholder=" 请填写证件号码" v-model="searchForm.idNo" type="text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData('searchForm')">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <template v-if="dataDetail">
          <vue-scroll>
            <div class="result_box">
              <div class="result_img">
                <div class="img_box img_box_1">
                  <span>上传图</span>
                  <img :src="dataDetail.upPhotoUrl" alt="">
                </div>
                <div class="img_box img_box_2">
                  <span>证件照片</span>
                  <img :src="dataDetail.photoUrl" alt="">
                </div>
              </div>
              <div class="similarity">
                <span class="title">相似度</span>
                <span class="number">{{dataDetail.semblance && dataDetail.semblance.toFixed(2)}}</span>
                <span class="percent">%</span>
              </div>
              <div class="result_detail">
                <p>证件对应信息</p>
                <div>
                  <ul class="result_left">
                    <li>
                      <span>姓名</span>
                      <span>{{dataDetail.name ? dataDetail.name : '无'}}</span>
                    </li>
                    <li>
                      <span>证件号码</span>
                      <span>{{dataDetail.idNo ? dataDetail.idNo : '无'}}</span>
                    </li>
                    <li>
                      <span>出生日期</span>
                      <span>{{dataDetail.birthDate  ? dataDetail.birthDate : '无'}}</span>
                    </li>
                    <li>
                      <span>民族</span>
                      <span>{{dataDetail.nation ? dataDetail.nation : '无'}}</span>
                    </li>
                    <li>
                      <span>性别</span>
                      <span>{{dataDetail.sex ? dataDetail.sex : '无'}}</span>
                    </li>
                  </ul>
                  <ul class="result_right">
                    <li>
                      <span>底库信息</span>
                      <span>{{dataDetail.repertory ? dataDetail.repertory : '无'}}</span>
                    </li>
                    <li>
                      <span>分组信息</span>
                      <span>{{dataDetail.group ? dataDetail.group : '无'}}</span>
                    </li>
                    <li>
                      <span>备注信息</span>
                      <span>{{dataDetail.remarks ? dataDetail.remarks : '无'}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
        <div class="his-pic-item" :class="{'active':isImgChecked === index}" v-for="(item, index) in historyPicList" :key="item.id" @click="chooseHisPic(item, index)">
          <img :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer" v-show="historyPicList.length">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addHisToImg" :disabled="choosedHisPicList.length === 0">确认</el-button>
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
    return {
      isInitPage: true, // 是否是初始化页面
      identyDetailDialog: false, // 身份核实详情弹出框
      strucDetailDialog: false,
      loadingHis: false, // 获取历史图片加载中
      historyPicDialog: false, // 历史图片弹出框
      uploading: false, // 是否正在上传
      curImageUrl: null, // 正在上传的照片
      fileList: [],
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      isAddImgDisabled: false,
      searchForm: {
        idNo: null // 身份证
      },
      searchRules: {
        idNo: [
          { validator: checkIdCard, trigger: 'blur' }
        ],
      },
      historyPicList: [], // 历史图片列表
      choosedHisPicList: [], // 选择了的图片
      // curImgNum: 0, // 图片数量
      // curImgIndex: 0,
      // sturcDetail: {}, // 身份核实详情
      dataDetail: null, //结果详情
      queryImgPath: null, // 从其他模块传过来的图片
      isSearchLoading: false, // 搜索条件加载中
      isImgChecked: -1, // 是否选中历史图片
    }
  },
  created () {
    const imgPath = this.$route.query.path;
    if (imgPath) {
      this.queryImgPath = imgPath;
      this.fileList.push({path: imgPath});
      this.curImageUrl = imgPath;
    }
  },
  methods: {
    // 显示上传图片历史弹框
    showHistoryPic (e) {
      e.stopPropagation();
      this.historyPicDialog = true;
      this.isImgChecked = -1;

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
    chooseHisPic (item, index) {
      if (this.isImgChecked === index) {
        this.isImgChecked = -1;
      } else {
        this.isImgChecked = index;
        this.choosedHisPicList.push(item);
      }
     
    },
    // 确定选择历史图片
    addHisToImg () {
      this.fileList = [];
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPicList.forEach(x => {
        _ids.push(x.uid);

        this.curImageUrl = x.path;
        const params = {
          uid: x.uid,
          url: x.path
        }
        this.fileList.push(params);

      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);

      console.log('fileList', this.fileList)
      console.log('fileList', this.curImageUrl)
    },
    handleRemove () {
      this.curImageUrl = null;
      this.fileList = [];
    },
    // 上传图片
    uploadPicExceed () {
      if (!document.querySelector('.el-message--info')) {
        this.$message.info('最多可同时对比1张图片');
      }
    },
    uploadPicSuccess (res) {
      this.uploading = true;
      this.fileList = [];
      if (res && res.data) {
        let oRes = res.data;
        this.uploading = false;

        this.curImageUrl = oRes.fileFullPath;

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
              x['uid'] = jRes.data;
              const params = {
                uid: jRes.data,
                url: x.path
              };
              this.fileList.push(params);
            }
          })


          console.log('fileList', this.fileList)
        }
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

      this.curImageUrl = null;
      this.fileList = [];
      this.dataDetail = null;
      this.$refs.uploadPic.clearFiles();
      this.$refs[form].resetFields();
    },
    // 根据搜索条件进行查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.dataDetail = null;
          if (!this.curImageUrl || !this.searchForm.idNo) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请输入图片和证件号');
            }
            return false;
          }
          const params = {
            idNo: this.searchForm.idNo,
            uploadImgUrls: this.queryImgPath
          };

          let _ids = [];
          this.fileList.forEach(x => {
            if (x) {
              _ids.push(x.uid);
            }
          })
          if (_ids.length) {
            params['appendixIds'] = _ids.join(',');
          }
          // params['appendixIds'] = '01tBEd6hSUblR8X9C5KElA'
          this.isSearchLoading = true;
          getIdNoList(params).then(res => {
            if (res && res.data) {
              this.isSearchLoading = false;
              this.dataDetail = res.data;
            } else {
              this.isSearchLoading = false;
              this.isInitPage = false;
            }
          })
        }
      })
    }
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
      height: 100%;
      box-shadow: 2px 0px 5px 0px rgba(131,131,131,0.28);
      background-color: #ffffff;
      padding: 15px 20px;
      .divide {
        height: 1px;
        border-bottom: 1px solid #D3D3D3;
        margin: 20px 0;
      }
      .upload_box {
        text-align: center;
        width: 225px;
        height: 225px;
        overflow: hidden;
        &.hidden /deep/ .el-upload--picture-card {
          display: none!important;
        }
        /deep/ .el-upload-list__item {
          width: 225px;
          height: 225px;
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
            .upload_text {
              color: #ffffff;
            }
            .history {
              display: block;
            }
          }
        }
      }
      .left_form {
        width: 100%;
        font-size: 12px !important;
      }
    }
    .right {
      width: calc(100% - 265px);
      margin: 15px 15px 0 15px;
      height: calc(100% - 30px);
      background-color: #ffffff;
      box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
      .result_box {
        width: 70%;
        margin-left: 15%;
        .result_img {
          padding-top: 20px;
          text-align: center;
          .img_box {
            display: inline-block;
            width: 340px;
            height: 340px;
            margin-right: 20px;
            position: relative;
            >img {
              width: 100%;
              height: 100%;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.6rem;
              left: -.6rem;
              transform: rotate(-45deg);
              z-index: 9;
            }
            >span {
              display: block;
              width: 60px;
              height: 60px;
              line-height: 60px;
              position: absolute;
              left: -0.07rem;
              top: -0.07rem;
              text-align: center;
              position: absolute;
              color: #ffffff;
               -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 10;
            }

          }
          .img_box_1 {
            &:before {
              border: .6rem solid #0C70F8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .img_box_2 {
            &:before {
              border: .6rem solid #50CC62;
              border-color: transparent transparent #50CC62;
            }
          }
        }
        .similarity {
          width: 100%;
          text-align: center;
          .title {
            color: #000;
            font-size: 12px;
            margin-right: 5px;
          }
          .number {
            color: #FA453A;
            font-weight: bold;
            font-family: AuroraBT-BoldCondensed;
            font-size: 28px;
          }
          .percent {
            color: #FA453A;
            font-family: AuroraBT-BoldCondensed;
            font-size: 20px;
          }
        }
        .result_detail {
          >p {
            color: #333333;
            font-weight: bold;
          }
          >div {
            display: flex;
            .result_left, .result_right {
              width: 50%;
              >li {
                border: 1px solid #F2F2F2;
                margin: 5px;
                display: flex;
                // align-items: center;
                font-size: 12px;
                span:first-child {
                  padding: 5px;
                  color: #999999;
                  margin-right: 5px;
                  min-width: 70px;
                  border-right: 1px solid #F2F2F2;
                  background-color: #FAFAFA;
                }
                span:last-child {
                  align-self: center;
                  // width: calc(100% - 90px);
                  color: #333333;
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

</style>
