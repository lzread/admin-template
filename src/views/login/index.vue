<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">LOGIN ADMIN</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'hide' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="medium"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
    <div class="loginFooter">
      <span>license: {{ config.license }}</span>
      <span>version: {{ config.version }}</span>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import pkg from '../../../package.json'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数字'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      config: pkg
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #333;
$cursor: #666;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-button {
    height: 47px;
  }

  .el-form-item {
    border: 1px solid #e4e4e4;
    background: #f7f7f7;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px;
    .el-form-item__error {
      padding-top: 10px;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #2d3a4b;
$light_gray: #2d3a4b;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg center top url('~@/assets/login_bg.jpg');
  overflow: hidden;

  .login-form {
    position: relative;
    width: 400px;
    height: 400px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 150px auto 20px;
    overflow: hidden;
    border: 1px solid #f4f4f4;
    background: #fff;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .tips {
    font-size: 12px;
    color: #333;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .loginFooter {
    text-align: center;
    color: #ccc;
    span {
      padding: 0 10px;
    }
  }

  .svg-container {
    padding: 1px 5px 8px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: normal;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 9px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
