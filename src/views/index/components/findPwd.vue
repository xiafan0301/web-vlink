<template>
    <div class="vl_pwd">
        <div is="headerNormal"></div>
        <div class="pwd_main">
            <div class="pwd_t">
                <div class="pwd_ts_1" :class="{'pwd_ts_sed': step === 1}"><i>1</i>确认账号</div>
                <div class="pwd_ts_2" :class="{'pwd_ts_sed': step === 2}"><i>2</i>安全验证</div>
                <div class="pwd_ts_3" :class="{'pwd_ts_sed': step === 3}"><i>3</i>重置密码</div>
                <p class="pwd_tl_1"></p>
                <p class="pwd_tl_2"></p>
            </div>
            <ul class="pwd_ul">
                <!-- 确认账号 -->
                <li v-show="step === 1">
                    <div>
                        <h2>找回密码</h2>
                        <el-form :model="pwdForm1" status-icon :rules="pwdForm1Rules" ref="pwdForm1">
                            <el-form-item prop="mobile">
                                <el-input type="text" v-model="pwdForm1.mobile" autocomplete="off" placeholder="输入手机号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                向右滑动验证
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :disabled="!pwdForm1.mobile" :loading="pwdForm1Loading" @click="nextStep1('pwdForm1')">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </li>
                <!-- 安全验证 -->
                <li v-show="step === 2">
                    <div>
                        <h2>找回密码</h2>
                        <p>为了您的账号安全，请完成身份认证</p>
                        <p class="pwd_mobile_p">手机号：<span>{{pwdForm1.mobile | mobileSecurity}}</span></p>
                        <el-form :model="pwdForm2" status-icon :rules="pwdForm2Rules" ref="pwdForm2">
                            <el-form-item prop="code">
                                <el-input style="width: 200px;" type="text" v-model="pwdForm2.code" autocomplete="off" :maxlength="16" placeholder="请输入验证码"></el-input>
                                <el-button @click="getRegCode('pwdForm2')" :disabled="regCodeDis" class="pwd_code_btn">{{regCodeTip}}</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :disabled="!pwdForm2.code" :loading="pwdForm2Loading" @click="nextStep2('pwdForm2')">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </li>
                <!-- 重置密码 -->
                <li v-show="step === 3">
                    <div>
                        <h2>找回密码</h2>
                        <el-form :model="pwdForm3" status-icon :rules="pwdForm3Rules" ref="pwdForm3">
                             <el-form-item prop="pass">
                                <el-input type="password" v-model="pwdForm3.pass" autocomplete="off" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item prop="checkPass">
                                <el-input type="password" v-model="pwdForm3.checkPass" autocomplete="off" placeholder="请确认新密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :disabled="!pwdForm3.pass || !pwdForm3.checkPass" :loading="pwdForm3Loading" @click="nextStep3('pwdForm3')">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import headerNormal from '@/components/headerNormal.vue';
import {validatePhone} from '@/utils/validator.js';
export default {
    components: {headerNormal},
    data () {
        var validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入新密码'));
            } else {
                let reg = /^[a-zA-Z0-9]{6,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码为6-16个数字或英文字母组合'));
                } else {
                    if (this.pwdForm3.checkPass !== '') {
                        this.$refs.pwdForm3.validateField('checkPass');
                    }
                    callback();
                }
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.pwdForm3.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            step: 1,
            pwdForm1: {
                mobile: ''
            },
            pwdForm1Rules: {
                mobile: [
                    { required: true, message: '输入手机号', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ]
            },
            pwdForm1Loading: false,

            regCodeDis: false,
            regCodeTip: '获取验证码',
            regCodeTime: 60,
            regCodeVal: null,
            pwdForm2: {
                code: ''
            },
            pwdForm2Rules: {
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            pwdForm2Loading: false,

            pwdForm3: {
                pass: '',
                checkPass: ''
            },
            pwdForm3Rules: {
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            pwdForm3Loading: false
        }
    },
    methods: {
        nextStep1 (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.pwdForm1Loading = true;
                    setTimeout(() => {
                        this.pwdForm1Loading = false;
                        this.step = 2;
                    }, 1000);
                } else {
                    return false;
                }
            });
        },

        nextStep2 (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.pwdForm2Loading = true;
                    setTimeout(() => {
                        this.pwdForm2Loading = false;
                        this.step = 3;
                    }, 1000);
                } else {
                    return false;
                }
            });
        },
        getRegCode () {
            this.regCodeDis = true;
            this.regCodeTip = this.regCodeTime;
            this.regCodeVal = setInterval(() => {
                if (this.regCodeTime > 0) {
                    this.regCodeTime -= 1;
                    this.regCodeTip = this.regCodeTime;
                } else {
                    if (this.regCodeVal) {
                        window.clearInterval(this.regCodeVal);
                    }
                    this.regCodeDis = false;
                    this.regCodeTip = '重新获取验证码';
                    this.regCodeTime = 60;
                }
                
            }, 1000);
        },

        nextStep3 (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.pwdForm3Loading = true;
                    setTimeout(() => {
                        this.pwdForm3Loading = false;
                        this.$message({
                            message: '新密码设置成功，请登录',
                            type: 'success'
                        });
                        this.$router.push({name: 'login'});
                    }, 1000);
                } else {
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.vl_pwd {
    position: relative;
    height: 100%;
    > .pwd_main {
        position: absolute; top: 200px; left: 50%;
        width: 800px; height: 400px;
        margin-left: -400px;
        > .pwd_t {
            height: 50px;
            position: relative;
            > div {
                position: absolute; top: 0; z-index: 2;
                width: 120px; height: 50px; line-height: 50px;
                padding-left: 40px;
                color: #999; font-size: 16px;
                transition: .4s ease-out;
                > i {
                    position: absolute; top: 9px; left: 0;
                    display: inline-block;
                    width: 32px; height: 32px; line-height: 32px;
                    border: 1px solid #999;
                    border-radius: 50%;
                    text-align: center;
                    font-style: normal; font-size: 16px; color: #999;
                    transition: .4s ease-out;
                }
                &.pwd_ts_1 {
                    left: 0;
                }
                &.pwd_ts_2 {
                    left: 50%;
                    margin-left: -60px;
                }
                &.pwd_ts_3 {
                    right: 0;
                }
                &.pwd_ts_sed {
                    > i {
                        border: 0;
                        background-color: #0C70F8;
                        color: #fff;
                        font-weight: normal;
                    }
                    font-weight: bold;
                    color: #333;
                }
            }
            > p {
                position: absolute; top: 25px; z-index: 1;
                height: 2px;
                overflow: hidden;
                background-color: #999;
                &.pwd_tl_1 {
                    left: 120px;
                    width: 200px;
                }
                &.pwd_tl_2 {
                    right: 135px;
                    width: 205px;
                }
            }
        }
        > .pwd_ul {
            padding: 30px;
            > li {
                > div {
                    width: 360px;
                    margin: 0 auto;
                    > h2 {
                        font-size: 20px;
                        color: #333;
                        font-weight: bold;
                        padding-bottom: 15px;
                    }
                    > p {
                       font-size: 16px; color: #333;
                       padding: 10px 0;
                       &.pwd_mobile_p {
                           color: #666;
                           padding: 10px 0 20px 0;
                       }
                       > span {
                           color: #333;
                       }
                    }
                }
            }
        }
    }
}
.pwd_code_btn {
    position: absolute; top: 0; right: 0;
    width: 150px;
}
</style>