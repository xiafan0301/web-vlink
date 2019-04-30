<template>
  <div class="control_library">
    <template v-if="pageType === '1'">
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
            <i slot="suffix" class="el-input__icon el-icon-search" @click="getGroupList(1)"></i>
          </el-input>
        </div>
        <vue-scroll>
          <div class="add_group">
            <div @click="popGroupDialog()" :class="['group_title', {'active': groupIndex === -1 }]">
              <i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span>
            </div>
            <!-- 人像库组列表 -->
            <div class="group_list" v-if="tabType === '1'">
              <div v-for="(item, index) in groupListPortrait" :key="item.uid"  :class="{'active': groupIndex === index }">
                <div @click="getPortraitList(item.uid, index)"><span class="vl_f_333">{{item.groupName}}</span><span class="vl_f_666" style="margin-left: 5px;">({{item.num}})</span></div>
                <i @click="getPortraitList(item.uid, index, '2', item.groupName)" class="vl_icon vl_icon_control_21"></i>
              </div>
            </div>
            <!-- 车像库组列表 -->
            <div class="group_list" v-else>
              <div v-for="(item, index) in groupListCar" :key="item.uid"  :class="{'active': groupIndex === index }">
                <div @click="getVehicleList(item.uid, index)"><span class="vl_f_333">{{item.groupName}}</span><span class="vl_f_666" style="margin-left: 5px;">({{item.num}})</span></div>
                <i @click="getVehicleList(item.uid, index, '2', item.groupName)" class="vl_icon vl_icon_control_21"></i>
              </div>
            </div>
          </div>
        </vue-scroll>
        <!-- 人像库左侧组合搜索 -->
        <el-form :model="libPortraitForm" class="lib_form" ref="portraitLibForm" v-show="tabType === '1'">
          <el-form-item prop="perTime">
            <el-date-picker
              style="width: 192px;"
              v-model="libPortraitForm.perTime"
              type="daterange"
              format="yy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="sex">
            <el-select v-model="libPortraitForm.sex" placeholder="选择性别">
              <el-option
                v-for="item in sexList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="nation">
            <el-select v-model="libPortraitForm.nation" placeholder="选择民族">
              <el-option
                v-for="item in nationalList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="card">
            <el-select
              v-model="libPortraitForm.card"
              filterable
              remote
              clearable
              value-key="value"
              placeholder="输入证件号码"
              :remote-method="getPortraitDropdownListByIdNo"
              :loading="loading">
              <el-option
                v-for="item in portraitDropdownList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;">
            <el-button style="width: 90px;" type="primary" plain @click.native="reset">重置</el-button>
            <el-button style="width: 90px;" type="primary" @click.native="getPortraitList(groupId, groupIndex)">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 车像库左侧组合搜索 -->
        <el-form :model="libVehicleForm" class="lib_form" v-show="tabType === '2'" ref="carLibForm">
          <el-form-item prop="carTime">
            <el-date-picker
              style="width: 192px;"
              v-model="libVehicleForm.carTime"
              type="daterange"
              format="yy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="vehicleColor">
            <el-select v-model="libVehicleForm.vehicleColor" placeholder="选择车身颜色">
              <el-option
                v-for="item in carColorList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="vehicleType">
            <el-select v-model="libVehicleForm.vehicleType" placeholder="选择车辆类型">
              <el-option
                v-for="item in carTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="numberType">
            <el-select v-model="libVehicleForm.numberType" placeholder="选择号牌类型">
              <el-option
                v-for="item in numTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;" prop="vehicleNumber">
            <el-select
              v-model="libVehicleForm.vehicleNumber"
              filterable
              remote
              clearable
              value-key="value"
              placeholder="输入车辆号码"
              :remote-method="getVehicleDropdownListByVehicleNumber"
              :loading="loading">
              <el-option
                v-for="item in carDropdownList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 192px;">
            <el-button style="width: 90px;" type="primary" plain @click.native="reset">重置</el-button>
            <el-button style="width: 90px;" type="primary" @click.native="getVehicleList(groupId, groupIndex)">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 组成员列表 -->
      <div class="member_list">
        <div class="member_title">
          <div><span class="vl_f_333">布控库</span><span class="vl_f_666">({{memberNum}})</span></div>
          <el-button v-if="tabType === '1'" type="primary" @click.native="clearForm('portraitForm', '1')">新建人像</el-button>
          <el-button v-else type="primary" @click.native="clearForm('carForm', '1')">新建车像</el-button>
        </div>
        <div class="list_box" v-loading="loading">
          <template v-if="tabType === '1'">
            <div class="list_info" v-for="item in protraitMemberList.list" :key="item.uid">
              <div class="list_img"><img :src="item.photoUrl" alt=""></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <i v-if="item.origin !== 1" class="vl_icon vl_icon_control_20 can_click" @click="clearForm('portraitForm', '2', item.uid)"></i>
                  <el-tooltip v-else class="item" effect="dark" content="底库数据不可编辑" placement="top">
                    <i class="vl_icon vl_icon_control_20"></i>
                  </el-tooltip>
                </div>
                <div class="data_list">
                  <span :title="item.name">{{item.name}}</span>
                  <span :title="item.sex">{{item.sex}}</span>
                  <span :title="item.nation">{{item.nation}}</span>
                </div>
                <div class="data_list">
                  <span>{{item.idNo}}<i class="vl_icon vl_icon_control_29"></i></span>
                </div>
                <div class="data_list" v-if="item.groupNames">
                  <template v-for="(gN, index) in item.groupNames.split(',')">
                    <span v-if="index <= 1" :title="gN" :key="index + gN">{{gN}}</span>
                  </template>
                  <div class="more" v-if="item.groupNames.split(',').length >= 3">
                    <el-popover
                      placement="top-start"
                      width="220"
                      popper-class="more_popover_box"
                      trigger="hover">
                      <vue-scroll>
                        <template>
                          <div class="more_popover">
                            <span :title="gN" v-for="(gN, index) in item.groupNames.split(',')" :key="index + gN">{{gN}}</span>
                          </div>
                        </template>
                      </vue-scroll>
                      <span slot="reference" class="more_hover">更多组</span>
                    </el-popover>
                  </div>
                </div>
                <div class="data_list" v-if="item.remarks">
                  <span>{{item.remarks}}</span>
                </div>
              </div>
            </div>
            <div class="not_content" v-if="protraitMemberList && protraitMemberList.list && protraitMemberList.list.length === 0">
              <img src="../../../../assets/img/not-content.png" alt="">
              <p>暂无相关数据</p>
            </div>
          </template>
          <template v-else>
            <div class="list_info" v-for="item in carMemberList.list" :key="item.uid">
              <div class="list_img"><img :src="item.vehicleImagePath" alt=""></div>
              <div class="list_data">
                <div class="data_title">
                  <span class="vl_f_999">详情资料</span>
                  <i v-if="item.origin !== 1" class="vl_icon vl_icon_control_20 can_click" @click="clearForm('carForm', '2', item.uid)"></i>
                  <el-tooltip v-else class="item" effect="dark" content="底库数据不可编辑" placement="top">
                    <i class="vl_icon vl_icon_control_20"></i>
                  </el-tooltip>
                </div>
                <div class="data_list">
                  <span :title="item.vehicleNumber">{{item.vehicleNumber}}</span><span :title="item.numberType">{{item.numberType}}</span>
                </div>
                <div class="data_list">
                  <span :title="item.vehicleType">{{item.vehicleType}}</span><span :title="item.vehicleColor">{{item.vehicleColor}}</span>
                </div>
                <div class="data_list">
                  <span :title="item.numberColor">{{item.numberColor}}</span>
                  <template v-if="item.groupNames">
                    <template v-for="(gN, index) in item.groupNames.split(',')">
                      <span v-if="index === 0" :title="gN" :key="index + gN">{{gN}}</span>
                    </template>
                    <div class="more" v-if="item.groupNames.split(',').length > 1">
                      <el-popover
                        placement="top-start"
                        width="220"
                        popper-class="more_popover_box"
                        trigger="hover">
                        <vue-scroll>
                          <template>
                            <div class="more_popover">
                              <span :title="gN" v-for="(gN, index) in item.groupNames.split(',')" :key="index + gN">{{gN}}</span>
                            </div>
                          </template>
                        </vue-scroll>
                        <span slot="reference" class="more_hover">更多组</span>
                      </el-popover>
                    </div>
                  </template>
                </div>
                <div class="data_list" v-if="item.desci">
                  <span>{{item.desci}}</span>
                </div>
              </div>
            </div>
            <div class="not_content" v-if="carMemberList && carMemberList.list && carMemberList.list.length === 0">
              <img src="../../../../assets/img/not-content.png" alt="">
              <p>暂无相关数据</p>
            </div>
          </template>
          <div style="width: 100%;" v-show="protraitMemberList && protraitMemberList.list && protraitMemberList.list.length > 0 && tabType === '1'">
            <el-pagination
              style="text-align: center;"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="protraitMemberList.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="protraitMemberList.total">
            </el-pagination>
          </div>
          <div style="width: 100%;" v-show="carMemberList && carMemberList.list && carMemberList.list.length > 0 && tabType === '2'">
            <el-pagination
              style="text-align: center;"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="carMemberList.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="carMemberList.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 新建人像/车像 -->
      <div class="add_portrait_dialog">
        <el-dialog
          :visible.sync="addPortraitDialog"
          :close-on-click-modal="false"
          width="722px"
          top="20vh"
          :title="tabType === '1' ? `${operationType === '1' ? '新增' : '修改'}人像` : `${operationType === '1' ? '新增' : '修改'}车像`">
          <div class="add_portrait">
            <div class="portrait_update" >
              <div :class="['upload_pic', {'hidden': dialogImageUrl}]">
                <el-upload
                  :disabled="isAddDisabled"
                  ref="uploadPic"
                  accept="image/*"
                  :limit="1"
                  :action="uploadUrl"
                  :on-exceed="uploadPicExceed"
                  :data="{projectType: 2}"
                  list-type="picture-card"
                  :file-list="fileList"
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
              <template v-if="!isAddDisabled">
                <h1 class="vl_f_999">点击修改{{tabType === '1' ? '人像' : '车像'}}</h1>
                <p>请上传清晰照片</p>
              </template>
            </div>
            <div class="portrait_form">
              <!-- 人像 -->
              <el-form class="portrait_form" v-show="tabType === '1'" :model="portraitForm" :rules="portraitRules" ref="portraitForm" label-width="20px" label-position="left">
                <el-form-item label=" " style="width: 415px;" prop="name">
                  <el-input v-model="portraitForm.name" placeholder="姓名" maxlength="50" :disabled="isAddDisabled"></el-input>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" class="portrait_form_sex" prop="sex">
                  <el-button plain @click.native="selSex(1)" :class="{'active': portraitForm.sex === 1}" :disabled="isAddDisabled">男</el-button>
                  <el-button plain @click.native="selSex(2)" :class="{'active': portraitForm.sex === 2}" :disabled="isAddDisabled">女</el-button>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="nation">
                  <el-select v-model="portraitForm.nation" placeholder="民族" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in nationalList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="idType">
                  <el-select v-model="portraitForm.idType" placeholder="证件类型" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in cardTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="idNo">
                  <el-input v-model="portraitForm.idNo" placeholder="证件号码" @blur="getPortraitByIdNo"></el-input>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="birthDate" :disabled="isAddDisabled">
                  <el-input v-model="portraitForm.birthDate" placeholder="出生日期" :disabled="true"></el-input>
                </el-form-item>
                <!-- 选择归属组 -->
                <el-form-item style="width: 415px;position: relative;">
                  <el-select v-model="portraitForm.groupIds" multiple filterable allow-create default-first-option placeholder="请选择归属组" style="width: 100%;">
                    <el-option
                      v-for="item in groupDropdownList"
                      :key="item.uid"
                      :label="item.groupName"
                      :value="item.uid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="width: 415px;" class="desc" prop="remarks">
                  <div>
                    <el-input
                      :disabled="isAddDisabled"
                      type="textarea"
                      :rows="2"
                      :maxlength="100"
                      resize="none"
                      placeholder="描述"
                      v-model="portraitForm.remarks">
                    </el-input>
                    <p><span class="vl_f_999">{{portraitForm.remarks.length}}</span>/<span class="vl_f_999">100</span></p>
                  </div>
                </el-form-item>
              </el-form>
              <!-- 车像 -->
              <el-form :model="carForm" class="portrait_form" v-show="tabType === '2'" :rules="carRules" ref="carForm" label-width="20px" label-position="left">
                <el-form-item label=" " style="width: 415px;" prop="vehicleNumber">
                  <el-input v-model="carForm.vehicleNumber" placeholder="车牌号码" @blur="getVehicleByVehicleNumber"></el-input>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="vehicleColor">
                  <el-select v-model="carForm.vehicleColor" placeholder="选择车身颜色" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in carColorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="vehicleType">
                  <el-select v-model="carForm.vehicleType" placeholder="选择车辆类型" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in carTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="numberType">
                  <el-select v-model="carForm.numberType" placeholder="选择号牌类型" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in numTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " style="width: 415px;" prop="numberColor">
                  <el-select v-model="carForm.numberColor" placeholder="选择号牌颜色" style="width: 100%;" :disabled="isAddDisabled">
                    <el-option
                      v-for="item in numColorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 归属组 -->
                <el-form-item style="width: 415px;">
                  <el-select v-model="carForm.groupIds" multiple filterable allow-create default-first-option placeholder="请选择归属组" style="width: 100%;">
                    <el-option
                      v-for="item in groupDropdownList"
                      :key="item.uid"
                      :label="item.groupName"
                      :value="item.uid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="width: 415px;" class="desc" prop="desci">
                  <div>
                    <el-input
                      :disabled="isAddDisabled"
                      type="textarea"
                      :rows="2"
                      :maxlength="100"
                      resize="none"
                      placeholder="描述"
                      v-model="carForm.desci">
                    </el-input>
                    <p><span class="vl_f_999">{{carForm.desci.length}}</span>/<span class="vl_f_999">100</span></p>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div slot="footer">
            <el-button @click="toGiveUpDialog = true">取消</el-button>
            <template v-if="tabType === '1'">
              <el-button v-if="operationType === '1'" :loading="loadingBtn" type="primary" @click="savePortrait('portraitForm')">保存</el-button>
              <el-button v-else :loading="loadingBtn" type="primary" @click="putPortrait('portraitForm')">确定</el-button>
            </template>
            <template v-else>
              <el-button v-if="operationType === '1'" :loading="loadingBtn" type="primary" @click="saveCar('carForm')">保存</el-button>
              <el-button v-else :loading="loadingBtn" type="primary" @click="putCar('carForm')">确定</el-button>
            </template>
          </div>
        </el-dialog>
      </div>
      <!-- 新增组 -->
      <div is="groupDialog" operateType="1" ref="groupDialog" :tabType="tabType" @getGroupList="getGroupList"></div>
      <!-- 确认操作 -->
      <el-dialog
        :visible.sync="toGiveUpDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h4>是否放弃本次操作？</h4>
        <div slot="footer">
          <el-button :loading="loadingBtn" @click="toGiveUpDialog = false;addPortraitDialog = false;">放弃</el-button>
          <el-button  type="primary" @click="toGiveUpDialog = false">取消</el-button>
        </div>
      </el-dialog>
    </template>
    <!-- 设置组 -->
    <template v-else>
      <template v-if="tabType === '1'">
        <!-- 全部人像列表 -->
        <div is="allPortrait" v-if="groupId === null" :tabType="tabType" :protraitMemberList="protraitMemberList" :groupName="groupName" @getPortraitList="handleCurrentChange" :currentPage="currentPage" @changePage="changePage"></div>
        <!-- 自定义人像列表 -->
        <div is="customPortrait" v-else :tabType="tabType" :protraitMemberList="protraitMemberList" :groupId="groupId" :groupName="groupName" @getPortraitList="handleCurrentChange" :currentPage="currentPage" @changePage="changePage"></div>
      </template>
      <template v-else>
        <!-- 全部车像列表 -->
        <div is="allCar" v-if="groupId === null" :tabType="tabType" :carMemberList="carMemberList" :groupName="groupName" @getVehicleList="handleCurrentChange" :currentPage="currentPage" @changePage="changePage"></div>
        <!-- 自定义车像列表 -->
        <div is="customCar" v-else :tabType="tabType" :carMemberList="carMemberList" :groupId="groupId" :groupName="groupName" @getVehicleList="handleCurrentChange" :currentPage="currentPage" @changePage="changePage"></div>
      </template>
    </template>
  </div>
</template>
<script>
import { ajaxCtx } from '@/config/config.js';
import {checkIdCard, checkName, checkPlateNumber} from '@/utils/validator.js';
import allCar from './components/allCar.vue';
import allPortrait from './components/allPortrait.vue';
import customCar from './components/customCar.vue';
import customPortrait from './components/customPortrait.vue';
import groupDialog from './components/groupDialog.vue';
import {getPortraitByIdNo, addPortrait, getVehicleByVehicleNumber, addVehicle, getPortraitList, getVehicleList, getPortraitById, putPortrait, getVehicleById, putVehicle, getGroupListIsPortrait, getGroupListIsVehicle} from '@/views/index/api/api.control.js';
import {objDeepCopy} from '@/utils/util.js';
import {nationData} from './testData.js';
export default {
  components: {allCar, allPortrait, customCar, customPortrait, groupDialog},
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/appendix', // 图片上传地址
      // 侧边栏参数
      tabType: '1',
      group: null,//搜索组
      // 人像库筛选参数
      libPortraitForm: {
        perTime: null,
        sex: null,
        nation: null,
        card: null
      },
      // 车像库筛选参数
      libVehicleForm: {
        carTime: null,
        vehicleColor: null,
        vehicleType: null,
        numberType: null,
        vehicleNumber: null
      },
      portraitDropdownList: [],
      carDropdownList: [],
      groupIndex: 0,//分组下标
      // 人像组列表数据
      groupListPortrait: [],
      // 车像组列表数据
      groupListCar: [],
      pageType: '1',//页面类型，默认为组成员页，1-组成员页，2-组设置页
      groupId: null,//分组id
      lastGroupId: null,//用于记录之前的分组id
      sexList: [
        {label: '未知', value: 0},
        {label: '男', value: 1},
        {label: '女', value: 2}
      ],//性别列表数据
      nationalList: nationData,//民族列表数据
      carTypeList: [
        {label: '其他', value: 9},
        {label: '轿车', value: 1},
        {label: '面包车', value: 2},
        {label: '客车', value: 3},
        {label: '货车', value: 4},
        {label: '自行车', value: 5},
        {label: '电动车', value: 6},
        {label: '摩托车', value: 7},
        {label: '挂车', value: 8}
      ],//车辆类型列表数据
      numTypeList: [
        {label: '大型汽车', value: 1},
        {label: '小型汽车', value: 2},
        {label: '轻便摩托车', value: 8},
        {label: '挂车', value: 15},
        {label: '警用汽车', value: 23},
        {label: '警用摩托', value: 24},
        {label: '小型新能源汽车', value: 25},
        {label: '大型新能源汽车', value: 26},
        {label: '小吨位货车', value: 27},
        {label: '大吨位货车', value: 28},
        {label: '客车', value: 29},
        {label: '其他', value: 99}
      ],//号码类型列表数据
      carColorList: [
        {label: '其他', value: 11},
        {label: '白', value: 1},
        {label: '灰', value: 2},
        {label: '黄', value: 3},
        {label: '粉', value: 4},
        {label: '红', value: 5},
        {label: '紫', value: 6},
        {label: '绿', value: 7},
        {label: '蓝', value: 8},
        {label: '棕', value: 9},
        {label: '黑', value: 10}
      ],//车身颜色列表
      numColorList: [
        {label: '其他', value: 0},
        {label: '红底白字', value: 1},
        {label: '蓝底白字', value: 2}
      ],//号牌颜色列表
      // 翻页数据
      currentPage: 1,
      pageSize: 9,
      pageNum: 1,
      // dialog
      addPortraitDialog: false,
      toGiveUpDialog: false,
      // 新增人像参数
      portraitForm: {
        name: '',
        sex: '',
        nation: null,
        idType: '',
        idNo: '',
        birthDate: null,
        groupIds: [],
        remarks: ''
      },
      // 新增车像参数
      carForm: {
        vehicleNumber: null,
        vehicleColor: null,
        vehicleType: null,
        numberType: 2,
        numberColor: 2,
        groupIds: [],
        desci: ''
      },
      isAddDisabled: false,
      //证件类型列表数据
      cardTypeList: [
        {label: '身份证', value: '1'}
      ],
      loadingBtn: false,
      loading: false,
      isShowDpList: false,//是否显示下拉列表数据
      operationType: null,//新增还是修改人像/车像，1-新增，2-修改
      groupDropdownList: [],//归属组下拉列表数据
      portraitRules: {
        name: [
          {required: true, message: '请填写姓名', trigger: 'blur'},
          {validator: checkName, trigger: 'blur'}
        ],
        sex: [{required: true, message: '请选择性别类型', trigger: 'change'}],
        nation: [{required: true, message: '请选择民族类型', trigger: 'change'}],
        idType: [{required: true, message: '请选择证件类型', trigger: 'change'}],
        birthDate: [{required: true, message: '请填写出生日期', trigger: 'change'}],
        idNo: [
          {required: true, message: '请填写证件号码', trigger: 'blur'},
          {validator: checkIdCard, trigger: 'blur'}
        ]
      },
      carRules: {
        vehicleNumber: [
          {required: true, message: '请填写车牌号码', trigger: 'blur'},
          {validator: checkPlateNumber, trigger: 'blur'}
        ],
        vehicleColor: [{required: true, message: '请选择车辆颜色', trigger: 'change'}],
        vehicleType: [{required: true, message: '请选择车辆类型', trigger: 'change'}],
        numberType: [{required: true, message: '请选择号牌类型', trigger: 'change'}],
        numberColor: [{required: true, message: '请选择号牌颜色', trigger: 'change'}]
      },
      lastIdNo: null,
      lastCarIdNo: null,
      // 上传人像参数
      dialogImageUrl: null,
      dialogVisible: false,
      fileList: [],//上传列表，用来回填
      picHeight: null,
      protraitMemberList: [],//人像成员列表数据
      carMemberList: []//车像成员列表数据
    }
  },
  computed: {
    memberNum () {
      if (this.tabType === '1') {
        return this.protraitMemberList.total;
      } else {
        return this.carMemberList.total;
      }
    }
  },
  mounted () {
    // 获取分组列表
    this.getGroupList();
    // 默认获取人像库列表
    this.getPortraitList(this.groupId, 0);
    this.picHeight = window.screenHeight + 180;
  },
  methods: {
    // 通过证件号模糊匹配人像列表
    getPortraitDropdownListByIdNo (query) {
      getPortraitByIdNo({idNo: query}).then(res => {
        if (res && res.data) {
          this.portraitDropdownList = res.data.map(m => {
            return {
              label: m.idNo,
              value: m.idNo
            }
          });
        }
      })
    },
    // 通过证件号模糊匹配人像列表
    getVehicleDropdownListByVehicleNumber (query) {
      getVehicleByVehicleNumber({vehicleNumber: query}).then(res => {
        if (res && res.data) {
          this.carDropdownList = res.data.map(m => {
            return {
              label: m.vehicleNumber,
              value: m.vehicleNumber
            }
          });
        }
      })
    },
    selSex (type) {
      this.portraitForm.sex = type;
      this.$refs['portraitForm'].clearValidate(['sex']);
    },
    // 删除完组后重新获取组列表和组成员
    changePage () {
      this.pageType = '1';
      this.groupIndex = -1;
      this.getGroupList();
      if (this.tabType === '1') {
        this.getPortraitList(null, 0);
      } else {
        this.getVehicleList(null, 0);
      }
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      if (this.tabType === '1') {
        this.getPortraitList(this.groupId, this.groupIndex);
      } else {
        this.getVehicleList(this.groupId, this.groupIndex);
      }
    },
    // 人像库和车像库切换
    changeTab (tabType) {
      this.tabType = tabType;
      this.groupIndex = 0;
      this.currentPage = 1;
      this.pageNum = 1;
      this.getGroupList();
      this.reset();
      if (this.tabType === '1') {
        this.getPortraitList(null, 0);
      } else {
        this.getVehicleList(null, 0);
      }
      this.pageType = '1';
      this.groupId = null;
    },
    popGroupDialog () {
      this.groupIndex = -1;
      this.$refs['groupDialog'].reset();
    },
    // 重置左侧组合搜索
    reset () {
      if (this.tabType === '1') {
        this.$refs['portraitLibForm'].resetFields();
      } else {
        this.$refs['carLibForm'].resetFields();
      }
    },
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.sysCommonImageInfo.fileFullPath;
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
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
    // 查询组列表
    getGroupList (type) {
      if (!type) {
        this.group = null;
      }
      const params = {groupName: this.group};
      if (this.tabType === '1') {
        getGroupListIsPortrait(params).then(res => {
          if (res && res.data) {
            this.groupListPortrait = res.data;
            this.groupDropdownList = this.groupListPortrait.filter(f => f.uid !== null);
          }
        })
      } else {
        getGroupListIsVehicle(params).then(res => {
          if (res && res.data) {
            this.groupListCar = res.data;
            this.groupDropdownList = this.groupListCar.filter(f => f.uid !== null);
          }
        })
      }
    },
    // 清除新建/修改人像和车像表单验证和内容
    clearForm (formName, type, uid) {
      // 清除已上传的图片
      if (this.$refs['uploadPic']) {
        this.$refs['uploadPic'].clearFiles();
        this.dialogImageUrl = null;
      }
      // 清空表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      this.operationType = type;
      this.lastIdNo = null;
      this.lastCarIdNo = null;
      // 获取人像信息回填，用来修改人像
      if (formName === 'portraitForm' && type === '2') {
        this.getPortraitById(uid);
      }
      // 获取车像信息回填，用来修改车像
      if (formName === 'carForm' && type === '2') {
        this.getVehicleById(uid);
        console.log('车像')
      }
      this.portraitForm.groupIds = [];
      this.carForm.groupIds = [];
      this.portraitForm.sex = '';
      this.isShowDpList = false;
      this.addPortraitDialog = !this.addPortraitDialog;
      this.isAddDisabled = false;
    },
    // 获取出生日期
    getBirthDate () {
      if (this.portraitForm.idNo.length === 18) {
        this.portraitForm.birthDate = `${this.portraitForm.idNo.slice(6, 10)}年${this.portraitForm.idNo.slice(10, 12)}月${this.portraitForm.idNo.slice(12, 14)}日`;
      }
    },
    //删除选中的组
    delSelGroup (item, type) {
      if (type === 1) {
        this.portraitForm.groupIds = this.portraitForm.groupIds.filter(f => f !== item);
      } else {
        this.carForm.groupIds = this.carForm.groupIds.filter(f => f !== item);
      }
    },
    // 通过证件号搜索人像
    getPortraitByIdNo () {
      const idNo = this.Trim(this.portraitForm.idNo, 'g');
      if (this.lastIdNo === idNo) return;
      this.lastIdNo = idNo;
      const params = {idNo: idNo}
      if (idNo) {
        getPortraitByIdNo(params).then(res => {
          // 人像已存在
          if (res && res.data && res.data.length > 0) {
            let protraitInfo = res.data[0];
            this.fileList = [{url: protraitInfo.photoUrl}];//回填图片
            this.dialogImageUrl = protraitInfo.photoUrl;
            protraitInfo.photoUrl = protraitInfo.photoUrl;
            console.log(protraitInfo.birthDate)
            protraitInfo.birthDate = protraitInfo.birthDate.split('');
            protraitInfo.birthDate.splice(4, 1, '年');
            protraitInfo.birthDate.splice(7, 1, '月');
            protraitInfo.birthDate.splice(10, 0, '日');
            protraitInfo.birthDate = protraitInfo.birthDate.join('');
            protraitInfo.idType = protraitInfo.idType === '身份证' ? '1' : '';
            protraitInfo.groupIds = protraitInfo.groupList.filter(f => f.selected).map(m => m.uid);
            if (protraitInfo.origin === 1) {
              this.isAddDisabled = true;
            } else {
              this.isAddDisabled = false;
              this.$message.error('布控库已存在，请修改证件号码');
            }
            protraitInfo.uid = this.portraitForm.uid;
            protraitInfo.origin = this.portraitForm.origin
            this.portraitForm = protraitInfo;
            if (this.$refs['portraitForm']) {
              this.$refs['portraitForm'].resetFields();
            }
            console.log(this.portraitForm)
          // 人像不存在
          } else {
            this.isAddDisabled = false;
            if (this.$refs['portraitForm']) {
              this.$nextTick(() => {
                this.$refs['portraitForm'].clearValidate(['idType']);
              })
            }
            this.getBirthDate();// 通过证件号获取出生日期
          }
        })
      }
    },
    // 保存人像
    savePortrait (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message.error('请上传人像');
            return;
          }
          this.loadingBtn = true;
          let data = objDeepCopy(this.portraitForm);
          if (data.uid !== undefined) {
            delete data['uid'];
            delete data['groupList'];
          }
          data.birthDate = data.birthDate.split('');
          data.birthDate.splice(4, 1, '-');
          data.birthDate.splice(7, 1, '-');
          data.birthDate.splice(10, 1);
          data.birthDate = data.birthDate.join('');
          data.groupIds = data.groupIds.join(',');
          if (this.isAddDisabled) {
            data.origin = 1;//来源底库
          } else {
            data.origin = 2;//来源布控库
          }
          data.photoUrl = this.dialogImageUrl;
          addPortrait(data).then(res => {
            if (res && res.data) {
              console.log(res);
              this.addPortraitDialog = false;
              this.$message.success('新增成功！');             
              this.getPortraitList(this.groupId, this.groupIndex);
              this.getGroupList();
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    },
    // 通过车牌号搜索车辆
    getVehicleByVehicleNumber () {
      const carIdNo = this.Trim(this.carForm.vehicleNumber, 'g');
      if (this.lastCarIdNo === carIdNo) return;
      this.lastCarIdNo = carIdNo;
      const params = {
        vehicleNumber: carIdNo
      }
      if (carIdNo) {
        getVehicleByVehicleNumber(params).then(res => {
          // 已存在车像
          if (res && res.data && res.data.length > 0) {
            let carInfo = res.data[0];
            this.fileList = carInfo.vehicleImagePath ? [{url: carInfo.vehicleImagePath}] : [];//回填图片
            this.dialogImageUrl = carInfo.vehicleImagePath;
            carInfo.groupIds = carInfo.groupList.filter(f => f.selected).map(m => m.uid);
            if (carInfo.origin === 1) {
              this.isAddDisabled = true;
            } else {
              this.isAddDisabled = false;
              this.$message.error('布控库已存在，请修改车牌号码');
            }
            carInfo.uid = this.carForm.uid;
            carInfo.origin = this.carForm.origin;
            this.carForm = carInfo;
          // 不存在车像
          } else {
            this.isAddDisabled = false;
          }
        })
      }
    },
    // 保存车像
    saveCar (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message.error('请上传车像');
            return;
          }
          this.loadingBtn = true;
          let data = objDeepCopy(this.carForm);
          if (data.uid !== undefined) {
            delete data['uid'];
            delete data['groupList'];
          }
          data.groupIds = data.groupIds.join(',');
          if (this.isAddDisabled) {
            data.origin = 1;//来源底库
          } else {
            data.origin = 2;//来源布控库
          }
          data.vehicleImagePath = this.dialogImageUrl;
          addVehicle(data).then(res => {
            if (res && res.data) {
              console.log(res);
              this.addPortraitDialog = false;
              this.$message.success('新增成功！');
              this.getVehicleList(this.groupId, this.groupIndex);
              this.getGroupList();
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    },
    // 通过id获取人像，用于修改人像
    getPortraitById (uid) {
      getPortraitById(uid).then(res => {
        if (res && res.data) {
          let protraitInfo = res.data;
          this.fileList = protraitInfo.photoUrl ? [{url: protraitInfo.photoUrl}] : [];//回填图片
          this.dialogImageUrl = protraitInfo.photoUrl;
          protraitInfo.birthDate = protraitInfo.birthDate.split('');
          protraitInfo.birthDate.splice(4, 1, '年');
          protraitInfo.birthDate.splice(7, 1, '月');
          protraitInfo.birthDate.splice(10, 0, '日');
          protraitInfo.birthDate = protraitInfo.birthDate.join('');
          protraitInfo.idType = protraitInfo.idType === '身份证' ? '1' : '';
          protraitInfo.groupIds = protraitInfo.groupList.filter(f => f.selected).map(m => m.uid);
          this.lastIdNo = protraitInfo.idNo;
          this.portraitForm = protraitInfo;
          console.log(this.portraitForm)
        }
      })
    },
    // 修改人像
    putPortrait (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message.error('请上传人像');
            return;
          }
          this.loadingBtn = true;
          let data = objDeepCopy(this.portraitForm);
          data.birthDate = data.birthDate.split('');
          data.birthDate.splice(4, 1, '-');
          data.birthDate.splice(7, 1, '-');
          data.birthDate.splice(10, 1);
          data.birthDate = data.birthDate.join('');
          data.groupIds = data.groupIds.join(',');
          // if (this.isAddDisabled) {
          //   data.origin = 1;//来源底库
          // } else {
          //   data.origin = 2;//来源布控库
          // }
          data.photoUrl = this.dialogImageUrl;
          putPortrait(data).then(res => {
            if (res) {
              console.log(res);
              this.addPortraitDialog = false;
              this.$message.success('修改成功！');
              this.getPortraitList(this.groupId, this.groupIndex);
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    },
    // 通过id获取车像，用于修改车像
    getVehicleById (uid) {
      getVehicleById(uid).then(res => {
        if (res && res.data) {
          let carInfo = res.data;
          this.fileList = carInfo.vehicleImagePath ? [{url: carInfo.vehicleImagePath}] : [];//回填图片
          this.dialogImageUrl = carInfo.vehicleImagePath;
          carInfo.groupIds = carInfo.groupList.filter(f => f.selected).map(m => m.uid);
          this.lastCarIdNo = carInfo.vehicleNumber;
          this.carForm = carInfo;
          console.log(this.carForm)
        }
      })
    },
    // 修改车像
    putCar (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message.error('请上传车像');
            return;
          }
          this.loadingBtn = true;
          let data = objDeepCopy(this.carForm);
          data.groupIds = data.groupIds.join(',');
          // if (this.isAddDisabled) {
          //   data.origin = 1;//来源底库
          // } else {
          //   data.origin = 2;//来源布控库
          // }
          data.vehicleImagePath = this.dialogImageUrl;
          putVehicle(data).then(res => {
            console.log(res);
            if (res) {
              this.addPortraitDialog = false;
              this.$message.success('修改成功！');
              this.getVehicleList(this.groupId, this.groupIndex);
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    },
    // 获取全部人像列表，或者根据组id获取人像列表
    getPortraitList (groupId, index, pageType, groupName) {
      this.groupIndex = index;
      this.groupId = groupId;
      this.groupName = groupName;
      if (this.groupId !== this.lastGroupId || pageType === '2') {
        this.currentPage = 1;
        this.pageNum = 1;
      }
      this.lastGroupId = this.groupId;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: null,
        order: null,
        'where.dateStart': this.libPortraitForm.perTime && this.libPortraitForm.perTime[0],
        'where.dateEnd': this.libPortraitForm.perTime && this.libPortraitForm.perTime[1],
        'where.sex': this.libPortraitForm.sex,
        'where.nation': this.libPortraitForm.nation,
        'where.groupId': groupId
      }
      this.libPortraitForm.card && (params['where.idNo'] = this.libPortraitForm.card);
      this.loading = true;
      getPortraitList(params).then(res => {
        if (res && res.data) {
          this.protraitMemberList = res.data;
          // 跳转到设置页
          if (pageType === '2') {
            this.pageType = pageType;
          }
          console.log(this.currentPage, 'currentPage')
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    //  获取全部车像列表，或者根据组id获取车像列表
    getVehicleList (groupId, index, pageType, groupName) {
      this.groupIndex = index;
      this.groupId = groupId;
      this.groupName = groupName;
      if (this.groupId !== this.lastGroupId || pageType === '2') {
        this.currentPage = 1;
        this.pageNum = 1;
      }
      this.lastGroupId = this.groupId;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: null,
        order: null,
        'where.dateStart': this.libVehicleForm.carTime && this.libVehicleForm.carTime[0],
        'where.dateEnd': this.libVehicleForm.carTime && this.libVehicleForm.carTime[1],
        'where.vehicleColor': this.libVehicleForm.vehicleColor,
        'where.vehicleType': this.libVehicleForm.vehicleType,
        'where.numberType': this.libVehicleForm.numberType,
        'where.groupId': groupId
      }
      this.libVehicleForm.vehicleNumber && (params['where.vehicleNumber'] = this.libVehicleForm.vehicleNumber);
      this.loading = true;
      getVehicleList(params).then(res => {
        if (res && res.data) {
          this.carMemberList = res.data;
          // 跳转到设置页
          if (pageType === '2') {
            this.pageType = pageType;
          }
          console.log(this.currentPage, 'currentPage')
        }
      }).finally(() => {
        this.loading = false;
      })
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
      max-height: 216px;
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
          > div{
            cursor: pointer;
          }
          i{
            margin-top: 10px;
            cursor: pointer;
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
  .member_list{
    height: 100%;
    width: calc(100% - 252px);
    margin-left: 252px;
    position: relative;
    .member_title{
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      line-height: 40px;
    }
    .list_box{
      height: calc(100% - 100px);
      margin: 20px 0.5%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .list_info{
        margin: 0 0.5%;
        width: 32%;
        max-width: 462px;
        height: 240px;
        padding: 20px;
        margin-bottom: 20px;
        background:rgba(255,255,255,1);
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        display: flex;
        justify-content: space-between;
        .list_img{
          width: 50%;
          padding-right: 20px;
          > img{
            width: 100%;
            height: 100%;
          }
        }
        .list_data{
          width: 50%;
          .data_title{
            display: flex;
            justify-content: space-between;
            i.can_click{
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
              .more_hover{
                margin-bottom: 10px;
                cursor: pointer;
                color: #0C70F8;
                border: none;
                padding: 0;
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
        padding-left: 30px;
      }
    }
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
      .el-range-input{
        width: 62px;
      }
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
      padding: 0 90px 20px!important;
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
          line-height: 30px;
        }
      }
      .el-form-item{
        margin-bottom: 18px;
      }
      .el-button.active{
        background: rgb(199, 197, 197);
        border-color: #409EFF;
        color: #409EFF;
      }
    }
  }
  .el-dialog__wrapper .el-dialog__body{
    padding: 0px 30px;
  }
}
@media (max-width: 1400px) {
  .control_library .list_box .list_info{
    width: 49%!important;
  }
}
</style>
