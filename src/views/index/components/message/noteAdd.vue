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
              <div class="rec_list" v-for="item in contactListSel" :key="item.id">
                <span>{{item.userName}}&lt;{{item.userMobile}}&gt;</span>
                <i class="el-icon-close" @click="delContact(item.uid)"></i>
              </div>
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
        <el-button type="primary" @click="sendMsg('addForm')">发送</el-button>
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
        <el-input v-model="keywords" filterable placeholder="请输入姓名或手机号" size="small" @keyup.prevent.enter.native="getOrganUser"></el-input>
        <div class="rec_box">
          <div class="rec_l">
            <p class="vl_f_999 vl_f_12">组织机构</p>
            <el-tree
              icon-class="el-icon-arrow-right"
              :data="organInfoList"
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
              <li v-for="item in contactList" :key="item.uid">
                <span>{{item.userName}}</span>
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </li>
            </ul>
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
import {formatDate} from '@/utils/util.js';
import {getOrganInfos, getOrganUser, getSmsTemplate, sendMsg} from '@/views/index/api/api.js';
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
      contactListSel: null,//已选择的联系人列表
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
      isChecked: false,
      contactList: null,//右边接收人列表数据
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
    operationChecked (nede, isChecked) {
      console.log(nede, 'nede')
      console.log(isChecked, 'isChecked')
      if (isChecked) {
        this.getOrganUser(nede);
      }
    },
    // 切换短信模板
    changeTemplate () {
      this.addForm.content = this.addForm.template.tempContent;
      this.addForm.content = this.addForm.content.replace(/code/g, `"{\\"code\\":\\"${this.addForm.name}\\"}"`)
      console.log(this.addForm.content)
    },
    // 二维数组转树结构方法
    translateDataToTree(data) {
      //没有父节点的数据
      let parents = data.filter(value => value.parentId == 'undefined' || value.parentId == null)
      //有父节点的数据
      let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null)
      //定义转换方法的具体实现
      let translator = (parents, children) => {
        //遍历父节点数据
        parents.forEach((parent) => {
          //遍历子节点数据
          children.forEach((current, index) => {
            //此时找到父节点对应的一个子节点
            if (current.parentId === parent.id) {
              //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
              let temp = JSON.parse(JSON.stringify(children))
              //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
              temp.splice(index, 1)
              //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
              translator([current], temp)
              //把找到子节点放入父节点的childrens属性中
              typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
            }
          }
          )
        }
        )
      }
      //调用转换方法
      translator(parents, children)
      //返回最终的结果
      return parents
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
          this.organInfoList = this.translateDataToTree(this.organInfoList);
        }
      })
    },
    // 根据组织机构查人员
    getOrganUser (data) {
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
            this.$set(f, 'isChecked', false)
          })
        }
      })
    },
    // 获取勾选的接收人列表
    getRecipient () {
      console.log(this.contactList)
      this.recDialog = false;
      this.contactListSel = this.contactList.filter(f => f.isChecked);
    },
    // 删除已选联系人
    delContact (uid) {
      this.contactList.forEach(f => {
        if (f.uid === uid) {
          f.isChecked = false;
        }
      });
      this.contactListSel = this.contactListSel.filter(f => f.uid !== uid);
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
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     console.log('通过验证')
          const data = {
            tempId: this.addForm.template.value,
            tempValue: this.addForm.content,
            receiverIdList: this.contactListSel.map(m => m.uid).join(',')
          }
          sendMsg(data).then(res => {
            if (res && res.data) {

            }
          })
        // } else {
        //   return false;
        // }
      // });
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
  .recipient{
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
      top: 0;
    }
  }
} 
</style>
