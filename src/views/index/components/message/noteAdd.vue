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
          <el-form-item label="联系人:" prop="contactListSel">
            <div class="contact_list_sel clearfix" :style="{'border-color': isShowRed ? 'red' : ''}" style="line-height: 34px;">
              <div class="rec_list" v-for="item in addForm.contactListSel" :key="item.id">
                <span>{{item.userName}}&lt;{{item.userMobile}}&gt;</span>
                <i class="el-icon-close" @click="delContact(item.uid)"></i>
              </div>
              <span v-if="addForm.contactListSel.length === 0" style="margin-left: 10px;color: #C0C4CC;">请选择联系人</span>
              <i class="vl_icon vl_icon_message_3 " @click="recDialog = true"></i>
            </div>
          </el-form-item>
          <el-form-item label="短信模板:" prop="template" class="template">
            <el-select value-key="value" v-model="addForm.template" filterable placeholder="请选择短信模板" @change="changeTemplate()">
              <el-option
                v-for="item in templateList"
                :key="item.value"
                :label="item.label"
                :value="item">
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
                :rows="3"
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
        <el-button type="primary" :loading="loadingBtn" @click="sendMsg('addForm')">发送</el-button>
        <el-button @click.native="skip(1)">返回</el-button>
      </div>
    </div>
    <div class="rec_dialog">
      <el-dialog
        :visible.sync="recDialog"
        :close-on-click-modal="false"
        width="482px"
        top="20vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 10px;">选择接收人（已选{{selContactNum}}人/共{{contactListTotal ? contactListTotal.length : 0}}人）</h1>
        <el-input v-model="keywords" filterable placeholder="请输入姓名或手机号" size="small" @keyup.prevent.enter.native="getOrganUser(null)"></el-input>
        <div class="rec_box">
          <div class="rec_l">
            <p class="vl_f_999 vl_f_12">组织机构</p>
            <el-tree
              icon-class="el-icon-arrow-right"
              :data="organInfoList"
              @check="operationChecked"
              @check-change="isNodeChecked"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[]"
              :default-checked-keys="[]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="rec_r">
            <p class="vl_f_999 vl_f_12">联系人</p>
            <vue-scroll>
              <ul style="max-height: 362px;">
                <li v-for="item in contactListTotal" :key="item.uid">
                  <span>{{item.userName}}</span>
                  <el-checkbox v-model="item.isChecked"></el-checkbox>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </div>
        <div slot="footer">
          <el-button @click="recDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary" @click="getRecipient">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {formatDate,translateDataToTree, objDeepCopy, unique} from '@/utils/util.js';
import {getOrganInfos, getOrganUser, getSmsTemplate, sendMsg} from '@/views/index/api/api.message.js';
export default {
  data () {
    return {
      addForm: {
        contactListSel: [],
        template: null,
        name: null,
        time: null,
        adress: null,
        content: null
      },
      templateList: [{label: '事件调度', value: '0'},{label: '普通通知', value: '1'}],
      addRules: {
        contactListSel: [
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
      isShowRed: false,//是否显示红边框
      // contactListSel: [],//已选择的联系人列表
      // 弹窗参数
      recDialog: false,
      loadingBtn: false,
      keywords: null,
      // 左边机构 数结构数据
      organInfoList: [],
      organId: null,//当前筛选的机构id
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      
      isChecked: null,
      contactList: [],//右边接收人列表数据,单独节点
      contactListTotal: [],//节点总数据
      loadingBtn: false
    }
  },
  computed: {
    // 获取已选择的人数
    selContactNum () {
      return this.contactListTotal.filter(f => f.isChecked).length;
    }
  },
  mounted () {
    this.getOrganInfos();
    this.getSmsTemplate();
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 获得操作完后显示在右边收件人列表的数据
    operationChecked (nede) {
      // 勾选时获取数据
      if (this.isChecked) {
        this.getOrganUser(nede).then(res => {
          console.log(res)
          this.contactListTotal.push(...this.contactList);
          this.contactListTotal = unique(this.contactListTotal);//去重
        }) 
      } else {
        this.getOrganUser(nede).then(res => {
          console.log(res)
          // 取消勾选时，删掉已获得的数据
          const data = objDeepCopy(this.contactListTotal);//深度拷贝
          data.forEach(f => {
            this.contactList.forEach(c => {
              this.contactListTotal = this.contactListTotal.filter(() => f.uid !== c.uid);
            })
          })
        })
      }
    },
    // 获得当前节点是否被选中
    isNodeChecked (nede, isChecked) {
      this.isChecked = isChecked;
    },
    // 切换短信模板
    changeTemplate () {
      this.addForm.content = this.addForm.template && this.addForm.template.tempContent;
      this.addForm.content = this.addForm.content && this.addForm.content.replace(/code/g, `"{\\"code\\":\\"${this.addForm.name}\\"}"`)
      console.log(this.addForm.content)
    },  
    // 获取组织机构
    getOrganInfos () {
      const params = {
        pageNum: 1,
        pageSize: 10,
        orderBy: null,
        order: null,
        'where.organName': null,
        'where.proKey': 'd32b803de585906c0ee2f1ac81588a70',
        'where.organLayer': null,
        'where.organPid': null
      }
      getOrganInfos(params).then(res => {
        if (res && res.data) {
          this.organInfoList = res.data.list;
          this.organInfoList = this.organInfoList.map(m => {
            return {
              id: m.uid,
              label: m.organName,
              parentId: m.organPid
            }
          })
          this.organInfoList = translateDataToTree(this.organInfoList);//转成tree
        }
      })
    },
    // 根据组织机构查人员
    getOrganUser (data) {
      return new Promise(resolve => {
        this.contactList = [];
        if (data) {
          this.organId = data.id;
        }
        const params = {
          'where.uid': this.organId,
          'where.proKey': 'd32b803de585906c0ee2f1ac81588a70',
          'where.userName': this.keywords
        }
        getOrganUser(params).then(res => {
          if (res && res.data) {
            this.contactList = res.data.list;
            this.contactList.forEach(f => {
              this.$set(f, 'isChecked', false);
            })
            console.log(data)
            if (data === null) {
              this.contactListTotal = this.contactList;
              console.log(this.contactListTotal, 'this.contactListTotal');
            }
            resolve(1);
          }
        })
      })
    },
    // 获取勾选的接收人列表
    getRecipient () {
      console.log(this.contactListTotal)
      this.recDialog = false;
      this.addForm.contactListSel = this.contactListTotal.filter(f => f.isChecked);
      if (this.$refs['addForm']) {
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate(['contactListSel']);
        })
      }
      this.isShowRed = false;
    },
    // 删除已选联系人
    delContact (uid) {
      this.contactList.forEach(f => {
        if (f.uid === uid) {
          f.isChecked = false;
        }
      });
      this.addForm.contactListSel = this.addForm.contactListSel.filter(f => f.uid !== uid);
      if (this.addForm.contactListSel.length === 0) {
        this.isShowRed = true;
        this.$refs['addForm'].validateField(['contactListSel']);
      }
    },
    // 获取短信模板
    getSmsTemplate () {
      const params = {
        'where.tempType': 1
      }
      getSmsTemplate(params).then(res => {
        if (res && res.data) {
          this.templateList = res.data.map(m => {
            return {
              label: m.title,
              value: m.tempId,
              tempContent: m.tempContent
            }
          });

        }
      })
    },
    // 确定发送
    sendMsg (formName) {
      if (this.addForm.contactListSel.length === 0) this.isShowRed = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
          const data = {
            tempId: this.addForm.template.value,
            tempValue: this.addForm.content,
            receiverIdList: this.addForm.contactListSel.map(m => m.uid).join(',')
          }
          this.loadingBtn = true;
          sendMsg(data).then(res => {
            if (res && res.data) {
              this.$message.success('发布成功');
              this.$emit('getSmsList');
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
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
      min-height: 400px;
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
  .contact_list_sel{
    width: 672px;
    min-height: 40px;
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
      height:32px;
      line-height: 30px;
      margin-right: 4px;
      margin-bottom: 4px;
      padding: 0 2px;
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
      top: 3px;
    }
  }
} 
</style>
