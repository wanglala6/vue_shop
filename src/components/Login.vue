<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginformref"
        :rules="loginformrules"
        label-width="0px"
        class="login_form"
        :model="loginform"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginform.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetloginform" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginform: {
        username: 'admin',
        password: '123456'
      },

      //这是表单验证规则对象
      loginformrules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],

        //验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击充值按钮 重置表单
    resetloginform() {
      this.$refs.loginformref.resetFields()
    },
    login() {
      this.$refs.loginformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginform) //访问路径 和对象
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    background-color: #fff;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0; //底部对齐
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box; //让width包含padding
  }
  .btns {
    display: flex; //变成弹性盒模型
    justify-content: flex-end; //尾部对其
  }
}
</style>
