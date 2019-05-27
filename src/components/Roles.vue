<template>
  <div>
    <!-- 分配权限表单 -->
    <el-dialog title="分配权限" :visible.sync="rolesVisible" width="50%">
      <el-form ref="changeRightForm" :model="changeRightForm" label-width="80px">
        <!-- 数据回显 -->
        <el-form-item label="角色名称:">{{changeRightForm.roleName}}</el-form-item>
        <el-tree
          :data="treeData"
          :props="treeProps"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          ref="treeRef"
        ></el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRightUpdate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 面包屑组件引入 -->
    <com-cru mydata1="权限" mydata2="角色"></com-cru>
    <!-- card使用 -->
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <!-- 表格组件 -->
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 第一级别数据 -->
            <el-row
              v-for="(item,index) in info.row.son"
              :key="item.id"
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)','border-top':index===0?'1px solid rgb(235, 238, 245)':''}"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="handleClose(info.row,item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19" style="margin:10px 0">
                <!-- 第二级别数据 -->
                <el-row v-for="item2 in item.children" :key="item2.id">
                  <el-col :span="5" style="margin:10px 0">
                    <el-tag
                      type="success"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(info.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 第三级别数据 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="danger"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(info.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoles(info.row.id)"
            ></el-button>
            <!-- tooltip提示功能 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getTreeData(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      rolesList: [],
      rolesVisible: false,
      changeRightForm: {},
      // 分配权限表单，树表所需的数据
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 定义默认选中所需的数组
      checkedKeys: []
    }
  },

  methods: {
    editRoles() {},
    delRoles() {},
    getRightId(infoRow, idArr) {
      // 将之前修改的son改回原值children
      if (infoRow.son) {
        infoRow.children = infoRow.son
      }
      // 若发现没有children节点 当前就是第三级菜单 直接return 并追加进idArr数组
      if (!infoRow.children) {
        return idArr.push(infoRow.id)
      }
      // 注意此处：
      // 要先判断是否是第三级菜单，因为第三级菜单没有children，不能用
      // infoRow.children.forEach循环 会报错
      // 找寻所有children节点
      infoRow.children.forEach(item => {
        this.getRightId(item, idArr)
      })
    },
    // 分配权限部分功能 获取树表所需的数据
    async getTreeData(infoRow) {
      this.rolesVisible = true
      const { data: dt } = await this.$http.get('rights/tree')
      if (dt.meta.status !== 200) return this.$http.error(dt.meta.msg)
      // 将后台传来的数据赋值给treeData
      this.treeData = dt.data
      // 获取角色已经拥有叶子权限的id数组形式信息
      var idArr = []
      this.getRightId(infoRow, idArr)
      this.checkedKeys = idArr
      // 接收html中传来的数据并赋值给changeRightForm用来实现数据回显
      this.changeRightForm = infoRow
    },
    // 将分配的权限重新提交到服务器
    // 服务器要求传送当前角色id和权限id
    async changeRightUpdate(rowId) {
      // 获取全选时权限的id elementui 自带的方法
      var id1 = this.$refs.treeRef.getCheckedKeys()
      // 获取半选是权限的id el-UI自带方法
      var id2 = this.$refs.treeRef.getHalfCheckedKeys()
      // 服务器要求传的是字符串  所以合并数组，并join加入,进去
      var idAll = id1.concat(id2).join(',')
      // console.log(idAll)
      const { data: dt } = await this.$http.post(
        `roles/${this.changeRightForm.id}/rights`,
        { rids: idAll }
      )
      // console.log(dt)
      if (dt.meta.status !== 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      // 关闭窗口
      this.rolesVisible = false
      // 刷新页面
      this.getRolesList()
    },
    // 获取角色列表
    async getRolesList() {
      const { data: dt } = await this.$http.get('roles')
      // 角色列表中children数组和elmenteui中的关键字冲突
      // 重名名children数组为son
      dt.data.forEach(item => {
        item.son = item.children
        delete item.children
      })
      // console.log(dt)
      this.rolesList = dt.data
    },
    // 权限删除功能实现
    handleClose(info, itemId) {
      this.$confirm('您是否要删除该权限?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async a => {
          // 向服务器传参
          const { data: dt } = await this.$http.delete(
            'roles/' + info.id + '/rights/' + itemId
          )
          if (dt.meta.status !== 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          // console.log(dt)
          // 向服务器发送完删除请求后，服务器会返回删除后的数组，将删除后的数组赋值给当前son数组
          info.son = dt.data
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 0 5px;
}
</style>
