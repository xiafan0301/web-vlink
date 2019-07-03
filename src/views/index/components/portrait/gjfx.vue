<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item>轨迹分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                label-width="0px"
                class="demo-ruleForm"
        >
          <el-form-item class="firstItem">
            <el-date-picker
                    v-model="data1"
                    type="date"
                    placeholder="选择日期"
                    class="full"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item prop="age">
            <p class="carCold">车牌：</p>
            <el-input placeholder="请输入车牌号" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="湘" value="1"></el-option>
                <el-option label="湘" value="2"></el-option>
                <el-option label="湘" value="3"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-row :gutter="5">
              <el-col :span="22">
                <div>
                  <el-input placeholder="不小于" v-model="input4" class="insetIput">
                    <i slot="prefix" class="inset">落脚点次数</i>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="line40">次</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="区域：" label-width="60px">
            <!-- <el-radio-group v-model="input5" @change="changeTab"> -->
            <el-radio-group v-model="input5" @change="changeTab">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12" >
                  <div @click="clickTab"><el-radio label="2">地图选择</el-radio></div>

                </el-col>
              </el-row>

            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="input5=='1'">
            <el-select v-model="value1" multiple class="full" placeholder="请选择">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="submitForm('ruleForm')" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="insetLeft" @click="hideLeft"></div>
      </div>
    </div>
    <div :class="['right',{hide:!hideleft}]" id="mapBox"></div>
    <div class="reselt" v-if="reselt">
      <div class="plane insetPadding">
        <h3 class="title">分析结果</h3>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" :show-overflow-tooltip="true" label="序号"></el-table-column>
          <el-table-column width="80px" prop="address" :show-overflow-tooltip="true" label="地址"></el-table-column>
          <el-table-column prop="name" width="80px" sortable label="次数"></el-table-column>
        </el-table>
        <div class="insetLeft2" @click="hideResult"></div>
      </div>
    </div>

    <!-- 地图选择 -->
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <div>
        <mapselect></mapselect>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button class="select_btn" type="primary" @click="dialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapXupuxian } from "@/config/config.js";
  import { JfoGETSurveillanceObject } from "@/views/index/api/api.judge.js";
  import mapselect from "@/views/index/components/common/mapSelect";
  export default {
    components: {
      mapselect
    },
    data() {
      return {
        dialogVisible: false,
        amap: null,
        data1: null,
        input3: null,
        input4: null,
        input5: "1",
        input1: null,
        value1: null,
        select: "",
        reselt: false,
        hideleft: false,
        ruleForm: {},
        tableData: [
          {
            date: "2016-05-02",
            name: "1",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "2",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-01",
            name: "3",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-03",
            name: "4",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ],
        options: [
          {
            value: "选项1",
            label: "黄金糕"
          },
          {
            value: "选项2",
            label: "双皮奶"
          },
          {
            value: "选项3",
            label: "蚵仔煎"
          },
          {
            value: "选项4",
            label: "龙须面"
          },
          {
            value: "选项5",
            label: "北京烤鸭"
          }
        ],
        evData: []
      };
    },

    mounted() {
      //this.getControlMap(1);
      let map = new window.AMap.Map("mapBox", {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;

      for (let i = 0; i < 100; i++) {
        this.tableData.push({
          date: "2016-05-03",
          name: "4",
          address: "上海市普陀区金沙江路 1516 弄"
        })
      }
    },
    methods: {
      hideResult() {
        this.reselt = false;
        this.hideLeft();
      },
      hideLeft() {
        this.hideleft = !this.hideleft;
        if (!this.hideleft && this.evData.length > 0) {
          this.reselt = true;
        }
      },
      clickTab(){
        if(!this.dialogVisible){
          this.dialogVisible=true
        }


      },
      changeTab(v) {
        //console.log(v);
        if (v == "2") {
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      },
      submitForm(v) {
        this.reselt = true;
        this.JfoGETSurveillanceObject({
          dateStart: "2019-6-10",
          dateEnd: "2019-6-25",
          type: 1
        });
      },
      JfoGETSurveillanceObject(d) {
        JfoGETSurveillanceObject(d).then(res => {
          if (res) {
            if (!res.data || res.data.list.length === 0) {
              this.$message.info("抱歉，没有找到匹配结果");
              this.amap.clearMap();
              //this.searching = false;
              return false;
            }
            this.evData = res.data.list.map(x => {
              x.checked = false;
              return x;
            });
            this.amap.clearMap();
            this.drawMarkers(this.evData);
            //this.showEventList();
          }
          this.searching = false;
        });
      },
      drawMarkers(data) {
        //console.log(data);

        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          let _idWin = "vlJfoImg" + i;
          if (obj.addLongitude > 0 && obj.addLatitude > 0) {
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_p"><p>${
                obj.deviceName
                }</p><p class="big">${obj.snapNum}次</p></div>`;
            // 窗体
            new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-90, -124), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent
            });
            // 摄像头
            let _id = "vlJfoSxt" + i;
            let _content =
                "<div id=" +
                _id +
                ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
            new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _content
            });
            setTimeout(() => {
              this.addListen($("#" + _id), "mouseover", i);
              this.addListen($("#" + _id), "mouseout", i, obj);
              this.addListen($("#" + _id), "click", i, obj);
            }, 300);
          }
        }
        this.amap.setFitView();
      },
      addListen(el, evType, key, obj = {}) {
        let self = this;
        let _key;
        el.bind(evType, function() {
          switch (evType) {
            case "mouseover":
              $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
              $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
              break;
            case "mouseout":
              if (!obj.checked) {
                $("#vlJfoImg" + key).removeClass("vl_jig_mk_img_hover");
                $("#vlJfoSxt" + key).removeClass("vl_icon_judge_02");
              }
              break;
            case "click":
              _key = self.curVideo.indexNum;
              self.evData.forEach(z => {
                z.checked = false;
              });
              obj.checked = true;
              if (_key !== null) {
                $("#vlJfoImg" + _key).removeClass("vl_jig_mk_img_hover");
                $("#vlJfoSxt" + _key).removeClass("vl_icon_judge_02");
              }
              $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
              $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
              self.showVideo(obj);
              break;
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .point {
    width: 100%;
    height: 100%;
  }
  .breadcrumb_heaer {
    background: #ffffff;

  }
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
  }
  .right.hide {
    width: calc(100% - 272px);
    height: calc(100% - 54px);
    float: right;
  }
  .right {
    width: 100%;
    height: calc(100% - 54px);
    float: right;
  }
  .reselt {
    width: 272px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    position: absolute;
    left: 275px;
    z-index: 2;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    .title {
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 12px;
    }
  }
  .left.hide {
    margin-left: -272px;
    transition: marginLeft 0.3s ease-in;
    position: relative;
    z-index: 2;
    // animation: fadeOutLeft 0.4s ease-out 0.3s both;
  }
  .left {
    position: relative;
    width: 272px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      padding: 10px;
      position: relative;
      height: 100%;
    }
    .line40 {
      line-height: 40px;
    }
    .inset {
      display: inline-block;
      line-height: 40px;
      font-style: normal;
    }
    .firstItem {
      margin-bottom: 5px;
    }
  }
  .insetLeft {
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../assets/img/icons.png);
    background-position: -380px -1269px;
    cursor: pointer;
  }
  .hide {
    .insetLeft {
      transform: rotate(180deg);
      background-position: -504px -1269px;
    }
  }
  .insetLeft2 {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../assets/img/icons.png);
    background-position: -318px -1269px;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
</style>
<style lang="scss">
  .vl_jig_mk_p {
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .big {
      font-size: 16px;
      font-weight: bold;
    }
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #fff;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    &.vl_jig_mk_img_hover {
      &:after {
        border-bottom-color: rgba(0, 0, 0, 1);
        content: "";
        display: inline-block;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -10px;
        border-top: 10px solid #0c70f8;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
      background: rgba(12, 112, 248, 1);
      position: relative;
      border: 0.04rem solid #0c70f8;
      > p {
        color: #ffffff;
      }
    }
  }
  .ljd{
    .el-dialog__wrapper .el-dialog__body{
      padding: 0px;
    }
    .el-dialog__header{
      padding: 0px 20px 3px;
    }
    .el-dialog__headerbtn{
      z-index: 1;
    }
  }

</style>