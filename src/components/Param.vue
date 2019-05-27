<template>
  <div>
    <!-- 面包屑 -->
    <com-cru mydata1="商品" mydata2="参数"></com-cru>
    <!-- card使用 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="options"
            :props="paramProps"
            v-model="paramList"
            @change="paramChange"
            clearable
            change-on-select
            style="margin-top:15px"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--  activeName ：设置默认激活项目、获取 激活的项目
      name：给每个标签起的名字，同时也是value值，可以 获取、设置 选中的标签-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="info">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item>
                    <el-tag
                      style="margin-left:15px"
                      closable
                      v-for="(item,index) in info.row.attr_vals_arr"
                      :key="index"
                    >{{item}}</el-tag>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <el-table :data="onlyData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="info">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item>
                    <el-tag
                      style="margin-left:15px"
                      closable
                      v-for="(item,index) in info.row.attr_vals_arr"
                      :key="index"
                    >{{item}}</el-tag>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getParamList()
  },
  data() {
    return {
      cateId3: 0,
      showButton: true,
      manyData: [],
      onlyData: [],
      // tab切换
      activeName: 'many',
      options: [],
      paramList: [],
      // 内容要写在页面显示的数据
      paramProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 级联框变动触发的函数
    paramChange() {
      // 判断list.length的长度，1-2-3分别对应123级
      var len = this.paramList.length
      // console.log(len)
      if (len !== 3) {
        this.showButton = true
        this.paramList = []
      } else {
        this.showButton = false
        this.cateId3 = this.paramList[len - 1]
        this.getParamListForTab()
      }
    },
    // 获取级联框所需的数据
    async getParamList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.console.error(dt.meta.msg)
      }
      this.options = dt.data
    },
    // 获取tab切换所需的数据
    async getParamListForTab() {
      const { data: dt } = await this.$http.get(
        `categories/${this.cateId3}/attributes`,
        { params: { sel: this.activeName } }
      )
      this.manyData = dt.data
      this.onlyData = dt.data
      dt.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      console.log(this.manyData)
    },
    // tab点击触发的事件
    handleClick() {
      // 若不加此判断，会获取到许多空数组
      if (this.cateId3 !== 0) {
        this.getParamListForTab()
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
