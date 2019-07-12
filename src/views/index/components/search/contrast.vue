<template>
  <div class="vl_judge_tc">
    <div class="vl_judge_ct">
      <div class="vl_judge_tc_h">
        <div class="judge_title"><i></i>CONTRAST<span>人像<br/>对比</span><i></i></div>
        <p>两张人脸比对，或一张人像与证件号比对</p>
      </div>
      <div class="vl_judge_tc_c">
        <div class="vl_judge_cmp_result">
          <h1>{{compSim}}</h1>
          <p>{{compSimWord}}</p>
        </div>
        <div class="vl_judge_tc_c_item">
          <el-upload
            :class="{'vl_jtc_upload': true}"
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucess"
            :on-error="handleError">
            <i v-if="uploading" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl" :src="curImageUrl">
            <i style="width: 140px;height: 114px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;" class="vl_icon vl_icon_retrieval_07" v-else></i>
          </el-upload>
          <p @click="showHistoryPic(1)">从上传记录中选择</p>
          <div v-show="curImageUrl" class="del_icon">
            <i class="el-icon-delete" @click="delPic(1)"></i>
          </div>
        </div>
        <div class="vl_judge_tc_c_item">
          <el-upload
            :class="{'vl_jtc_upload': true}"
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            :before-upload="beforeAvatarUpload2"
            :on-success="uploadSucess2"
            :on-error="handleError2">
            <i v-if="uploading2" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl2" :src="curImageUrl2">
            <i style="width: 140px;height: 114px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;" class="vl_icon vl_icon_retrieval_07" v-else></i>
          </el-upload>
          <div class="vl_jtc_ic_input" v-show="!curImageUrl2">
            <el-form :model="numberValidateForm" ref="vlJtcIdCard"  class="demo-ruleForm">
              <el-form-item
                label=""
                prop="idCard"
                :rules="[
                  { validator: validateIdCard, trigger: 'blur' }
                ]"
              >
                <el-input type="idCard" @blur="checkId" v-model="numberValidateForm.idCard" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <p @click="showHistoryPic(2)">从上传记录中选择</p>
          <div v-show="curImageUrl2" class="del_icon">
            <i class="el-icon-delete" @click="delPic(2)"></i>
          </div>
        </div>
      </div>
      <el-button class="vl_judge_tc_btn" @click="beginComp" type="primary" :disabled="!this.curImageUrl || !this.curImageUrl2" :loading="compLoading">立即对比</el-button>
    </div>
    <!--历史记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
          <img :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg(curIndex)" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {ScpGETbasePortraitInfo, ScpGETportraitCmpInfo, ScpGETretrievalHisById} from '../../api/api.search.js';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcPUTAppendixsOrder} from '../../api/api.judge.js'
export default {
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
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
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
    validateIdCard (rule, value, callback) {
      if (value !== "") {
        var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!reg.test(value)) {
          callback(new Error("请输入有效的身份证号码"));
        }
      }
      callback();
    },
    checkId (){
      if (this.numberValidateForm.idCard) {
        this.$refs['vlJtcIdCard'].validate((valid) => {
          if (valid) {
            ScpGETbasePortraitInfo({idNo: this.numberValidateForm.idCard})
                .then(res => {
                  if (res.data) {
                    this.curImageUrl2 = res.data.photoUrl;
                  } else {
                    this.$message({
                      message: '您所查询的人员不在信息库中',
                      type: 'success'
                    });
                    this.numberValidateForm.idCard = '';
                  }
                })
          }
        })
      }
    },
    // 上传图片
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess (response, file, fileList) {
      this.uploading = false;
      this.compSim = '';
      this.compSimWord = '';
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
              x['uid'] = jRes.data;
              console.log(x);
            }
          })
          this.imgData.imgOne = x;
          this.curImageUrl = x.path;
        }
      }
      this.uploadFileList = fileList;
    },
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    // 上传图片2
    beforeAvatarUpload2 (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      this.uploading2 = true;
      return isJPG && isLt;
    },
    uploadSucess2 (response, file, fileList) {
      this.uploading2 = false;
      this.compSim = '';
      this.compSimWord = '';
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
              x['uid'] = jRes.data;
              console.log(x);
            }
          })
          this.imgData.imgTwo = x;
          this.curImageUrl2 = x.path;
          this.numberValidateForm.idCard = '';
        }
      }
      this.uploadFileList2 = fileList;
    },
    handleError2 () {
      this.uploading2 = false;
      this.$message.error('上传失败')
    },
    delPic (index) {
      this.compSim = '';
      this.compSimWord = '';
      if (index === 1) {
        this.uploadFileList.splice(0, 1);
        this.curImageUrl = '';
      } else {
        this.uploadFileList2.splice(0, 1);
        this.curImageUrl2 = '';
      }
    },
    showHistoryPic (index) {
      this.curIndex = index;
      this.loadingHis = true;
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
    chooseHisPic (item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      })
      item.checked = true;
    },
    addHisToImg (index) {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid)
        if (index === 1) {
          this.curImageUrl = x.path;
          this.imgData.imgOne = x;
        } else {
          this.imgData.imgTwo = x;
          this.curImageUrl2 = x.path;
        }
      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);
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
                this.compSim = res.data;
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
  .vl_judge_ct {
    width: 100%;
    height: 100%;
    border: .2rem solid #fafafa;
    background: #FFFFFF;
    .vl_judge_tc_h {
      width: 100%;
      text-align: center;
      padding-top: .77rem;
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
      margin-bottom: .9rem;
      padding-top: .9rem;
      position: relative;
      .vl_judge_tc_c_item {
        width: 3.4rem;
        height: 3.4rem;
        display: inline-block;
        position: relative;
        -webkit-box-shadow: 0 5px 20px 0px rgba(169, 169, 169, .3);
        -moz-box-shadow: 0 5px 20px 0px rgba(169, 169, 169, .3);
        box-shadow: 0 5px 20px 0px rgba(169, 169, 169, .3);
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
        &:hover {
          background: #2981F8;
          >p {
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
          .el-upload {
            width: 100%;
            height: 100%;
            background: none;
            line-height: 3.4rem;
            img {
              width: 100%;
              height: 100%;
              -webkit-border-radius: 10px;
              -moz-border-radius: 10px;
              border-radius: 10px;
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
          background: #0C70F8;
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
