<template>
    <div class="vl_reg">
        <div is="headerNormal"></div>
        <div class="reg_main">
            <h1>新用户注册</h1>
            <el-form :model="regForm" status-icon :rules="regFormRules" ref="regForm">
                <el-form-item prop="mobile">
                    <el-input type="text" v-model="regForm.mobile" autocomplete="off" placeholder="输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input type="password" v-model="regForm.pass" autocomplete="off" placeholder="密码由6-16位字母、数字组成，区分大小"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" v-model="regForm.checkPass" autocomplete="off" placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input style="width: 200px;" type="text" v-model="regForm.code" autocomplete="off" :maxlength="16" placeholder="请输入验证码"></el-input>
                    <el-button @click="getRegCode('regForm')" :disabled="regCodeDis" class="reg_code_btn">{{regCodeTip}}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="regLoading" @click="submitForm('regForm')">提交</el-button>
                    <el-button @click="resetForm('regForm')">重置</el-button>
                    <span class="reg_bak">已有账号？<router-link :to="{name: 'login'}">请登录&gt;</router-link></span>
                </el-form-item>
            </el-form>
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
                callback(new Error('请输入密码'));
            } else {
                let reg = /^[a-zA-Z0-9]{6,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码为6-16个数字或英文字母组合'));
                } else {
                    if (this.regForm.checkPass !== '') {
                        this.$refs.regForm.validateField('checkPass');
                    }
                    callback();
                }
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.regForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            regLoading: false,
            regCodeDis: false,
            regCodeTip: '获取验证码',
            regCodeTime: 60,
            regCodeVal: null,
            regForm: {
                mobile: '',
                pass: '',
                checkPass: '',
                code: ''
            },
            regFormRules: {
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.regLoading = true;
                    setTimeout(() => {
                        this.regLoading = false;
                        this.$message({
                            message: '注册成功，请登录',
                            type: 'success'
                        });
                        this.$router.push({name: 'index'});
                    }, 1000);
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getRegCode (formName) {
            this.$refs[formName].validateField('mobile', (errorMessage) => {
                if (errorMessage) {
                    return false;
                } else {
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
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.vl_reg {
    height: 100%;
    position: relative;
    > .reg_main {
        position: absolute; top: 50%; left: 50%;
        width: 368px; height: 360px;
        margin-left: -184px; margin-top: -200px;
        > h1 {
            padding: 10px 0;
            font-size: 20px; color: #000;
        }
    }
}
.reg_bak { 
    display: inline-block;
    margin-left: 20px;
    vertical-align: baseline;
    > a {
        text-decoration: none !important;
    }
}
.reg_code_btn {
    position: absolute; right: 0; top: 0;
    width: 150px;
}
</style>