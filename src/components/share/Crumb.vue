<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ mydata1 }}管理</el-breadcrumb-item>
    <el-breadcrumb-item>{{ mydata2 }}列表</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['mydata1', 'mydata2']
}
</script>

<style lang="less" scoped>
</style>
