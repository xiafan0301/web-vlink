/*
* rule
* {"trigger":"change","max":10,"min":20,"field":"telegrpNo","fullField":"telegrpNo","type":"string", ...}
*  可自定义属性
*/
// 验证手机号
export const validatePhone = (rule, value, callback) => {
  if (value) {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
          return callback(new Error('请输入正确的手机号码'));
      }
  }
  callback();
};
// 密码验证
export const validatePwd = (rule, value, callback) => {
  // if (value) {
  //     let reg = /^[a-zA-Z0-9]{6,16}$/;
  //     if (!reg.test(value)) {
  //         callback(new Error('密码为8位，必须包含一个英文字母一个数字跟一个特殊字符'));
  //     } else {
  //         callback();
  //     }
  // }
  callback();
}
// 身份证号码验证 
export const checkIdCard = (rule, value, callback) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
  if (value && !reg.test(value)) {
    callback(new Error('请正确输入身份证号码'));
  } else {
    callback();
  }
}
// 姓名验证
export const checkName = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5]+$/;
  if (value && !reg.test(value)) {
    callback(new Error('请正确输入姓名'));
  } else {
    callback();
  }
}
// 车牌验证
export const checkPlateNumber = (rule, value, callback) => {
  let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的车牌号码'));
  } else {
    callback();
  }
  callback();
}

/**
 * 判断邮箱格式
 */
export const checkEmail = (rule, value, callback) => {
  if (value) {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(value)) {
      callback(new Error('邮箱格式填写错误'));
    } else {
      callback();
    }
  }
  callback()
}
/**
 * 判断输入的是否是中英文
 */
export const checkUserName = (rule, value, callback) => {
  if (value) {
    let reg = /^[\u0391-\uFFE5A-Za-z]+$/;
    if (!reg.test(value)) {
      callback(new Error('请输入中英文'));
    } else {
      callback();
    }
  }
  callback()
}
/**
 * 支持中文，英文大小写，数字
 */
export const validateName = (rule, value, callback) => {
  let reg = /^[\u0391-\uFFE5A-Za-z0-9]+$/;
  if (!reg.test(value)) {
    callback(new Error('支持中文，英文大小写，数字'));
  } else {
    callback();
  }
};
/**
 * 支持10-120之间的正整数
 */
export const validateDurationTime = (rule, value, callback) => {
  let reg = /^[0-9]+$/;
  if (!reg.test(value) || parseInt(value) < 10 || parseInt(value) > 120) {
    callback(new Error('请正确输入10-120之间的整数'));
  } else {
    callback();
  }
};
/**
 * 支持0-99之间的整数
 */
export const validatePersonNum = (rule, value, callback) => {
  let reg = /^[0-9]+$/;
  if (value) {
    if (!reg.test(value) || parseInt(value) > 99) {
      callback(new Error('请正确输入0-99之间的整数'));
    } else {
      callback();
    }
  }
  callback();
};
/**
 * 校验轮巡时间  30分钟≤（结束时间-开始时间）≤8小时
 */
export const validatePatrolTime = (rule, value, callback) => {
  if (value) {
    const startTime = new Date(value[0]);
    const endTime = new Date(value[1]);
    const timeDiff = endTime.getTime() - startTime.getTime();
    if (timeDiff < 1800000 || timeDiff > (8*60*60*1000)) {
      callback(new Error('轮巡时间段在0.5h和8小时之间'));
    }
  }
  callback();
};
/**
 * 支持正整数
 */
export const validateInteger = (rule, value, callback) => {
  let reg = /^[0-9]+$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正整数'));
    } else {
      callback();
    }
  }
  callback();
};
/**
 * 支持3-200之间的正整数
 */
export const validateFrequency = (rule, value, callback) => {
  let reg = /^[0-9]+$/;
  if (!reg.test(value) || parseInt(value) < 3 || parseInt(value) > 200) {
    callback(new Error('请正确输入3-200之间的整数'));
  } else {
    callback();
  }
};
/**
 * 支持0-100之间的数字
 */
export const validateSimilarity = (rule, value, callback) => {
  let reg = /^100$|^(\d|[1-9]\d)(\.\d+)*$/;
  if (!reg.test(value)) {
    callback(new Error('请正确输入0-100之间的数字'));
  } else {
    callback();
  }
};
