<template>
  <div class="mes_note_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">短信通知</el-breadcrumb-item>
        <el-breadcrumb-item>新增短信</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="联系人:" prop="recipient">
            <div class="recipient clearfix">
              <div class="rec_list" v-for="item in '123456'" :key="item.id">
                <span>王益&lt;13324922333&gt;</span>
                <i class="el-icon-close"></i>
              </div>
              <i class="vl_icon vl_icon_message_3 " @click="recDialog = true"></i>
            </div>
          </el-form-item>
          <el-form-item label="短信模板:" prop="template" class="template">
            <el-select value-key="uid" v-model="addForm.template" filterable placeholder="请选择短信模板" @change="changeTemplate()">
              <el-option
                v-for="item in templateList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名字:" prop="name" style="width: 754px;">
            <el-input v-model="addForm.name" filterable placeholder="请输入名字" @blur="changeTemplate"></el-input>
          </el-form-item>
          <el-form-item label="时间:" prop="time" class="template">
            <el-date-picker
              @blur="changeTemplate"
              v-model="addForm.time"
              type="datetime"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地点:" prop="adress" style="width: 754px;">
            <el-input v-model="addForm.adress" filterable placeholder="请输入地点" @blur="changeTemplate"></el-input>
          </el-form-item>
          <el-form-item label="短信内容:" style="width: 754px;" class="content">
            <div class="con_box">
              <el-input
                :disabled="true"
                resize="none"
                type="textarea"
                :rows="1"
                placeholder="此处是已经编辑好的短信内容"
                v-model="addForm.content">
              </el-input>
              <ul class="con_list">
                <li>主题：评审会</li>
                <li>时间：2018-07-16 08:46</li>
                <li>地点：大会议室</li>
              </ul>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_footer">
        <el-button type="primary" @click="release('addForm')">发送</el-button>
        <el-button @click.native="skip(1)">返回</el-button>
      </div>
    </div>
    <div class="rec_dialog">
      <el-dialog
        :visible.sync="recDialog"
        :close-on-click-modal="false"
        width="482px"
        top="20vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 10px;">选择接收人（已选2人/共1000人）</h1>
        <el-input v-model="keywords" filterable placeholder="请输入姓名或手机号" size="small"></el-input>
        <div class="rec_box">
          <div class="rec_l">
            <p class="vl_f_999 vl_f_12">组织机构</p>
            <el-tree
              icon-class="el-icon-arrow-right"
              :data="instList"
              @node-click="getRightData"
              @check-change="operationChecked"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[]"
              :default-checked-keys="[]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="rec_r">
            <p class="vl_f_999 vl_f_12">联系人</p>
            <ul>
              <li v-for="item in '1234567123456'" :key="item.id">
                <span>冯晓龙</span>
                <el-checkbox v-model="isChecked"></el-checkbox>
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer">
          <el-button @click="recDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
      addForm: {
        recipient: null,
        template: null,
        name: null,
        time: null,
        adress: null,
        content: null
      },
      templateList: [{label: '事件调度', value: '0'},{label: '普通通知', value: '1'}],
      addRules: {
        recipient: [
          {required: true, message: '请选择联系人', trigger: 'blur'}
        ],
        template: [
          {required: true, message: '请选择短信模板', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '请输入时间', trigger: 'blur'}
        ],
        adress: [
          {required: true, message: '请输入地点', trigger: 'blur'}
        ]
      },
      // 弹窗参数
      recDialog: false,
      loadingBtn: false,
      keywords: null,
      // 左边机构 数结构数据
      instList: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isChecked: false,
      rgihtData: null,//右边接收人列表数据
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    getRightData (data) {
      console.log(data, 'data')
      this.rgihtData = data;
    },
    operationChecked (nede, isChecked) {
      console.log(nede, 'nede')
      console.log(isChecked, 'isChecked')
    },
    // 切换短信模板
    changeTemplate () {
      if (this.addForm.template === '0') {
        this.addForm.content = `${this.addForm.name ? this.addForm.name : '#name#'}，请于${this.addForm.time ? formatDate(this.addForm.time, 'yyyy-MM-dd HH:mm:ss') : '#time#'}，到达${this.addForm.adress ? this.addForm.adress : 'adress'}`;
      } else if (this.addForm.template === '1') {
        this.addForm.content = `${this.addForm.name ? this.addForm.name : '#name#'}，xxxx${this.addForm.time ? formatDate(this.addForm.time, 'yyyy-MM-dd HH:mm:ss') : '#time#'}，xxxx${this.addForm.adress ? this.addForm.adress : 'adress'}`;
      }
    },
    // 确定发送
    release (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.mes_note_add{
  width: 100%;
  position: relative;
  .note_add_box{
    margin: 0 20px 20px 20px;
    padding: 20px 40px;
    min-height:680px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
  }
  .rec_dialog{
    .rec_box{
      width: 100%;
      border-top: 1px solid #F2F2F2;
      display: flex;
      margin-top: 10px;
      .rec_l{
        width: 50%;
        p{
          padding-left: 22px;
          line-height: 30px;
        }
      }
      .rec_r{
        width: 50%;
        border-left: 1px solid #F2F2F2;
        p{
          padding-left: 20px;
          line-height: 30px;
        }
        li{
          width: 100%;
          height: 26px;
          line-height: 26px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          &:hover{
            background: #E0F2FF;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.mes_note_add{
  .template .el-input__inner{
    width: 672px;
  }
  .recipient{
    width: 672px;
    padding: 4px 4px 0;
    border: 1px solid #dcdfe6;
    border-radius:4px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    > i{
      position: absolute;
      right: 10px;
      top: 12px;
      cursor: pointer;
    }
    .rec_list{
      width: 31%;
      height:32px;
      line-height: 30px;
      margin-right: 4px;
      margin-bottom: 4px;
      text-align: center;
      background:rgba(243,243,243,1);
      border-radius:2px;
      border:1px solid rgba(217,217,217,1);
      > i{
        cursor: pointer;
        color: #B2B2B2;
      }
    }
  }
  .content{
    .el-textarea__inner{
      border: none;
    }
    .con_box{
      background:rgba(242,242,242,1);
      border-radius:4px;
      border:1px solid rgba(211,211,211,1);
      .con_list{
        width: 226px;
        margin-left: 20px;
        padding: 10px 0;
        li{
          height: 30px; 
          color: #B2B2B2;
        }
      }
      .el-textarea__inner{
        background:rgba(242,242,242,1);
      }
    }
  }
  // 重置UI树组件样式
  .rec_dialog .el-tree-node__content{
    position: relative;
    .el-checkbox{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
} 
</style>
