<template>
  <el-container>
    <el-header>
      <div class="log-box">
        <img src="../assets/img/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isShow?'65px':'200px'">
        <el-menu
          :router="true"
          :collapse="isShow"
          :collapse-transition="false"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#40B9FF"
        >
          <div class="toggle_bar" @click="isShow=!isShow" :style="isShow?'65px':'200px'">|||</div>
          <el-submenu
            :index="item.id+''"
            :style="isShow?'65px':'200px'"
            v-for="(item,index) in leftUserList"
            :key="item.id"
          >
            <template slot="title">
              <i style="margin-right:10px" :class="'iconfont icon-'+iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getLeftUserList()
  },
  data() {
    return {
      isShow: false,
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'],
      leftUserList: []
    }
  },
  methods: {
    async getLeftUserList() {
      // 发送axios请求
      var { data: dt } = await this.$http.get('/menus')
      // console.log(dt)
      // 判断服务器返回是数据
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meat.msg)
      }
      // 将返回的数组赋值给data中定义的数组，以便标签中使用数据
      this.leftUserList = dt.data
      // console.log(this.leftUserList)
    },
    logout() {
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    padding: 0;
    padding-right: 20px;
    .log-box {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      span {
        font-size: 22px;
        color: #fff;
        user-select: none;
      }
    }
    .el-button--info {
      width: 70px;
      height: 40px;
      margin-top: 10px;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border: 0;
      .toggle_bar {
        background-color: #4a5064;
        color: #fff;
        text-align: center;
        letter-spacing: 0.1em;
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        user-select: none;
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
