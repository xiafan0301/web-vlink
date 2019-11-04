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
          <p :class="{active_tab: tabStep === 1}" @click="tabStep = 1">
            <span class="number">1</span>
            <span class="text">选择车体</span>
          </p>
          <p :class="{active_tab: tabStep === 2}" @click="tabStep = 2">
            <span class="number">2</span>
            <span class="text">框选特征</span>
          </p>
        </div>
        <div class="btn_box">
          <el-button class="nosure_btn" size="small" @click="cancelSelectCut">取消</el-button>
          <el-button class="sure_btn" size="small" :disabled="!hasImgBoxData" @click="sureSelectCut">确定</el-button>
        </div>
      </div>
      <div class="middle">
        <div class="middle_left">
          <span class="middle_step">1</span>
          <div class="img_box" >
            <img id="imgBox" :src="imgInfo.url" alt="">
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
             <div id="mapCutScreenContain" v-show="showCutContainer" class="cut_right_box" @mousedown.stop="beginDraw($event)" @mouseup="endDraw($event)">
              <span id="mapCutScreenBox" v-show="curCutBox" @mousedown.stop="moveBox($event)"  @mouseup.stop="boxMoveEnd($event)">
                <!-- <img :src="secondImgUrl" alt=""> -->
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
        <div class="item_list" v-for="(item, index) in imgBDataList" :key="index">
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
  props: ['open', 'imgDataList', 'initImageInfo'],
  /**
   * open: false;  是否打开框选弹框
   * imgDataList：[];  图片可框选的车体数据信息列表
   * initImageInfo：{}; 原始图片信息
   * imgBDataList: []; 传至父组件的框选的车体信息
   */
  data () {
    return {
      tabStep: 1, // 导航栏选择
      dialogVisible: false,
      selectComplete: false,
      showCutContainer: false,
      cutComplete: false,
      curCutBox: false,
      selectList: [],  
      secondImgUrl: null, // 第二步选择车体的图片地址
      initImgWidth: 920, // 图片原width
      initImgHeight: 419, // 图片原height
      fd: null,
      currentId: null, // 第一步选择车体标识
      currentX: 0, // 当前选择车体的x
      currentY: 0, // 当前选择车体的y
      currentWidth: 0, // 当前选择车体的width
      currentHeight: 0,  // 当前选择车体的height
      secondCurrWidth: 0, // 第二步框选车体--当前框选车体的width
      secondCurrHeight: 0, // 第二步框选车体--当前框选车体的height
      secondCurrX: 0, // 第二步框选车体--当前框选车体的x
      secondCurrY: 0, // 第二步框选车体--当前框选车体的y
      imgBDataList: [
        {
          fileName: null,
          src: null
        }
      ],
      secondCutList: [], // 第二步截屏的div
      imgInfo: {
        url: null,
        height: null,
        width: null
      }, // 原始图片信息
      hasImgBoxData: false // 是否有框选图片
    }
  },
  watch: {
    open (val) {
      this.dialogVisible = val;
    },
    imgDataList (val) {
      this.selectList = val;

      if (val.length > 0) {
        setTimeout(() => {
          this.getImgScale();
        }, 1000)
      }
    },
    initImageInfo () {
      this.imgInfo = Object.assign({}, this.initImageInfo);
    },
    imgBDataList (val) {
      val.map(item => {
        if (item.src) {
          this.hasImgBoxData = true;
        } else {
          this.hasImgBoxData = false;
        }
      })
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.getImgScale();
    // })
  },
  methods: {
    // 取消
    cancelSelectCut () {
      // this.dialogVisible = false;
      this.tabStep = 1;
      this.$emit('emitImgData', {
        open: false,
        // uploadClear: {},
        imgBDataList: []
      })
    },
    // 上一步
    prev () {
      this.tabStep = 1;
    },
    // 确定
    sureSelectCut () {
      this.$emit('emitImgData', {
        open: false,
        imgBDataList: this.imgBDataList
      })
      // this.dialogVisible = false;
    },
    // 第一步---取消选择车体
    cancelSelect () {
      if ($('.select_box').hasClass('active_select')) {
        $('.select_box').removeClass('active_select');
      }
      this.selectComplete = false;
    },
    // 第一步---- 确认选择车体
    finishSelect () {
      let x = this.currentX, y = this.currentY, width = this.currentWidth, height = this.currentHeight;
      if (width > 0 && height > 0) {
        this.tabStep = 2;
        this.imgBDataList = [{
          fileName: null,
          src: null
        }];

        this.secondCutList.map(item => {
          const $imgDiv = document.getElementById('second_select_box_' + item.fileName);
          
          $('.img_right_box')[0].removeChild($imgDiv);
        });

        this.secondCutList = [];
    
        this.createImgPath(x, y, width, height, 1);
      }
    },
    // 获取图片缩放比例
    getImgScale () {
      let imgWidth = $('#imgBox').width(); // 获取图片的宽度
      let scale = this.initImgWidth / imgWidth;

      
      this.selectList.forEach((item, index) => {
        // 在页面显示的图片大小计算宽和高的比例
        let newItem = {};
        for (let key in item) { // 根据图片的缩放比例计算车体的缩放后的各数据的大小
          newItem[key] = Math.ceil(item[key] / scale);
        }

        let $div = document.createElement('div');
        let $id = 'select_box_' + index;

        let $p = document.createElement('p');

        $p.setAttribute('class', 'title_p');
        $p.style.whiteSpace = 'nowrap';
        $p.innerText = '目标';
        

        $div.setAttribute('id', $id);

        $div.setAttribute('class', 'select_box');

        $div.style.width = newItem.width + 'px';
        $div.style.height = newItem.height + 'px';

      
        $div.style.left = newItem.x + 'px';
        $div.style.top = newItem.y + 'px';

        $div.appendChild($p);

        $('.img_box')[0].appendChild($div);

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
        _self.currentId = id; // 第一步选择的车体对象标识

        // _self.createImgPath(x, y, width, height);
      })
    },
    // 创建一个canvas，生成图片
    createImgPath (x, y, width, height, step) {
      console.log(x, y, width, height)
      let image = new Image();
      image.setAttribute("crossOrigin",'Anonymous');
      if (step === 1) {
        image.src = this.imgInfo.url;
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
                if (step === 2) {
                  const obj = {
                    x, y, width, height,
                    fileName: res.data.fileName
                  };
                  this.secondCutList.push(obj);

                  let $div = document.createElement('div');
  
                  $div.setAttribute('id', 'second_select_box_' + res.data.fileName);
  
                  $div.setAttribute('class', 'second_select_box');
  
                  $div.style.width = this.secondCurrWidth + 'px';
                  $div.style.height = this.secondCurrHeight + 'px';
  
                  $div.style.left = this.secondCurrX + 'px';
                  $div.style.top = this.secondCurrY + 'px';
  
                  $('.img_right_box')[0].appendChild($div);

                }
                if (this.secondCutList.length < 6) {
                  this.getAutoCutBox();
                }
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
            
            if (step === 1) {
              this.secondImgUrl = imgObj.path;
              this.showCutContainer = true;

              this.selectComplete = false;
              if ($('.select_box').hasClass('active_select')) {
                $('.select_box').removeClass('active_select');
              }
            } else {
              if (this.secondCutList.length === 1) {
                this.imgBDataList = [{
                  fileName: imgObj.cname,
                  src: imgObj.path
                }]
              } else {
                const params = {
                  fileName: imgObj.cname,
                  src: imgObj.path
                };
                this.imgBDataList.push(params);
              }
            }
          }
        })
      }
    },
    // 第二步---自动生成一个预设框选体
    getAutoCutBox () {
      this.showCutContainer = true;

      let x = 100 + Math.random() * 100, y = 100 + Math.random() * 100;

      this.cutComplete = true;
      this.curCutBox = true;

      $('#mapCutScreenBox').css({
        'top': y,
        'left': x,
        'width': '100px',
        'height': '100px'
      });
      
      $('#mapSureCutComplete').css({
        'top': y + 120,
        'left': x + 50,
      })
    },
    changeIt (index, ev) {
      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;

      let X = ev.clientX, Y = ev.clientY, originW = $('#mapCutScreenBox').width(), orginH = $('#mapCutScreenBox').height();
      // this.curTapIndex = index;
      console.log(X + '+++++++++++++' + X);
      
      console.log(originW + '______________' + orginH);
      
      this.cutComplete = false;
      $('#mapCutScreenContain').bind('mousemove', (event) => {
        // 阻止默认行为
        if(event.preventDefault){event.preventDefault();}else{window.event.returnValue == false;}
        let curY = event.clientY - Y, curX = event.clientX - X;
        
        switch(index) {
          case '1':
            this.setPosition($('#mapCutScreenBox'), {
              'top': event.clientY - middleRtop,
              'left': event.clientX - middleRleft,
              'width': originW - curX,
              'height': orginH - curY
            })
            this.setPosition($('#mapCutScreenBox img').eq(0), {
              'top': -event.clientY,
              'left': -event.clientX
            })
            break;
          case '2':
            this.setPosition($('#mapCutScreenBox'), {
              'top': event.clientY - middleRtop,
              'height': orginH - curY
            })
            this.setPosition($('#mapCutScreenBox img').eq(0), {
              'top': -event.clientY
            })
            break;
          case '3':
            this.setPosition($('#mapCutScreenBox'), {
              'top': event.clientY - middleRtop,
              'width': originW + curX,
              'height': orginH - curY
            })
            this.setPosition($('#mapCutScreenBox img').eq(0), {
              'top': -event.clientY,
            })
            this.setPosition($('#mapCutComplete'), {
              'top': event.clientY + 10 + $('#mapCutScreenBox').height(),
              'left': event.clientX - 100,
            })
            break;
          case '4':
            this.setPosition($('#mapCutScreenBox'), {
              'left': event.clientX - middleRleft,
              'width': originW - curX,
            })
            this.setPosition($('#mapCutScreenBox img').eq(0), {
              'left': -event.clientX
            })
            break;
          case '5':
            this.setPosition($('#mapCutScreenBox'), {
              'width': originW + curX
            })
            this.setPosition($('#mapCutComplete'), {
              'left': event.clientX - 100
            })
            break;
          case '6':
            this.setPosition($('#mapCutScreenBox'), {
              'left': event.clientX - middleRleft,
              'width': originW - curX,
              'height': orginH + curY
            })
            this.setPosition($('#mapCutScreenBox img').eq(0), {
              'left': -event.clientX
            })
            this.setPosition($('#mapCutComplete'), {
              'top': event.clientY + 10
            })
            break;
          case '7':
            this.setPosition($('#mapCutScreenBox'), {
              'height': orginH + curY
            })
            this.setPosition($('#mapCutComplete'), {
              'top': event.clientY + 10,
            })
            break;
          case '8':
            this.setPosition($('#mapCutScreenBox'), {
              'width': originW + curX,
              'height': orginH + curY
            })
            this.setPosition($('#mapCutComplete'), {
              'top': event.clientY + 10,
              'left': event.clientX - 100,
            })
            break;
        }
      })
    },
    setPosition (el, options) {
      el.css(options);
    },
    // 开始截图
    beginDraw (e) {
      let imgHeight = $('#mapCutImageSource').height();
      $('#mapCutScreenContain').css('height', (imgHeight + 8) + 'px'); // 设置截屏容器的高度

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue == false;
      }
      if (this.curCutBox || this.secondCutList.length >= 6) {
        return false;
      }

      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;
      let scrollTop = $('.middle_right').scrollTop();

      let X = e.clientX, Y = e.clientY;

      this.curCutBox = true;

      $('#mapCutScreenBox').css({
        'top': Y - middleRtop + scrollTop,
        'left': X - middleRleft,
        'width': '10px',
        'height': '10px'
      });

      $('#mapCutScreenBox img').eq(0).css({
        'top': -Y,
        'left': -X
      });

      $('#mapCutScreenContain').bind('mousemove', (event) => {
        
        let curY =  event.clientY, curX =  event.clientX;
        $('#mapCutScreenBox').css({
          'width': curX - X,
          'height': curY - Y
        })
      })

    },
    // 结束截屏
    endDraw (ev) {
      if (this.secondCutList.length >= 6) {
        return false;
      }
      
      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;

      let Y =  ev.clientY, X =  ev.clientX;
      $('#mapSureCutComplete').css({
        'top': (Y - middleRtop) + 20,
        'left': (X - middleRleft) - 100,
      })
      this.cutComplete = true;
      
      $('#mapCutScreenContain').unbind('mousemove');
    },
    moveBox (ev) {
      let Y = ev.clientY - ev.target.offsetTop, X = ev.clientX - ev.target.offsetLeft;
      $('#mapCutScreenContain').bind('mousemove', (event) => {
        let curY =  event.clientY - Y, curX =  event.clientX - X;
        $('#mapCutScreenBox').css({
          'top': curY,
          'left': curX,
        })
        $('#mapCutScreenBox img').eq(0).css({
          'top': -curY,
          'left': -curX
        })
        $('#mapCutComplete').css({
          'top': curY + ev.target.clientHeight + 10,
          'left': curX + ev.target.clientWidth - 100,
        })
      })
    },
    // 移动结束
    boxMoveEnd (ev) {
      let middleRleft = $('.middle_right').offset().left;
      let middleRtop = $('.middle_right').offset().top;
      $('#mapSureCutComplete').css({
        'top': (ev.clientY - middleRtop) + 50,
        'left': (ev.clientX - middleRleft) - 50,
      })
      this.cutComplete = true;
      $('#mapCutScreenContain').unbind('mousemove');
    },
    // 取消截屏
    cancelCutScreen () {
      this.curCutBox = false;
      this.cutComplete = false;
    },
    // 确定截屏
    finishCut () {
      let bigDom = document.getElementById('mapCutScreenContain');
      let dom = document.getElementById('mapCutScreenBox');

      let currentId = this.currentId.split('_');
      let _scale = bigDom.clientWidth / this.selectList[parseInt(currentId[2])].width; // 计算缩放比例
      
      this.secondCurrWidth = dom.clientWidth;
      this.secondCurrHeight = dom.clientHeight;
      this.secondCurrX = dom.offsetLeft;
      this.secondCurrY = dom.offsetTop;

      let w = Math.ceil(dom.clientWidth / _scale), h = Math.ceil(dom.clientHeight / _scale), x = Math.ceil(dom.offsetLeft / _scale), y = Math.ceil(dom.offsetTop / _scale);

      this.curCutBox = false;
      this.cutComplete = false;

      this.createImgPath(x, y, w, h, 2);

    },
    // 底部删除所框选的图片
    deleteBottomImg (obj, index) {
      
      if (this.tabStep === 1) {
        return false;
      }
      if (this.imgBDataList.length <= 1) {
        this.imgBDataList = [{
          fileName: null,
          src: null
        }]
        this.curCutBox = false;
      } else {
        this.imgBDataList.splice(index, 1);
      }
      this.secondCutList.map((item, idx) => {
        if (item.fileName === obj.fileName) {
          this.secondCutList.splice(idx, 1);
        }
      })
      const $imgDiv = document.getElementById('second_select_box_' + obj.fileName);
      
      $('.img_right_box')[0].removeChild($imgDiv);

      if (this.secondCutList.length < 6) {
        this.getAutoCutBox();
      }
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
          cursor: pointer;
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
        text-align: right;
        padding-right: 30px;
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
        overflow-y: scroll;
        width: 48%;
        .img_box, .img_right_box {
          width: 100%;
          height: 100%;
          position: relative;
          >img {
            width: 100%;
            height: auto;
            background-color: #EAEAEA;
          }
          .select_box {
            &:hover {
              z-index: 1000;
            }
            .title_p {
              width: 100%;
              height: 20px;
              text-align: center;
              color: #ffffff;
              background-color: #0C70F8;
            }
          }
          .select_box, .second_select_box {
            position: absolute;
            background:rgba(12,112,248,0.1);
            border:1px solid rgba(18,100,248,1);
            // opacity: 0.4;
            cursor: pointer;
            // &:hover {
            //   background:rgba(255,0,0,0.2);
            //   border:1px solid rgba(255,0,57,1);
            // }
          }
          .active_select, .second_active_select {
            background:rgba(255,0,0,0.2);
            border:1px solid rgba(255,0,57,1);
            .title_p {
              background-color: #FF0039;
            }
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
            height: auto;
            top: 0;
            // background: rgba(0, 0, 0, .4);
            cursor: crosshair;
            // overflow: scroll;
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