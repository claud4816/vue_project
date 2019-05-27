<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 表格容器 要有id为main的盒子 -->
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echart表格插件
import echarts from 'echarts'
export default {
  mounted() {
    // 图标是dom操作 要挂载在mounted上
    this.mychart()
  },
  methods: {
    async mychart() {
      // 操作dom 获取盒子
      var myChart = echarts.init(document.getElementById('main'))
      // 发送ajax获取数据
      const { data: dt } = await this.$http.get('reports/type/1')
      // 干掉图标两遍留白的代码
      dt.data.xAxis[0].boundaryGap = false
      // 将后台获取到的数据赋值
      var option2 = dt.data
      var option = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            // 保存为图片
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      // 将后台获取到的数据和原表格的数据结合成一个数组
      let options = { ...option, ...option2 }
      // 应用
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
