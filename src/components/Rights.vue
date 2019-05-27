<template>
  <div>
    <com-cru mydata1="权限" mydata2="权限"></com-cru>
    <el-card class="box-card">
      <el-table :data="rightsList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="200px"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200px"></el-table-column>
        <el-table-column prop="path" label="路径" width="200px"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==='1'">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.level==='2'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')
      // console.log(dt)
      this.rightsList = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
