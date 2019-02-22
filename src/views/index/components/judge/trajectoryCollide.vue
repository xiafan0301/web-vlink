<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_img_box">
        <div class="vl_jtc_upload_img">
          <el-upload
            ref="vlJtcUpload"
            :class="{'vl_jtc_upload': true}"
            :limit="3"
            multiple
            :show-file-list="false"
            accept="image/*"
            action="https://apidev.aorise.org/medical-his/api/network/upload/new"
            list-type="picture-card"
            :on-exceed="uploadPicExceed"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucess"
            :on-error="handleError">
            <i v-if="uploading" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl" :src="curImageUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
          <p v-show="!curImageUrl">点击上传目标图片</p>
        </div>
        <div class="vl_jtc_img_list">
          <div v-for="(item, index) in imgList" :key="item.id" :class="{'middle_img': index === 1}">
            <img :src="item.fileFullPath ? item.fileFullPath : ''" alt="">
            <div class="del_mask" v-show="item.fileFullPath">
              <i class="el-icon-delete" @click="delPic(index)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="vl_jtc_search">
        <el-select v-model="searchData.targetType" @change="chooseType" placeholder="请选择">
          <el-option
            v-for="item in targetTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-show="searchData.targetType === 0" v-model="searchData.name" placeholder="输入姓名搜索"></el-input>
        <el-input v-show="searchData.targetType === 0" v-model="searchData.cardId" placeholder="输入证件号码搜索"></el-input>
        <el-input v-show="searchData.targetType === 1" v-model="searchData.carNum" placeholder="输入车牌号码搜索"></el-input>
        <el-date-picker
          v-model="searchData.time"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          format="yy/MM/dd"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="tcDiscuss">碰撞分析</el-button>
      </div>
    </div>
    <div class="vl_j_right">
      <div id="tcMap"></div>
    </div>
  </div>
</template>
<script>
import {testData} from './testData';
export default {
  data() {
    return {
      testData: testData,
      curImageUrl: '', // 当前上传的图片
      curImgNum: 0, // 当前图片数量
      uploading: false, // 是否上传中
      uploadFileList: [],
      imgList: ['', '', ''],
      searchData: {
        targetType: 0, // 0：人， 1： 车
        name: null, // 目标姓名
        cardId: null, // 目标身份证号
        time: null,
        carNum: null // 车牌号
      },
      targetTypeList: [
        {label: '人', value: 0},
        {label: '车', value: 1}
      ],
      pickerOptions: {
        disabledDate (time) {
          let date = new Date();
          let y = date.getFullYear();
          let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
          let d = date.getDate();
          let threeMonths = '';
          let start = '';
          if (parseFloat(m) >= 4) {
            start = y + '-' + (m - 3) + '-' + d;
          } else {
            start = (y - 1) + '-' + (m - 3 + 12) + '-' + d;
          }
          threeMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      amap: null // 地图实例
    }
  },
  mounted () {
    this.setDTime();
    let map = new window.AMap.Map('tcMap', {
      center: [112.980377, 28.100175],
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map;
  },
  methods: {
    // 上传图片
    uploadPicExceed () {
      this.$message.warning('当前限制选择 3 个文件，请删除后再上传！');
    },
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
      console.log(this.curImgNum);
      this.uploading = false;
      if (response && response.data) {
        if (this.curImgNum >= 3) {
          this.$message.error('最多上传3张，请先删掉再上传');
          return;
        }
        this.curImgNum++;
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: '', // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            fileFullPath: oRes.fileFullPath,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          this.imgList[this.curImgNum - 1] = x;
          this.curImageUrl = x.fileFullPath;
        }
      }
      this.uploadFileList = fileList;
      console.log(fileList)
    },
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    delPic (index) {
      this.curImgNum--;
      this.uploadFileList.splice(index, 1);
      this.imgList.splice(index, 1, '');
      console.log(this.uploadFileList, index);
      if (this.curImgNum) {
        if (this.imgList[this.curImgNum - 1].fileFullPath && this.imgList[0].fileFullPath) {
          this.curImageUrl = this.imgList[this.curImgNum - 1].fileFullPath;
        } else {
          if (this.curImgNum === 2) {
            this.curImageUrl = this.imgList[2].fileFullPath;
          } else {
            if (this.imgList[this.curImgNum - 1].fileFullPath) {
              this.curImageUrl = this.imgList[this.curImgNum - 1].fileFullPath;
            } else {
              this.curImageUrl = this.imgList[2].fileFullPath ? this.imgList[2].fileFullPath : this.imgList[1].fileFullPath;
            }
          }
        }
      } else {
        this.curImageUrl = '';
      }
    },
    chooseType () {
      this.searchData.cardId = null;
      this.searchData.name = null;
      this.searchData.carNum = null;
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 15 * 24 * 3600 * 1000;
      this.searchData.time = [curDate - curS, date.getTime()]
    },
    resetSearch () {
      this.searchData = {
        targetType: 0, // 0：人， 1： 车
        name: null, // 目标姓名
        cardId: null, // 目标身份证号
        carNum: null // 车牌号
      }
      this.uploadFileList.splice(0, this.uploadFileList.length);
      this.imgList = ['', '', ''];
      this.curImageUrl = '';
      this.curImgNum = 0;
    },
    tcDiscuss () {
      console.log(this.searchData.time)
    }
  },
  watch: {}
}
</script>
<style scoped="scoped" lang="scss">
  .vl_jtc_img_box {
    width: 100%;
    height: auto;
    padding: 0 .2rem;
    border-bottom: 1px dashed #D3D3D3;
    padding-bottom: .44rem;
    .vl_jtc_upload_img {
      position: relative;
      .vl_jtc_upload {
        /deep/.el-upload--picture-card {
          width: 100%;
          padding-top: 100%;
          position: relative;
          > i {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
          > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
          }
        }
      }
      > p {
        position: absolute;
        bottom: 7px;
        text-align: center;
        font-size: 0.14rem;
        width: 100%;
      }
    }
    .vl_jtc_img_list {
      width: 100%;
      margin-top: 10px;
      text-align: center;
      .middle_img {
        display: inline-block;
      }
      > div {
        width: 30%;
        padding-top: 30%;
        border: 1px dashed #D3D3D3;
        position: relative;
        &:hover {
          .del_mask {
            display: block;
          }
        }
        &:last-child {
          float: right;
        }
        &:first-child {
          float: left;
        }
        .del_mask {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .2);
          top: 0;
          > i {
            cursor: pointer;
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            color: #ffffff;
            width: 16px;
            height: 16px;
            text-align: center;
          }
        }
        > img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .vl_jtc_search {
    width: 100%;
    height: auto;
    padding: 0 .2rem;
    padding-top: .4rem;
    /deep/.el-input__inner {
      height: .4rem;
      line-height: .4rem;
    }
    /deep/.el-input__icon {
      height: .4rem;
      line-height: .4rem;
    }
    /deep/.el-range-editor {
      width: 100%;
      padding: 0;
      > i {
        display: none;
      }
      > input {
        width: 50%;
      }
      .el-range-separator {
        height: .4rem;
        line-height: .4rem;
        width: 10px;
        padding: 0;
      }
    }
    /deep/button {
      height: .4rem;
      line-height: .4rem;
      padding: 0 .12rem;
    }
    > div {
      margin-bottom: .1rem;
    }
  }
</style>
