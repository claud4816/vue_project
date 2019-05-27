<template>
  <div>
    <el-dialog @close="closeForm()" title="添加分类" :visible.sync="addCateVisible" width="50%">
      <el-form ref="changeRightForm" :model="changeRightForm" label-width="90px" :rules="cateRules">
        <!-- 数据回显 -->
        <el-form-item label="活动名称:" prop="cat_name">
          <el-input v-model="changeRightForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类:">
          <!-- clearable清空按钮  change-on-select允许选取任意级别按钮-->
          <el-cascader
            expand-trigger="hover"
            :options="options"
            :props="cascaderProps"
            v-model="cascaderList"
            @change="cascaderChange"
            clearable
            change-on-select
            style="100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateUpdate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 面包屑 -->
    <com-cru mydata1="分类" mydata2="分类"></com-cru>
    <!-- card使用 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCate()">添加分类</el-button>
      <!-- table表格父子级关系数据中，必须写row-key属性 否则会报错，通常是一组数据中的id值 -->
      <el-table :data="cateData" border style="width: 100%" row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="cat_level" label="等级" width="180">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 级联选择器所需数据:下面都写就行，分不清具体了
      options: [],
      //  v-model="cascaderList"绑定的数据列表
      cascaderList: [],
      // :props="cascaderProps"属性是让数据在页面显示出来的
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 添加分类按钮所需数据
      addCateVisible: false,
      // 表单相关属性:之所以这样写是因为提交的时候服务器要求
      changeRightForm: {
        cat_name: '',
        // 分类的父级id
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      cateRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 商品数据需要的相关数据
      cateData: [],
      // queryData:要向服务器发送的参数
      // type pagenum pagesize是参考文档提供的数据
      queryData: {
        type: 3,
        pagenum: 1,
        pagesize: 1
      }
    }
  },
  methods: {
    // 级联选择器变化触发的函数
    cascaderChange() {
      // form表单数据中存储的数据 当选中一级级联框的时候，数组中会有一个数据，选中两个会有两个数据
      // console.log(this.cascaderList)
      // form表单数据中存储的数据 长度
      var len = this.cascaderList.length
      // console.log(len)
      // 若长度是零  则上级id和同级level都是零
      if (len === 0) {
        this.changeRightForm.cat_pid = 0
        this.changeRightForm.cat_level = 0
      } else {
        // 若长度不为零 则上级id永远是当前数据中的前一个元素
        this.changeRightForm.cat_pid = this.cascaderList[len - 1]
        //  同级level就等于当前数组长度
        this.changeRightForm.cat_level = len
      }
      // console.log(this.cascaderList)
    },
    // 添加分类按钮功能
    async showAddCate() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      this.options = dt.data
      // console.log(dt)
      this.addCateVisible = true
    },
    // 获取商品数据
    async getCateList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.queryData
      })
      if (dt.meta.status !== 200) {
        return this.$message.console.error(dt.meta.msg)
      }
      this.cateData = dt.data.result
    },
    // 提交表单功能
    async addCateUpdate() {
      const { data: dt } = await this.$http.post(
        'categories',
        this.changeRightForm
      )
      if (dt.meta.status !== 201) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.addCateVisible = false
      this.getCateList()
      this.closeForm()
    },
    // 多次用到清空表单功能 封装成函数
    closeForm() {
      // 重置form表单数据
      this.$refs.changeRightForm.resetFields()
      // 清空pid和level为了让级联框回复默认
      this.changeRightForm.cat_pid = 0
      this.changeRightForm.cat_level = 0
      // 清空双向数据绑定的list值 也是为了让级联框回复默认
      this.cascaderList = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
