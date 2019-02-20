<template>
  <div class="control_library">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <div class="search_tab">
        <div class="tab_lt">
          <ul>
            <li :class="{'tab_lt_ul_sed': tabType === '1'}" @click="changeTab('1')">人像库</li>
            <li :class="{'tab_lt_ul_sed': tabType === '2'}" @click="changeTab('2')">车像库</li>
          </ul>
          <div :style="{'left': tabType === '1' ? 0 : '50%'}"></div>
        </div>
      </div>
      <div class="group_input">
        <el-input v-model="group" size="small" placeholder="搜索组">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <vue-scroll>
        <div class="add_group">
          <div @click="popAddGroupDialog(1)" :class="['group_title', {'active': groupIndex === -1 }]">
            <i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span>
          </div>
          <div class="group_list">
            <div v-for="(item, index) in groupList" :key="item.id"  :class="{'active': groupIndex === index }">
              <div @click="groupIndex = index"><span class="vl_f_333">{{item.groupName}}</span><span class="vl_f_666" style="margin-left: 5px;">({{item.memberNum}})</span></div>
              <i @click="groupId = item.id;pageType = '2'" :class="['vl_icon', groupId === item.id ? 'vl_icon_control_16' : 'vl_icon_control_21']"></i>
            </div>
          </div>
        </div>
      </vue-scroll>
      <el-form :model="libForm" class="lib_form" v-if="tabType === '1'">
        <el-form-item>
          <el-date-picker
            style="width: 192px;"
            v-model="libForm.perTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="libForm.sex" placeholder="选择性别">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="libForm.national" placeholder="选择民族">
            <el-option
              v-for="item in nationalList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-input v-model="libForm.card" placeholder="证件号码"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button style="width: 90px;" type="primary" plain>重置</el-button>
          <el-button style="width: 90px;" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="libForm" class="lib_form" v-else>
        <el-form-item>
          <el-date-picker
            style="width: 192px;"
            v-model="libForm.carTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="libForm.carColor" placeholder="选择车身颜色">
            <el-option
              v-for="item in carColorList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="libForm.carType" placeholder="选择车辆类型">
            <el-option
              v-for="item in carTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="libForm.numType" placeholder="选择号牌类型">
            <el-option
              v-for="item in numTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-input v-model="libForm.carNum" placeholder="车辆号码"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button style="width: 90px;" type="primary" plain>重置</el-button>
          <el-button style="width: 90px;" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="library_content">
      <div class="snap_list" v-if="pageType === '1'">
        <div class="snap_title">
          <div><span class="vl_f_333">布控库</span><span class="vl_f_666">(123)</span></div>
          <el-button v-if="tabType === '1'" type="primary" @click.native="clearForm('portraitForm')">新建人像</el-button>
          <el-button v-else type="primary" @click.native="clearForm('carForm')">新建车像</el-button>
        </div>
        <div class="list_box">
          <template v-if="tabType === '1'">
            <div class="list_info" v-for="item in '123456'" :key="item.id">
              <div class="list_img"><img src="//via.placeholder.com/200x200" alt="" style="width: 100%;"></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <i class="vl_icon vl_icon_control_20"></i>
                </div>
                <div class="data_list">
                  <span>里默默</span>
                  <span>女</span>
                  <span>汉族</span>
                </div>
                <div class="data_list">
                  <span>43068419970215013X <i class="vl_icon vl_icon_control_29"></i></span>
                </div>
                <div class="data_list">
                  <span>失踪儿童</span>
                  <span>分组2</span>
                  <!-- <div class="more">
                    <span>更多组</span>
                    <div>
                      <span>失踪儿童</span>
                      <span>拐卖儿童</span>
                    </div>
                    <i></i>
                  </div> -->
                </div>
                <div class="data_list">
                  <span>环保路十字路口一小孩从电动车上掉下，被宝马车方救起送往天心区公安局。</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="list_info" v-for="item in '123456'" :key="item.id">
              <div class="list_img"><img src="//via.placeholder.com/200x200" alt="" style="width: 100%;"></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <i class="vl_icon vl_icon_control_20"></i>
                </div>
                <div class="data_list">
                  <span>湘A12345</span><span>小型汽车号牌</span>
                </div>
                <div class="data_list">
                  <span>大客车</span><span>白</span>
                </div>
                <div class="data_list">
                  <span>蓝底黑字</span>
                  <span>组1；组2</span>
                  <!-- <div class="more">
                    <span>更多组</span>
                    <div>
                      <span>失踪儿童</span>
                      <span>拐卖儿童</span>
                    </div>
                    <i></i>
                  </div> -->
                </div>
                <div class="data_list">
                  <span>环保路十字路口一小孩从电动车上掉下，被宝马车方救起送往天心区公安局。</span>
                </div>
              </div>
            </div>
          </template>
          <div style="width: 100%;">
            <el-pagination
              style="text-align: center;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="member_list" v-if="pageType === '2'">
        <div class="member_title">
          <div>
            <div><span class="vl_f_333">{{tabType === '1' ? '失踪儿童' : '全部车辆'}}</span><i class="vl_icon vl_icon_control_25" @click="popAddGroupDialog(2)"></i><i class="vl_icon vl_icon_control_24" @click="delGroupDialog = true;"></i></div>
            <div><el-checkbox v-model="allChecked" @click.native="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
          </div>
          <div>
            <el-button @click="isShowGroupCopy = !isShowGroupCopy;">复制</el-button>
            <el-button @click="removeGroupDialog = true;">移出</el-button>
            <el-collapse-transition>
              <ul class="group_copy" v-show="isShowGroupCopy">
                <li>系统默认</li>
                <li>重点青少年</li>
                <li>拐卖妇女</li>
                <li>失踪儿童</li>
              </ul>
            </el-collapse-transition>
          </div>
        </div>
        <div class="list_box">
          <template v-if="tabType === '1'">
            <div class="list_info" v-for="item in memberList" :key="item.id">
              <div class="list_img"><img src="//via.placeholder.com/200x200" alt="" style="width: 100%;"></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <el-checkbox v-model="item.isChecked" @click.native="operateRadio()"></el-checkbox>
                </div>
                <div class="data_list">
                  <span>里默默</span>
                  <span>女</span>
                  <span>汉族</span>
                </div>
                <div class="data_list">
                  <span>43068419970215013X <i class="vl_icon vl_icon_control_29"></i></span>
                </div>
                <div class="data_list">
                  <span>失踪儿童</span>
                  <span>分组2</span>
                  <div class="more">
                    <span @mouseenter="showMoreId = item.id" @mouseleave="showMoreId = null">更多组</span>
                    <template v-if="showMoreId === item.id">
                      <div>
                        <span>失踪儿童</span>
                        <span>拐卖儿童</span>
                        <span>拐卖儿童</span>
                      </div>
                      <i></i>
                    </template>
                  </div>
                </div>
                <div class="data_list">
                  <span>环保路十字路口一小孩从电动车上掉下，被宝马车方救起送往天心区公安局。</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="list_info" v-for="item in memberList" :key="item.id">
              <div class="list_img"><img src="//via.placeholder.com/200x200" alt="" style="width: 100%;"></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <el-checkbox v-model="item.isChecked" @click.native="operateRadio()"></el-checkbox>
                </div>
                <div class="data_list">
                  <span>湘A12345</span><span>小型汽车号牌</span>
                </div>
                <div class="data_list">
                  <span>大客车</span><span>白</span>
                </div>
                <div class="data_list">
                  <span>蓝底黑字</span>
                  <span>组2</span>
                  <div class="more">
                    <span @mouseenter="showMoreId = item.id" @mouseleave="showMoreId = null">更多组</span>
                    <template v-if="showMoreId === item.id">
                      <div>
                        <span>失踪儿童</span>
                        <span>拐卖儿童</span>
                      </div>
                      <i></i>
                    </template>
                  </div>
                </div>
                <div class="data_list">
                  <span>环保路十字路口一小孩从电动车上掉下，被宝马车方救起送往天心区公安局。</span>
                </div>
              </div>
            </div>
          </template>
          <div style="width: 100%;">
            <el-pagination
              style="text-align: center;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="add_portrait_dialog">
      <el-dialog
        :visible.sync="addPortraitDialog"
        :close-on-click-modal="false"
        width="722px"
        top="20vh"
        :title="tabType === '1' ? '新增人像' : '新增车像'">
        <div class="add_portrait">
          <div class="portrait_update">
            <div :class="['upload_pic', {'hidden': dialogImageUrl}]">
              <el-upload
                ref="uploadPic"
                multiple
                accept="image/*"
                :limit="1"
                action="https://apidev.aorise.org/medical-his/api/network/upload/new"
                :on-exceed="uploadPicExceed"
                :data="{projectType: 2}"
                list-type="picture-card"
                :on-success="uploadPicSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-error="uploadPicError"
                :before-upload="beforeAvatarUpload">
                <i class="vl_icon vl_icon_control_14"></i>
              </el-upload>
              <div class="dialog_pic" v-show="dialogVisible" @click="dialogVisible = false">
                <img :src="dialogImageUrl" alt="" :style="{'max-height': picHeight + 'px'}">
              </div>
            </div>
            <h1 class="vl_f_999">点击修改{{tabType === '1' ? '人像' : '车像'}}</h1>
            <p>请上传清晰照片</p>
          </div>
          <div class="portrait_form">
            <!-- 人像 -->
            <el-form class="portrait_form" v-show="tabType === '1'" :model="portraitForm" :rules="portraitRules" ref="portraitForm" label-width="20px" label-position="left">
              <el-form-item label=" " style="width: 415px;" prop="name">
                <el-input v-model="portraitForm.name" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-button plain>男</el-button>
                <el-button plain>女</el-button>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-select v-model="portraitForm.national" placeholder="民族" style="width: 100%;">
                  <el-option
                    v-for="item in nationalList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=" " style="width: 415px;" prop="cardType">
                <el-select v-model="portraitForm.cardType" placeholder="证件类型" style="width: 100%;">
                  <el-option
                    v-for="item in cardTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=" " style="width: 415px;" prop="cardNum">
                <el-input v-model="portraitForm.cardNum" placeholder="证件号码"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-input v-model="portraitForm.date" placeholder="出生日期"></el-input>
              </el-form-item>
              <!-- 选择归属组 -->
              <el-form-item style="width: 415px;position: relative;">
                <div class="group_sel">
                  <span v-show="!isShowDpList && portraitForm.perOwnerGroup.length === 0" @click="isShowDpList = !isShowDpList">选择归属组</span>
                  <div class="group" v-for="item in portraitForm.perOwnerGroup" :key="item.value" @click="delSelGroup(item, 1)">
                    <span class="vl_f_999">{{item.label}}</span>
                    <i class="el-icon-close"></i>
                  </div>
                  <i class="el-icon-arrow-down" v-show="!isShowDpList" @click="isShowDpList = !isShowDpList"></i>
                  <i class="el-icon-arrow-up" v-show="isShowDpList" @click="isShowDpList = !isShowDpList"></i>
                </div>
                <el-collapse-transition>
                  <div class="group_li" v-show="isShowDpList">
                    <el-checkbox-group v-model="portraitForm.perOwnerGroup">
                      <el-checkbox v-for="item in groupDropdownList" :label="item" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-collapse-transition>
              </el-form-item>
              <el-form-item style="width: 415px;" class="desc">
                <div>
                  <el-input
                    type="textarea"
                    :rows="4"
                    resize="none"
                    placeholder="描述"
                    v-model="portraitForm.perDesc">
                  </el-input>
                  <p><span class="vl_f_999">1</span>/<span class="vl_f_999">50</span></p>
                </div>
              </el-form-item>
            </el-form>
            <!-- 车像 -->
            <el-form :model="carForm" class="portrait_form" v-show="tabType === '2'" :rules="carRules" ref="carForm" label-width="20px" label-position="left">
              <el-form-item label=" " style="width: 415px;" prop="carNum">
                <el-input v-model="carForm.carNum" placeholder="车牌号码"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-input v-model="carForm.carColor" placeholder="车身颜色"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-input v-model="carForm.cardType" placeholder="车辆类型"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-input v-model="carForm.numType" placeholder="号牌类型"></el-input>
              </el-form-item>
              <el-form-item style="width: 415px;">
                <el-input v-model="carForm.numColor" placeholder="号牌颜色"></el-input>
              </el-form-item>
              <!-- 归属组 -->
              <el-form-item style="width: 415px;">
                <div class="group_sel">
                  <span v-show="!isShowDpList && carForm.carOwnerGroup.length === 0" @click="isShowDpList = !isShowDpList">选择归属组</span>
                  <div class="group" v-for="item in carForm.carOwnerGroup" :key="item.value" @click="delSelGroup(item, 2)">
                    <span class="vl_f_999">{{item.label}}</span>
                    <i class="el-icon-close"></i>
                  </div>
                  <i class="el-icon-arrow-down" v-show="!isShowDpList" @click="isShowDpList = !isShowDpList"></i>
                  <i class="el-icon-arrow-up" v-show="isShowDpList" @click="isShowDpList = !isShowDpList"></i>
                </div>
                <el-collapse-transition>
                  <div class="group_li" v-show="isShowDpList">
                    <el-checkbox-group v-model="carForm.carOwnerGroup">
                      <el-checkbox v-for="item in groupDropdownList" :label="item" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-collapse-transition>
              </el-form-item>
              <el-form-item style="width: 415px;" class="desc">
                <div>
                  <el-input
                    type="textarea"
                    :rows="4"
                    resize="none"
                    placeholder="描述"
                    v-model="carForm.carDesc">
                  </el-input>
                  <p><span class="vl_f_999">1</span>/<span class="vl_f_999">50</span></p>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer">
          <el-button @click="addPortraitDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="add_group_dialog">
      <el-dialog
        :visible.sync="addGroupDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h4>{{addOrUpdate  === 1 ? '新增组' : '修改组'}}</h4>
        <el-input v-model="groupName" placeholder="请输入组名称，最多6字，不可重复" style="padding: 20px 20px 0;"></el-input>
        <div slot="footer">
          <el-button @click="addGroupDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">{{addOrUpdate  === 1 ? '新增' : '确认'}}</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="del_group_dialog">
      <el-dialog
        :visible.sync="delGroupDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">确定要删除该分组吗？</h1>
        <p class="vl_f_12 vl_f_999">删除后该分组人像将找不到。</p>
        <div slot="footer">
          <el-button @click="delGroupDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="remove_group_dialog">
      <el-dialog
        :visible.sync="removeGroupDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">确定要将这 <span>1</span>条人像数据移出该组？</h1>
        <p class="vl_f_12 vl_f_999">移出该组后将在系统默认中。</p>
        <div slot="footer">
          <el-button @click="removeGroupDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 侧边栏参数
      tabType: '1',
      group: null,//搜索组
      libForm: {
        // 人像库筛选参数
        perTime: null,
        sex: null,
        national: null,
        card: null,
        // 车像库筛选参数
        carTime: null,
        carColor: null,
        carType: null,
        numType: null,
        carNum: null
      },
      groupIndex: null,//分组下标
      groupList: [
        {groupName: '系统默认', memberNum: 200, id: '001'},
        {groupName: '失踪儿童', memberNum: 201, id: '002'},
        {groupName: '重点青少年', memberNum: 202, id: '003'},
        {groupName: '拐卖妇女', memberNum: 203, id: '004'},
        {groupName: '系统默认', memberNum: 204, id: '005'},
        {groupName: '系统默认', memberNum: 204, id: '006'},
        {groupName: '系统默认', memberNum: 204, id: '007'},
        {groupName: '系统默认', memberNum: 204, id: '008'},
        {groupName: '系统默认', memberNum: 205, id: '009'}
      ],//分组列表数据
      pageType: '1',//页面类型，默认为今日抓拍列表页
      groupId: null,//分组id
      sexList: [],//性别列表数据
      nationalList: [],//民族列表数据
      carColorList: [],//车身颜色列表数据
      carTypeList: [],//车辆类型列表数据
      numTypeList: [],//号码类型列表数据
      // 翻页数据
      currentPage: 1,
      pageSzie: 10,
      pageNum: 1,
      // dialog
      addPortraitDialog: false,
      // 新增人像参数
      portraitForm: {
        name: '',
        national: null,
        cardType: '',
        cardNum: '',
        date: null,
        perOwnerGroup: [],
        perDesc: null
      },
      // 新增车像参数
      carForm: {
        carNum: null,
        carColor: null,
        cadType: null,
        numType: null,
        numColor: null,
        carOwnerGroup: [],
        carDesc: null
      },
      cardTypeList: [
        {
          label: '身份证',
          value: '1'
        },
        {
          label: '护照',
          value: '2'
        }
      ],//证件类型列表数据
      addGroupDialog: false,
      delGroupDialog: false,
      removeGroupDialog: false,
      groupName: null,//新增组名
      loadingBtn: false,
      addOrUpdate: null,//新增或者修改弹窗
      isShowDpList: false,//是否显示下拉列表数据
      groupDropdownList: [
        {label: '失踪儿童', value: '1'},
        {label: '拐卖妇女', value: '2'},
        {label: '失踪儿童', value: '3'},
        {label: '失踪儿童', value: '4'},
        {label: '失踪儿童', value: '5'},
        {label: '失踪儿童', value: '6'}
      ],//归属组下拉列表数据
      portraitRules: {
        name: [{required: true, message: '不能为空', trigger: 'blur'}],
        cardType: [{required: true, message: '不能为空', trigger: 'change'}],
        cardNum: [{required: true, message: '不能为空', trigger: 'blur'}]
      },
      carRules: {
        carNum: [{required: true, message: '不能为空', trigger: 'blur'}]
      },

      // 上传人像参数
      dialogImageUrl: null,
      dialogVisible: false,
      picHeight: null,

      // 右边列表参数
      allChecked: false,
      memberList: [
        {isChecked: false, id: '00001'},
        {isChecked: false, id: '00002'},
        {isChecked: false, id: '00003'},
        {isChecked: false, id: '00004'},
        {isChecked: false, id: '00005'},
        {isChecked: false, id: '00006'},
        {isChecked: false, id: '00007'}
      ],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
    }
  },
  computed: {
    allIsChecked () {
      return this.memberList.filter(f => f.isChecked).length;
    }
  },
  mounted () {
    this.picHeight = window.screenHeight + 180;
  },
  methods: {
    changeTab (tabType) {
      this.tabType = tabType;
      this.pageType = '1';
      this.groupId = null;
      // 切换tab全部置为false
      this.memberList.map(m => {
        m.isChecked = false;
      })
      this.allChecked = false;
    },
    popAddGroupDialog (type) {
      this.addOrUpdate = type;
      this.groupIndex = -1;
      this.addGroupDialog = true;
    },
    // 单选
    operateRadio () {
      console.log(this.memberList)
      this.$nextTick(() => {
        this.allChecked = !this.memberList.some(s => s.isChecked === false);
      })
    },
    // 全选
    operateAllChecked () {
      this.$nextTick(() => {
        if (!this.allChecked) {
          console.log(1111111)
          this.memberList.map(m => {
            m.isChecked = false;
          })
          console.log(this.memberList)
        } else {
          this.memberList.map(m => {
            m.isChecked = true;
          })
        }
      })
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.fileFullPath;
      this.$message.success('上传成功！');
    },
    uploadPicError () {
      this.$message.error('上传失败！');
    },
    uploadPicExceed () {
      this.$message.warning('最多一次可上传1张图片,不能上传非图片文件');
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //删除选中的组
    delSelGroup (item, type) {
      if (type === 1) {
        this.portraitForm.perOwnerGroup = this.portraitForm.perOwnerGroup.filter(f => f !== item);
      } else {
        this.carForm.carOwnerGroup = this.carForm.carOwnerGroup.filter(f => f !== item);
      }
    },
    // 清除新建人像和车像表单验证和内容
    clearForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      this.portraitForm.perOwnerGroup = [];
      this.carForm.carOwnerGroup = [];
      this.isShowDpList = false;
      this.addPortraitDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.control_library{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .search_box{
    position: absolute;
    left: 20px;
    top: 0;
    z-index: 999;
    width: 232px;
    background: #fff;
    box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    .search_tab{
      position: relative;
      width: 100%; height: 60px;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      background-color: #fff;
      .tab_lt{
        position: absolute; top: 0; left: 0;
        width: 100%;
        border-bottom: 1px solid #F2F2F2;
        > ul {
          overflow: hidden;
          > li {
            float: left;
            width: 50%; height: 50px; line-height: 50px;
            text-align: center;
            font-size: 14px; color: #666666;
            cursor: pointer;
            transition: color .4s ease-out;
            &.tab_lt_ul_sed {
              cursor: default;
              color: #0C70F8;
            }
          }
        }
        > div {
          position: absolute; left: 0; bottom: 0;
          width: 50%; height: 2px;
          background-color: #0C70F8;
          transition: left .3s ease-out;
        }
      }
    }
    .add_group{
      padding: 0 10px 10px;
      max-height: 540px;
      .group_title{
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        cursor: pointer;
        i{
          position: relative;
          top: 2px;
          font-size: 20px;
        }
        span{
          margin-left: 10px;
        }
        &.active{
          background:rgba(242,242,242,1);
          i, span{
            color: #0C70F8;
          }
        }
        &:hover{
          background:rgba(242,242,242,1);
          i, span{
            color: #0C70F8;
          }
        }
      }
      .group_list{
        > div{
          width: 100%;
          height: 36px;
          line-height: 36px;
          padding-left: 40px;
          padding-right: 10px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          cursor: pointer;
          i{
            margin-top: 10px;
            &:hover{
              background-position: -414px -346px!important;
            }
          }
          &.active{
            background:rgba(242,242,242,1);
          }
          &:hover{
            background:rgba(242,242,242,1);
          }
        }
      }
    }
    .lib_form{
      margin-top: 30px;
      padding: 40px 20px 0;
      border-top: 1px solid rgba(211,211,211,1);
    }
  }
  .library_content{
    height: 100%;
    width: calc(100% - 252px);
    margin-left: 252px;
    .snap_list, .member_list{
      width: 100%;
      height: 100%;
      position: relative;
      .snap_title{
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        line-height: 40px;
      }
      .list_box{
        margin: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        .list_info{
          width: 32%;
          padding: 20px;
          margin-bottom: 20px;
          background:rgba(255,255,255,1);
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          .list_img{
            width: 50%;
            padding-right: 20px;
          }
          .list_data{
            width: 50%;
            .data_title{
              display: flex;
              justify-content: space-between;
              i{
                cursor: pointer;
                &:hover{
                  background-position: -584px -347px!important;
                }
              }
            }
            .data_list{
              display: flex;
              margin-top: 9px;
              span{
                padding: 5px 10px;
                background:rgba(250,250,250,1);
                border:1px solid rgba(242,242,242,1);
                border-radius: 3px;
                white-space:nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              & > span:not(:last-child){
                margin-right: 2px;
              }
              .more{
                position: relative;
                padding-top: 6px;
                > span{
                  margin-bottom: 10px;
                  cursor: pointer;
                  color: #0C70F8;
                }
                > div{
                  width: 220px;
                  padding: 20px 20px 10px;
                  position: absolute;
                  right: 72px;
                  bottom: 0;
                  background:rgba(255,255,255,1);
                  box-shadow:0px 5px 18px 0px rgba(169,169,169,0.39);
                  border-radius: 5px;
                  display: flex;
                  flex-wrap: wrap;
                  > span{
                    margin-bottom: 10px;
                    margin-right: 2px;
                  }
                }
                > i{
                  position: absolute;
                  left: -8px;
                  top: 6px;
                  display: inline-block;
                  border: 6px solid transparent;
                  border-left-color: #fff;
                }
              }
            }
          }
        }
      }
    }
    .member_list{
      width: 100%;
      height: 100%;
      .member_title{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 10px 20px;
        line-height: 40px;
        > div:nth-child(1){
          display: flex;
          > div:nth-child(1){
            margin-right: 20px;
            > span{
              font-size: 20px;
            }
            > i{
              margin-left: 10px;
              color: #186DFB;
              cursor: pointer;
            }
          }
          > div:nth-child(2){
            > span{
              margin-left: 10px;
              > span{
                color: #0C70F8;
              }
            }
          }
        }
        > div:nth-child(2){
          position: relative;
          .group_copy{
            width:152px;
            position: absolute;
            left: 0;
            top: 50px;
            z-index: 999;
            background:rgba(255,255,255,1);
            box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
            border-radius:4px;
            > li{
              padding: 0 10px;
              cursor: pointer;
              &:hover{
                background:rgba(237,249,255,1);
                border-radius:4px 4px 0px 0px;
              }
            }
          }
        }
      }
    }
  }
  .add_portrait_dialog{
    .add_portrait{
      display: flex;
      position: relative;
      .portrait_update{
        width: 240px;
        padding-top: 168px;
        padding-right: 20px;
        text-align: center;
        border-right: 1px solid rgba(242,242,242,1);
        .upload_pic{
          height: 160px;
          overflow: hidden;
          margin-bottom: 25px;
          .el-upload{
            img{
              width: 158px;
              height: 158px;
              border-radius: 6px;
            }
          }
          .dialog_pic{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            margin: 0;
            z-index: 2002;
            background: rgba(0, 0, 0, 0.4);
            img{
              position: fixed;
              top: 50%;
              left: 50%;
              z-index: 2003;
              margin: 0 !important;
              -webkit-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
              border-radius: 4px;
            }
          }
        }
        p{
          margin-top: 92px;
          color: #D3D3D3;
        }
      }
      .portrait_form{
        width: 480px;
        padding-left: 30px;
        .group_sel{
          min-height: 40px;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          padding-right: 30px;
          padding-bottom: 4px;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          > span{
            width: 100%;
            display: inline-block;
            margin-left: 16px;
            line-height: 34px;
            color: #dcdfe6;
            cursor: pointer;
          }
          .group{
            height:30px;
            line-height: 30px;
            padding: 0 8px;
            margin: 4px 0px 0 2px;
            background:rgba(242,242,242,1);
            border:1px solid rgba(211,211,211,1);
            border-radius:3px;
            cursor: pointer;
            &:hover{
              background:rgba(16,115,248,1);
              border-radius:3px;
              color: #fff;
              > span{
                color: #fff;
              }
            }
          }
          > i{
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
@media (max-width: 1400px) {
  .control_library .list_box .list_info{
    width: 49%!important;
  }
}
</style>
<style lang="scss">
.control_library{
  .search_box{
    .group_input{
      padding: 20px 10px;
      .el-input__inner{
        width: 212px;
        border-radius: 15px!important;
        background:rgba(242,242,242,1)!important;
        border: none;
      }
    }
    .lib_form .el-form-item{
      margin-bottom: 10px!important;
    }
  }
  .add_portrait_dialog{
    .el-dialog__header{
      padding: 20px 70px 10px!important;
    }
    .upload_pic{
      .el-upload--picture-card{
        width: 160px;
        height: 160px;
        background: rgba(67,140,238,1);
        border-radius: 20px;
        i{
          width: 120px;
          height: 110px;
        }
        &:hover{
          i.vl_icon_control_14{
            background-position: -228px -570px;
          }
        }
      }
      &.hidden .el-upload--picture-card{
        display: none!important;
      }
      .el-upload-list__item{
        width: 160px;
        height: 160px;
      }
    }
    .el-dialog__footer{
      text-align: right;
      padding: 10px 90px 20px!important;
    }
    .add_portrait .portrait_form{
      .desc{
        > div{
          border-radius: 4px;
          border: 1px solid #dcdfe6;
        }
        .el-textarea__inner{
          border: none;
        }
        p{
          padding-right: 10px;
          text-align: right;
        }
      }
      .group_li{
        width: 100%;
        position: absolute;
        left: 0;
        z-index: 999;
        margin-top: 4px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(211,211,211,1);
        border-radius:4px;
        .el-checkbox{
          display: block;
          height: 30px;
          line-height: 30px;
          margin-left: 0px;
          padding-left: 20px;
          &:hover{
            background:rgba(237,249,255,1);
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
