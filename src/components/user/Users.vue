<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->

      <el-row :gutter="20">
        <!--20  格与格空行的间隙 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogvisable=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index "></el-table-column>
        <!-- type=index 索引列 -->
        <el-table-column label="姓名 " prop="username"></el-table-column>
        <el-table-column label="邮箱 " prop="email"></el-table-column>
        <el-table-column label=" 电话" prop="mobile"></el-table-column>
        <el-table-column label="角色 " prop="role_name"></el-table-column>
        <el-table-column label="状态 " prop="mg_state">
          <template slot-scope=" scope ">
            <el-switch v-model="scope.row.mg_state" @change="userstatechang(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作 " width="180px">
          <template slot-scope=" scope ">
            <!-- 修改阿牛 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showeditdialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="removeuserbyid(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->

            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo. pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="adddialogclose" :visible.sync="adddialogvisable" width="50%">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addformrules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogvisable = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdailogvisable" width="50%" @close="editdailogclose">
      <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editform.email" props="email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <!-- prop添加检验规则 -->
          <el-input v-model="editform.mobile" props="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdailogvisable = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //   验证邮箱规则
    var checkemail = (rule, value, cb) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})/
      if (regemail.test(value)) {
        return cb()
        //合法
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkmobile = (rule, value, cb) => {
      const regmobile = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\\d{8}$/

      if (regmobile.test(value)) {
        return cb()
        //合法
      }
      cb(new Error('请输入合法手机'))
    }
    return {
      //获取用户列表参数
      queryinfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //   控制添加用户对话框的显示与隐藏
      adddialogvisable: false,
      //   添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则对象
      addformrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在三到10之间' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6到15之间' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      //   控制修改用户对话框显示与隐藏
      editdailogvisable: false,
      //   查询到的用户信息对象
      editform: {},
      //   修改表单验证规则
      editformrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getuserlist()
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('用户列表获取失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total

      console.log(res)
    },
    //监听pagesize改变事件
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryinfo.pagesize = newsize
      //重新获取数据
      this.getuserlist()
    },
    //监听页码值改变事件
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryinfo.pagenum = newpage
      this.getuserlist()
    },
    //监听switch状态的改变
    async userstatechang(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    //监听对话框关闭
    adddialogclose() {
      this.$refs.addFormref.resetFields()
    },
    //点击按钮添加新用户
    adduser() {
      this.$refs.addFormref.validate(async vaild => {
        if (!vaild) return
        //可以发起网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        //隐藏对话框
        this.adddialogvisable = false
        this.getuserlist()
      })
    },
    //展示编辑用户的对话框
    async showeditdialog(id) {
      this.editdailogvisable = true
      const { data: res } = await this.$http.get('users/' + id) //动态请求
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      this.editform = res.data
    },
    // 监听修改用户对话框关闭事件
    editdailogclose() {
      this.$refs.editformref.resetFields()
    },
    // 修改用户信息并验证
    edituserinfo() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) return
        //可以发起网络请求

        const { data: res } = await this.$http.put(
          'users/' + this.editform.id,
          {
            email: this.editform.email,
            mobile: this.editform.mobile
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }

        //隐藏对话框
        this.adddialogvisable = false
        // 刷新数据列表
        this.getuserlist()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 删除用户
    async removeuserbyid(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => {
        return error
      })
      //   如果用户确认删除 则返回字符串confrim
      //如果取消了则返回result
      if (res !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      console.log('确认了删除')
      const { data: res1 } = await this.$http.delete('users/' + id)
      if (res1.meta.status !== 200) {
        return this.$message.error('删除用户信息失败')
      }
      this.$message.success('删除用户信息成功')
      this.getuserlist()
    }
  }
}
</script>
<style lang="less"scoped>
</style>