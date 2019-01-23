<template>
  <div class="control_create">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'control_manage' }">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="create_box">
      <div class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">b19344985</span></div>
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one">
            <el-form-item label="布控名称:" prop="controlName" style="width: 25%;">
              <el-input v-model="createForm.controlName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="event" style="width: 25%;">
              <el-input v-model="createForm.event"></el-input>
            </el-form-item>
            <el-form-item label="布控类型:" prop="controlType" style="width: 25%;">
              <el-select value-key="uid" v-model="createForm.controlType" filterable placeholder="请选择">
                <el-option
                  v-for="item in controlTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布控日期:" prop="controlDate" style="width: 25%;">
              <el-date-picker
                style="width: 192px;"
                v-model="createForm.controlDate"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <div v-for="(item, index) in createForm.periodTime" :key="index" style="width: 25%;" :class="['period_time', {'top': index === 4}]">
              <el-form-item :label="index === 0 ? '布控时间段（可分时段布控,最多可设置5个时间段）' : ''" :prop="'periodTime.' + index + '.startTime'" :rules="{ required: true, message: '起始时间不能为空', trigger: 'blur'}" >
                <el-time-select
                  placeholder="起始时间"
                  v-model="item.startTime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }">
                </el-time-select>
              </el-form-item>
              <span class="vl_f_666">-</span>
              <el-form-item :prop="'periodTime.' + index + '.endTime'" :rules="{ required: true, message: '结束时间不能为空', trigger: 'blur'}" >
                <el-time-select
                  placeholder="结束时间"
                  v-model="item.endTime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                    minTime: item.startTime
                  }">
                </el-time-select>
              </el-form-item>
            </div>
            <el-form-item class="period_time_btn_box" :class="{'top': (createForm.periodTime.length === 4 || createForm.periodTime.length === 5)}">
              <div class="period_time_btn" @click="addPeriodTime()"><i class="vl_icon vl_icon_control_22"></i><span>添加布控时间段</span></div>
              <div class="period_time_btn" @click="removePeriodTime()"><i class="vl_icon vl_icon_control_28"></i><span>删除布控时间段</span></div>
            </el-form-item>
          </el-form-item>
       
          <el-form-item label="告警级别（在地图上显示颜色 ）:" prop="controlRank" style="width: 25%;">
            <el-select value-key="uid" v-model="createForm.controlRank" filterable placeholder="请选择">
              <el-option
                v-for="item in controlRankList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="create_model">
            <span class="vl_f_666">分析模型：</span>
            <div class="create_model_box">
              <div class="model_checkbox">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="人员追踪" @click.native="modelType = '1'" :class="{'is_checked': modelType === '1'}"></el-checkbox>
                  <el-checkbox label="车辆追踪" @click.native="modelType = '2'" :class="{'is_checked': modelType === '2'}"></el-checkbox>
                  <el-checkbox label="越界分析" @click.native="modelType = '3'" :class="{'is_checked': modelType === '3'}"></el-checkbox>
                  <el-checkbox label="范围分析" @click.native="modelType = '4'" :class="{'is_checked': modelType === '4'}"></el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- 人员追踪 -->
              <el-collapse-transition>
                <keep-alive>
                  <div is="model" v-if="modelType === '1'" mapId="mapOne" :modelType="modelType"></div>
                </keep-alive>
              </el-collapse-transition>
              <!-- 车辆追踪 -->
              <el-collapse-transition>
                <keep-alive>
                  <div is="model" v-if="modelType === '2'" mapId="mapTwo" :modelType="modelType"></div>
                </keep-alive>
              </el-collapse-transition>
              <!-- 越界分析 -->
              <el-collapse-transition>
                <keep-alive>
                  <div is="model" v-if="modelType === '3'" mapId="mapThree" :modelType="modelType"></div>
                </keep-alive>
              </el-collapse-transition>
              <!-- 范围分析 -->
              <el-collapse-transition>
                <keep-alive>
                  <div is="model" v-if="modelType === '4'" mapId="mapFour" :modelType="modelType"></div>
                </keep-alive>
              </el-collapse-transition>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import model from './model.vue';
export default {
  components: {model},
  data () {
    return {
      // 表单参数
      labelPosition: 'top',
      controlTypeList: [],//布控类型
      controlRankList: [],//告警类型
      createForm: {
        controlName: null,
        event: null,
        controlType: null,
        controlDate: null,
        controlRank: null,
        periodTime: [
          {
            startTime: null,
            endTime: null
          }
        ],
      },
      // 分析模型数据
      checkList: ['人员追踪'],
      modelType: '1',//模型类型序号
    }
  },
  mounted () {
  },
  methods: {
    // 新增时间段
    addPeriodTime() {
      if (this.createForm.periodTime.length === 5) {
        this.$message.error('布控时间段不能超过5个');
        return false;
      }
      this.createForm.periodTime.push({
        startTime: null,
        endTime: null
      });
    },
    // 删除时间段
    removePeriodTime() {
      if (this.createForm.periodTime.length === 1) {
        this.$message.error('至少要有一个布控时间段');
        return false;
      }
      this.createForm.periodTime.splice(this.createForm.periodTime.length - 1, 1);
    }
  }
}
</script>
<style lang="scss" scoped>
.control_create{
  width: 100%;
  height: 100%;
  .create_box{
    min-height: 875px;
    margin: 0 20px 20px 20px;
    padding: 0 20px 20px;
    background: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .create_num{
      line-height: 40px;
    }
  }
  .create_model{
    .create_model_box{
      margin-top: 10px;
      border-radius:4px 4px 0px 0px;
      border:1px solid rgba(211,211,211,1);
      .model_checkbox{
        width: 100%;
        height: 44px;
        line-height: 44px;
        padding-left: 15px;
        background:rgba(250,250,250,1);
        border-radius:5px 5px 0px 0px;
        border:1px solid rgba(242,242,242,1);
      }
    }
  }
}
</style>
<style lang="scss">
.control_create{
  .create_form {
    .create_form_one{
      .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          padding-right: 40px;
          .el-input__inner, .el-select{
            width: 100%!important;
          }
          .el-form-item__label{
            padding-bottom: 0!important;
          }
        }
        .period_time{
          display: flex;
          margin-top: 40px;
          padding-right: 40px;
          > span{
            margin: 0 9px;
          }
          > .el-form-item{
            padding-right: 0!important;
            & > .el-form-item__label:nth-child(1){
              width: 330px;
              position: absolute;
              left: 0;
              top: 80px;
            }
          }
          .el-form-item__content{
            .el-date-editor{
              width: 100%!important;
            }
          }
        }
        .period_time.top{
          margin-top: 20px!important;
        }
      }
      .period_time_btn_box{ 
        margin-bottom: 0!important;
        padding-right: 38px!important;
        padding-top: 40px;
        &.top{
          padding-top: 20px;
        }
        .el-form-item__content{
          display: flex;
          .period_time_btn{
            width: 164px;
            height:40px;
            line-height:40px;
            text-align: center;
            border-radius:4px;
            border:1px dashed rgba(217,217,217,1);
            cursor: pointer;
            &:nth-child(1){
              color: #0C70F8;
              margin-right: 25px;
            }
            &:nth-child(2){
              color: #F94539;
            }
            .vl_icon_control_22{
              vertical-align: middle;
              margin-bottom: 5px;
              margin-right: 5px;
            }
            .vl_icon_control_28{
              vertical-align: middle;
              margin-bottom: 7px;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .el-form-item{
      padding-right: 53px;
      .el-input__inner, .el-select{
        width: 100%!important;
      }
      .el-form-item__label{
        padding-bottom: 0!important;
      }
    }
    .model_checkbox label.is_checked{
      border-bottom: 2px solid #0C70F8;
      .el-checkbox__label{
        color: #409EFF;
      }
    }
  }
}
</style>
