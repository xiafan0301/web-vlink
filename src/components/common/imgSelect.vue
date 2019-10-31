<template>
  <el-dialog
  title="请选择搜索目标"
  :visible.sync="dialogVisible"
  width="1024px"
  :show-close="false"
  :close-on-press-escape="false"
  :close-on-click-modal="false"
  custom-class="cut_img_select_dialog"
  >
    <div class="select_body">
      <div class="img_box">
        <img :src="imgInfo.url" alt="" id="imgBox">
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSave" size="small">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="saveCutImg" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { handUpload } from "@/views/index/api/api.base.js";
import { JtcPOSTAppendixInfo } from "@/views/index/api/api.judge.js";
export default {
  props: ['open', 'imgDataList', 'initImageInfo'],
  data () {
    return {
      dialogVisible: false,
      submitLoading: false,
      selectList: [],
      initImgWidth: 500, // 图片原width
      initImgHeight: 341, // 图片原height
      fd: null,
      selectComplete: true, // 点击选择出现
      imgInfo: {
        url: null,
        height: null,
        width: null
      }
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
    }
  },
  methods: {
    // 默认选中第一个框体
    // checkFirstImgBox () {
    //   let obj = this.selectList[0];
    //   let firstId = 'select_box_0';

    //   let $idObj = document.getElementById(firstId);
    //   $($idObj).addClass('active_select');

    //   this.createImgPath(obj.x, obj.y, obj.width, obj.height);
    // },
    // 获取图片缩放比例
    getImgScale () {
      let imgWidth = $('#imgBox').width();
      let scale = this.imgInfo.width / imgWidth; // 原图初始比例
      console.log('asdasd', this.selectList);
      
      this.selectList.forEach((item, index) => {

        // 在页面显示的图片大小计算宽和高的比例
        let newItem = {};
        for (let key in item) { // 根据图片的缩放比例计算车体的缩放后的各数据的大小
          newItem[key] = Math.ceil(item[key] / scale);
        }

        let $div = document.createElement('div');
        let $p = document.createElement('p');

        $p.setAttribute('class', 'title_p');
        $p.innerText = '目标' + (index + 1);

        let $id = 'select_box_' + index;

        $div.setAttribute('id', $id);

        $div.setAttribute('class', 'select_box');
        
        $div.style.width = newItem.width + 'px';
        $div.style.height = newItem.height + 'px';


        $div.style.left = newItem.x + 'px';
        $div.style.top = newItem.y + 'px';
        
        $div.appendChild($p);
        
        $('.img_box')[0].appendChild($div);

        // 默认选中第一个框体
        // this.checkFirstImgBox();

        this.handleClickListen($id, item.x, item.y, item.width, item.height);
      })
    },
    // 图片选择区域的点击监听事件
    handleClickListen (id, x, y, width, height) {
      let _self = this;
      let clickObj = document.getElementById(id);

      clickObj.addEventListener('click', function () {
        if ($('.select_box').hasClass('active_select')) {
          $('.select_box').removeClass('active_select');
        }

        if ($(clickObj).hasClass('active_select')) {
          $(clickObj).removeClass('active_select');
        } else {
          $(clickObj).addClass('active_select');
        }

        _self.createImgPath(x, y, width, height);
      })
    },
    // 创建一个canvas，生成图片
    createImgPath (x, y, width, height) {
      let image = new Image();
      image.setAttribute("crossOrigin",'Anonymous');
      image.src = this.imgInfo.url;

      image.onload = () => {
        
        let $canvas = document.createElement('canvas');
        $($canvas).attr({'width': width, 'height': height});
        let ctx = $canvas.getContext('2d');
  
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        $($canvas)[0].toBlob((blob) => {
          this.fd = new FormData();
          let fileBlob = new File([blob], new Date().getTime() + '.png')
          this.fd.append("file", fileBlob);
          
        })
      }
    },
    // 设置截屏图片信息---上传图片
    setImgUid (oRes) {
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
      // this.skipImgUrl = imgObj.path;
      if (this.$store.state.loginUser && this.$store.state.loginUser.uid) {
        imgObj.contentUid = this.$store.state.loginUser.uid;
        JtcPOSTAppendixInfo(imgObj).then(jRes => {
          if (jRes) {
            this.dialogVisible = false;

            this.$emit('emitImgData', {
              open: false,
              imgPath: imgObj.path
            })
            $('.img_box div').remove();
          }
        })
      }
    },
    // 保存确认选择的图片
    saveCutImg () {
      if (this.fd) {
        // 上传图片
        handUpload(this.fd)
          .then(res => {
            if (res && res.data) {
              this.setImgUid(res.data);
            }
          })
          .catch(() => {})
      } else {
        $('.img_box div').remove();
        this.$emit('emitImgData', {
          open: false
        })
      }
    },
    // 取消选择
    cancelSave () {
      $('.img_box div').remove(); // 删除添加的div元素
      this.$emit('emitImgData', {
        open: false,
        // uploadClear: {}
      })
    }
  }
}
</script>
<style lang="scss">
  .cut_img_select_dialog {
    .select_body {
      height: 500px;
      overflow-y: scroll;
      .img_box {
        width: 100%;
        height: 100%;
        position: relative;
        >img {
          width: 100%;
          // height: 100%;
        }
        .select_box {
          position: absolute;
          background:rgba(12,112,248,0.1);
          border:1px solid rgba(18,100,248,1);
          cursor: pointer;
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
        .active_select {
          background:rgba(255,0,0,0.2);
          border:1px solid rgba(255,0,57,1);
          .title_p {
            background-color: #FF0039;
          }
        }
      }
    }
  }
</style>