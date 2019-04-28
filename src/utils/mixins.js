import Vue from 'vue';
const mixin = {
  data () {
    return {
      $_loading: false,
      $_loadingObj: null
    }
  },
  methods: {
    $_hideLoading () {
      if (this.$_loading) {
        this.$_loadingObj.close()
        this.$_loading = false
      }
    },
    $_showLoading (options = {}) {
      if (!this.$_loading) {
        this.$_loadingObj = this.$loading({
          lock: true,
          text: options.text || 'Loading',
          target: options.target || 'document.body',
          spinner: 'el-icon-loading',
          fullscreen: options.target ? false : true,
          background: options.background || 'rgba(0, 0, 0, 0.3)'
        })
        this.$_loading = true
      }
    }
  }
}
Vue.mixin(mixin);

Vue.prototype.dicObj = null;

let dicObj = localStorage.getItem('dic')
if (dicObj) {
  Vue.prototype.dicObj = JSON.parse(localStorage.getItem('dic'))
}

Vue.prototype.$_setDic = (dic) => {
  Vue.prototype.dicObj = dic
}
Vue.prototype.dicFormater = function (typeValue, enumField) {
  if (!typeValue && !enumField) {
    return '';
  } else if (typeValue && !enumField) {
    return this.dicObj.filter((item) => {
      return item.typeValue === typeValue;
    });
  } else if (typeValue && enumField) {
    let dict = [], typeList = [];
    /* const typeList = this.dicObj.filter((item) => {
      return item.typeValue === typeValue;
    }).filter((item) => {
      return item.enumField == enumField;
    }).map((item) => {
      return item.enumValue;
    }); */
    dict= this.dicObj.filter((item) => {
      return item.typeValue === typeValue;
    })
    if(dict[0].dictList &&  dict[0].dictList.length > 0) {
      typeList = dict[0].dictList.filter((item) => {
        return item.enumField == enumField;
      }).map((item) => {
        return item.enumValue;
      })
    }
    if (typeList.length) {
      return typeList[0];
    } else {
      return '';
    }
  }
  return '';
}

/*
* 定义需要公用插入组件的方法，
* 使用是直接this.testOne()，即可
* */
const testMxin = {
  methods: {
    testOne () {
      console.log('我是测试一下啊')
    }
  }
}

export {testMxin}