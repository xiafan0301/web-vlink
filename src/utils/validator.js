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
/**
 * 判断身份证验证
 */
export const checkIdCard = (rule, value, callback) => {
  if (value) {
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(value)) {
      callback(new Error('身份证格式不正确'));
    } else {
      callback();
    }
  }
  callback();
}

/**
 * 校验--可输入中英文，长度在2-20
 */
export const checkName = (rule, value, callback) => {
  callback();
}