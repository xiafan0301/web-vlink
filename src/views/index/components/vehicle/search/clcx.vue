<template>
  <div class="point">
    <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>车辆查询</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="left">
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
              placeholder="开始时间"
              class="full"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item >
            <el-date-picker
              v-model="data2"
              type="date"
              placeholder="结束时间"
              class="full"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item >
            <el-select v-model="value2" multiple collapse-tags class="full" placeholder="车辆类别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="value3" multiple collapse-tags class="full" placeholder="车辆类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
            <el-select v-model="value1" multiple collapse-tags class="full" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="age">
            <p class="carCold">车牌：<el-checkbox v-model="checked">非</el-checkbox></p>
            <el-input placeholder="请输入车牌号" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="湘" value="1"></el-option>
                <el-option label="湘" value="2"></el-option>
                <el-option label="湘" value="3"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="submitForm('ruleForm')" class="select_btn full">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <h3 class="title">查询结果</h3>
      <el-table
      :data="tableData"
      style="width: 100%; padding:20px;">
      <el-table-column
        prop="date"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="date"
        label="车牌号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        sortable
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable
        label="过车时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="车道名称">
      </el-table-column>
      <el-table-column
        prop="address"
        label="车辆类型">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">车辆详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="cum_pagination"
      @size-change="handleSizeChange"
      @current-change="onPageChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data1: null,
      data2: null,
      input3: null,
      input4: null,
      input5: "1",
      input1: null,
      value1: null,
      value2: null,
      value3: null,
      select: "",
      reselt: false,
      checked: false,
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
      pagination: { total: 4, pageSize: 10, pageNum: 1 },
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
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
    }
  },
  methods: {
    clickTab(){
      if(!this.dialogVisible){
        this.dialogVisible=true
      }
    },
    handleClick(v){
      // console.log(v);
      this.$router.push({name: 'vehicle_search_clcxdetail', query: {}});
    },
    changeTab(v) {
      //console.log(v);
      if (v == "2") {
        this.dialogVisible = true;
      } else {
        this.dialogVisible = false;
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getEventData();
    },
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getEventData();
    },
  }
}
</script>
<style lang="scss" scoped>
.point {
  width: 100%;
  height: 100%;
}
.breadcrumb_heaer {
  background: #ffffff;
 
  border-bottom: solid 1px #eeeeee;
  
}
.full {
  width: 100%;
}
.title {
  padding: 10px 20px;
  border-bottom: solid 1px #dddddd;
  font-size: 16px;
  font-weight: bold;
}

.right {
  width: calc(100% - 300px);
  height: calc(100% - 80px);
  float: right;
  background: #ffffff;
  margin-top: 20px;
}

.left {
  width: 272px;
  height: calc(100% - 55px);
  background-color: #ffffff;
  float: left;
  z-index: 1;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  // transition: left 0.3s ease-in;
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
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
</style>
<style lang="scss">


</style>