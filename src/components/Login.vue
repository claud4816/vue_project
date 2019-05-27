<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png">
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="userLogin()">登录</el-button>
            <el-button type="info" @click="formReset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loginForm: { username: 'admin', password: '123456' }
    }
  },
  methods: {
    userLogin() {
      // vue中的表单提交：validate
      this.$refs.loginForm.validate(async boolean => {
        if (boolean === false) return false
        // 此处的this.loginForm中存储了如下代码：
        // username: this.loginForm.username, password: this.loginForm.password
        // username和password是服务器端要求验证的数据this.xxx.username是存储在data中的数据，其来源于通过双向绑定获取的用户输入的数据
        var { data: dt } = await this.$http.post('/login', this.loginForm)
        console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        // 储存token
        window.sessionStorage.setItem('token', dt.data.token)
        // 登录成功后定向到主页面
        this.$router.push('/home')
      })
    },
    // 重置表单
    formReset() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      background-color: #fff;
      transform: translateX(-50%) translateY(-50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
