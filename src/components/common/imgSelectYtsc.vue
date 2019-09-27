<template>
  <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="1024px"
  :show-close="true"
  :close-on-press-escape="false"
  :close-on-click-modal="false"
  custom-class="cut_img_select_ytsc_dialog"
  >
    <div class="select_body">
      <div class="top">
        <div class="tab_list">
          <p :class="{active_tab: tabStep === 1}">
            <span class="number">1</span>
            <span class="text">选择车体</span>
          </p>
          <p :class="{active_tab: tabStep === 2}">
            <span class="number">2</span>
            <span class="text">框选特征</span>
          </p>
        </div>
        <div class="btn_box">
          <el-button class="nosure_btn" size="small" @click="cancelSelectCut">取消</el-button>
          <el-button class="nosure_btn" size="small" @click="prev">上一步</el-button>
          <el-button class="sure_btn" size="small" @click="sureSelectCut">确定</el-button>
        </div>
      </div>
      <div class="middle">
        <div class="middle_left">
          <span class="middle_step">1</span>
          <div class="img_box" >
            <img id="imgBox" src="http://newfile.aorise.org:80/group1/default/20190919/15/00/2/9546310b-b254-49ca-8ff2-4b3cef487d45.png" alt="">
            <div class="cut_end" id="mapCutComplete" v-show="selectComplete">
              <span @click.stop="cancelSelect"><i class="el-icon-close"></i></span>
              <span @click.stop="finishSelect"><i class="el-icon-check"></i>确定</span>
            </div>
          </div>
        </div>
        <div class="middle_right">
          <span class="middle_step">2</span>
          <div class="img_right_box">
            <img :src="secondImgUrl" alt="" id="mapCutImageSource">
             <div id="mapCutScreenContain" class="cut_right_box"  @mousedown.stop="beginDraw($event)" @mouseup="endDraw($event)">
              <span id="mapCutScreenBox" v-show="curCutBox" @mousedown.stop="moveBox($event)"  @mouseup.stop="boxMoveEnd">
                <img :src="secondImgUrl" alt="">
                <i v-for="item in '12345678'" :class="'move_icon' + item" :key="item.id" @mousedown.stop="changeIt(item ,$event)"  @mouseup="boxMoveEnd"></i>
              </span>
              <div class="cut_end" id="mapSureCutComplete" v-show="cutComplete">
                <span @click.stop="cancelCutScreen"><i class="el-icon-close"></i></span>
                <span @click.stop="finishCut"><i class="el-icon-check"></i>完成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divide"></div>
      <div class="bottom">
        <div class="item_list" v-for="(item, index) in imgDataList" :key="index">
          <p class="close_btn" v-if="item.src" @click="deleteBottomImg(item, index)">
            <i class="el-icon-close"></i>
          </p>
          <img :src="item.src" alt="">
          <span class="info_text" v-if="item.src">特征{{index + 1}}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { handUpload } from "@/views/index/api/api.base.js";
import { JtcPOSTAppendixInfo } from "@/views/index/api/api.judge.js";

export default {
  data () {
    return {
      tabStep: 1, // 导航栏选择
      dialogVisible: true,
      selectComplete: false,
      cutComplete: false,
      curCutBox: false,
      selectList: [
        {
          uid: 'x12222',
          x: 30,
          y: 30,
          width: 100,
          height: 100
        },
        {
          uid: 'x12223',
          x: 70,
          y: 100,
          width: 200,
          height: 150
        }
      ],
      secondImgUrl: null, // 第二步选择车体的图片地址
      initImgWidth: 881, // 图片原width
      initImgHeight: 600, // 图片原height
      fd: null,
      currentX: 0, // 当前选择车体的x
      currentY: 0, // 当前选择车体的y
      currentWidth: 0, // 当前选择车体的width
      currentHeight: 0,  // 当前选择车体的height
      imgDataList: [
        {
          uid: null,
          src: null
        }
      ],
      secondCutList: [], // 第二步截屏的div
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getImgScale();
    })
  },
  methods: {
    // 取消
    cancelSelectCut () {
      this.dialogVisible = false;
      this.tabStep = 1;
    },
    // 上一步
    prev () {
      this.tabStep = 1;
    },
    // 确定
    sureSelectCut () {
      this.dialogVisible = false;
    },
    // 取消选择车体
    cancelSelect () {
      if ($('.select_box').hasClass('active_select')) {
        $('.select_box').removeClass('active_select');
      }
      this.selectComplete = false;
    },
    // 确认选择车体
    finishSelect () {
      let x = this.currentX, y = this.currentY, width = this.currentWidth, height = this.currentHeight;
      if (width > 0 && height > 0) {
        this.tabStep = 2;
        this.createImgPath(x, y, width, height, 1);
      }
    },
    // 获取图片缩放比例
    getImgScale () {
      let scale = this.initImgWidth / this.initImgHeight; // 原图初始比例

      let imgWidth = $('#imgBox').width();
      
      let currHeight = Math.ceil(imgWidth / scale); // 图片压缩后的height
      // $('#imgBox').css('height', currHeight + 'px');

      this.selectList.forEach(item => {
        // 在页面显示的图片大小计算宽和高的比例
        let wScale = this.initImgWidth / item.width;
        let hScale = this.initImgHeight / item.height;

        let $div = document.createElement('div');

        $div.setAttribute('id', 'select_box' + item.uid);

        $div.setAttribute('class', 'select_box');

        $div.style.width = Math.ceil(imgWidth / wScale) + 'px';
        $div.style.height = Math.ceil(currHeight / hScale) + 'px';

        $div.style.left = item.x + 'px';
        $div.style.top = item.y + 'px';

        $('.img_box')[0].appendChild($div);

        let $id = 'select_box' + item.uid;

        this.handleClickListen($id, item.x, item.y, item.width, item.height);
      })
     
    },
    // 图片选择区域的点击监听事件
    handleClickListen (id, x, y, width, height) {
      
      let _self = this;
      let clickObj = document.getElementById(id);
      
      let middleLleft = $('.middle_left').offset().left;
      let middleLtop = $('.middle_left').offset().top;

      clickObj.addEventListener('click', function (event) {
        
        _self.selectComplete = true;

        let X = event.clientX, Y = event.clientY;
        $('#mapCutComplete').css({
          'top': (Y - middleLtop) + 20,
          'left': (X - middleLleft) + 10,
        });

        if ($('.select_box').hasClass('active_select')) {
          $('.select_box').removeClass('active_select');
        }

        if ($(clickObj).hasClass('active_select')) {
          $(clickObj).removeClass('active_select');
        } else {
          $(clickObj).addClass('active_select');
        }

        _self.currentX = x;
        _self.currentY = y;
        _self.currentWidth = width;
        _self.currentHeight = height;

        // _self.createImgPath(x, y, width, height);
      })
    },
    // 创建一个canvas，生成图片
    createImgPath (x, y, width, height, step) {
      let image = new Image();
      image.setAttribute("crossOrigin",'Anonymous');
      if (step === 1) {
        image.src = 'http://newfile.aorise.org:80/group1/default/20190919/15/00/2/9546310b-b254-49ca-8ff2-4b3cef487d45.png';
      } else {
        image.src = this.secondImgUrl;
      }

      image.onload = () => {
        
        let $canvas = document.createElement('canvas');
        $($canvas).attr({'width': width, 'height': height});
        let ctx = $canvas.getContext('2d');
  
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        $($canvas)[0].toBlob((blob) => {
          this.fd = new FormData();
          let fileBlob = new File([blob], new Date().getTime() + '.png')
          this.fd.append("file", fileBlob);
          
          // 上传图片
          handUpload(this.fd)
            .then(res => {
              if (res && res.data) {
                this.setImgUid(res.data, step);
              }
            })
            .catch(() => {})
        })
      }
    },
    // 设置截屏图片信息---上传图片
    setImgUid (oRes, step) {
     let imgObj = {
        cname: oRes.fileName, // 附件名称 ,
        // contentUid: this.$store.state.loginUser.uid,
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


      if (this.$store.state.loginUser && this.$store.state.loginUser.uid) {
        imgObj.contentUid = this.$store.state.loginUser.uid;
        JtcPOSTAppendixInfo(imgObj).then(jRes => {
          if (jRes) {
            
            // this.dialogVisible = false;
            if (step === 1) {
              this.secondImgUrl = imgObj.path;
              this.selectComplete = false;
              if ($('.select_box').hasClass('active_select')) {
                $('.select_box').removeClass('active_select');
              }
            } else {
              if (this.secondCutList.length === 1) {
                this.imgDataList = [{
                  uid: imgObj.contentUid,
                  src: imgObj.path
                }]
              } else {
                const params = {
                  uid: imgObj.contentUid,
                  src: imgObj.path
                };
                this.imgDataList.push(params);
              }

              console.log(this.imgDataList)
            }
            // this.$emit('emitImgData', {
            //   open: false,
            //   imgPath: imgObj.path
            // })
          }
        })
      }
    },
    // 开始截图
    beginDraw (e) {
      console.log('this.secondCutList', this.secondCutList)
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue == false;
      }
      if (this.curCutBox || this.secondCutList.length >= 6) {
        return false;
      }

      console.log('6666666666');
      
      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;

      let X = e.clientX, Y = e.clientY;

      this.curCutBox = true;

      $('#mapCutScreenBox').css({
        'top': Y - middleRtop,
        'left': X - middleRleft,
        'width': '10px',
        'height': '10px'
      });

      $('#mapCutScreenBox img').eq(0).css({
        'top': -Y,
        'left': -X
      });

      $('#mapCutScreenContain').bind('mousemove', (event) => {
        console.log('ooooooooooooooooo');
        
        let curY =  event.clientY, curX =  event.clientX;
        $('#mapCutScreenBox').css({
          'width': curX - X,
          'height': curY - Y
        })
      })

    },
    // 结束截屏
    endDraw (ev) {
      console.log('jjjjjjjjjjjjjjjjjjjjjjj');
      
      if (this.secondCutList.length >= 6) {
        return false;
      }
      console.log('mmmmmmmmmmmmmmmmmm');
      
      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;

      let Y =  ev.clientY, X =  ev.clientX;
      // if (!this.curTapIndex) {
        $('#mapSureCutComplete').css({
          'top': (Y - middleRtop) + 20,
          'left': (X - middleRleft) - 100,
        })
      // }
      this.cutComplete = true;
      console.log('ddddddddddddddddd');
      
      $('#mapCutScreenContain').unbind('mousemove')

    },
    // 移动截屏框
    moveBox (e) {},
    // 移动结束
    boxMoveEnd () {
      this.cutComplete = true;
      $('#mapCutScreenContain').unbind('mousemove')
    },
    changeIt (obj, e) {},
    // 取消截屏
    cancelCutScreen () {
      this.curCutBox = false;
      this.cutComplete = false;
    },
    // 确定截屏
    finishCut () {
      let dom = document.getElementById('mapCutScreenBox');
      let w = dom.clientWidth, h = dom.clientHeight, x = dom.offsetLeft, y = dom.offsetTop;
      console.log(w + 'g' + h)
      console.log(x + 'h' + y)

      const obj = {
        x, y, w, h
      };
      this.secondCutList.push(obj);

      // this.secondCutList.map((item, index) => {
      let $div = document.createElement('div');

      $div.setAttribute('id', 'second_select_box_' + this.secondCutList.length);

      $div.setAttribute('class', 'second_select_box');

      $div.style.width = w + 'px';
      $div.style.height = h + 'px';

      $div.style.left = x + 'px';
      $div.style.top = y + 'px';

      $('.img_right_box')[0].appendChild($div);

      let $id = 'second_select_box_' + this.secondCutList.length;

      this.curCutBox = false;
      this.cutComplete = false;

      // });
      this.createImgPath(x, y, w, h, 2);

    },
    // 底部删除所框选的图片
    deleteBottomImg (obj, index) {
      if (this.imgDataList.length <= 1) {
        this.imgDataList = [{
          uid: null,
          src: null
        }]
      } else {
        this.imgDataList.splice(index, 1);
      }
      const $imgDiv = document.getElementById('second_select_box_' + (index + 1));
      console.log($imgDiv);
      
      $('.img_right_box')[0].removeChild($imgDiv);
      
    }
  }
}
</script>
<style lang="scss">
.cut_img_select_ytsc_dialog {
  .select_body {
    .top {
      display: flex;
      align-items: center;
      >div {
        width: 50%;
      }
      .tab_list {
        display: flex;
        >p {
          padding-bottom: 10px;
          margin-right: 20px;
          color: #666666;
          display: inline-block;
          .number {
            // width: 10px;
            // height: 10px;
            font-size: 12px;
            padding: 0 5px;
            margin-right: 10px;
            border: 1px solid #666666;
            border-radius: 50%;
          }
        }
        .active_tab {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
          .number {
            border-color: #0C70F8;
            color: #0C70F8;
          }
        }
      }
      .btn_box {
        .nosure_btn, .sure_btn {
          width: 110px;
          border-radius:2px;
        }
        .nosure_btn {
          background:rgba(246,248,249,1);
          border:1px solid rgba(211,211,211,1);
        }
        .sure_btn {
          background:rgba(12,112,248,1);
          color: #ffffff;
        }
      }
    }
    .middle {
      margin-top: 20px;
      display: flex;
      height: 300px;
      .middle_left, .middle_right {
        position: relative;
        width: 48%;
        .img_box, .img_right_box {
          width: 100%;
          height: 100%;
          position: relative;
          >img {
            width: 100%;
            height: 100%;
            background-color: #EAEAEA;
          }
          .select_box, .second_select_box {
            position: absolute;
            background:rgba(12,112,248,0.1);
            border:1px solid rgba(18,100,248,1);
            opacity: 0.4;
            cursor: pointer;
            &:hover {
              background:rgba(255,0,0,0.2);
              border:1px solid rgba(255,0,57,1);
            }
          }
          .active_select, .second_active_select {
            background:rgba(255,0,0,0.2);
            border:1px solid rgba(255,0,57,1);
          }
          .cut_end {
            z-index: 1000;
            position: absolute;
            bottom: 500px;
            left: 500px;
            height: 30px;
            background: #ffffff;
            width: 100px;
            box-shadow: 0px 12px 12px 0px rgba(2,10,62,0.36);
            border-radius: 4px;
            line-height: 30px;
            span {
              cursor: pointer;
              vertical-align: middle;
              padding: 0 5px;
              i {
                color: #F95826;
                font-weight: bold;
                font-size: 20px;
                vertical-align: inherit;
                padding: 0 1px;
              }
              &:last-child {
                i {
                  color: #1264F8;
                }
              }
            }
          }
        }
        .img_right_box {
          .cut_right_box {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            // background: rgba(0, 0, 0, .4);
            cursor: crosshair;
            >span {
              display: block;
              overflow: hidden;
              position: absolute;
              width: 0px;
              height: 0px;
              &:after {
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                cursor: move;
                top: 0;
                left: 0;
                margin: auto;
                bottom: 0;
                right: 0;
              }
              >img {
                width: auto;
                height: auto;
                position: absolute;
              }
              > i {
                position: absolute;
                width: 7px;
                height: 7px;
                background: #0C70F8;
                z-index: 8;
              }
              >.move_icon1 {cursor: nw-resize; top: 0px;left: 0px;}
              >.move_icon8 {cursor: nw-resize; bottom: 0px;right: 0px;}
              >.move_icon2 {cursor: n-resize; left: 50%;top: 0px;}
              >.move_icon7 {cursor: n-resize; left: 50%; bottom: 0px;}
              >.move_icon3 {cursor: sw-resize;top: 0px;right: 0px;}
              >.move_icon6 {cursor: sw-resize;left: 0px;bottom: 0px;}
              >.move_icon4 {cursor: w-resize;top: 50%;left: 0px;}
              >.move_icon5 {cursor: w-resize;top: 50%;right: 0px;}
            }
            .cut_end {
              z-index: 1000;
              position: absolute;
              bottom: 500px;
              left: 500px;
              height: 30px;
              background: #ffffff;
              width: 100px;
              box-shadow: 0px 12px 12px 0px rgba(2,10,62,0.36);
              border-radius: 4px;
              line-height: 30px;
              span {
                cursor: pointer;
                vertical-align: middle;
                padding: 0 5px;
                i {
                  color: #F95826;
                  font-weight: bold;
                  font-size: 20px;
                  vertical-align: inherit;
                  padding: 0 1px;
                }
                &:last-child {
                  i {
                    color: #1264F8;
                  }
                }
              }
            }
          }

        }
        .middle_step {
          z-index: 111;
          position: absolute;
          width: 25px;
          height: 25px;
          line-height: 25px;
          background:rgba(12,112,248,1);
          border-radius:50%;
          color: #ffffff;
          font-weight:600;
          font-size: 13px;
          text-align: center;
          left: 10px;
          top: 10px;
        }
      }
      .middle_right {
        margin-left: 2%;
      }
    }
    .divide {
      border: 1px solid #F2F2F2;
      margin: 20px 0;
    }
    .bottom {
      display: flex;
      flex-wrap: wrap;
      .item_list {
        width: calc((100% - 100px) / 6);
        // height: auto;
        height: 85px;
        margin-right: 20px;
        position: relative;
        background-color: #EAEAEA;
        .close_btn {
          background-color: #000000;
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          text-align: center;
          cursor: pointer;
          i {
            font-size: 14px;
            color: #ffffff;
          }
        }
        .info_text {
          padding: 2px 5px;
          position: absolute;
          background-color: #000000;
          bottom: 0;
          left: 0;
          opacity:0.8;
          color: #ffffff;
          border-radius:0px 2px 0px 0px;
        }
        &:last-child {
          margin-right: 0;
        }
        >img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>