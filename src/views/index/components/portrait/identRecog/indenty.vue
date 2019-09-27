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
      <div class="left_search">
        <div style="padding: 0 15px; height: 210px; text-align:center">
          <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
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
          <div is="noResult" :isInitPage="isInitPage" :tipMessage="initPageMessage"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>  
import { ajaxCtx } from '@/config/config.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import { checkIdCard } from '@/utils/validator.js';
import vlUpload from '@/components/common/upload.vue';
import { getIdNoList } from '@/views/index/api/api.judge.js';
export default {
  components: { vlBreadcrumb, noResult, vlUpload },
  data () {
    return {
      isInitPage: true, // 是否是初始化页面
      initPageMessage: '上传人脸图片与身份证号，分析上传的图片与身份证信息是否为同一人',
      uploadImgId: null, // 上传的图片id
      curImageUrl: null, // 正在上传的照片
      fileList: [],
      searchForm: {
        idNo: null // 身份证
      },
      searchRules: {
        idNo: [
          { validator: checkIdCard, trigger: 'blur' }
        ],
      },
      dataDetail: null, //结果详情
      queryImgPath: null, // 从其他模块传过来的图片
      isSearchLoading: false, // 搜索条件加载中
      uploadClear: {},
      imgData: null,
    }
  },
  created () {
    const imgPath = this.$route.query.path;
    if (imgPath) {
      this.imgData = Object.assign({}, {path: imgPath});

      this.queryImgPath = imgPath;
    }
  },
  methods: {
    uploadEmit (data) {
      if (data) {
        this.uploadImgId = data.uid;
      } else {
        this.uploadImgId = null;
      }
    },
    // 重置查询条件
    resetData (form) {
      this.isInitPage = false;

      this.uploadImgId = null;
      this.dataDetail = null;
      this.uploadClear = {};

      this.$refs[form].resetFields();
    },
    // 根据搜索条件进行查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.dataDetail = null;
          if (!this.uploadImgId || !this.searchForm.idNo) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请输入图片和证件号');
            }
            return false;
          }
          const params = {
            idNo: this.searchForm.idNo,
            uploadImgUrls: this.queryImgPath
          };

          if (this.uploadImgId) {
            params['appendixIds'] = this.uploadImgId;
          }
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
    .left_search {
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

</style>
