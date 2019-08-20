<template>
  <div class="vl_judge_tc_ytsr">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '以图搜人'}]">
      </div>
    </div>
    <div class="vl_j_left">
      <div class="ytsr_left_radio">
        <span>查询方式：</span>
        <span>
          <el-radio v-model="taskType" label="1">在线查询</el-radio>
          <el-radio v-model="taskType" label="2">离线任务</el-radio>
        </span>
      </div>
      <div v-show="taskType === '2'" class="ytsr_left_radio">
        <span>任务名称：</span>
        <span style="padding-right: 20px">
          <el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>
        </span>
      </div>
      <div class="vl_jtc_img_box">
        <div style="margin-left: 17px;" class="vl_judge_tc_c_item"  @drop="drop($event)" @dragover="allowDrop($event)">
          <el-upload
            :class="{'vl_jtc_upload_ytsr': true}"
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            @drop="drop($event)"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucess"
            :on-error="handleError">
            <i v-if="uploading" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl" :src="curImageUrl">
            <div v-else>
              <i
                      style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                      class="vl_icon vl_icon_vehicle_01"
              ></i>
              <span>点击上传图片</span>
            </div>
          </el-upload>
          <div v-show="curImageUrl" class="del_icon">
            <i class="el-icon-delete" @click="delPic()"></i>
          </div>
          <p @click="showHistoryPic">从上传记录中选择</p>
        </div>
      </div>
      <div class="per_semblance_ytsr"><span>相似度：≥</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" placeholder="填写相似度数字" v-model="searchData.minSemblance"></el-input>%</div>
      <!--查询范围-->
      <div class="ytsr_left_radio">
        <span>查询范围：</span>
        <span>
          <el-radio v-model="radio" label="1">基础信息库</el-radio>
          <el-radio v-model="radio" label="2">抓拍视图库</el-radio>
        </span>
      </div>
      <div class="ytsr_left_search" v-show="radio === '1'">
        <el-select
                v-model="searchData.portraitGroupId"
                placeholder="全部人像"
                multiple
                collapse-tags
        >
          <el-option
                  v-for="item in portraitGroupList"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.uid">
          </el-option>
        </el-select>
      </div>
      <div class="ytsr_left_search"  v-show="radio === '2'">
        <div class="left_time">
          <el-date-picker
            v-model="searchData.startTime"
            style="width: 100%;margin-bottom: 20px;"
            class="vl_date"
            type="datetime"
            :time-arrow-control="true"
            @change="chooseStartTime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
          <el-date-picker
                  style="width: 100%;"
                  class="vl_date vl_date_end"
                  v-model="searchData.endTime"
                  @change="chooseEndTime"
                  :time-arrow-control="true"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <!-- 设备搜索 -->
        <div class="device-comp">
          <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
          <div class="selected_device" @click="treeTabShow = true;">
            <i class="el-icon-arrow-down"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
            <div class="device_list" v-if="selectDeviceArr.length > 0">
              <template v-if="checkAllTree">
                <span>全部设备</span>
              </template>
              <template v-else>
                <span>{{ selectDeviceArr[0].label }}</span>
                <span
                        v-show="selectDeviceArr.length > 1"
                        title="展开选中的设备"
                        class="device_count"
                >+{{ selectDeviceArr.length - 1 }}</span>
              </template>
            </div>
            <div class="no_device" v-else>选择设备</div>
            <!-- 树tab页面 -->
            <div class="device_tree_tab" v-show="treeTabShow">
              <div style="overflow: hidden;">
              </div>
              <!-- 摄像头树 -->
              <div class="tree_content">
                <vue-scroll>
                  <div class="checked_all">
                    <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAllTree"
                            @change="handleCheckedAll"
                    >全选</el-checkbox>
                  </div>
                  <el-tree
                          @check="listenChecked"
                          :data="cameraTree"
                          show-checkbox
                          default-expand-all
                          node-key="label"
                          ref="cameraTree"
                          highlight-current
                          :props="defaultProps"
                  ></el-tree>
                </vue-scroll>
              </div>
            </div>
          </div>
          <p class="error-tip" :class="{'is-show': isDeviceTrue}">{{messageDevTip}}</p>
        </div>
      </div>
      <div class="vl_jtc_search">
        <div style="text-align: center;margin-bottom: 0px;">
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" :loading="searching" @click="tcDiscuss(false)">确定</el-button>
        </div>
      </div>
    </div>
    <div class="vl_s_right">
      <div class="frequent-a-content">
        <ul class="tab-menu">
          <li
                  v-for="(item,index) in tabList"
                  :key="index"
                  :class="{'is-active': selectIndex === item.value}"
                  @click="selectTab(item.value)"
          >{{item.label}}</li>
        </ul>
        <!--基础信息库-->
        <template v-if="selectIndex === 2 && isBase === 1">
          <div class="vl_jig_right">
            <template v-if="strucInfoList && strucInfoList.length > 0">
              <div class="vl_jig_right_title">
                <div class="vl_jr_t_item">
                  <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
                </div>
              </div>
              <div class="vl_jfo_event">
                <vue-scroll>
                  <div class="vl_jfo_event_box clearfix">
                    <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                      <div class="vl_jfo_i_left"><img :src="item.photoUrl" alt=""></div>
                      <div class="vl_jfo_i_right">
                        <p>检索资料</p>
                        <div class="vl_jfo_line"><span>{{item.name}}</span></div>
                        <br>
                        <div class="vl_jfo_line"><span>{{item.originBank}}</span></div>
                        <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                      </div>
                    </div>
                  </div>
                </vue-scroll>
              </div>
            </template>
            <template v-else>
              <div is="noResult"></div>
            </template>
          </div>
        </template>
        <!--抓拍视图库-->
        <template v-else-if="selectIndex === 2 && isBase === 2">
          <div class="vl_jig_right">
            <template v-if="strucInfoList && strucInfoList.length > 0">
              <div class="vl_jig_right_title">
                <div class="vl_jr_t_item">
                  <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
                  <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
                </div>
                <div class="vl_jr_t_item">
                  <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
                  <div :class="{'active-item': stucOrder === 4}" @click="stucOrder = 4" style="margin-left: .1rem;">相似度排序</div>
                </div>
              </div>
              <div class="vl_jfo_event">
                <vue-scroll>
                  <div class="vl_jfo_event_box clearfix">
                    <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                      <div class="vl_jfo_i_left"><img :src="item.subStoragePath" alt=""></div>
                      <div class="vl_jfo_i_right">
                        <p>检索资料</p>
                        <div class="vl_jfo_line"><span>{{item.shotTime}}</span></div>
                        <br>
                        <div class="vl_jfo_line"><span>{{item.deviceName}}</span></div>
                        <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                      </div>
                    </div>
                  </div>
                </vue-scroll>
              </div>
            </template>
            <template v-else>
              <div is="noResult"></div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="search_box">
            <el-form :inline="true" :model="taskForm" class="event_form" ref="taskForm">
              <el-form-item label="任务名称：" prop="taskName">
                <el-input
                        style="width: 200px;"
                        type="text"
                        placeholder="请输入任务名称"
                        v-model="taskForm.taskName"
                />
              </el-form-item>
              <el-form-item label="创建时间：" prop="reportTime">
                <el-date-picker
                        v-model="taskForm.reportTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn" @click="selectDataList">查询</el-button>
                <el-button class="reset_btn" @click="resetForm('taskForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="divide"></div>
            <!--<el-button @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>-->
          </div>
          <div class="content-box">
            <div class="table_box">
              <el-table :data="list">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="相似度" show-overflow-tooltip>
                  <template slot-scope="scope">
                    ≥{{scope.row.taskWebParam.minSemblance ? scope.row.taskWebParam.minSemblance : 0}}%
                  </template>
                </el-table-column>
                <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                  <span
                          class="operation_btn"
                          @click="skipResultPage(scope.row)"
                          v-if="selectIndex === 1"
                  >查看</span>
                    <span
                            class="operation_btn"
                            @click="showInterruptDialog(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 1"
                    >中断任务</span>
                    <span
                            class="operation_btn"
                            @click="recoveryOrRestart(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"
                    >恢复任务</span>
                    <span
                            class="operation_btn"
                            @click="recoveryOrRestart(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 3"
                    >重启任务</span>
                    <span
                            class="operation_btn"
                            @click="showDeleteDialog(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus !== 4"
                    >删除任务</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <template v-if="pagination.total > 0">
            <el-pagination
                    class="cum_pagination"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.pageNum"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total"
            ></el-pagination>
          </template>
        </template>
      </div>
    </div>
    <!--历史记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
          <img :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
    <!--中断任务弹出框-->
    <el-dialog
            title="中断任务确认"
            :visible.sync="interruptDialog"
            width="482px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="dialog_comp"
    >
      <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interruptDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureInterruptTask">确认</el-button>
      </div>
    </el-dialog>

    <!--删除任务弹出框-->
    <el-dialog
      title="删除任务确认"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
    >
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清除，任务不再可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDeleteTask">确认</el-button>
      </div>
    </el-dialog>
    <!--新建任务弹出框-->
    <el-dialog
            title="新建离线任务"
            :visible.sync="addTaskDialog"
            width="482px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="dialog_comp"
    >
      <span style="color: #999999;">因数据量较大，为减少等待时间，这次分析将建立离线任务，需要在下方输入 任务名称。离线任务可以在右侧离线任务列表查看任务状态。</span>
      <el-input v-model="taskName" placeholder="请输入任务名称"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTaskDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="onConfirmAddTask">确认</el-button>
      </div>
    </el-dialog>
    <!--检索详情弹窗-->
    <el-dialog
            :visible.sync="strucDetailDialog"
            class="struc_detail_dialog_ytsr_shot"
            :close-on-click-modal="false"
            top="4vh"
            :show-close="false">
      <div class="struc_tab_shot" v-if="isBase === 2">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">检索详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_tab" v-else>
        <span>检索详情</span>
        <!--<span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>-->
        <!--<span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>-->
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main_shot" v-if="isBase === 2">
        <ul v-show="strucCurTab === 1">
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span style="line-height: 0.24rem;">抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;line-height: 0.24rem;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.personStoragePath" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
              <span>抓拍图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>分析结果<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cd_info_main">
                <vue-scroll>
                  <div class="struc_cdi_line" v-if="sturcDetail.sex">
                    <p>
                      <b>性别</b>
                      <span>{{sturcDetail.sex}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.age">
                    <p>
                      <b>年龄段</b>
                      <span>{{sturcDetail.age}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.glasses">
                    <p>
                      <b>眼镜</b>
                      <span>{{sturcDetail.glasses}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.hat">
                    <p>
                      <b>帽子</b>
                      <span>{{sturcDetail.hat}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.mask">
                    <p>
                      <b>口罩</b>
                      <span>{{sturcDetail.mask}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.hair">
                    <p>
                      <b>发型</b>
                      <span>{{sturcDetail.hair}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.upperType">
                    <p>
                      <b>上身款式</b>
                      <span>{{sturcDetail.upperType}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.upperColor">
                    <p>
                      <b>上身颜色</b>
                      <span>{{sturcDetail.upperColor}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bottomType">
                    <p>
                      <b>下身款式</b>
                      <span>{{sturcDetail.bottomType}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bottomColor">
                    <p>
                      <b>下身颜色</b>
                      <span>{{sturcDetail.bottomColor}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.baby">
                    <p>
                      <b>抱小孩</b>
                      <span>{{sturcDetail.baby}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bag">
                    <p>
                      <b>拎东西</b>
                      <span>{{sturcDetail.bag}}</span>
                    </p>
                  </div>
                </vue-scroll>
              </div>
            </div>
          </div>
          <!--跳转按钮-->
          <div class="struc_t_btn">
            <a @click="gotoControl(sturcDetail.subStoragePath)">新建布控</a>
            <a @click="gotoLjd(sturcDetail.subStoragePath)">落脚点分析</a>
            <a @click="gotoGjfx(sturcDetail.subStoragePath)">轨迹分析</a>
            <!--<a @click="gotoIden(sturcDetail.subStoragePath)">身份确认</a>-->
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box" style="float: left;" v-if="playerData">
            <div is="flvplayer" :oData="playerData"
                 :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
            </div>
          </div>
          <div class="struc_c_d_box struc_vid_empty" style="float: left;" v-else>
            <div class="struc_vid_empty_c com_trans50_lt">
              <div></div>
              <p>暂无视频</p>
            </div>
          </div>
          <p class="download_tips" v-show="sturcDetail.videoPath">下载提示：右键点击视频选择“另存视频为”即可下载视频。</p>
        </div>
      </div>
      <div class="struc_main" v-else>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img  class="bigImg" :src="sturcDetail.upPhotoUrl" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="sturcDetail.photoUrl" alt="">
              <span>底库图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>{{sturcDetail.name}}<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span v-show="sturcDetail.sex">{{sturcDetail.sex}}</span>
                <span v-show="sturcDetail.nation">{{sturcDetail.nation}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.birthDate}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.idNo}}<i class="el-icon-postcard"></i></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.group">
                <span>{{sturcDetail.group}}</span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>布控库信息</span>
          </div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <template v-if="isBase === 2">
                <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.personStoragePath" alt="">
                <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.subStoragePath" alt="">
              </template>
              <template v-else>
                <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.upPhotoUrl" alt="">
                <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.photoUrl" alt="">
              </template>
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
  </div>
</template>
<script>
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import { PortraitPostByphotoTask, PortraitPostByphotoRealtime, PortraitGetDispatch } from '@/views/index/api/api.portrait.js';
  import { ScpGETdeviceListById, ScpGETretrievalHisById} from '../../api/api.search.js';
  import {JtcPUTAppendixsOrder, JtcPOSTAppendixInfo, JtcGETAppendixInfoList,  getShotDevice, getTailBehindList } from '../../api/api.judge'
  import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
  import {getGroups} from '../../api/api.judge.js';
  import noResult from '@/components/common/noResult.vue';
  import flvplayer from '@/components/common/flvplayer.vue';
  import { ajaxCtx, mapXupuxian } from '@/config/config.js';
  import { MapGETmonitorList } from "@/views/index/api/api.map.js";
  import { objDeepCopy, formatDate } from "@/utils/util.js";
  export default {
    components: {vlBreadcrumb, noResult, flvplayer},
    data() {
      return {
        map: null,
        playerData: null,
        isBase: 1,
        radio: "1",
        cameraTree: [],
        videoTreeNodeCount: 0, // 摄像头节点数量
        bayonetTreeNodeCount: 0, // 卡口节点数量
        defaultProps: {
          children: "children",
          label: "label"
        },
        messageDevTip: "",
        isDeviceTrue: false,
        isIndeterminate: false, // 是否处于全选与全不选之间
        checkAllTree: true, // 树是否全选
        portraitGroupList: [],
        treeTabShow: false,
        selectDeviceArr: [], // 选中的设备数组
        selectCameraArr: [], // 选中的摄像头数组
        selectBayonetArr: [], // 选中的卡口数组
        tabList: [
          {
            label: "已完成任务",
            value: 1
          },
          {
            label: "未完成任务",
            value: 0
          },
          {
            label: "查询结果",
            value: 2
          }
        ],
        selectIndex: 1, // 默认已完成的任务
        pagination: { total: 0, pageSize: 10, pageNum: 1 },
        taskForm: {
          startTime: '',
          endTime: '',
          taskName: null // 任务名称
        },
        list: [], //已完成列表
        taskId: null, // 任务id
        deleteDialog: false,
        isDeleteLoading: false,
        interruptDialog: false, //中断任务
        addTaskDialog: false,
        isAddLoading: false,
        taskName: '', // 左侧输入任务名称
        taskType: "1", // 左侧任务类型，1 实时，2离线
        addParams: {},
        uploading: false,
        uploadAcion: ajaxCtx.base + '/new',
        searching: false,
        curImageUrl: '', // 当前上传的图片
        imgList: '',
        historyPicDialog: false,
        historyPicList: [], // 上传历史记录
        loadingHis: false,
        searchData: {
          minSemblance: 85, // 最小相似度
          portraitGroupId: [],
          startTime: '',
          endTime: ''
        },
        stucOrder: 4, // 1升序，2降序，3监控，4相似度
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
        devicePinYin: 'abcdefghijklmnopqrstuvwxyz',
        videoUrl: '', // 弹窗视频回放里的视频
        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 5,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        }
      }
    },
    computed: {
      choosedHisPic () {
        return this.historyPicList.filter(x => x.checked)
      }
    },
    mounted () {
      // 弹窗地图
      let supMap = new AMap.Map('capMap', {
        center: mapXupuxian.center,
        zoom: 16
      });
      supMap.setMapStyle('amap://styles/whitesmoke');
      this.map = supMap;
      if (this.$route.query.imgurl) {
        let x = {
          contentUid: this.$store.state.loginUser.uid,
          cname: '带图' + Math.random(),
          filePathName: '带图' + Math.random(),
          path: this.$route.query.imgurl
        }
        JtcPOSTAppendixInfo(x).then(jRes => {
          if (jRes) {
            x['uid'] = jRes.data;
            console.log(x);
          }
        })
        this.imgList = x;
        this.curImageUrl = x.path;
      }
      // 获取人员组，跟车辆组列表
      getGroups({groupType: 4}).then(res => {
        if (res) {
          this.portraitGroupList = res.data;
          // 去除默认选中
//          this.searchData.portraitGroupId = this.portraitGroupList.map(x => {
//            return x.uid
//          })
        }
      })
      this.getMonitorList();
      this.getDataList();
      this.setDTime();
    },
    methods: {
      // 设置视频数据
      setPlayerData () {
        if (this.sturcDetail.videoPath) {
          this.playerData = {
            type: 3,
            title: this.sturcDetail.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: this.sturcDetail.videoPath
            }
          }
        } else {
          this.playerData = null;
        }
      },
      // 重置查询条件
      resetForm (form) {
        this.$refs[form].resetFields();
        this.getDataList();
      },
      chooseEndTime (e) {
        if (e < this.searchData.startTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      chooseStartTime (e) {
        if (e > this.searchData.endTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      setDTime() {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let _sDate = new Date(curDate - curS);
        let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
        this.searchData.startTime = new Date(_s).getTime();
        this.searchData.endTime = curDate;
      },
      //获取摄像头卡口信息列表
      getMonitorList() {
        let params = {
          areaUid: mapXupuxian.adcode
        };
        MapGETmonitorList(params).then(res => {
          if (res && res.data) {
            let camera = objDeepCopy(res.data.areaTreeList);
            /* let bayonet = objDeepCopy(res.data.areaTreeList); */
            this.cameraTree = this.getTreeList(camera);
            /* this.bayonetTree = this.getBayTreeList(bayonet); */
            this.getLeafCountTree(this.cameraTree);
            /* this.getLeafCountTree(this.cameraTree, 'camera');
            this.getLeafCountTree(this.bayonetTree, 'bayonet'); */
            this.$nextTick(() => {
              this.checkAllTree = true;
              this.handleCheckedAll(true);
            });
          }
        });
      },
      //获取摄像头数据
      getTreeList(data) {
        for (let item of data) {
          item["id"] = item.areaId;
          item["label"] = item.areaName;
          let children = [],
              deviceBasic = [],
              bayonet = [];
          if (item.deviceBasicList && item.deviceBasicList.length > 0) {
            deviceBasic = item.deviceBasicList;
            for (let key of deviceBasic) {
              key["label"] = key.deviceName;
              key["id"] = key.uid;
              key["treeType"] = 1;
            }
            delete item.deviceBasicList;
          }
          if (item.bayonetList && item.bayonetList.length > 0) {
            bayonet = item.bayonetList;
            for (let key of bayonet) {
              key["label"] = key.bayonetName;
              key["id"] = key.uid;
              key["treeType"] = 2;
            }
            delete item.bayonetList;
          }
          children.push(...deviceBasic, ...bayonet);
          item["children"] = children;
        }
        return data;
      },
      //获取卡口数据
      // tab的方法
      chooseDevice() {
        // 选择了树的设备
        this.treeTabShow = false;
        if(this.selectDeviceArr &&
            this.selectDeviceArr.length > 0) {
          this.isDeviceTrue = false;
          this.messageDevTip = "";
        }else {
          this.isDeviceTrue = true;
          this.messageDevTip = "请选择设备";
        }
      },
      // 处理摄像头树全选时间
      handleCheckedAll(val) {
        this.isIndeterminate = false;
        if (val) {
          this.$refs.cameraTree.setCheckedNodes(this.cameraTree);
        } else {
          this.$refs.cameraTree.setCheckedNodes([]);
        }
        this.selectDeviceArr = this.$refs.cameraTree.getCheckedNodes(true);
        this.handleData();
      },
      getLeafCountTree(json) {
        // 获取树节点的数量
        for (let i = 0; i < json.length; i++) {
          if (json[i].hasOwnProperty("id")) {
            this.videoTreeNodeCount++;
          }
          if (json[i].hasOwnProperty("children")) {
            this.getLeafCountTree(json[i].children);
          } else {
            continue;
          }
        }
        console.log('videoTreeNodeCount', this.videoTreeNodeCount)
      },
      //摄像头
      listenChecked(val, val1) {
        this.selectDeviceArr = this.$refs.cameraTree.getCheckedNodes(true);
        this.handleData();
        if (val1.checkedNodes.length === this.videoTreeNodeCount) {
          this.isIndeterminate = false;
          this.checkAllTree = true;
        } else if (
            val1.checkedNodes.length < this.videoTreeNodeCount &&
            val1.checkedNodes.length > 0
        ) {
          this.checkAllTree = false;
          this.isIndeterminate = true;
        } else if (val1.checkedNodes.length === 0) {
          this.checkAllTree = false;
          this.isIndeterminate = false;
        }
      },
      // 选中的设备数量处理
      handleData() {
        /* this.selectDeviceArr = [...this.selectCameraArr, ...this.selectBayonetArr].filter(key => key.treeType); */
        this.selectDeviceArr = [...this.selectDeviceArr].filter(
            key => key.treeType
        );
        this.selectCameraArr = [...this.selectDeviceArr].filter(
            key => key.treeType === 1
        );
        this.selectBayonetArr = [...this.selectDeviceArr].filter(
            key => key.treeType === 2
        );
        console.log(
            "选中的数据",
            this.selectDeviceArr,
            this.selectBayonetArr,
            this.selectCameraArr
        );
      },
      drag (ev) {
        ev.dataTransfer.setData("Text",ev.target.currentSrc);
      },
      drop (e) {
        let x = {
          contentUid: this.$store.state.loginUser.uid,
          cname: '拖拽图片' + Math.random(),
          filePathName: '拖拽图片' + Math.random(),
          path: e.dataTransfer.getData("Text")
        }
        JtcPOSTAppendixInfo(x).then(jRes => {
          if (jRes) {
            x['uid'] = jRes.data;
            console.log(x);
          }
        })
        this.imgList = x;
        this.curImageUrl = x.path;
      },
      allowDrop (e) {
        e.preventDefault();
      },
      // 上传图片
      uploadPicExceed () {
        this.$message.warning('当前限制选择 3 个文件，请删除后再上传！');
      },
      beforeAvatarUpload (file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt = file.size / 1024 / 1024 < 100;
        if (!isJPG) {
          this.$message.error('只能上传 JPG / PNG 格式图片!');
        }
        if (!isLt) {
          this.$message.error('上传图片大小不能超过 100MB!');
        }
        this.uploading = true;
        return isJPG && isLt;
      },
      uploadSucess (response, file, fileList) {
        this.uploading = false;
        if (response && response.data) {
          let oRes = response.data;
          if (oRes) {
            let x = {
              cname: oRes.fileName, // 附件名称 ,
              contentUid: this.$store.state.loginUser.uid,
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
            JtcPOSTAppendixInfo(x).then(jRes => {
              if (jRes) {
                x['uid'] = jRes.data;
                console.log(x);
              }
            })
            this.imgList = x;
            this.curImageUrl = x.path;
          }
        }
        console.log(fileList)
      },
      // 获取离线任务
      getDataList () {
        const params = {
          'where.taskName': this.taskForm.taskName,
          'where.taskType': 4, //  1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 4:以图搜人 9：人员侦查报告
          'where.startTime': this.taskForm.reportTime ? this.taskForm.reportTime[0] : null,
          'where.endTime': this.taskForm.reportTime ? this.taskForm.reportTime[1] : null,
          'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          order: 'desc',
          orderBy: 'create_time'
        };
        getTaskInfosPage(params)
            .then(res => {
              if (res) {
                res.data.list.forEach(item => {
                  this.$set(item, 'taskWebParam', JSON.parse(item.taskWebParam))
                })
                this.list = res.data.list;
                this.pagination.total = res.data.total;
              }
            })
            .catch(() => {})
      },
      //tab切换
      selectTab (val) {
        this.selectIndex = val;
        if(parseFloat(val) < 2) {
          this.getDataList();
        }
      },
      skipResultPage (obj) {
        if (obj.taskWebParam.origin === 1) {
          this.$router.push({name: 'portrait_ytsr', query: {uid: obj.uid}})
        } else {
          this.$router.push({name: 'portrait_ytsr_shot', query: {uid: obj.uid}})
        }
      },
      // 显示中断任务弹出框
      showInterruptDialog (obj) {
        this.interruptDialog = true;
        this.taskId = obj.uid;
      },
      // 显示删除任务弹出框
      showDeleteDialog (obj) {
        this.deleteDialog = true;
        this.taskId = obj.uid;
      },
      // 确认中断任务
      sureInterruptTask () {
        if (this.taskId) {
          const params = {
            uid: this.taskId,
            taskType: 4, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
            taskStatus: 4 // 1：处理中 2：处理成功 3：处理失败 4：处理中断
          };
          this.isInterruptLoading = true;
          putAnalysisTask(params)
              .then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '中断任务成功',
                    customClass: 'request_tip'
                  });
                  this.interruptDialog = false;
                  this.isInterruptLoading = false;
                  this.getDataList();
                } else {
                  this.isInterruptLoading = false;
                }
              })
              .catch(() => {this.isInterruptLoading = false;})
        }
      },
      // 确认删除任务
      sureDeleteTask () {
        if (this.taskId) {
          const params = {
            uid: this.taskId,
            taskType: 4, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
            delFlag: true
          };
          this.isDeleteLoading = true;
          putAnalysisTask(params)
              .then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '删除任务成功',
                    customClass: 'request_tip'
                  });
                  this.deleteDialog = false;
                  this.isDeleteLoading = false;
                  this.getDataList();
                } else {
                  this.isDeleteLoading = false;
                }
              })
              .catch(() => {this.isDeleteLoading = false;})
        }
      },
      //恢复任务,重启任务
      recoveryOrRestart(obj) {
        putTaskInfosResume(obj.uid).then(res => {
          console.log(res)
          if(res) {
            this.getDataList();
          }
        }).catch(() => {})
      },
      // 查询任务列表数据
      selectDataList () {
        this.getDataList();
      },
      handleError () {
        this.uploading = false;
        this.$message.error('上传失败')
      },
      showHistoryPic () {
        this.loadingHis = true;
        this.historyPicDialog = true;
        let params = {
          userId: this.$store.state.loginUser.uid,
          fileType: 1
        }
        JtcGETAppendixInfoList(params).then(res => {
          if (res) {
            this.loadingHis = false;
            res.data.forEach(x => x.checked = false);
            this.historyPicList = res.data;
          }
        }).catch(() => {
          this.historyPicDialog = false;
        })
      },
      chooseHisPic (item) {
        this.historyPicList.forEach(x => x.checked = false)
        item.checked = true;
      },
      addHisToImg () {
        this.historyPicDialog = false;
        let _ids = [];
        this.choosedHisPic.forEach(x => {
          _ids.push(x.uid)
          this.imgList = x;
          this.curImageUrl = x.path;
        })
        let _obj = {
          appendixInfoIds: _ids.join(',')
        }
        JtcPUTAppendixsOrder(_obj);
      },
      resetSearch () {
        this.taskName = '';
        this.searchData.minSemblance = 85;
        this.imgList = '';
        this.curImageUrl = '';
        this.radio = '1';
        this.searchData.portraitGroupId = this.portraitGroupList.map(x => {
          return x.uid
        })
        this.$nextTick(() => {
          this.checkAllTree = true;
          this.handleCheckedAll(true);
        });
        this.setDTime();
      },
      tcDiscuss (boolean) {
        let p1 = {
          origin: this.radio,
        };
        let params = {
          origin: this.radio,
        }
        if (!this.imgList) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请上传图片')
          }
          return false;
        } else {
          params['appendixIds'] = this.imgList.uid;
          params['uploadImgUrls'] = this.imgList.path;
        }
        if (this.searchData.minSemblance) {
          params['minSemblance'] = this.searchData.minSemblance;
        } else {
          params['minSemblance'] = 0;
        }
        if (this.radio === '1') {
          p1['portraitGroupId'] = this.searchData.portraitGroupId.join(',');
          params['portraitGroupId'] = this.searchData.portraitGroupId.join(',');
          let pNameList = []
          this.searchData.portraitGroupId.forEach(x => {
            pNameList.push(this.portraitGroupList.find(y => y.uid === x).groupName)
          })
          params['portraitGroupName'] = pNameList;
        } else {
          let dNameList = [];
          let dList = this.selectCameraArr.map(res =>  res.deviceName);
          let bList = this.selectBayonetArr.map(res => res.bayonetName);
          dNameList = dList.concat(bList);
          if (dNameList.length > 3) {
            params['deviceNames'] = dNameList.splice(0, 2);
            params['deviceNames'].push('等' + dNameList.length + '个设备');
            params['deviceNames'] =  params['deviceNames'].join(',')
          } else {
            params['deviceNames'] = dNameList.join(',')
          }
          p1['deviceIds'] = this.selectCameraArr.map(res => res.id).join(',');
          params['deviceIds'] = this.selectCameraArr.map(res => res.id).join(',');
          p1['bayonetIds'] = this.selectBayonetArr.map(res => res.id).join(',');
          params['bayonetIds'] = this.selectBayonetArr.map(res => res.id).join(',');
          p1['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
          params['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
          p1['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
          params['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
        }
        if (!boolean) {
          this.searching = true;
        }
        // 判断选择的是实时还是离线 taskType 1为实时，2为离线.
        if (this.taskType === "1") {
          this.searching = true;
          PortraitPostByphotoRealtime(params)
              .then(sRes => {
                this.searching = false;
                if (sRes) {
                  this.selectIndex = 2;
                  this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
                  this.strucInfoList = sRes.data.taskResult;
                  if (this.radio === "1") {
                    this.isBase = 1;
                  } else {
                    this.isBase = 2;
                    this.changeOrder();
                  }
                } else {
                  this.strucInfoList = [];
                  this.$message.info('抱歉，没有找到匹配结果');
                }
              })
        } else {
          if (!this.taskName.replace(/\s+|\s+$/g, '')) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('任务名称不能为空');
              return false;
            }
          } else {
            this.searching = true;
            params.taskName = this.taskName;
            PortraitPostByphotoTask(params).then(res => {
              this.searching = false;
              this.resetSearch();
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                })
                this.getDataList()
                console.log(res.data)
              }
            })
          }
        }
//        PortraitGetDispatch(p1)
//            .then(res => {
//              if (res) {
//                if (res.data === 1) {
//                  this.searching = false;
//                  this.addParams = params;
//                  this.addTaskDialog = true;
//                } else if (res.data === 2) {
//                  PortraitPostByphotoRealtime(params)
//                      .then(sRes => {
//                        this.searching = false;
//                        if (sRes) {
//                          this.selectIndex = 2;
//                          this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
//                          this.strucInfoList = sRes.data.taskResult;
//                          if (this.radio === "1") {
//                            this.isBase = 1;
//                          } else {
//                            this.isBase = 2;
//                            this.changeOrder();
//                          }
//                        }
//                      })
//                } else {
//                  this.searching = false;
//                  this.$message.info('抱歉，没有找到匹配结果');
//                }
//              } else {
//                this.searching = false;
//              }
//            })
      },
      onConfirmAddTask () {
        if (!this.taskName.replace(/\s+|\s+$/g, '')) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('任务名称不能为空');
            return false;
          }
        }
        this.addParams.taskName = this.taskName;
        this.isAddLoading = true;
        PortraitPostByphotoTask(this.addParams).then(res => {
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '新建成功',
              customClass: 'request_tip'
            })
            this.isAddLoading = false
            this.addTaskDialog = false
            this.getDataList()
            console.log(res.data)
          } else {
            this.isAddLoading = false;
          }
        }).catch(() => {this.isAddLoading = false})
      },
      handleCurrentChange (e) {
        this.pagination.pageNum = e;
        this.getDataList();
      },
      delPic () {
        this.curImageUrl = '';
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      changeOrder () {
        console.log(this.stucOrder);
        switch (this.stucOrder) {
          case 1:
            this.strucInfoList.sort((a, b) => {
              return new Date(b.shotTime).getTime() - new Date(a.shotTime).getTime();
            })
            break;
          case 2:
            this.strucInfoList.sort((a, b) => {
              return new Date(a.shotTime).getTime() - new Date(b.shotTime).getTime();
            })
            break;
          case 3:
            this.strucInfoList.sort((a, b) => {
              return this.devicePinYin.indexOf(b.deviceNamePinyin.toLowerCase()[0]) - this.devicePinYin.indexOf(a.deviceNamePinyin.toLowerCase()[0]);
            })
            break;
          case 4:
            this.strucInfoList.sort((a, b) => {
              return b.semblance - a.semblance;
            })
            break;
        }
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
        if (this.isBase === 2) {
          this.drawPoint(data);
          this.setPlayerData();
        }
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new AMap.InfoWindow({
          map: this.map,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        if (this.isBase === 2) {
          this.drawPoint(data);
          this.setPlayerData();
        }
      },
    },
    watch: {
      stucOrder () {
        this.changeOrder();
      }
    }
  }
</script>
<style lang="scss" scoped="scoped">
  // 关闭设备tab
  .selected_device_comp {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: 0;
    z-index: 10;
  }
  .device-comp {
    .error-tip {
      margin-top: -10px;
      margin-bottom: 10px;
    }
  }
  // 选择设备下拉
  .selected_device {
    margin-bottom: 10px;
    position: relative;
    width: 232px;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding-left: 12px;
    > i {
      position: absolute;
      right: 12px;
      top: 13px;
    }
    &:hover,
    &:focus {
      border-color: #0c70f8;
      cursor: pointer;
    }
    .device_list {
      line-height: 40px;
      font-size: 14px;
      color: #333;
      .device_count {
        color: #0c70f8;
        margin-left: 20px;
      }
    }
    .no_device {
      line-height: 40px;
      color: #999999;
    }
    // 树tab
    .device_tree_tab {
      position: absolute;
      top: 50px;
      left: -1px;
      z-index: 100;
      background: #fff;
      width: 232px;
      height: 350px;
      border-radius: 4px;
      border: 1px solid #d3d3d3;
      .tab_title {
        width: 50%;
        float: left;
        background: #f2f2f2;
        text-align: center;
        color: #666666;
        line-height: 30px;
        font-size: 12px;
      }
      .current_title {
        background: #fff;
      }
      // 树
      .tree_content {
        height: 310px;
        padding-top: 10px;
        .checked_all {
          padding: 0 0 8px 23px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
  .camera-select {
    .el-select-dropdown {
      display: none;
    }
    .el-select__tags {
      >span {
        white-space: nowrap;
        display: block;
        width: 100%;
        overflow: hidden;
      }
    }
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
  .vl_judge_tc_ytsr {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 272px;
      /*padding-top: 20px;*/
      height: calc(100% - 50px);
      min-height: 790px;
      background: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #D3D3D3;
        padding-bottom: 30px;
        margin-bottom: 30px;
        .vl_judge_tc_c_item {
          width: 238px;
          height: 238px;
          display: inline-block;
          position: relative;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
          cursor: pointer;
          background: #f2f2f2;
          span {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 119px;
            line-height: 119px;
            color: #999;
          }
          &:hover span {
            color: #fff;
          }
          .del_icon {
            display: none;
            position: absolute;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: rgba(0, 0, 0, 0.4);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            color: #ffffff;
          }
          &:first-child {
            margin-right: .15rem;
          }
          &:last-child {
            margin-left: .15rem;
          }
          &:hover {
            background: #2981F8;
            >p {
              display: block;
            }
            .del_icon {
              display: block;
            }
          }
          .vl_jtc_upload_ytsr {
            width: 100%;
            height: 100%;
            background: none;
            .el-upload--picture-card {
              border: none;
            }
            .el-upload {
              width: 100%;
              height: 100%;
              background: none;
              line-height: 238px;
              img {
                width: 100%;
                height: 100%;
                -webkit-border-radius: 10px;
                -moz-border-radius: 10px;
                border-radius: 10px;
              }
            }
          }
          >p {
            display: none;
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
            color: #FFFFFF;
            height: 40px;
            line-height: 40px;
            -webkit-border-radius: 0 0 10px 10px;
            -moz-border-radius: 0 0 10px 10px;
            border-radius: 0 0 10px 10px;
            background: #0C70F8;
          }
          .vl_jtc_ic_input {
            position: absolute;
            top: .2rem;
            width: 3rem;
            height: .26rem;
            left: .2rem;
            border: 1px solid #D3D3D3;
            -webkit-border-radius: .13rem;
            -moz-border-radius: .13rem;
            border-radius: .13rem;
            padding: 0 .02rem;
            background: #FFFFFF;
            .el-form-item__content {
              height: .23rem;
              line-height: .23rem;
            }
            input {
              border: none!important;
              height: .23rem;
              line-height: .23rem;
            }
          }
          .del_icon {
            display: none;
            position: absolute;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: rgba(0, 0, 0, .4);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            color: #FFFFFF;
          }
        }
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 30px 0 20px 0;
        .el-input__inner {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-input__icon {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-range-editor {
          width: 100%;
          /*padding: 0;*/
          > .el-range__close-icon {
            display: none;
          }
          > input {
            width: 50%;
          }
          /*.el-range-separator {*/
          /*height: 40px;*/
          /*line-height: 40px;*/
          /*width: 10px;*/
          /*padding: 0;*/
          /*}*/
        }
        button {
          width: 110px;
          height: 40px;
          line-height: 40px;
          padding: 0 12px;
        }
        .el-select {
          margin-bottom: 10px;
        }
        > div {
          margin-bottom: 10px;
        }
        .vl_jtc_search_item {
          height: 217px;
          .camera-tree {
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            -webkit-box-sizing: border-box;
          }
        }
      }
      .ytsr_left_radio {
        padding-left: 20px;
        margin: 20px 0;
        display: flex;
        height: 40px;
        >span {
          display: block;
          &:first-child {
            width: 90px;
            line-height: 40px;
          }
        }
      }
      .ytsr_left_search {
        margin-left: 20px;
        width: 232px;
        .el-select {
          width: 100%;
        }
        .left_time {
          width: 100%;
          margin: 20px 0;
          .el-date-editor {
            width: 100%;
          }
          .el-range__close-icon {
            display: none;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 60px);
      position: relative;
      .frequent-a-content {
        height: calc(100% - 20px);
        min-height: 760px;
        margin: 20px;
        margin-bottom: 0px;
        background: #ffffff;
        box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
        .tab-menu {
          background-color: #fff;
          padding-top: 8px;
          overflow: hidden;
          border-bottom: 1px solid #f2f2f2;
          li {
            float: left;
            width: auto;
            font-size: 16px;
            margin: 0 20px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            color: #333;
            cursor: pointer;
          }
          .is-active {
            color: #0c70f8;
            border-bottom: 2px solid #0c70f8;
          }
        }
        .search_box {
          width: 100%;
          padding: 20px;
          .event_form {
            width: 100%;
            .select_btn,
            .reset_btn {
              width: 80px;
            }
            .select_btn {
              background-color: #0c70f8;
              color: #ffffff;
            }
            .reset_btn {
              background-color: #ffffff;
              color: #666666;
              border-color: #dddddd;
            }
          }
          .divide {
            border: 1px dashed #fafafa;
          }
        }
        .content-box {
          padding: 0 20px;
          .table_box {
            margin-top: 10px;
            .operation_btn {
              display: inline-block;
              padding: 0 10px;
              border-right: 1px solid #f2f2f2;
              &:last-child {
                border-right: none;
              }
            }
          }
        }
        .vl_jig_right {
          width: 100%;
          height: calc(100% - 50px);
          padding: 0 20px;
          padding-right: 0;
          .vl_jig_right_title {
            width: 100%;
            height: 70px;
            line-height: 70px;
            color: #999999;
            .vl_jr_t_item {
              float: left;
              width: 50%;
              text-align: left;
              padding-left: 10px;
              >div {
                cursor: pointer;
                display: inline-block;
              }
              .active-item {
                color: #2580FC;
                i {
                  color: #999999;
                }
                .active {
                  color: #2580FC;
                }
              }
              &:first-child {
                padding-right: 10px;
                padding-left: 0;
                >div {
                  float: right;
                  span {
                    display: inline-block;
                    vertical-align: middle;
                    i {
                      display: block;
                      font-size: 10px;
                    }
                  }
                }
              }
            }
          }
          .vl_jfo_event {
            height: calc(100% - 159px);
            min-height: 598px;
            .vl_jfo_event_box {
              width: 100%;
              height: auto;
              .vl_jfo_box_item {
                float: left;
                cursor: pointer;
                width: 387px;
                height: 203px;
                padding: 20px;
                margin-right: 20px;
                margin-bottom: 20px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
                .vl_jfo_i_left {
                  float: left;
                  width: 163px;
                  height: 163px;
                  >img {
                    width: 100%;
                    height: 100%;
                  }
                }
                .vl_jfo_i_right {
                  width: calc(100% - 163px);
                  height: 100%;
                  margin-left: 163px;
                  padding-left: 10px;
                  >p {
                    color: #999999;
                    margin-bottom: 13px;
                  }
                  .vl_jfo_line {
                    position: relative;
                    max-width: 100%;
                    display: inline-block;
                    height: 28px;
                    line-height: 28px;
                    margin-bottom: 8px;
                    border: 1px solid #F2F2F2;
                    background: #FAFAFA;
                    color: #333333;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    border-radius:3px;
                    font-size: 12px;
                    overflow: hidden;
                    padding-right: 4px;
                    > i {
                      vertical-align: middle;
                    }
                    span {
                      padding: 0 4px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .vl_jfo_sim {
      color: #0C70F8;
      font-weight: bold;
      font-size: 24px;
      margin-top: -4px;
      i {
        vertical-align: text-top;
        margin-right: 10px;
      }
      span {
        font-weight: normal;
      }
    }
    .vl_j_fullscreen {
      position: fixed;
      width: 100%!important;
      height: 100%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #000000;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      > video {
        width: 100%;
        height: 100%;
      }
      > .control_bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48px;
        background: rgba(0, 0, 0, .65);
        > div {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 48px;
          text-align: right;
          padding-right: 20px;
          color: #FFFFFF;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
          > span {
            display: inline-block;
            height: 22px;
            margin-left: 10px;
            vertical-align: middle;
            cursor: pointer;
            a {
              font-size: 25px;
              text-decoration: none;
              color: #ffffff;
              vertical-align: top;
            }
          }
        }
      }
    }
    .vl_j_cutscreen {
      position: fixed;
      width: 90%!important;
      height: 90%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #FFFFFF;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      padding: 20px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
      }
      > p {
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding-left: .06rem;
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: .08rem;
        right: .08rem;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .struc_detail_dialog_ytsr_shot {
      .el-dialog {
        max-width: 13.06rem;
        width: 100%!important;
        /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
        transform: none !important;
        top: calc(100% - 8.8rem);
        left: calc((100% - 13.06rem)/2);
      }
      .el-dialog__header {
        display: none;
      }
      .struc_tab_shot {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #333333;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main_shot {
        width: 11.46rem;
        height: 5rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              top: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: rgba(255, 255, 255, .8);
              border-radius: .13rem;
              font-style: normal;
              color: #0C70F8;
              font-size: 12px;
              padding: 0 .1rem;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cd_info_main {
                height: 2.75rem;
              }
              .struc_cdi_line {
                flex: none;
                width: 50%;
                display: inline-block;
                p {
                  max-width: 100%;
                  overflow: hidden;
                  display: table;
                  min-height: 30px;
                  margin-bottom: 0.08rem;
                  padding-right: 10px;
                  margin-right: 0.08rem;
                  border: 1px solid #f2f2f2;
                  border-radius: 3px;
                  font-size: 12px;
                  > b {
                    width: 70px;
                    background: #fafafa;
                    color: #999;
                    font-weight: normal;
                    padding-right: 10px;
                    padding-left: 10px;
                    display: table-cell;
                    vertical-align: middle;
                    border-right: 1px solid #f2f2f2;
                  }
                  >span {
                    display: table-cell;
                    vertical-align: middle;
                    padding-left: 5px;
                  }
                }
              }
            }
            &:before {
              display: block;
              content: none!important;
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: none!important;
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
          .struc_t_btn {
            margin-top: .2rem;
            float: right;
            a {
              display: inline-block;
              text-align: center;
              line-height: .38rem;
              border: solid 1px #eeeeee;
              border-radius: 4px;
              margin-top: 10px;
              padding: 0px .15rem;
              text-decoration: none;
              margin-left: 10px;
              background: rgba(246, 248, 249, 1);
              border: 1px solid rgba(211, 211, 211, 1);
              cursor: pointer;
            }
            a:hover {
              background: #0c70f8;
              border: solid 1px #0c70f8;
              color: #ffffff;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
          }
        }
        .struc_c_video {
          .download_tips {
            float: left;
            width: 100%;
            text-align: right;
            padding-right: 40px; padding-top: 10px;
          }
          .struc_c_d_box {
            background: #E9E7E8;
            height: 100%;
            text-align: center;
            &:hover {
              .play_btn {
                display: block!important;
              }
            }
            .play_btn {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background: rgba(0, 0, 0, .4);
              width: 1rem;
              height: 1rem;
              text-align: center;
              line-height: 1rem;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              cursor: pointer;
              i {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                height: 22px!important;
              }
            }
            >video {
              width: auto;
              height: 100%;
            }
            &:after {
              content: none!important;
            }
            &:before {
              content: none!important;
            }
            -webkit-box-shadow: 0 0 0!important;
            -moz-box-shadow: 0 0 0!important;
            box-shadow: 0 0 0!important;
          }
          .download_btn {
            text-align: center;
            width: 1.1rem;
            height: .4rem;
            float: right!important;
            margin-top: .2rem;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
            position: relative;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
            a {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .struc_tab {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #333333;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main {
        width: 11.46rem;
        height: 4.4rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              top: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: rgba(255, 255, 255, .8);
              border-radius: .13rem;
              font-style: normal;
              color: #0C70F8;
              font-size: 12px;
              padding: 0 .1rem;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cdi_line {
                >span {
                  /*position: relative;*/
                  max-width: 100%;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding: 0 .1rem;
                  margin-right: .08rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                  font {
                    color: #999999;
                    margin-left: 20px;
                  }
                }
                p {
                  color: #999999;
                }
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
          }
        }
        .struc_c_video {
          .struc_c_d_box {
            background: #E9E7E8;
            height: 100%;
            text-align: center;
            &:hover {
              .play_btn {
                display: block!important;
              }
            }
            .play_btn {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background: rgba(0, 0, 0, .4);
              width: 1rem;
              height: 1rem;
              text-align: center;
              line-height: 1rem;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              cursor: pointer;
              i {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                height: 22px!important;
              }
            }
            >video {
              width: auto;
              height: 100%;
            }
            &:after {
              content: none!important;
            }
            &:before {
              content: none!important;
            }
            -webkit-box-shadow: 0 0 0!important;
            -moz-box-shadow: 0 0 0!important;
            box-shadow: 0 0 0!important;
          }
          .download_btn {
            text-align: center;
            width: 1.1rem;
            height: .4rem;
            float: right!important;
            margin-top: .2rem;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
            position: relative;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
            a {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .struc-list {
        width: 12.46rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            left: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          .swiper-button-next {
            right:  0;
          }
          .swiper-button-prev {
            left: 0;
          }
          .swiper-slide {
            .swiper_img_item {
              cursor: pointer;
              border: 1px solid #FFFFFF;
              padding: 2px;
              img {
                width: 100%;
                height: 100%;
              }
              .vl_jfo_sim {
                font-size: .14rem;
                height: .3rem;
                margin-top: 0;
                /*display: inline-block;*/
                white-space: nowrap;
                text-align: center;
                color: #999999;
                i {
                  margin-right: 0;
                }
              }
            }
            .active {
              border-color: #0C70F8;
              box-shadow: inset 0px 3px 3px #c8c8c8;
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
  }
  .per_semblance_ytsr {
    position: relative;
    padding-left: 20px;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
      color: #999999;
      width: 79px;
      padding-left: 12px;
    }
    >i {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #999;
      margin: 19px 16px;
      vertical-align: middle;
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
      input{
        text-indent: 69px;
      }
    }
  }
</style>