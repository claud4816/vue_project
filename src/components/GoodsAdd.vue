<template>
  <div>
    <!-- 面包屑 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="card">
      <!-- 消息提示 -->
      <el-alert title="添加商品" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->
      <!--
        基本信息
        商品参数
        商品属性
        商品图片
        商品内容
        完成
      -->
      <el-steps class="step" :active="activeName-1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab切换+表单 -->
      <el-form ref="addFormRef" :model="formGoodsAdd" :rules="addFormRules" label-width="150px">
        <!--  -->
        <el-tabs
          :before-leave="beforeTab"
          tab-position="left"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <!--
          商品名称
          商品价格
          商品重量
          商品数量
          商品分类
          -->
          <el-tab-pane name="1" label="基本信息">
            <!-- 5个表单元素 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formGoodsAdd.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="formGoodsAdd.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="formGoodsAdd.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="formGoodsAdd.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- <el-input v-model="formGoodsAdd.goods_cat"></el-input> -->
              <!-- {{formGoodsAdd.goods_cat}} -->
              <el-cascader
                clearable
                expand-trigger="hover"
                :options="catList"
                v-model="seleOptions"
                :props="catProps"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in manyParams" :key="i">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,j) in item1.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyParams" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <el-form-item label-width="0">
              <!-- 富文本 1. 找ElementUI -> 没有 2.去vue官网找https://github.com/vuejs/awesome-vue -->
              <quill-editor class="editor" v-model="formGoodsAdd.goods_introduce"></quill-editor>
              <!-- 添加的按钮 -->
            </el-form-item>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  // 注册组件
  components: {
    // <quill-editor>
    quillEditor
  },

  data() {
    return {
      activeName: '1',

      // 将来添加商品的表单的请求体->目前初始值都给''

      formGoodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        goods_cat: [],
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选取商品分类', trigger: 'blur' }
        ]
      },
      // 第三级分类的id
      threeCatId: 0,
      // 动态参数数组
      manyParams: [],
      // 静态参数数组
      onlyParams: [],
      // 级联的相关数据
      catList: [],
      seleOptions: [],
      catProps: {
        value: 'cat_id',
        label: 'cat_name'
      },

      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 添加商品的方法
    async addGoods() {
      // 1. 处理表单数据

      // goods_cat 以为','分割的分类列表
      // this.formGoodsAdd.goods_cat = this.formGoodsAdd.goods_cat.join(',')
      this.formGoodsAdd.goods_cat = this.seleOptions.join(',')

      // 处理动态数组
      if (this.manyParams.length > 0) {
        this.manyParams.forEach((item, i) => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.formGoodsAdd.attrs.push(obj)
        })
      }
      // 处理静态数组

      if (this.onlyParams.length > 0) {
        this.onlyParams.forEach((item, i) => {
          let obj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.formGoodsAdd.attrs.push(obj)
        })
      }
      // console.log(this.formGoodsAdd.attrs)

      // 2. 发送请求
      const { data: res } = await this.$http.post('goods', this.formGoodsAdd)
      if (res.meta.status !== 201) {
        // 提示
        return this.$message({
          message: '添加商品失败',
          type: 'error',
          duration: 1500
        })
      } else {
        this.$message({
          message: '添加商品成功',
          type: 'success',
          duration: 1500
        })
        // 跳转->js->js改标识->编程式导航
        this.$router.push('goods')
      }
    },
    // 图片上传相关方法
    handlePreview(file) {
      // console.log('handlePreview----', file)
    },

    handleRemove(file) {
      // console.log('handleRemove----', file)
      // 图片临时保存的路径->将来会用
      const tmpPath = file.response.data.tmpPath

      const index = this.formGoodsAdd.pics.findIndex((item, i) => {
        return item.pic === tmpPath
      })

      // 从this.formGoodsAdd.pics数组中移除元素
      this.formGoodsAdd.pics.splice(index, 1)
    },

    handleSuccess(response) {
      // console.log('handleSuccess----', response)
      // 图片临时保存的路径->将来会用
      const tmpPath = response.data.tmpPath
      this.formGoodsAdd.pics.push({
        pic: tmpPath
      })
      // console.log(this.formGoodsAdd.pics)
    },

    // tab选中生效之前的函数
    beforeTab(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)

      if (oldActiveName === '1' && this.seleOptions.length !== 3) {
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    // 获取三级分类的数据
    async getCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message({
          message: '三级商品分类获取失败',
          type: 'error',
          duration: 1500
        })
      }

      this.catList = res.data
    },
    async handleClick() {
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }

        res.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.manyParams = res.data
      }
      if (this.activeName === '3') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品属性失败',
            type: 'error',
            duration: 1500
          })
        }
        // console.log(res)

        this.onlyParams = res.data
        // console.log(this.onlyParams)
      }
    },
    catChange() {
      this.threeCatId = this.seleOptions[2]
    }
  }
}
</script>

<style>
.card {
  margin-top: 20px;
}
.step {
  margin-top: 20px;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
