<template>
  <div class="vl_judge_tc">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像侦查</el-breadcrumb-item>
        <el-breadcrumb-item>人像比对</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="vl_judge_ct">
      <div class="vl_judge_tc_h">
        <div class="judge_title"><i></i>CONTRAST<span>人像<br/>比对</span><i></i></div>
        <p>两张人脸比对</p>
      </div>
      <div class="vl_judge_tc_c">
        <div class="vl_judge_cmp_result">
          <h1>{{compSim}}</h1>
          <p>{{compSimWord}}</p>
        </div>
        <div class="vl_judge_tc_c_item">
          <div is="vlUpload" :clear="uploadClearOne" @uploadEmit="uploadEmitOne"></div>
        </div>
        <div class="vl_judge_tc_c_item">
          <div is="vlUpload" :clear="uploadClearTwo" @uploadEmit="uploadEmitTwo"></div>
        </div>
      </div>
      <el-button class="vl_judge_tc_btn" @click="beginComp" type="primary" :disabled="!this.curImageUrl || !this.curImageUrl2" :loading="compLoading">立即比对</el-button>
    </div>
  </div>
</template>
<script>
  import vlUpload from '@/components/common/upload.vue';
  import {ajaxCtx} from '@/config/config';
  import {ScpGETbasePortraitInfo, ScpGETportraitCmpInfo, ScpGETretrievalHisById} from '../../api/api.search.js';
  import {JtcGETAppendixInfoList} from '../../api/api.judge.js'
  export default {
    components: {vlUpload},
    data () {
      return {
        uploadAcion: ajaxCtx.base + '/new',
        curImageUrl: '', // 当前上传的图片
        uploading: false, // 是否上传中
        uploadFileList: [],
        curImageUrl2: '', // 当前上传的图片
        uploading2: false, // 是否上传中
        uploadFileList2: [],
        imgData: {
          imgOne: null,
          imgTwo: null
        },
        uploadClearOne: {},
        uploadClearTwo: {},
        historyPicList: [], // 上传历史记录
        numberValidateForm: {
          idCard: ''
        },
        curIndex: 0,
        compLoading: false,
        compSim: '',
        compSimWord: ''
      }
    },
    computed: {
      choosedHisPic () {
        return this.historyPicList.filter(x => x.checked)
      }
    },
    mounted () {
      if (this.$route.query.hisId) {
        ScpGETretrievalHisById(this.$route.query.hisId)
            .then(res => {
              if (res) {
                this.imgData.imgOne = res.data.retrievalPicList[0];
                this.curImageUrl = res.data.retrievalPicList[0].path;
                this.imgData.imgTwo = res.data.retrievalPicList[1];
                this.curImageUrl2 = res.data.retrievalPicList[1].path;
              }
              this.beginComp();
            })
      }
    },
    methods: {
      uploadEmitOne (data) {
        console.log('uploadEmit data', data);
        if (data && data.path) {
          this.curImageUrl = data.path;
          this.imgData.imgOne = data;
        } else {
          this.curImageUrl = null;
          this.imgData.imgOne = null;
        }
      },
      uploadEmitTwo (data) {
        console.log('uploadEmit data', data);
        if (data && data.path) {
          this.curImageUrl2 = data.path;
          this.imgData.imgTwo = data;
        } else {
          this.curImageUrl2 = null;
          this.imgData.imgTwo = null;
        }
      },
      beginComp () {
        if (this.curImageUrl && this.curImageUrl2) {
          this.compLoading = true;
          let params = {
            leftAppendixId: this.imgData.imgOne.uid
          }
          if (this.numberValidateForm.idCard) {
            params['idNo'] = this.numberValidateForm.idCard;
          } else {
            params['rightAppendixId'] = this.imgData.imgTwo.uid;
          }
          ScpGETportraitCmpInfo(params)
              .then(res => {
                this.compLoading = false;
                if (res) {
                  this.compSim = res.data.toFixed(2) + ' %';
                  if (res.data < 60) {
                    this.compSimWord = '极不可能是一个人'
                  } else if (res.data < 80) {
                    this.compSimWord = '可能不是一个人'
                  } else if (res.data < 90) {
                    this.compSimWord = '可能是一个人'
                  } else {
                    this.compSimWord = '极可能是一个人'
                  }
                }
              }).catch(() => {
            this.compLoading = false;
          })
        } else {
          this.$message.error('如需对比请补全图片信息')
        }
      }
    }
  }
</script>
<style lang="scss">
  .history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100%!important;
    }
    .el-dialog__title {
      font-size: .16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 .76rem .3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem!important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: .02rem solid #FFFFFF;
        margin-right: .2rem;
        margin-bottom: .2rem;
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
    .el-dialog__footer {
      button {
        width: 1.4rem!important;
        height: .4rem;
        line-height: .4rem;
        padding: 0;
      }
    }
  }
  .breadcrumb_heaer {
    background: #ffffff;
  }
  .vl_judge_ct {
    width: 100%;
    height: 100%;
    border: .2rem solid #fafafa;
    background: #FFFFFF;
    padding-bottom: .2rem;
    .vl_judge_tc_h {
      width: 100%;
      text-align: center;
      padding-top: .27rem;
      .judge_title {
        color: #333333;
        font-size: .5rem;
        font-weight: bold;
        position: relative;
        span {
          display: inline-block;
          font-size: .2rem;
          vertical-align: inherit;
        }
        i {
          display: inline-block;
          width: .08rem;
          height: .08rem;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          vertical-align: super;
          background: #333333;
          margin: 0 .15rem;
        }
      }
      >p {
        color: #999999;
        font-size: 12px;
      }
    }
    .vl_judge_tc_c {
      height: 4.3rem;
      text-align: center;
      margin-bottom: .6rem;
      padding-top: .9rem;
      position: relative;
      .vl_judge_tc_c_item {
        width: 3.4rem;
        height: 3.4rem;
        display: inline-block;
        position: relative;
        background: #f2f2f2;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        cursor: pointer;
        &:first-child {
          margin-right: .15rem;
        }
        &:last-child {
          margin-left: .15rem;
        }
        /*&:hover {*/
          /*background: #2981F8;*/
          /*>p {*/
            /*display: block;*/
          /*}*/
          /*.del_icon {*/
            /*display: block;*/
          /*}*/
          /*.vl_upload_tip {*/
            /*span {*/
              /*display: none;*/
            /*}*/
          /*}*/
        /*}*/
        .vl_jtc_upload_rxbd {
          width: 100%;
          height: 100%;
          background: none;
          .el-upload--picture-card {
            border: none;
          }
          .el-upload {
            width: 100%;
            height: 100%;
            background: none;
            /*line-height: 3.4rem;*/
            img {
              width: 100%;
              height: 100%;
              -webkit-border-radius: 10px;
              -moz-border-radius: 10px;
              border-radius: 10px;
            }
          }
          .vl_upload_tip {
            i {
              width: 100px;height: 85px;opacity: .5; position: absolute;
              top: 0;left: 0;right: 0;bottom: 0;margin: auto;
            }
            span {
              position: absolute; bottom: 6px; left: 0;
              width: 100%; line-height: normal;
              text-align: center;
              color: #999;
            }
          }
        }
        >p {
          display: none;
          position: absolute;
          bottom: 0;
          text-align: center;
          width: 100%;
          color: #FFFFFF;
          height: .4rem;
          line-height: .4rem;
          -webkit-border-radius: 0 0 10px 10px;
          -moz-border-radius: 0 0 10px 10px;
          border-radius: 0 0 10px 10px;
          background: rgba(0, 0, 0, 0.3);
        }
        .vl_jtc_ic_input {
          position: absolute;
          top: .2rem;
          width: 3rem;
          height: .26rem;
          left: .2rem;
          border: 1px solid #D3D3D3;
          -webkit-border-radius: .13rem;
          -moz-border-radius: .13rem;
          border-radius: .13rem;
          padding: 0 .02rem;
          background: #FFFFFF;
          .el-form-item__content {
            height: .23rem;
            line-height: .23rem;
          }
          input {
            border: none!important;
            height: .23rem;
            line-height: .23rem;
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
          background: rgba(0, 0, 0, .4);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          color: #FFFFFF;
        }
      }
      .vl_judge_cmp_result {
        position: absolute;
        top: 0;
        width: 100%;
        h1 {
          font-size: .5rem;
          color: #FA453A;
          font-weight: bold;
        }
        p {
          color: #FA453A;
        }
      }
    }
    .vl_judge_tc_btn {
      padding: 0;
      display: block;
      width: 2.82rem;
      height: .38rem;
      border: 1px solid #0C70F8;
      background: #0C70F8;
      color: #FFFFFF;
      text-align: center;
      line-height: .38rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      margin: 0 auto;
      cursor: pointer;
    }
    .is-disabled {
      background: #F2F2F2;
      color: #b2b2b2;
      border-color: #b2b2b2;
      &:hover {
        background: #F2F2F2;
        color: #b2b2b2;
        border-color: #b2b2b2;
      }
    }
  }
</style>
