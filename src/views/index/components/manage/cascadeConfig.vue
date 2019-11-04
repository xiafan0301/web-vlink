<template>
  <div class="vl_manage_cascade">
    <div class="vl_m_bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'manage' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>级联配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="vl_m_content" v-if="!showUpdate">
      <vue-scroll>
        <div class="vl_m_c_main">
          <div class="vl_m_c_box">
            <!--级联方式列，先固定写死，后端没有做处理的-->
            <div class="vl_mc_box_h">
              <div class="vl_inline_block">
                <p class="vl_color_666"><span class="vl_color_333">级联方式：</span>端口映射</p>
              </div>
              <div class="vl_inline_block">
                <p class="vl_color_666"><span class="vl_color_333">级联渠道：</span>无</p>
              </div>
            </div>
            <div class="vl_mc_box_list">
              <div class="vl_top_line vl_mc_box_item" v-for="item in upperCascade" :key="item.id">
                <div class="vl_inline_block">
                  <p>上级：名称</p>
                  <p>{{item.cascadeName}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>IP</p>
                  <p>{{item.ipAddress}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>端口</p>
                  <p>{{item.ipPort}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>设备区域代码</p>
                  <p>{{item.placeCode}}</p>
                </div>
              </div>
              <div class="vl_top_line vl_mc_box_item" v-for="item in localCascade" :key="item.id">
                <div class="vl_inline_block">
                  <p>本级：名称</p>
                  <p>{{item.cascadeName}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>IP</p>
                  <p>{{item.ipAddress}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>端口</p>
                  <p>{{item.ipPort}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>设备区域代码</p>
                  <p>{{item.placeCode}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="vl_m_c_box">
            <div class="vl_mc_box_h">
              <div class="vl_inline_block">
                <p class="vl_color_333">下级列表</p>
              </div>
            </div>
            <div class="vl_mc_box_list">
              <div class="vl_top_line vl_mc_box_item" v-for="(item, index) in lowerCascade" :key="item.id">
                <div class="vl_inline_block">
                  <p>{{index + 1}}：<span>名称</span></p>
                  <p>{{item.cascadeName}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>IP</p>
                  <p>{{item.ipAddress}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>端口</p>
                  <p>{{item.ipPort}}</p>
                </div>
                <div class="vl_inline_block">
                  <p>设备区域代码</p>
                  <p>{{item.placeCode}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
    <div class="vl_m_content" v-else>
      <vue-scroll>
        <div class="vl_m_c_main">
          <div class="vl_m_c_box">
            <!--级联方式列，先固定写死，后端没有做处理的-->
            <div class="vl_mc_box_h">
              <div class="vl_inline_block">
                <p class="vl_color_666"><span class="vl_color_333">级联方式：</span>端口映射</p>
              </div>
              <div class="vl_inline_block">
                <p class="vl_color_666"><span class="vl_color_333">级联渠道：</span>无</p>
              </div>
            </div>
            <div class="vl_mc_box_list">
              <div class="vl_top_line vl_mc_box_item vl_mc_box_item_up" v-for="(item, index) in updateUpper" :key="item.id">
                <el-form :model="item" :ref="'upperCascadeForm' + index" :rules="rules">
                  <div class="vl_inline_block">
                    <p>上级：名称</p>
                    <el-form-item prop="cascadeName">
                      <el-input v-model="item.cascadeName" maxlength="10" placeholder="本级级联名称，最长十个字"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>IP</p>
                    <el-form-item prop="ipAddress">
                      <el-input v-model="item.ipAddress" placeholder="请输入IP"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>端口</p>
                    <el-form-item prop="ipPort">
                      <el-input v-model="item.ipPort" placeholder="请输入端口"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>设备区域代码</p>
                    <el-form-item prop="placeCode">
                      <el-input v-model="item.placeCode" placeholder="请输入设备区域代码"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="vl_top_line vl_mc_box_item" v-for="(item, index) in updateLocal" :key="item.id">
                <el-form :model="item" :ref="'localCascadeForm' + index" :rules="rules">
                  <div class="vl_inline_block">
                    <p>本级：名称</p>
                    <el-form-item prop="cascadeName">
                      <el-input v-model="item.cascadeName" maxlength="10" placeholder="本级级联名称，最长十个字"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>IP</p>
                    <el-form-item prop="ipAddress">
                      <el-input v-model="item.ipAddress" placeholder="请输入IP"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>端口</p>
                    <el-form-item prop="ipPort">
                      <el-input v-model="item.ipPort" placeholder="请输入端口"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>设备区域代码</p>
                    <el-form-item prop="placeCode">
                      <el-input v-model="item.placeCode" placeholder="请输入设备区域代码"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
          <div class="vl_m_c_box">
            <div class="vl_mc_box_h">
              <div class="vl_inline_block">
                <p class="vl_color_333">下级列表</p>
              </div>
            </div>
            <!--新增下级-->
            <div class="vl_top_line vl_m_c_box_add">
              <div class="vl_center" @click="addLower"><i class="el-icon-circle-plus"></i>新增下级</div>
            </div>
            <div class="vl_mc_box_list">
              <div class="vl_top_line vl_mc_box_item vl_mc_box_item_up" v-for="(item, index) in updateLower" :key="item.id">
                <el-form :model="item" :ref="'lowerCascadeForm' + index" :rules="rules">
                  <div class="vl_inline_block">
                    <p>{{index + 1}}：<span>名称</span></p>
                    <el-form-item prop="cascadeName">
                      <i class="el-icon-remove" @click="removeLower(index, item)"></i><el-input v-model="item.cascadeName" maxlength="10" placeholder="本级级联名称，最长十个字"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>IP</p>
                    <el-form-item prop="ipAddress">
                      <el-input v-model="item.ipAddress" placeholder="请输入IP"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>端口</p>
                    <el-form-item prop="ipPort">
                      <el-input v-model="item.ipPort" placeholder="请输入端口"></el-input>
                    </el-form-item>
                  </div>
                  <div class="vl_inline_block">
                    <p>设备区域代码</p>
                    <el-form-item prop="placeCode">
                      <el-input v-model="item.placeCode" placeholder="请输入设备区域代码"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
    <div class="vl_m_footer" v-if="showUpdate">
      <div>
        <el-button type="primary" :loading="searchLoading" @click="submitForm">保存</el-button>
        <el-button :disabled="searchLoading" @click="showUpdate = false;">取消</el-button>
      </div>
    </div>
    <div class="vl_m_footer" v-else>
      <el-button type="primary" @click="updateData">修改</el-button>
    </div>
  </div>
</template>
<script>
  import {ManageDeleteCascades, ManagePutCascades, ManagePostCascades, ManageGetCascades} from '@/views/index/api/api.manage.js'
  import {objDeepCopy} from '@/utils/util.js'
  export default {
    data() {
      return {
        searchLoading: false,
        showUpdate: false, // 展示修改页
        allCascadeList: [], // 获取到所有的级联
        rules: {
          cascadeName: [{required: true, message: '请输入级联名称', trigger: 'blur' }],
          ipAddress: [{required: true, message: '请输入IP', trigger: 'blur' }],
          ipPort: [{required: true, message: '请输入端口', trigger: 'blur' }],
          placeCode: [{required: true, message: '请输入设备区域代码', trigger: 'blur' }]
        },
        updateUpper: [],
        updateLocal: [],
        updateLower:[],
        waitRemoveIds: [], // 等待被删除的id
        ajaxNum: 0, // 当前请求的次数，判断是否所有请求都请求完了
      }
    },
    mounted () {
      this.getCascadeList();
    },
    computed: {
      upperCascade () {
        return this.allCascadeList.filter(x => x.cascadeType === 0)
      },
      localCascade () {
        return this.allCascadeList.filter(x => x.cascadeType === 1)
      },
      lowerCascade () {
        return this.allCascadeList.filter(x => x.cascadeType === 2)
      }
    },
    methods: {
      getCascadeList () {
        ManageGetCascades().then(res => {
          if (res && res.data) {
            this.allCascadeList = res.data;
          }
        })
      },
      updateData () {
        this.showUpdate = true;
        this.updateUpper = objDeepCopy(this.allCascadeList.filter(x => x.cascadeType === 0))
        this.updateLocal = objDeepCopy(this.allCascadeList.filter(x => x.cascadeType === 1))
        this.updateLower = objDeepCopy(this.allCascadeList.filter(x => x.cascadeType === 2))
      },
      submitForm () {
        let isOk = true;
        for (let i = 0; i < this.updateUpper.length; i++) {
          this.$refs['upperCascadeForm' + i][0].validate(valid => {
            if (!valid) {
              isOk = false;
            }
          })
        }
        for (let i = 0; i < this.updateLocal.length; i++) {
          this.$refs['localCascadeForm' + i][0].validate(valid => {
            if (!valid) {
              isOk = false;
            }
          })
        }
        for (let i = 0; i < this.updateLower.length; i++) {
          this.$refs['lowerCascadeForm' + i][0].validate(valid => {
            if (!valid) {
              isOk = false;
            }
          })
        }
        this.searchLoading = isOk;
        // 正式发起请求
          // 修改操作
        this.updateUpper.forEach(x => {
          this.updateCascade(x);
        })
        this.updateLocal.forEach(x => {
          this.updateCascade(x);
        })
        this.updateLower.filter(x => x.uid).forEach(y => {
          this.updateCascade(y);
        })
         // 新增操作
        this.updateLower.filter(x => !x.uid).forEach(y => {
          this.addCascade(y);
        })
          // 删除操作
        this.waitRemoveIds.forEach(x => {
          this.removeCascade(x);
        })
      },
      removeLower (index, item) {
        this.waitRemoveIds.push(item.uid)
        this.updateLower.splice(index, 1);
      },
      addLower () {
        let obj = {
          cascadeName: '',
          ipAddress: '',
          ipPort: '',
          placeCode: '',
          cascadeType: 2,
          cascadeMode: 'http'
        }
        this.updateLower.splice(0, 0, obj)
      },
      removeCascade (uid) {
        let params = {uid}
        ManageDeleteCascades(params).then(()=> {
          this.ajaxNum += 1;
        })
      },
      updateCascade (obj) {
        ManagePutCascades(obj).then(() => {
          this.ajaxNum += 1;
        })
      },
      addCascade (obj) {
        ManagePostCascades(obj).then(() => {
          this.ajaxNum += 1;
        })
      },
    },
    watch: {
      ajaxNum () {
        if (this.ajaxNum === this.updateLower.length + this.updateLocal.length + this.updateUpper.length) {
          this.$MyMessage('所有操作都已完成');
          this.searchLoading = false;
          this.showUpdate = false;
          this.getCascadeList();
        }
      }
    }
  }
</script>
<style lang="scss">
  .vl_manage_cascade {
    height: 100%;
    /*头部*/
    .vl_m_bread {
      height: 60px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 20px;
    }
    /*内容区*/
    .vl_m_content{
      height: calc(100% - 130px);
      .vl_m_c_main {
        padding: 0 20px;
        .vl_m_c_box {
          background: #ffffff;
          margin-bottom: 20px;
          padding: 0 20px;
          .vl_mc_box_h {
            height: 54px;
            line-height: 54px;
            .vl_inline_block {
              width: 25%;
            }
          }
          .vl_mc_box_list {
            .vl_mc_box_item {
              height: 74px;
              .vl_inline_block {
                width: 25%;
                &:first-child {
                  p {
                    > span {
                      margin-left: 16px;
                    }
                    &:last-child {
                      text-indent: 42px;
                    }
                  }
                }
                p {
                  &:first-child {
                    margin-top: 16px;
                    margin-bottom: 10px;
                  }
                }
              }
            }
            .vl_mc_box_item_up {
              height: 106px;
              .vl_inline_block{
                .el-input {
                  width: 90%;
                }
                &:first-child {
                  .el-input {
                    width: 80%;
                  }
                }
                .el-icon-remove {
                  color: #F94539;
                  font-size: 20px;
                  cursor: pointer;
                  margin-right: 20px;
                }
              }
            }
          }
          .vl_m_c_box_add {
            padding-top: 20px;
            > div {
              height: 40px;
              line-height: 40px;
              color: #0C70F8;
              border: 1px dashed #D3D3D3;
              cursor: pointer;
              > i{
                font-size: 20px;
                margin-right: 8px;
                vertical-align: middle;
              }
            }
          }
        } 
      }
    }
    /*底部*/
    .vl_m_footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      background: #ffffff;
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 9999;
      padding-left: 20px;
      button {
        width: 100px;
        height: 40px;
      }
    }
  }
</style>
