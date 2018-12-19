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
    callback()
}