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
                      <span>{{item.semblance && item.semblance.toFixed(2)}}<span class="percent">%</span></span>
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
      width="890px"
      top="15vh"
      :close-on-click-modal="true"
      :show-close="true">
      <div class="struc_main">
        <div class="struc_c_d_qj">
          <img :src="sturcDetail.photoUrl" alt="" class="bigImg">
          <span>来源库图</span>
        </div>
        <div class="struc_c_d_box">
          <h3>来源库信息</h3>
          <ul>
            <li>
              <span>姓名</span>
              <span>{{sturcDetail.name ? sturcDetail.name : '无'}}</span>
            </li>
            <li>
              <span>证件号码</span>
              <span>{{sturcDetail.idNo ? sturcDetail.idNo : '无'}}</span>
            </li>
            <li>
              <span>出生日期</span>
              <span>{{sturcDetail.birthDate ? sturcDetail.birthDate.split(' ')[0] : '无'}}</span>
            </li>
            <li>
              <span>民族</span>
              <span>{{sturcDetail.nation ? sturcDetail.nation : '无'}}</span>
            </li>
            <li>
              <span>性别</span>
              <span>{{sturcDetail.sex ? sturcDetail.sex : '无'}}</span>
            </li>
            <li>
              <span>底库信息</span>
              <span class="info_span">{{sturcDetail.repertory ? sturcDetail.repertory : '无'}}</span>
            </li>
            <li>
              <span>分组信息</span>
              <span class="info_span">{{sturcDetail.group ? sturcDetail.group : '无'}}</span>
            </li>
            <li>
              <span>备注信息</span>
              <span class="info_span">{{sturcDetail.remarks ? sturcDetail.remarks : '无'}}</span>
            </li>
          </ul>
        </div>
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
      this.curImgNum = 0;

      this.dataList = [];
      
      this.$refs[form].resetFields();
    },
    // 根据搜索条件进行查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.dataList = [];
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
  .struc_main {
    display: flex;
    padding: 30px 30px 30px 50px;
    .struc_c_d_qj {
      width: 320px;
      height: 320px;
      position: relative;
      >img {
        width: 100%;
        height: 100%;
      }
      >span {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        background-color: #0C70F8;
        color: #FFFFFF;
        border-radius: 0 20px 20px 0;
      }
    }
    .struc_c_d_box {
      margin-left: 20px;
      >h3 {
        color: #333333;
        font-weight: bold;
        font-size: 18px;
      }
      >ul {
        margin-top: 10px;
        >li {
          margin-bottom: 6px;
          height: 30px;
          line-height: 30px;
          border-radius:2px;
          font-size: 12px;
          span:first-child {
            width: 70px;
            overflow: hidden;
            display: inline-block;
            padding: 0 5px;
            background-color: #FAFAFA;
            color: #999999;
            border: 1px solid #F2F2F2;
          }
          span:last-child {
            border: 1px solid #F2F2F2;
            border-left: none;
            display: inline-block;
            overflow: hidden;
            padding: 0 7px;
            color: #333333;
          }
          .info_span {
            width: 300px;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">

</style>


