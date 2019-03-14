/*
* rule
* {"trigger":"change","max":10,"min":20,"field":"telegrpNo","fullField":"telegrpNo","type":"string", ...}
*  可自定义属性
*/
import { judgeDepart, judgeUserGroup } from '@/views/index/api/api.js';
// const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// // 判断部门名称是否重复
// export const isJudgeDepart = (value, callback) => {
//   if (value) {
//     console.log(value)
//     const params = {
//       proKey: userInfo.proKey,
//       organName: value
//     }
//     judgeDepart(params)
//       .then(res => {
//         if (res) {
//           return callback(new Error('部门已存在'))
//         }
//       })
//       .catch(() => {})
//   }
// }
/**
 * 判断用户组名称是否重复
 */
export const isJudgeUserGroup = (value, callback) => {
  if (value) {
    const params = {
      'where.proKey': userInfo.proKey,
      groupName: value
    }
    judgeUserGroup(params)
      .then(res => {
        if (res) {
          return callback(new Error('该用户组已存在'))
        }
      })
      .catch(() => {})
  }
}
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
  if (value) {
      let reg = /^[a-zA-Z0-9]{6,16}$/;
      if (!reg.test(value)) {
          callback(new Error('密码为6-16个数字或英文字母组合'));
      } else {
          callback();
      }
  }
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
  let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的车牌号码'));
  } else {
    callback();
  }
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

