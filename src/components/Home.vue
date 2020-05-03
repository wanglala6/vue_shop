<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="toggle-button" @click="togglecollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#33734"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          width="100%"
          router
          :default-active="activepath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->

            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savevastate('/'+subitem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconobj.id"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧页面主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconobj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠
      iscollapse: false,
      //被激活链接地址
      activepath: ''
    }
  },
  created() {
    this.getmenulist()
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有菜单
    async getmenulist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    togglecollapse() {
      this.iscollapse = !this.iscollapse
    },
    //保持连接激活状态
    savevastate(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activepath = activepath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //左右贴边对其
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #fff;
}
.iconfont {
  margin: 10px;
}
.toggle-button {
  background-color: #4a5604;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>